import { useCallback, useEffect, useRef, useState } from 'react'
import { ControlPanel } from './ControlPanel'
import './App.css'

const DEFAULT_CDN = 'https://cdn.zolak.tech/embed/embed.dev.js'

const CONTAINER = '#zolak-instance'
const SHOWROOM_CONTAINER = '#zolak-sandbox-instance'

async function destroyApp(apiObj: any, sel: string) {
  if (!apiObj?.onReady) return
  await new Promise<void>((resolve) => {
    apiObj.onReady(sel, async (app: any) => {
      try { await app.App.destroy() } catch {}
      const el = document.querySelector(sel)
      if (el) el.innerHTML = ''
      resolve()
    }, 1000)
    setTimeout(resolve, 1500)
  })
}

type Group = 'configurator' | 'sandbox'

const configuratorMethods = [
  'InitConfigurator',
  'App.destroy',
  'App.show',
  'Cart.add',
  'Cart.remove',
  'Cart.list',
  'Product.setSKU',
  'Product.item',
  'Interiors.item',
]

const sandboxMethods = [
  'InitShowroom',
  'App.destroy',
  'Cart.add',
  'Cart.remove',
  'Cart.list',
  'Interiors.item',
]

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    document.querySelectorAll('script[data-zolak-sdk="true"]').forEach((n) => n.remove())
    const s = document.createElement('script')
    s.async = true
    s.src = src
    s.dataset.zolakSdk = 'true'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.append(s)
  })
}

async function callApi(
  method: string,
  group: Group,
  token: string,
  sku: string,
  initialized: Record<Group, boolean>,
  sidebar: boolean,
  sidebarPosition: 'left' | 'right',
  ar: boolean,
  rtl: boolean,
  language: string,
): Promise<{ message: string; initialized: Record<Group, boolean> }> {
  function getApp(): Promise<any> {
    if (group === 'configurator') {
      const api = (window as any).ZolakConfigurator
      if (!api) throw new Error('ZolakConfigurator not available')
      return new Promise((resolve, reject) => {
        api.onReady(CONTAINER, (app: any) => resolve(app), 2000)
        setTimeout(() => reject(new Error('Configurator not ready. Click InitConfigurator first.')), 2500)
      })
    }
    const api = (window as any).ZolakShowroom
    if (!api) throw new Error('ZolakShowroom not available')
    return new Promise((resolve, reject) => {
      api.onReady(SHOWROOM_CONTAINER, (app: any) => resolve(app), 2000)
      setTimeout(() => reject(new Error('Showroom not ready. Click InitShowroom first.')), 2500)
    })
  }

  switch (method) {
    case 'InitConfigurator': {
      const api = (window as any).ZolakAPI
      if (!api) throw new Error('ZolakAPI not loaded')
      api.initConfigurator(token, { 
        container: CONTAINER, 
        product: sku, 
        modal: false, 
        sidebar, 
        sidebarPosition, 
        ar,
        rtl,
        language
      })
      return { message: `initConfigurator("${token}", "${sku}")`, initialized: { ...initialized, configurator: true } }
    }
    case 'InitShowroom': {
      const api = (window as any).ZolakAPI
      if (!api) throw new Error('ZolakAPI not loaded')
      api.initShowroom(token, { 
        container: SHOWROOM_CONTAINER, 
        sidebar: false,
        rtl,
        language
      })
      return { message: `initShowroom("${token}")`, initialized: { ...initialized, sandbox: true } }
    }
    case 'App.destroy': {
      const app = await getApp(); await app.App.destroy()
      const sel = group === 'configurator' ? CONTAINER : SHOWROOM_CONTAINER
      const el = document.querySelector(sel)
      if (el) el.innerHTML = ''
      return { message: 'App.destroy()', initialized: { ...initialized, [group]: false } }
    }
    case 'App.show': {
      const app = await getApp(); await app.App.show()
      return { message: 'App.show()', initialized }
    }
    case 'Cart.add': {
      const app = await getApp(); await app.Cart.add({ productId: sku })
      return { message: `Cart.add("${sku}")`, initialized }
    }
    case 'Cart.remove': {
      const app = await getApp(); await app.Cart.remove({ productId: sku })
      return { message: `Cart.remove("${sku}")`, initialized }
    }
    case 'Cart.list': {
      const app = await getApp(); const r = await app.Cart.list()
      return { message: `Cart.list() => ${JSON.stringify(r)}`, initialized }
    }
    case 'Product.setSKU': {
      const app = await getApp(); await app.Product.setSKU({ productId: sku })
      return { message: `Product.setSKU("${sku}")`, initialized }
    }
    case 'Product.item': {
      const app = await getApp(); const r = await app.Product.item()
      return { message: `Product.item() => ${JSON.stringify(r)}`, initialized }
    }
    case 'Interiors.item': {
      const app = await getApp(); const r = await app.Interiors.item()
      return { message: `Interiors.item() => ${JSON.stringify(r)}`, initialized }
    }
    default:
      return { message: `Unknown: ${method}`, initialized }
  }
}

function MethodBar({ methods, group, onCall }: { methods: string[]; group: Group; onCall: (m: string, g: Group) => void }) {
  return (
    <div className="method-bar">
      {methods.map((m) => (
        <button key={m} type="button" className="method-pill" onClick={() => onCall(m, group)}>
          {m}
        </button>
      ))}
    </div>
  )
}

