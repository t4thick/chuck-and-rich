'use client'

import { useId, useState } from 'react'
import { evaluatePasswordStrength, type PasswordStrength } from '@/lib/auth/password-strength'

type Props = {
  id?: string
  name?: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: 'new-password' | 'current-password'
  disabled?: boolean
  showStrengthMeter?: boolean
  required?: boolean
}

export function PasswordField({
  id: idProp,
  name = 'password',
  label,
  value,
  onChange,
  autoComplete,
  disabled,
  showStrengthMeter,
  required = true,
}: Props) {
  const genId = useId()
  const id = idProp ?? `${genId}-password`
  const [visible, setVisible] = useState(false)
  const strength: PasswordStrength | null = showStrengthMeter && value.length > 0 ? evaluatePasswordStrength(value) : null

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          className="text-xs font-semibold text-[#236641] hover:underline"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4731]/30"
      />
      {strength && (
        <div className="mt-2 space-y-1" aria-live="polite">
          <div className="flex gap-1" role="meter" aria-valuemin={0} aria-valuemax={5} aria-valuenow={strength.score}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i < strength.score ? 'bg-[#1a4731]' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            <span className="font-medium">{strength.label}</span>
            {strength.hints.length > 0 && <span className="text-gray-500"> — {strength.hints.join(' · ')}</span>}
          </p>
        </div>
      )}
    </div>
  )
}
