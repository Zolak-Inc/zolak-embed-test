import { Check } from 'lucide-react'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  applied?: boolean
}

export function ToggleSwitch({ checked, onChange, label, applied = true }: ToggleSwitchProps) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-slider" />
      {label}
      <Check size={16} className={`tick-icon${applied ? '' : ' tick-icon--hidden'}`} />
    </label>
  )
}
