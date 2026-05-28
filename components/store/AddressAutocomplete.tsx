'use client'

import { useEffect, useId, useRef, useState } from 'react'
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
  primary: string
  secondary: string
  parsed: ParsedAddress
}

type Props = {
  value: string
  onChange: (v: string) => void
  onSelect: (addr: ParsedAddress) => void
  required?: boolean
  id?: string
  name?: string
  countryBias?: 'us' | 'none'
}

const PHOTON_ENDPOINT = 'https://photon.komoot.io/api'
/** Bias suggestions toward Columbus / Ohio delivery area. */
const OHIO_BIAS = { lat: '39.9612', lon: '-82.9988' }
/** Continental US bounding box for Photon. */
const US_BBOX = '-125.0,24.0,-66.0,49.5'

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

const ALLOWED_COUNTRIES = new Set(['united states', 'usa', 'us', 'canada', 'mexico'])

function toStateCode(raw: string | undefined, country: string): string {
  if (!raw) return ''
  if (country === 'United States') {
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
  if (k === 'mexico' || k === 'mx') return 'Mexico'
  return raw
}

function countryAllowed(country: string): boolean {
  return ALLOWED_COUNTRIES.has(country.trim().toLowerCase())
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
  if (!countryAllowed(country)) return null

  const state = toStateCode(p.state, country)
  const postal = p.postcode?.trim() ?? ''

  const line1 = [housenumber, street].filter(Boolean).join(' ').trim()
  if (!line1 && !city) return null

  const secondary = [city, [state, postal].filter(Boolean).join(' '), country]
    .filter(Boolean)
    .join(', ')

  const id = [
    f.geometry?.coordinates?.join(','),
    line1,
    city,
    state,
    postal,
  ]
    .filter(Boolean)
    .join('|')

  return {
    id: id || `${line1}|${secondary}`,
    primary: line1 || street || city,
    secondary,
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
  name = 'address1',
  countryBias = 'us',
}: Props) {
  const listId = useId()
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
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setLoading(false)
      setOpen(false)
      return
    }

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const params = new URLSearchParams({
      q: trimmed,
      limit: '8',
      lang: 'en',
    })
    if (countryBias === 'us') {
      params.set('lat', OHIO_BIAS.lat)
      params.set('lon', OHIO_BIAS.lon)
      params.set('bbox', US_BBOX)
    }

    setLoading(true)

    fetch(`${PHOTON_ENDPOINT}?${params.toString()}`, { signal: ctrl.signal })
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
        if (err?.name !== 'AbortError') setSuggestions([])
      })
      .finally(() => setLoading(false))
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    onChange(next)
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => fetchSuggestions(next), 180)
  }

  function pick(s: Suggestion) {
    onChange(s.parsed.line1 || value)
    onSelect(s.parsed)
    setOpen(false)
    setSuggestions([])
    setActiveIndex(-1)
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

  const activeOptionId =
    activeIndex >= 0 && suggestions[activeIndex] ? `${listId}-opt-${activeIndex}` : undefined

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        required={required}
        autoComplete="shipping address-line1"
        spellCheck={false}
        placeholder="Street address"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        className={loading ? 'pr-10' : undefined}
      />

      {loading && (
        <span
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-earth-200 border-t-brand-600"
          aria-hidden
        />
      )}

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-earth-200 bg-white py-1 shadow-[var(--shadow-elev)]"
          role="listbox"
        >
          {suggestions.map((s, i) => {
            const isActive = i === activeIndex
            return (
              <li key={s.id} id={`${listId}-opt-${i}`} role="presentation">
                <button
                  type="button"
                  onClick={() => pick(s)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`block w-full px-3 py-2.5 text-left transition-colors duration-150 ${
                    isActive ? 'bg-earth-50' : 'hover:bg-earth-50'
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="block text-sm font-medium text-earth-900">{s.primary}</span>
                  {s.secondary ? (
                    <span className="mt-0.5 block text-xs text-earth-500">{s.secondary}</span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <p className="mt-1.5 text-xs text-earth-500">
        Type your street address — city, state, and ZIP fill in when you pick a match.
      </p>
    </div>
  )
}
