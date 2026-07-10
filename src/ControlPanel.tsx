import { Maximize2, Minimize2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './components/Button'
import { ToggleSwitch } from './components/ToggleSwitch'
import { SegmentedControl } from './components/SegmentedControl'
import { LanguageSelect } from './components/LanguageSelect'

const CDN_BASE = 'https://cdn.zolak.tech/'
const CDN_PATHS = [
  'embed/embed.dev.js',
  'embed/embed.js',
  'embed/embed.1.0.0.dev.js',
  'embed/embed.1.0.0.js',
  'embed/embed.staging.js',
  'embed/embed.1.0.0.staging.js',
]
const DEFAULT_CDN = CDN_BASE + 'embed/embed.dev.js'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fi', label: 'Finnish' },
  { value: 'he', label: 'Hebrew' },
]

interface ControlPanelProps {
  token: string
  sku: string
  sidebar: boolean
  sidebarPosition: 'left' | 'right'
  ar: boolean
  rtl: boolean
  language: string
  cdnUrl: string
  onTokenChange: (value: string) => void
  onSkuChange: (value: string) => void
  onSidebarChange: (value: boolean) => void
  onSidebarPositionChange: (value: 'left' | 'right') => void
  onArChange: (value: boolean) => void
  onRtlChange: (value: boolean) => void
  onLanguageChange: (value: string) => void
  onUpdate: () => void
  onApplyCdn: (cdnUrl: string) => void
  onMarkDirty: () => void
  isDirty: boolean
  collapsed: boolean
  onToggleCollapse: () => void
}

export function ControlPanel({
  token,
  sku,
  sidebar,
  sidebarPosition,
  ar,
  rtl,
  language,
  cdnUrl,
  onTokenChange,
  onSkuChange,
  onSidebarChange,
  onSidebarPositionChange,
  onArChange,
  onRtlChange,
  onLanguageChange,
  onUpdate,
  onApplyCdn,
  onMarkDirty,
  isDirty,
  collapsed,
  onToggleCollapse
}: ControlPanelProps) {
  const [cdnInput, setCdnInput] = useState(cdnUrl || DEFAULT_CDN)

  const handleCdnInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCdnInput(e.target.value)
    onMarkDirty()
  }

  const handleApplyCdn = () => {
    onApplyCdn(cdnInput.trim() || DEFAULT_CDN)
  }

  useEffect(() => {
    console.log(isDirty)
  }, [isDirty])

  return (
    <section className={`controls-panel${collapsed ? ' controls-panel--collapsed' : ''}`}>
      <div className="controls-header">
        {!collapsed && <img src="/zolakIcon.svg" alt="Zolak logo" className="cdn-logo" /> }
        <button type="button" className="collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
        </button>
      </div>
      {!collapsed && (
        <div className="controls-body">
          <div className="controls-fields">
            <label className="field">
              <span>CDN script</span>
              <div className="field-row">
                <input
                  list="cdn-list"
                  value={cdnInput}
                  onChange={handleCdnInputChange}
                />
              </div>
              <datalist id="cdn-list">
                {CDN_PATHS.map((p) => (
                  <option key={p} value={CDN_BASE + p} />
                ))}
              </datalist>
              <div className="field-row cdn-actions">
                <Button onClick={handleApplyCdn}>
                  Apply CDN
                </Button>
              </div>
            </label>
            <label className="field">
              <span>Company token</span>
              <div className="field-row">
                <input value={token} onChange={(e) => onTokenChange(e.target.value)} />
              </div>
            </label>
            <label className="field">
              <span>SKU</span>
              <div className="field-row">
                <input value={sku} onChange={(e) => onSkuChange(e.target.value)} />
              </div>
            </label>
          </div>
          <div className="controls-toggles">
            <ToggleSwitch
              checked={sidebar}
              onChange={onSidebarChange}
              label="Sidebar"
            />
            <SegmentedControl
              label=""
              options={[
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
              value={sidebarPosition}
              onChange={onSidebarPositionChange}
            />
            <ToggleSwitch
              checked={ar}
              onChange={onArChange}
              label="AR"
            />
            <ToggleSwitch
              checked={rtl}
              onChange={onRtlChange}
              label="RTL"
            />
            <LanguageSelect
              value={language}
              onChange={onLanguageChange}
              languages={LANGUAGES}
            />
          </div>
          <Button onClick={onUpdate} disabled={!isDirty}>
            Update
          </Button>
        </div>
      )}
    </section>
  )
}
