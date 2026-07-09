
interface Option<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ label, options, value, onChange, applied = true }: SegmentedControlProps<T>) {
  return (
    <div className="segmented-toggle">
      <span className="segmented-label">{label}</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`segmented-btn${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
