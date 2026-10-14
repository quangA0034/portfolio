import { useState, useEffect, useCallback, type ReactNode, type MouseEvent as ReactMouseEvent } from 'react'

import type { Block, CaseStudySection, Project, ProjectImage, Tone } from './types'
import { PROJECTS, COMMUNITY_PROJECTS } from './data/projects'
import { LangProvider, useLang } from './i18n'

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed') }),
      { threshold: 0.12, rootMargin: '0px 0px -20px 0px' }
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { lang, setLang, t } = useLang()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-sm border-b border-edge' : ''}`}>
      <div className="flex items-center justify-between px-6 md:px-10 h-16">
        <button onClick={() => go('hero')} className="font-display font-black text-lg tracking-[0.2em] text-ink">
          QN
        </button>
        <div className="flex items-center gap-4 md:gap-8">
          {[['WORK', 'work'], ['ABOUT', 'about'], ['CONTACT', 'contact']].map(([label, id]) => (
            <button key={id} onClick={() => go(id)}
              className="font-mono text-[11px] tracking-widest text-mid hover:text-ink transition-colors duration-200">
              {t(label)}
            </button>
          ))}
          <div role="group" aria-label={t('Language')} className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest">
            <button
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={`transition-colors duration-200 ${lang === 'en' ? 'text-ink' : 'text-dim hover:text-ink'}`}
            >
              ENG
            </button>
            <span className="text-dim" aria-hidden="true">/</span>
            <button
              onClick={() => setLang('vi')}
              aria-pressed={lang === 'vi'}
              className={`transition-colors duration-200 ${lang === 'vi' ? 'text-ink' : 'text-dim hover:text-ink'}`}
            >
              VIE
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { t } = useLang()
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-between pt-32 pb-12 px-6 md:px-10 bg-bg">
      <div>
        {/* Name */}
        <h1
          className="font-display font-black leading-none text-ink uppercase mb-8"
          style={{ fontSize: 'clamp(4.5rem, 16vw, 16rem)' }}
        >
          QUANG<br />NGUYEN.
        </h1>

        {/* Subtitle row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 max-w-5xl">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-mid mb-4">
              {t('DESIGN · CREATE · LAUNCH')}
            </p>
            <p className="font-body text-lg text-mid max-w-xs leading-relaxed">
              {t('Create products where design, experience, and technology meets.')}
            </p>
          </div>
          <button
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="group font-mono text-[11px] tracking-widest text-ink border border-solid border-ink rounded-none px-7 py-4 hover:bg-ink hover:text-white transition-all duration-300 self-start"
          >
            {t('VIEW SELECTED WORK ↓')}
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const { t } = useLang()
  const off = !!project.disabled
  return (
    <article
      data-reveal
      className={`group ${off ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={off ? undefined : onClick}
      title={off ? 'This content is not available currently' : undefined}
      aria-disabled={off || undefined}
    >
      {/* Image */}
      <div className="relative overflow-hidden mb-5 bg-edge" style={{ aspectRatio: '4/3' }}>
        <img
          src={project.image}
          alt={project.imageAlt ? t(project.imageAlt) : project.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${off ? '' : 'group-hover:scale-[1.04]'}`}
        />
        {off && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-6 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="font-mono text-[11px] tracking-widest text-white text-center leading-relaxed">
              THIS CONTENT IS NOT AVAILABLE CURRENTLY
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between mb-2">
        <span className="font-mono text-[10px] tracking-widest text-mid">{t(project.category)}</span>
      </div>
      <h3
        className={`font-display font-bold leading-none text-ink uppercase mb-2 transition-opacity duration-200 ${off ? '' : 'group-hover:opacity-60'}`}
        style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}
      >
        {project.title}
      </h3>
      {project.description && (
        <p className="font-body text-sm text-mid leading-relaxed">{t(project.description)}</p>
      )}
    </article>
  )
}

// ─── Case study blocks ────────────────────────────────────────────────────────
const TONES: Record<Tone, { bg: string; dark: boolean }> = {
  mint: { bg: '#E9F6EC', dark: false },
  dark: { bg: '#1e1e1e', dark: true },
  cocoa: { bg: '#271E1E', dark: true },
  navy: { bg: '#1f2e4c', dark: true },
  white: { bg: '#ffffff', dark: false },
  cream: { bg: '#f4ece3', dark: false },
  royal: { bg: '#223d8a', dark: true },
}

const COLS = ['grid-cols-1', 'grid-cols-1', 'grid-cols-2', 'grid-cols-3']
const COLS_MD = ['md:grid-cols-1', 'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3']

function Panel({ tone, flush, children }: { tone?: Tone; flush?: boolean; children: ReactNode }) {
  return (
    <div
      className={`overflow-hidden ${flush ? '' : 'p-6 md:p-10'}`}
      style={{ background: tone ? TONES[tone].bg : 'var(--color-edge)' }}
    >
      {children}
    </div>
  )
}

const capClass = (tone?: Tone) =>
  `font-mono text-[10px] tracking-wider leading-relaxed ${tone && TONES[tone].dark ? 'text-white/70' : 'text-mid'}`

function Pic({ image, portraitMax = 360 }: { image: ProjectImage; portraitMax?: number }) {
  const { t } = useLang()
  const portrait = image.w / image.h < 0.8
  const natural = Math.round(image.w * 1.6)
  return (
    <img
      src={image.src}
      alt={t(image.alt)}
      width={image.w}
      height={image.h}
      loading="lazy"
      className="block w-full h-auto"
      style={{ aspectRatio: `${image.w} / ${image.h}`, maxWidth: portrait ? Math.min(natural, portraitMax) : natural, marginInline: 'auto' }}
    />
  )
}

function ImagesBlock({ block }: { block: Extract<Block, { type: 'images' }> }) {
  const { t } = useLang()
  const n = Math.min(block.images.length, 3)
  const portrait = block.images.every((i) => i.w / i.h < 0.8)
  const grid = portrait ? COLS[n] : `grid-cols-1 ${COLS_MD[n]}`
  return (
    <Panel tone={block.tone} flush={block.flush}>
      <div className={`grid items-start gap-6 md:gap-10 ${grid}`}>
        {block.images.map((image) => (
          <figure key={image.src}>
            <Pic image={image} />
            {image.caption && (
              <figcaption className={`${capClass(block.tone)} mt-3 ${block.flush ? 'px-4 pb-4' : ''} text-center`}>
                {t(image.caption)}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      {block.caption && (
        <p className={`${capClass(block.tone)} text-center ${block.flush ? 'p-4' : 'mt-6'}`}>{t(block.caption)}</p>
      )}
    </Panel>
  )
}

function CompareBlock({ block }: { block: Extract<Block, { type: 'compare' }> }) {
  const { t } = useLang()
  return (
    <Panel tone={block.tone}>
      <div className="flex items-center justify-center gap-4 md:gap-10">
        <div className="flex-1 min-w-0"><Pic image={block.original} portraitMax={300} /></div>
        <svg viewBox="0 0 64 40" aria-hidden="true" className="w-8 md:w-12 shrink-0 text-ink">
          <path d="M5 20 H53 M38 5 L55 20 L38 35" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex-1 min-w-0"><Pic image={block.revamped} portraitMax={300} /></div>
      </div>
      <p className={`${capClass(block.tone)} text-center mt-6`}>{t(block.caption)}</p>
    </Panel>
  )
}

function CarouselBlock({ block }: { block: Extract<Block, { type: 'carousel' }> }) {
  const { t } = useLang()
  const n = block.images.length
  const [i, setI] = useState(0)
  const [anim, setAnim] = useState(true)
  const [hover, setHover] = useState(false)
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const advance = useCallback(() => {
    setAnim(true)
    setI((v) => (v >= n ? v : v + 1))
  }, [n])

  useEffect(() => {
    if (reduce || hover || n < 2) return
    const t = setInterval(advance, 3500)
    return () => clearInterval(t)
  }, [reduce, hover, n, advance])

  // after sliding onto the copy of picture 1, quietly jump back to the real one
  const onEnd = () => {
    if (i >= n) {
      setAnim(false)
      setI(0)
      requestAnimationFrame(() => requestAnimationFrame(() => setAnim(true)))
    }
  }

  const slides = [...block.images, block.images[0]]
  const dark = !!block.tone && TONES[block.tone].dark
  const viewer = (
    <div
      className="mx-auto"
      style={{ width: `min(100%, calc(70vh * ${block.ratio}))`, maxWidth: 760 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="overflow-hidden cursor-pointer" style={{ aspectRatio: block.ratio, borderRadius: 6 }} onClick={advance}>
        <div
          className="flex h-full"
          style={{ transform: `translateX(-${i * 100}%)`, transition: anim ? 'transform 0.7s ease' : 'none' }}
          onTransitionEnd={onEnd}
        >
          {slides.map((image, k) => (
            <img
              key={k}
              src={image.src}
              alt={k === n ? '' : t(image.alt)}
              aria-hidden={k === n || undefined}
              loading="lazy"
              className="block h-full w-full shrink-0 object-contain object-top"
            />
          ))}
        </div>
      </div>
      {block.dots && n > 1 && (
        <div className="mt-4 flex justify-center gap-2.5">
          {block.images.map((_, k) => (
            <button
              key={k}
              type="button"
              aria-label={`${t('Show picture')} ${k + 1}`}
              onClick={() => { setAnim(true); setI(k) }}
              className={`h-2 w-2 rounded-full transition-colors ${k === i % n ? (dark ? 'bg-white' : 'bg-ink') : dark ? 'bg-white/40' : 'bg-dim'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
  return block.tone ? <Panel tone={block.tone}>{viewer}</Panel> : viewer
}

function BlockView({ block }: { block: Block }) {
  const { t } = useLang()
  switch (block.type) {
    case 'text':
      return (
        <p
          className="font-body text-base text-ink max-w-2xl [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-ink hover:[&_a]:text-mid [&_.ver]:font-mono [&_.ver]:text-[0.85em] [&_.ver]:bg-edge [&_.ver]:px-1.5 [&_.ver]:py-0.5 [&_strong]:font-medium"
          style={{ lineHeight: 1.9 }}
          dangerouslySetInnerHTML={{ __html: t(block.html) }}
        />
      )
    case 'images':
      return <ImagesBlock block={block} />
    case 'compare':
      return <CompareBlock block={block} />
    case 'carousel':
      return <CarouselBlock block={block} />
    case 'links':
      return (
        <ul className="space-y-3">
          {block.items.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] tracking-widest text-ink underline underline-offset-4 hover:text-mid transition-colors"
              >
                {t(l.label).toUpperCase()} ↗
              </a>
            </li>
          ))}
        </ul>
      )
  }
}

