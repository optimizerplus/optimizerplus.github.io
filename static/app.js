// Vanilla replacement of the former React components (header, language selector, demo, FAQ, i18n).
(function () {
  'use strict'

  const $ = (sel, root = document) => root.querySelector(sel)
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel))

  // ---------------------------------------------------------------- i18n
  const LOCALES = ['en', 'fr', 'de', 'es', 'it', 'pt', 'pl', 'ru', 'uk', 'cs', 'sk', 'hu', 'ro', 'tr', 'sv']
  const NAMES = {
    en: 'English', fr: 'Français', de: 'Deutsch', es: 'Español', it: 'Italiano',
    pt: 'Português', pl: 'Polski', ru: 'Русский', uk: 'Українська', cs: 'Čeština',
    sk: 'Slovenčina', hu: 'Magyar', ro: 'Română', tr: 'Türkçe', sv: 'Svenska',
  }
  const STORAGE_KEY = 'boosteroid-optimizer-locale'
  const cache = {}
  let locale = 'en'
  let messages = null

  const lookup = (obj, path) => {
    const v = path.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj)
    return typeof v === 'string' ? v : path
  }

  const load = (l) =>
    cache[l] || (cache[l] = fetch('/i18n/' + l + '.json').then((r) => {
      if (!r.ok) throw new Error('i18n ' + l + ': ' + r.status)
      return r.json()
    }))

  function applyMessages() {
    if (!messages) return
    $$('[data-i18n]').forEach((el) => { el.textContent = lookup(messages, el.dataset.i18n) })
    $$('[data-i18n-text]').forEach((el) => {
      el.setAttribute('data-text', el.dataset.i18nText.split('|').map((k) => lookup(messages, k)).join(' '))
    })
    $$('[data-locale-code]').forEach((el) => { el.textContent = locale.toUpperCase() })
  }

  function setLocale(l, persist) {
    if (!LOCALES.includes(l)) return
    return load(l).then((m) => {
      locale = l
      messages = m
      applyMessages()
      if (persist) {
        try { localStorage.setItem(STORAGE_KEY, l) } catch (e) { /* storage blocked */ }
        document.documentElement.lang = l
      }
    }).catch((e) => console.error(e))
  }

  function detectLocale() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && LOCALES.includes(stored)) return stored
    } catch (e) { /* storage blocked */ }
    for (const lang of [navigator.language, ...(navigator.languages || [])]) {
      const code = (lang || '').split('-')[0]
      if (LOCALES.includes(code)) return code
    }
    return 'en'
  }

  // ---------------------------------------------------- language selector
  const GLOBE = '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
  const OPTION_ACTIVE = 'bg-boo-blue/20 text-boo-blue border-l-2 border-boo-blue'
  const OPTION_IDLE = 'text-white/80 hover:bg-white/10 hover:text-white border-l-2 border-transparent'

  function renderDropdown() {
    const items = LOCALES.map((l) => `
      <button class="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${l === locale ? OPTION_ACTIVE : OPTION_IDLE}" role="option" aria-selected="${l === locale}" data-locale="${l}">
        <span class="w-8 font-mono text-xs uppercase text-white/50">${l.toUpperCase()}</span>
        <span class="flex-1 text-sm font-medium">${NAMES[l]}</span>
        ${l === locale ? '<svg class="w-4 h-4 text-boo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' : ''}
      </button>`).join('')
    const el = document.createElement('div')
    el.className = 'fixed md:absolute right-4 md:right-0 mt-2 w-56 md:w-48 max-h-[60vh] overflow-y-auto rounded-xl bg-[#0a0e17]/95 backdrop-blur-xl border border-boo-blue/30 shadow-2xl shadow-black/80'
    el.setAttribute('role', 'listbox')
    el.style.zIndex = '9999'
    el.innerHTML = `
      <div class="sticky top-0 bg-[#0a0e17] px-4 py-3 border-b border-white/10">
        <div class="flex items-center gap-2 text-white/60 text-xs font-medium uppercase tracking-wider">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">${GLOBE}</svg>
          Language
        </div>
      </div>
      <div class="py-1">${items}</div>`
    return el
  }

  function initLanguageSelectors() {
    const selectors = $$('button[aria-label="Select language"]').map((btn) => {
      const root = btn.parentElement
      const chevron = btn.querySelector('svg.w-3')
      const code = btn.querySelector('span.uppercase')
      if (code) code.setAttribute('data-locale-code', '')
      let menu = null
      const close = () => {
        if (!menu) return
        menu.remove()
        menu = null
        btn.setAttribute('aria-expanded', 'false')
        if (chevron) chevron.classList.remove('rotate-180')
      }
      const open = () => {
        menu = renderDropdown()
        menu.addEventListener('click', (e) => {
          const opt = e.target.closest('[data-locale]')
          if (!opt) return
          setLocale(opt.dataset.locale, true)
          close()
        })
        root.appendChild(menu)
        btn.setAttribute('aria-expanded', 'true')
        if (chevron) chevron.classList.add('rotate-180')
      }
      btn.addEventListener('click', () => (menu ? close() : open()))
      return { root, close }
    })
    document.addEventListener('mousedown', (e) => selectors.forEach((s) => { if (!s.root.contains(e.target)) s.close() }))
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') selectors.forEach((s) => s.close()) })
  }

  // ------------------------------------------------- header (CRT retract)
  const MENU_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
  const X_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
  const MENU_OPEN = ['max-h-80', 'opacity-100', 'mt-3', 'pt-3', 'border-t', 'border-white/10']
  const MENU_CLOSED = ['max-h-0', 'opacity-0']
  const PHASES = {
    normal: { transform: 'scaleX(1) scaleY(1)', opacity: '1', filter: 'brightness(1)' },
    compressing: { transform: 'scaleX(0.6) scaleY(0.15)', opacity: '1', filter: 'brightness(1.5)' },
    line: { transform: 'scaleX(0.5) scaleY(0.05)', opacity: '1', filter: 'brightness(2)' },
    fading: { transform: 'scaleX(0.1) scaleY(0.02)', opacity: '0.5', filter: 'brightness(3)' },
    hidden: { transform: 'scaleX(0) scaleY(0)', opacity: '0', filter: 'brightness(3)' },
  }

  function initHeader() {
    const header = $('header')
    const container = $('.navbar-crt-container', header)
    const wrapper = $('.navbar-crt-wrapper', header)
    const scan = wrapper.firstElementChild
    const nav = $('.gaming-navbar', header)
    const lineBox = wrapper.lastElementChild
    const line = lineBox.firstElementChild
    const jet = container.lastElementChild
    const menuBtn = $('button[aria-label="Open menu"]', header)
    const mobileMenu = nav.lastElementChild
    let phase = 'normal'
    let menuOpen = false
    let timers = []

    setTimeout(() => {
      header.classList.remove('opacity-0', '-translate-y-4')
      header.classList.add('opacity-100', 'translate-y-0')
    }, 100)

    function render() {
      const p = menuOpen ? 'normal' : phase
      Object.assign(wrapper.style, PHASES[menuOpen ? 'normal' : phase])
      wrapper.style.pointerEvents = p !== 'normal' ? 'none' : 'auto'
      const squeezing = phase === 'compressing' || phase === 'line'
      scan.style.opacity = squeezing ? '0.5' : '0'
      nav.style.opacity = phase === 'normal' || menuOpen ? '1' : '0'
      lineBox.style.opacity = squeezing ? '1' : '0'
      line.style.width = phase === 'compressing' ? '80%' : phase === 'line' ? '60%' : '0%'
      const jetOn = phase === 'fading'
      Object.assign(jet.style, {
        width: jetOn ? '30%' : '0%',
        background: jetOn ? 'linear-gradient(90deg, transparent 0%, #00a3ff 20%, #ffffff 50%, #00a3ff 80%, transparent 100%)' : 'transparent',
        opacity: jetOn ? '1' : '0',
        // "0 0_60px" typo kept from the Next.js version: it voids the whole shadow, same render as before.
        boxShadow: jetOn ? '0 0 20px #00a3ff, 0 0 40px #22c55e, 0 0_60px #fff, 0 0 100px rgba(0,163,255,0.8)' : 'none',
        filter: jetOn ? 'blur(1px)' : 'none',
      })
    }

    const setPhase = (p) => { phase = p; render() }
    const clearTimers = () => { timers.forEach(clearTimeout); timers = [] }

    window.addEventListener('scroll', () => {
      if (menuOpen) {
        if (phase !== 'normal') { clearTimers(); setPhase('normal') }
        return
      }
      const scrolled = window.scrollY > 80
      if (scrolled && phase === 'normal') {
        setPhase('compressing')
        timers.push(setTimeout(() => {
          setPhase('line')
          timers.push(setTimeout(() => {
            setPhase('fading')
            timers.push(setTimeout(() => setPhase('hidden'), 400))
          }, 600))
        }, 400))
      } else if (!scrolled && phase !== 'normal') {
        clearTimers()
        setPhase('normal')
      }
    }, { passive: true })

    function setMenu(open) {
      menuOpen = open
      mobileMenu.classList.remove(...(open ? MENU_CLOSED : MENU_OPEN))
      mobileMenu.classList.add(...(open ? MENU_OPEN : MENU_CLOSED))
      menuBtn.innerHTML = open ? X_ICON : MENU_ICON
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
      menuBtn.setAttribute('aria-expanded', String(open))
      render()
    }
    menuBtn.addEventListener('click', () => setMenu(!menuOpen))
    $$('a', mobileMenu).forEach((a) => { if (!a.target) a.addEventListener('click', () => setMenu(false)) })
  }

  // ------------------------------------------------------ live preset demo
  const FILTERS = {
    default: 'contrast(1.05) saturate(1.05)',
    cinematic: 'contrast(1.15) saturate(1.2) brightness(0.98)',
    competitive: 'contrast(1.08) brightness(1.02)',
    comfort: 'brightness(0.95) contrast(1.05) saturate(0.95) sepia(0.05)',
    perfectQuality: 'contrast(1.12) saturate(1.15) brightness(1.03)',
  }
  const IMAGES = ['/img/Deathstranding.webp', '/img/wherewind.webp']
  const PRESET_BASE = 'px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm '
  const PRESET_ACTIVE = 'bg-boo-blue text-white shadow-[0_0_15px_rgba(0,163,255,0.5)]'
  const PRESET_IDLE = 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
  const DOT_BASE = 'w-2.5 h-2.5 rounded-full transition-all '
  const DOT_ACTIVE = 'bg-boo-blue w-8'
  const DOT_IDLE = 'bg-white/30 hover:bg-white/50'

  function initDemo() {
    const box = $('.aspect-video')
    if (!box) return
    const [before, after, handle] = box.children
    const [labelName, labelDesc] = $$('div[data-i18n^="demo.presets."]')
    const buttons = $$('button[data-i18n^="demo.presets."]')
    const tablist = $('[role="tablist"]')
    const dots = $$('button', tablist)
    let image = 0
    let dragging = false

    function selectPreset(btn) {
      const key = btn.dataset.i18n
      buttons.forEach((b) => { b.className = PRESET_BASE + (b === btn ? PRESET_ACTIVE : PRESET_IDLE) })
      after.style.filter = FILTERS[key.split('.').pop()]
      labelName.dataset.i18n = key
      labelDesc.dataset.i18n = key + 'Desc'
      if (messages) applyMessages()
    }
    buttons.forEach((b) => b.addEventListener('click', () => selectPreset(b)))

    function showImage(i) {
      image = (i + IMAGES.length) % IMAGES.length
      const url = `url('${IMAGES[image]}')`
      before.style.backgroundImage = url
      after.style.backgroundImage = url
      dots.forEach((d, j) => {
        d.className = DOT_BASE + (j === image ? DOT_ACTIVE : DOT_IDLE)
        d.setAttribute('aria-selected', String(j === image))
      })
    }
    dots.forEach((d, j) => d.addEventListener('click', () => showImage(j)))
    // The 360 KB demo image is fetched only when the section comes near the viewport.
    const lazy = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      lazy.disconnect()
      if (!before.style.backgroundImage) showImage(image)
    }, { rootMargin: '800px 0px' })
    lazy.observe(box)
    tablist.previousElementSibling.addEventListener('click', () => showImage(image - 1))
    tablist.nextElementSibling.addEventListener('click', () => showImage(image + 1))

    function move(clientX) {
      const r = box.getBoundingClientRect()
      const pct = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100))
      after.style.clipPath = `inset(0 0 0 ${pct}%)`
      handle.style.left = `calc(${pct}% - 20px)`
    }
    box.addEventListener('mousedown', (e) => { dragging = true; move(e.clientX) })
    box.addEventListener('touchstart', (e) => { dragging = true; if (e.touches[0]) move(e.touches[0].clientX) }, { passive: true })
    window.addEventListener('mousemove', (e) => { if (dragging) move(e.clientX) })
    window.addEventListener('touchmove', (e) => { if (dragging && e.touches[0]) move(e.touches[0].clientX) }, { passive: true })
    window.addEventListener('mouseup', () => { dragging = false })
    window.addEventListener('touchend', () => { dragging = false })
  }

  // ------------------------------------------------------------------ FAQ
  const Q_BASE = 'text-lg sm:text-xl font-bold tracking-wide transition-colors duration-300 '
  const CHEVRON_BASE = 'faq-chevron-punch '

  function initFaq() {
    const cards = $$('.faq-punch-card')
    let openIndex = null
    function render() {
      cards.forEach((card, i) => {
        const open = i === openIndex
        const answer = card.lastElementChild
        card.classList.toggle('faq-open', open)
        $('.punch-hole', card).classList.toggle('faq-open', open)
        $('button > span', card).className = Q_BASE + (open ? 'text-boo-blue' : 'text-white group-hover:text-boo-blue/80')
        $('.faq-chevron-punch', card).className = CHEVRON_BASE + (open ? 'bg-boo-blue/20 border-boo-blue rotate-180' : 'group-hover:border-white/40')
        answer.classList.toggle('faq-answer-hourglass', open)
        answer.style.maxHeight = open ? '300px' : '0'
      })
    }
    cards.forEach((card, i) => $('button', card).addEventListener('click', () => {
      openIndex = openIndex === i ? null : i
      render()
    }))
  }

  // ---------------------------------------------- off-screen animations
  // ~80 infinite CSS animations recalc styles every frame even out of view:
  // pause each section while it is off-screen (resumes as soon as it is visible).
  function pauseOffscreenAnimations() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('anim-paused', !e.isIntersecting))
    })
    $$('main > section, footer').forEach((el) => io.observe(el))
  }

  // ----------------------------------------------------------------- boot
  initHeader()
  initLanguageSelectors()
  initDemo()
  initFaq()
  pauseOffscreenAnimations()
  // /fr/, /de/... are pre-rendered in their language: keep it (search engines must see that language).
  const pageLocale = document.documentElement.lang
  const initial = pageLocale !== 'en' ? pageLocale : detectLocale()
  if (initial !== pageLocale) setLocale(initial, false)
  else load(initial).then((m) => { locale = initial; messages = m })
})()
