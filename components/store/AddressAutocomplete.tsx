'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'

export type ParsedAddress = {
  line1: string
  city: string
  state: string
  country: string
  postalCode: string
}

type Suggestion = {
  id: string
  display: string
  parsed: ParsedAddress
}

type Props = {
  value: string
  onChange: (v: string) => void
  onSelect: (addr: ParsedAddress) => void
  required?: boolean
  id?: string
  countryBias?: string
}

const PHOTON_ENDPOINT = 'https://photon.komoot.io/api'
const US_STATE_TO_CODE: Record<string, string> = {
  alabama: 'AL', alaska: 'AK', arizona: 'AZ', arkansas: 'AR', california: 'CA',
  colorado: 'CO', connecticut: 'CT', delaware: 'DE', florida: 'FL', georgia: 'GA',
  hawaii: 'HI', idaho: 'ID', illinois: 'IL', indiana: 'IN', iowa: 'IA',
  kansas: 'KS', kentucky: 'KY', louisiana: 'LA', maine: 'ME', maryland: 'MD',
  massachusetts: 'MA', michigan: 'MI', minnesota: 'MN', mississippi: 'MS', missouri: 'MO',
  montana: 'MT', nebraska: 'NE', nevada: 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', ohio: 'OH',
  oklahoma: 'OK', oregon: 'OR', pennsylvania: 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', tennessee: 'TN', texas: 'TX', utah: 'UT', vermont: 'VT',
  virginia: 'VA', washington: 'WA', 'west virginia': 'WV', wisconsin: 'WI', wyoming: 'WY',
  'district of columbia': 'DC',
}

function toStateCode(raw: string | undefined, country: string): string {
  if (!raw) return ''
  if (country === 'US' || country === 'United States') {
    const k = raw.toLowerCase().trim()
    return US_STATE_TO_CODE[k] ?? raw
  }
  return raw
}

function normalizeCountry(raw: string | undefined): string {
  if (!raw) return 'United States'
  const k = raw.trim().toLowerCase()
  if (k === 'united states' || k === 'usa' || k === 'us' || k === 'united states of america') {
    return 'United States'
  }
  if (k === 'canada' || k === 'ca') return 'Canada'
  if (k === 'united kingdom' || k === 'uk' || k === 'gb' || k === 'great britain') {
    return 'United Kingdom'
  }
  if (k === 'mexico' || k === 'mx') return 'Mexico'
  return raw
}

type PhotonProps = {
  name?: string
  housenumber?: string
  street?: string
  city?: string
  town?: string
  village?: string
  hamlet?: string
  state?: string
  postcode?: string
  country?: string
  countrycode?: string
  type?: string
  osm_value?: string
}

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] }
  properties: PhotonProps
}

function buildSuggestionFromFeature(f: PhotonFeature): Suggestion | null {
  const p = f.properties
  const housenumber = p.housenumber?.trim() ?? ''
  const street = p.street?.trim() ?? p.name?.trim() ?? ''
  const city = (p.city ?? p.town ?? p.village ?? p.hamlet ?? '').trim()
  const country = normalizeCountry(p.country)
  const state = toStateCode(p.state, country)
  const postal = p.postcode?.trim() ?? ''

  const line1 = [housenumber, street].filter(Boolean).join(' ').trim()
  if (!line1 && !city) return null

  const displayParts = [
    line1 || street || p.name || '',
    city,
    [state, postal].filter(Boolean).join(' '),
    country,
  ].filter(Boolean)

  const id = [
    f.geometry?.coordinates?.join(','),
    line1,
    city,
    state,
    postal,
  ].filter(Boolean).join('|')

  return {
    id: id || displayParts.join('|'),
    display: displayParts.join(', '),
    parsed: {
      line1,
      city,
      state,
      country,
      postalCode: postal,
    },
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  required,
  id,
  countryBias = 'us',
}: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function fetchSuggestions(query: string) {
    if (query.trim().length < 3) {
      setSuggestions([])
      setLoading(false)
      return
    }

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const params = new URLSearchParams({
      q: query,
      limit: '6',
      lang: 'en',
    })
    if (countryBias) params.set('lat', '39.9612')
    if (countryBias) params.set('lon', '-82.9988')
    setLoading(true)

    fetch(`${PHOTON_ENDPOINT}?${params.toString()}`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Photon error'))))
      .then((data: { features?: PhotonFeature[] }) => {
        const features = Array.isArray(data.features) ? data.features : []
        const list: Suggestion[] = []
        const seen = new Set<string>()
        for (const f of features) {
          const s = buildSuggestionFromFeature(f)
          if (s && !seen.has(s.id)) {
            seen.add(s.id)
            list.push(s)
          }
        }
        setSuggestions(list)
        setOpen(list.length > 0)
        setActiveIndex(-1)
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') {
          setSuggestions([])
        }
      })
      .finally(() => setLoading(false))
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    onChange(next)
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => fetchSuggestions(next), 220)
  }

  function pick(s: Suggestion) {
    onChange(s.parsed.line1 || value)
    onSelect(s.parsed)
    setOpen(false)
    setSuggestions([])
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      pick(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        required={required}
        autoComplete="address-line1"
        spellCheck={false}
        placeholder="Start typing your address…"
      />

      {open && suggestions.length > 0 && (
        <ul
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto rounded-lg border border-earth-200 bg-white shadow-[var(--shadow-elev)]"
          role="listbox"
        >
          {suggestions.map((s, i) => {
            const isActive = i === activeIndex
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => pick(s)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-start gap-2 px-3 py-2 text-left text-sm transition-colors ${
                    isActive ? 'bg-earth-100' : 'hover:bg-earth-50'
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <MapPin
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-earth-400"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  <span className="line-clamp-2 text-earth-800">{s.display}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {loading && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-earth-400">
          …
        </span>
      )}
    </div>
  )
}