function App() {
  const [cdnUrl, setCdnUrl] = useState(DEFAULT_CDN)
  const [token, setToken] = useState('')
  const [sku, setSku] = useState('')
  const [sidebar, setSidebar] = useState(true)
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left')
  const [ar, setAr] = useState(true)
  const [rtl, setRtl] = useState(false)
  const [language, setLanguage] = useState('en')
  const [popup, setPopup] = useState<string | null>(null)
  const [initialized, setInitialized] = useState<Record<Group, boolean>>({ configurator: false, sandbox: false })
  const sandboxRef = useRef<HTMLDivElement>(null)
  const configuratorRef = useRef<HTMLDivElement>(null)
  const [sandboxSize, setSandboxSize] = useState({ width: 0, height: 0 })
  const [configuratorSize, setConfiguratorSize] = useState({ width: 0, height: 0 })
  const [panelCollapsed, setPanelCollapsed] = useState(false)

  useEffect(() => {
    let active = true
    loadScript(cdnUrl)
      .then(() => { if (active) {/* loaded */} })
      .catch(() => { if (active) {/* failed */} })
    return () => { active = false }
  }, [cdnUrl])

  useEffect(() => {
    if (!sandboxRef.current) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setSandboxSize({ width: Math.round(width), height: Math.round(height) })
    })
    observer.observe(sandboxRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!configuratorRef.current) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setConfiguratorSize({ width: Math.round(width), height: Math.round(height) })
    })
    observer.observe(configuratorRef.current)
    return () => observer.disconnect()
  }, [])

  const handle = useCallback(
    async (method: string, group: Group) => {
      if (!token.trim()) {
        setPopup('Enter company token first')
        return
      }
      const needsSku = !['App.destroy','App.show','Cart.list','Product.item','Interiors.item','InitShowroom'].includes(method)
      if (needsSku && !sku.trim()) {
        setPopup('Enter SKU first')
        return
      }
      setPopup(`Calling ${group}.${method}…`)
      try {
        const result = await callApi(method, group, token, sku, initialized, sidebar, sidebarPosition, ar, rtl, language)
        setInitialized(result.initialized)
        setPopup(`✓ ${result.message}`)
      } catch (e: any) {
        setPopup(`✗ ${e.message || e}`)
        if (e.message?.includes('not ready')) {
          setInitialized((prev) => ({ ...prev, [group]: false }))
        }
      }
    },
    [token, sku, initialized, sidebar, sidebarPosition, ar, rtl, language],
  )

  const handleUpdate = useCallback(async (
    newToken: string, 
    newSku: string, 
    newSidebar: boolean, 
    newSidebarPosition: 'left' | 'right', 
    newAr: boolean,
    newRtl: boolean,
    newLanguage: string
  ) => {
    setToken(newToken)
    setSku(newSku)
    setSidebar(newSidebar)
    setSidebarPosition(newSidebarPosition)
    setAr(newAr)
    setRtl(newRtl)
    setLanguage(newLanguage)
    await destroyApp((window as any).ZolakConfigurator, CONTAINER)
    await destroyApp((window as any).ZolakShowroom, SHOWROOM_CONTAINER)
    setInitialized({ configurator: false, sandbox: false })
  }, [])

  const handleApplyCdn = useCallback(async (newCdn: string) => {
    await destroyApp((window as any).ZolakConfigurator, CONTAINER)
    await destroyApp((window as any).ZolakShowroom, SHOWROOM_CONTAINER)
    setInitialized({ configurator: false, sandbox: false })
    setCdnUrl(newCdn)
  }, [])

  return (
    <main className="app-shell">
      <ControlPanel
        token={token}
        sku={sku}
        sidebar={sidebar}
        sidebarPosition={sidebarPosition}
        ar={ar}
        rtl={rtl}
        language={language}
        cdnUrl={cdnUrl}
        onUpdate={handleUpdate}
        onApplyCdn={handleApplyCdn}
        collapsed={panelCollapsed}
        onToggleCollapse={() => setPanelCollapsed((c) => !c)}
      />

      <section className="workspace-frame">
        <div className="panel sandbox-panel" >
          <div className="panel-header">
            <span className="badge">Sandbox</span>
            {initialized.sandbox && <span className="badge active">Active</span>}
            <span className="badge size">{sandboxSize.width}×{sandboxSize.height}</span>
          </div>
          <div id="zolak-sandbox-instance" className="render-target" ref={sandboxRef}/>
          <MethodBar methods={sandboxMethods} group="sandbox" onCall={handle} />
        </div>
        <div className="panel configurator-panel" >
          <div className="panel-header">
            <span className="badge">Configurator</span>
            {initialized.configurator && <span className="badge active">Active</span>}
            <span className="badge size">{configuratorSize.width}×{configuratorSize.height}</span>
          </div>
          <div id="zolak-instance" className="render-target" ref={configuratorRef}/>
          <MethodBar methods={configuratorMethods} group="configurator" onCall={handle} />
        </div>
      </section>

      {popup ? (
        <div className="popup-backdrop" onClick={() => setPopup(null)}>
          <div className="popup-card" role="dialog" aria-modal="true">
            <p className="popup-title">Action</p>
            <p className="popup-message">{popup}</p>
            <div className="popup-footer">
              <button type="button" onClick={() => setPopup(null)}>Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App