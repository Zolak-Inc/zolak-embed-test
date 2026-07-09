import { Check } from 'lucide-react'
import { useState } from 'react'
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
const defaultToken = ''
const defaultSku = ''

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
  onUpdate: (token: string, sku: string, sidebar: boolean, sidebarPosition: 'left' | 'right', ar: boolean, rtl: boolean, language: string) => void
  onApplyCdn: (cdnUrl: string) => void
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
  onUpdate, 
  onApplyCdn 
}: ControlPanelProps) {
  const [cdnInput, setCdnInput] = useState(cdnUrl || DEFAULT_CDN)
  const [tokenInput, setTokenInput] = useState(token)
  const [skuInput, setSkuInput] = useState(sku)
  const [sidebarInput, setSidebarInput] = useState(sidebar)
  const [sidebarPositionInput, setSidebarPositionInput] = useState(sidebarPosition)
  const [arInput, setArInput] = useState(ar)
  const [rtlInput, setRtlInput] = useState(rtl)
  const [languageInput, setLanguageInput] = useState(language || 'en')

  const handleUpdate = () => {
    onUpdate(
      tokenInput.trim() || defaultToken, 
      skuInput.trim() || defaultSku, 
      sidebarInput, 
      sidebarPositionInput, 
      arInput,
      rtlInput,
      languageInput
    )
  }

  const handleApplyCdn = () => {
    onApplyCdn(cdnInput.trim() || DEFAULT_CDN)
  }

  return (
    <section className="controls-panel">
      <div className="controls-body">
        <div className="controls-fields">
          <label className="field">
            <img src="../public/zolakIcon.svg" alt="Zolak logo" className="cdn-logo" />
            <span>CDN script</span>
            <div className="field-row">
              <input
                list="cdn-list"
                value={cdnInput}
                onChange={(e) => setCdnInput(e.target.value)}
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
              <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} />
              <Check size={20} className={`tick-icon${token.trim() && tokenInput.trim() === token ? '' : ' tick-icon--hidden'}`} />
            </div>
          </label>
          <label className="field">
            <span>SKU</span>
            <div className="field-row">
              <input value={skuInput} onChange={(e) => setSkuInput(e.target.value)} />
              <Check size={20} className={`tick-icon${sku.trim() && skuInput.trim() === sku ? '' : ' tick-icon--hidden'}`} />
            </div>
          </label>
        </div>
        <div className="controls-toggles">
          <ToggleSwitch
            checked={sidebarInput}
            onChange={setSidebarInput}
            label="Sidebar"
            applied={sidebarInput === sidebar}
          />
          <SegmentedControl
            label="Pos"
            options={[
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
            value={sidebarPositionInput}
            onChange={setSidebarPositionInput}
            applied={sidebarPositionInput === sidebarPosition}
          />
          <ToggleSwitch
            checked={arInput}
            onChange={setArInput}
            label="AR"
            applied={arInput === ar}
          />
          <ToggleSwitch
            checked={rtlInput}
            onChange={setRtlInput}
            label="RTL"
            applied={rtlInput === rtl}
          />
          <LanguageSelect
            value={languageInput}
            onChange={setLanguageInput}
            applied={languageInput === language}
            languages={LANGUAGES}
          />
        </div>
        <Button onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </section>
  )
}