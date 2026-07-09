
interface Language {
  value: string
  label: string
}

interface LanguageSelectProps {
  value: string
  onChange: (value: string) => void
  languages: Language[]
}

export function LanguageSelect({ value, onChange,  languages }: LanguageSelectProps) {
  return (
    <div className="language-select">
      <span className="language-label">Language</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="language-dropdown">
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  )
}
