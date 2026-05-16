export type Species = 'dog' | 'cat' | 'horse' | 'bird' | 'other'
export type FontChoice = 'classic' | 'modern' | 'personal' | 'friendly'
export type Palette =
  | 'meadow' | 'ocean' | 'sunset' | 'forest'
  | 'lavender' | 'monochrome' | 'golden' | 'rose' | 'sky'

export interface FavouriteThings {
  food?: string
  place?: string
  toy?: string
  person?: string
  activity?: string
}

export interface MemorialPage {
  id: string
  slug: string
  createdBy: string          // Firebase Auth UID
  createdAt: number          // Unix ms
  editableUntil: number      // Unix ms — 6 months after creation
  editable: boolean          // flipped to false by scheduled function at expiry

  // Fixed header
  petName: string
  heroPhotoUrl: string
  dateFrom: string           // "2010" or full date
  dateTo: string             // "2024" or "Forever in our hearts"
  tagline: string            // "Beloved golden retriever and faithful companion"

  // Species & personalisation
  species: Species
  font: FontChoice
  palette: Palette

  // Panels — names are editable
  panel1Name: string
  panel1Content: string

  panel2Name: string
  panel2Content: string

  panel3Name: string
  panel3Content: string

  panel4Name: string
  favouriteThings: FavouriteThings

  panel5Name: string
  panel5Content: string

  panel6Name: string
  galleryPhotos: GalleryPhoto[]

  // Stickers
  stickers: StickerPlacement[]

  // Counsellor credit
  counsellorName: string
  counsellorId?: string
}

export interface GalleryPhoto {
  url: string
  caption?: string
}

export interface StickerPlacement {
  stickerId: string
  x: number   // percentage from left
  y: number   // percentage from top
}
