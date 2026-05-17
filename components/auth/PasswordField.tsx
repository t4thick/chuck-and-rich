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
  const strength: PasswordStrength | null =
    showStrengthMeter && value.length > 0 ? evaluatePasswordStrength(value) : null

  return (
    <div>
      <label htmlFor={id}>
        {label}{' '}
        <button type="button" onClick={() => setVisible((v) => !v)} aria-pressed={visible}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </label>
      <br />
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {strength && (
        <p className="muted" aria-live="polite">
          Strength: {strength.label}
          {strength.hints.length > 0 ? ` (${strength.hints.join(' · ')})` : ''}
        </p>
      )}
    </div>
  )
}