// ─── Project Modal ────────────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
  onOpen,
}: {
  project: Project
  onClose: () => void
  onOpen: (slug: string) => void
}) {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    setTimeout(() => setVisible(true), 10)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 400)
  }, [onClose])

  // links inside the text that point to another project open that project
  const onContentClick = (e: ReactMouseEvent) => {
    const a = (e.target as HTMLElement).closest('a[data-project]') as HTMLElement | null
    if (a?.dataset.project) {
      e.preventDefault()
      onOpen(a.dataset.project)
    }
  }

  const sections: CaseStudySection[] = project.sections ?? []
  const hero = project.hero

  return (
    <div
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-edge flex items-center justify-between px-6 md:px-10 h-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] tracking-widest text-mid">{project.num}</span>
          <span className="font-mono text-[10px] tracking-widest text-mid">{t(project.category).toUpperCase()}</span>
        </div>
        <button onClick={close} className="font-mono text-[11px] tracking-widest text-mid hover:text-ink transition-colors">
          {t('CLOSE ✕')}
        </button>
      </div>

      <div className="px-6 md:px-10 lg:px-16 py-12 max-w-6xl" onClick={onContentClick}>
        {/* Title */}
        <h2
          className="font-display font-black leading-none text-ink uppercase mb-6"
          style={{ fontSize: 'clamp(3rem, 9vw, 9rem)' }}
        >
          {project.title}
        </h2>
        {project.headline && (
          <p className="font-display font-light text-ink leading-tight mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            {t(project.headline)}
          </p>
        )}
        {project.tagline && <p className="font-body text-base text-mid mb-4 max-w-2xl">{t(project.tagline)}</p>}
        <p className="font-mono text-[10px] tracking-widest text-mid mb-12">{t(project.role).toUpperCase()}</p>

        {/* Hero image */}
        {hero ? (
          <div className="mb-16">
            {hero.fit === 'contain' ? (
              <div className="flex items-center justify-center overflow-hidden aspect-[4/5] md:aspect-[16/9]" style={{ background: hero.bg, maxHeight: '75vh' }}>
                <img src={hero.src} alt={t(hero.alt)} width={hero.w} height={hero.h} className="w-auto" style={{ height: '88%' }} />
              </div>
            ) : (
              <img
                src={hero.src}
                alt={t(hero.alt)}
                width={hero.w}
                height={hero.h}
                className="w-full object-cover"
                style={{ aspectRatio: hero.ratio?.replace('/', ' / ') ?? '16 / 9', maxHeight: '70vh', objectPosition: hero.position ?? '50% 40%' }}
              />
            )}
            {hero.note && <p className="font-mono text-[10px] tracking-wider text-mid text-center mt-3">{t(hero.note)}</p>}
          </div>
        ) : (
          <img src={project.image} alt={project.title} className="w-full object-cover mb-16" style={{ height: '55vh' }} />
        )}

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={s.num} className={`pb-16 mb-16 ${i < sections.length - 1 ? 'border-b border-edge' : ''}`}>
            <p className="font-mono text-[10px] tracking-widest text-mid mb-8">{s.num} — {t(s.label).toUpperCase()}</p>
            <div className="flex flex-col gap-8">
              {s.blocks.map((b, k) => (
                <BlockView key={k} block={b} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const { t } = useLang()
  return (
    <section id="about" className="py-24 md:py-36 px-6 md:px-10 border-t border-edge">
      <div className="max-w-5xl">
        <p data-reveal className="font-mono text-[11px] tracking-widest text-mid mb-10">{t('ABOUT')}</p>

        <p
          data-reveal data-delay="1"
          className="font-display font-light text-ink leading-tight mb-10"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
        >
          {t('“Simplicity is the ultimate sophistication.”')}
          <span className="block mt-5 font-mono text-[11px] tracking-widest text-mid">— LEONARDO DA VINCI</span>
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-14">
          <p data-reveal data-delay="2" className="font-body text-base text-mid leading-relaxed">
            {t("I'm an UI/UX Designer shaped from Turku University of Applied Sciences. I had my practical training at theFirma and there I had the opportunity to work as a UI/UX Designer on real projects, collaborate with different teams, and gain hands-on experience working with actual clients.")}
          </p>
          <p data-reveal data-delay="3" className="font-body text-base text-mid leading-relaxed">
            {t('I love listening to people talk, finding new ways to step outside of my comfort zone, and learning something new every day. I’m always curious about new experiences, whether they’re related to design or something completely different.')}
          </p>
        </div>

        {/* Stats */}
        <div data-reveal data-delay="4" className="flex gap-12 pt-10 border-t border-edge">
          {[['8', 'Projects'], ['5', 'Collaborations'], ['2', 'Product Launched']].map(([num, label]) => (
            <div key={label}>
              <p className="font-display font-bold text-ink leading-none mb-1" style={{ fontSize: '3rem' }}>{num}</p>
              <p className="font-mono text-[10px] tracking-widest text-mid">{t(label).toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function Skills() {
  const { t } = useLang()
  const cats = [
    { title: 'Technical', items: ['UI/UX design', 'Web design', 'Mobile design', 'Prototyping'] },
    { title: 'Soft', items: ['Communication', 'Critical thinking', 'Problem solving', 'Collaboration'] },
    { title: 'Media', items: ['Video editing', 'Content create', 'Strategy'] },
    { title: 'Tools', items: ['Figma', 'VScode', 'Filmora 12', 'Canva'] },
  ]

  return (
    <section id="skills" className="py-24 md:py-36 px-6 md:px-10 border-t border-edge">
      <p data-reveal className="font-mono text-[11px] tracking-widest text-mid mb-14">{t('CAPABILITIES')}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
        {cats.map((cat, i) => (
          <div key={cat.title} data-reveal data-delay={String(i + 1)}>
            <p className="font-display font-bold text-ink text-2xl mb-5">{t(cat.title)}</p>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item} className="font-body text-sm text-mid">{t(item)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const { t } = useLang()
  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-10 border-t border-edge">
      <p data-reveal className="font-mono text-[11px] tracking-widest text-mid mb-10">{t('CONTACT')}</p>

      <div data-reveal data-delay="1" className="mb-14">
        <p className="font-display font-black leading-none text-ink uppercase" style={{ fontSize: 'clamp(3rem, 10vw, 10rem)' }}>
          {t("LET'S CREATE")}<br />{t('SOMETHING.')}
        </p>
      </div>

      <div data-reveal data-delay="2" className="flex flex-col md:flex-row md:items-center gap-6 pt-10 border-t border-edge">
        <a href="mailto:anhqnguyen3405@gmail.com"
          className="font-mono text-sm tracking-widest text-ink hover:text-mid transition-colors duration-200">
          anhqnguyen3405@gmail.com
        </a>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/nguyen-quang-anh-a3591a293"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-widest text-mid hover:text-ink transition-colors duration-200"
          >
            LINKEDIN
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
function AppInner() {
  const { t } = useLang()
  const [active, setActive] = useState<Project | null>(null)
  useScrollReveal()

  const openBySlug = (slug: string) => {
    const next = [...PROJECTS, ...COMMUNITY_PROJECTS].find((p) => p.slug === slug)
    if (next && !next.disabled) setActive(next)
  }

  return (
    <div className="bg-bg min-h-screen">
      <Nav />

      <main>
        {/* Hero */}
        <Hero />

        {/* Work */}
        <section id="work" className="py-24 md:py-32 px-6 md:px-10 border-t border-edge">
          <div className="flex items-center justify-between mb-14">
            <p className="font-mono text-[11px] tracking-widest text-mid">{t('SELECTED WORK')}</p>
            <p className="font-mono text-[11px] tracking-widest text-dim">{t('06 PROJECTS')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => setActive(p)} />
            ))}
          </div>
        </section>

        {/* Volunteer and personal work */}
        <section id="community" className="py-24 md:py-32 px-6 md:px-10 border-t border-edge">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-14">
            <p data-reveal className="font-mono text-[11px] tracking-widest text-mid">
              {t('VOLUNTEER & PERSONAL WORK')}
            </p>
            <p data-reveal data-delay="1" className="font-body text-base text-mid leading-relaxed max-w-lg">
              {t('I always try to do as many “side quests” as possible. I always find learning something that is not related to my technical field interesting.')}
            </p>
          </div>

          <div className="flex items-center justify-between mb-10 pt-6 border-t border-edge">
            <p className="font-mono text-[10px] tracking-widest text-dim">{t('PLAY · CONTENT · MEDIA')}</p>
            <p className="font-mono text-[11px] tracking-widest text-dim">{t('03 PROJECTS')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {COMMUNITY_PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} onClick={() => setActive(p)} />
            ))}
          </div>
        </section>

        <About />
        <Skills />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="border-t border-edge px-6 md:px-10 py-6 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-mid">NGUYEN QUANG ANH</span>
        <span className="font-mono text-[10px] tracking-widest text-mid hidden md:block">{t('DESIGN · CREATE · LAUNCH')}</span>
      </footer>

      {active && <ProjectModal key={active.slug} project={active} onClose={() => setActive(null)} onOpen={openBySlug} />}
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  )
}
