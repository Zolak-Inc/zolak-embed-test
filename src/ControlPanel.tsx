import { Check } from 'lucide-react'
import { useState } from 'react'

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
              <button type="button" className="btn-action" onClick={handleApplyCdn}>
                Apply CDN
              </button>
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
          <label className="toggle">
            <input type="checkbox" checked={sidebarInput} onChange={(e) => setSidebarInput(e.target.checked)} />
            <span className="toggle-slider" />
            Sidebar
            <Check size={16} className={`tick-icon${sidebarInput === sidebar ? '' : ' tick-icon--hidden'}`} />
          </label>
          <div className="segmented-toggle">
            <span className="segmented-label">Pos</span>
            <button
              type="button"
              className={`segmented-btn${sidebarPositionInput === 'left' ? ' active' : ''}`}
              onClick={() => setSidebarPositionInput('left')}
            >
              Left
            </button>
            <button
              type="button"
              className={`segmented-btn${sidebarPositionInput === 'right' ? ' active' : ''}`}
              onClick={() => setSidebarPositionInput('right')}
            >
              Right
            </button>
            <Check size={16} className={`tick-icon${sidebarPositionInput === sidebarPosition ? '' : ' tick-icon--hidden'}`} />
          </div>
          <label className="toggle">
            <input type="checkbox" checked={arInput} onChange={(e) => setArInput(e.target.checked)} />
            <span className="toggle-slider" />
            AR
            <Check size={16} className={`tick-icon${arInput === ar ? '' : ' tick-icon--hidden'}`} />
          </label>
          <label className="toggle">
            <input type="checkbox" checked={rtlInput} onChange={(e) => setRtlInput(e.target.checked)} />
            <span className="toggle-slider" />
            RTL
            <Check size={16} className={`tick-icon${rtlInput === rtl ? '' : ' tick-icon--hidden'}`} />
          </label>
          <div className="language-select">
            <span className="language-label">Language</span>
            <select 
              value={languageInput} 
              onChange={(e) => setLanguageInput(e.target.value)}
              className="language-dropdown"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <Check size={16} className={`tick-icon${languageInput === language ? '' : ' tick-icon--hidden'}`} />
          </div>
        </div>
        <button type="button" className="btn-action" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </section>
  )
}