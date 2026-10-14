export type Tone = 'mint' | 'dark' | 'cocoa' | 'navy' | 'white' | 'cream' | 'royal'

export interface ProjectImage {
  src: string
  alt: string
  caption?: string
  w: number
  h: number
}

export type Block =
  | { type: 'text'; html: string }
  | {
      type: 'images'
      images: ProjectImage[]
      tone?: Tone
      /** picture fills its panel edge to edge (no padding) */
      flush?: boolean
      /** one caption under the whole panel */
      caption?: string
    }
  | {
      type: 'compare'
      original: ProjectImage
      revamped: ProjectImage
      caption: string
      tone?: Tone
    }
  | {
      type: 'carousel'
      images: ProjectImage[]
      /** width / height of one slide */
      ratio: number
      tone?: Tone
      dots?: boolean
    }
  | { type: 'links'; items: { label: string; href: string }[] }

export interface CaseStudySection {
  num: string
  label: string
  blocks: Block[]
}

export interface ProjectHero {
  src: string
  alt: string
  w: number
  h: number
  /** background behind a contained (phone) picture */
  bg?: string
  fit: 'cover' | 'contain'
  position?: string
  ratio?: string
  note?: string
}

export interface Project {
  id: number
  slug: string
  num: string
  title: string
  category: string
  description: string
  role: string
  image: string
  imageAlt?: string
  /** long headline shown in the detail view */
  headline?: string
  tagline?: string
  hero?: ProjectHero
  /** card is shown but can't be opened yet */
  disabled?: boolean
  sections?: CaseStudySection[]
}
