import type { Species } from './types'

export interface StickerDef {
  id: string
  label: string
  svg: string
}

const HEART = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
const STAR = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`
const PAW = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="4.5" cy="9" r="2.5"/><circle cx="9" cy="5.5" r="2.5"/><circle cx="15" cy="5.5" r="2.5"/><circle cx="19.5" cy="9" r="2.5"/><path d="M17.34 14.86c-.87-1.02-1.6-1.76-2.53-2.56-.83-.7-1.99-1.3-3.48-1.3s-2.65.6-3.48 1.3c-.93.8-1.66 1.54-2.53 2.56C3.44 16.32 3 17.34 3 18.5c0 1.93 1.55 3.5 3.47 3.5h11.06C19.45 22 21 20.43 21 18.5c0-1.16-.44-2.18-1.66-3.64z"/></svg>`
const SPARKLE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"/><path d="M18 2L18.75 4.25L21 5L18.75 5.75L18 8L17.25 5.75L15 5L17.25 4.25L18 2Z" opacity="0.6"/><path d="M5 16L5.5 17.5L7 18L5.5 18.5L5 20L4.5 18.5L3 18L4.5 17.5L5 16Z" opacity="0.6"/></svg>`
const BUTTERFLY = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8 2 4 5 4 8c0 2 1.5 4 3.5 5L12 22l4.5-9C18.5 12 20 10 20 8c0-3-4-6-8-6zm0 2c3 0 6 2.5 6 4 0 1.5-1 3-3 4l-3-6-3 6c-2-1-3-2.5-3-4 0-1.5 3-4 6-4z" opacity="0.7"/></svg>`
const RAINBOW = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4C7 4 3 8 3 12h2c0-3.9 3.1-7 7-7s7 3.1 7 7h2c0-4-4-8-9-8zm0 4c-2.2 0-4 1.8-4 4h2c0-1.1.9-2 2-2s2 .9 2 2h2c0-2.2-1.8-4-4-4z"/></svg>`
const MOON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`
const FLOWER = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 2a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0V4a2 2 0 0 0-2-2zm0 16a2 2 0 0 0-2 2v0a2 2 0 0 0 4 0v0a2 2 0 0 0-2-2zm8-8a2 2 0 0 0 0 4h0a2 2 0 0 0 0-4h0zm-16 0a2 2 0 0 0 0 4h0a2 2 0 0 0 0-4h0zm13.66-5.66a2 2 0 0 0-2.83 2.83l.01.01a2 2 0 0 0 2.83-2.83l-.01-.01zm-11.32 0a2 2 0 0 0 0 2.83l.01.01a2 2 0 0 0 2.83-2.83l-.01-.01zm11.32 11.32a2 2 0 0 0-2.83 0l-.01.01a2 2 0 0 0 2.83 2.83l.01-.01a2 2 0 0 0 0-2.83zm-11.32 0a2 2 0 0 0 0 2.83l.01.01a2 2 0 0 0 2.83-2.83l-.01-.01a2 2 0 0 0-2.83 0z"/></svg>`
const BONE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 8.5c.83 0 1.5-.67 1.5-1.5S9.33 5.5 8.5 5.5c-.28 0-.53.08-.75.21L6.21 4.17C6.62 3.46 7.5 3 8.5 3 10.43 3 12 4.57 12 6.5c0 .88-.33 1.68-.87 2.29l1.74 1.74c.61-.54 1.41-.87 2.29-.87 1.93 0 3.5 1.57 3.5 3.5S17.09 16.5 15.16 16.5c-.88 0-1.68-.33-2.29-.87l-1.74 1.74c.54.61.87 1.41.87 2.29C12 21.43 10.43 23 8.5 23S5 21.43 5 19.5c0-.83.29-1.59.76-2.19l-1.35-1.35C3.82 16.47 3 16.74 3 16.5 3 14.57 4.57 13 6.5 13c.88 0 1.68.33 2.29.87l1.74-1.74C9.99 11.52 9.5 10.56 9.5 9.5c0-.55.45-1 1-1z" opacity="0.8"/></svg>`
const BALL = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" opacity="0.2"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M3 12c0 0 3-4 9-4s9 4 9 4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12c0 0 3 4 9 4s9-4 9-4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>`
const HORSESHOE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7 2 3 6 3 11v3c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-3c0-5-4-9-9-9z"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>`
const ROSETTE = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="9" r="4"/><path d="M12 13l-1 8h2l-1-8z"/><path d="M10 20l-2 1v-2l2 1zm4 0l2 1v-2l-2 1z"/><path d="M8 9a4 4 0 0 1 4-4 4 4 0 0 1 4 4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"/></svg>`
const FEATHER = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.57 3.43C18.93 1.79 16.7 1 14.5 1c-2.2 0-4.43.79-6.07 2.43C4.75 7.17 4.34 12.57 7 16.9L3 21h2.5l2.09-2.09C9.5 20.27 11.5 21 13.5 21c2.5 0 5-1 6.5-3 2-2.5 2-6 .57-8.07l1.43-6.5z" opacity="0.8"/><line x1="12" y1="12" x2="6" y2="21" stroke="white" strokeWidth="1"/></svg>`
const MUSICAL_NOTE = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`
const YARN = `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M3.5 8.5C7 7 11 9 12 12s-1 7-4.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M20.5 8.5C17 7 13 9 12 12s1 7 4.5 7.5" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>`

export const STICKER_SETS: Record<Species | 'generic', StickerDef[]> = {
  generic: [
    { id: 'heart',     label: 'Heart',     svg: HEART },
    { id: 'star',      label: 'Star',      svg: STAR },
    { id: 'paw',       label: 'Paw print', svg: PAW },
    { id: 'sparkle',   label: 'Sparkle',   svg: SPARKLE },
    { id: 'butterfly', label: 'Butterfly', svg: BUTTERFLY },
    { id: 'rainbow',   label: 'Rainbow',   svg: RAINBOW },
    { id: 'moon',      label: 'Moon',      svg: MOON },
    { id: 'flower',    label: 'Flower',    svg: FLOWER },
  ],
  dog: [
    { id: 'paw',  label: 'Paw print', svg: PAW },
    { id: 'bone', label: 'Bone',      svg: BONE },
    { id: 'ball', label: 'Ball',      svg: BALL },
    { id: 'heart', label: 'Heart',    svg: HEART },
    { id: 'star',  label: 'Star',     svg: STAR },
    { id: 'sparkle', label: 'Sparkle', svg: SPARKLE },
  ],
  cat: [
    { id: 'paw',    label: 'Paw print', svg: PAW },
    { id: 'yarn',   label: 'Yarn',      svg: YARN },
    { id: 'heart',  label: 'Heart',     svg: HEART },
    { id: 'moon',   label: 'Moon',      svg: MOON },
    { id: 'star',   label: 'Star',      svg: STAR },
    { id: 'flower', label: 'Flower',    svg: FLOWER },
  ],
  horse: [
    { id: 'horseshoe', label: 'Horseshoe', svg: HORSESHOE },
    { id: 'rosette',   label: 'Rosette',   svg: ROSETTE },
    { id: 'heart',     label: 'Heart',     svg: HEART },
    { id: 'star',      label: 'Star',      svg: STAR },
    { id: 'flower',    label: 'Flower',    svg: FLOWER },
    { id: 'sparkle',   label: 'Sparkle',   svg: SPARKLE },
  ],
  bird: [
    { id: 'feather', label: 'Feather',      svg: FEATHER },
    { id: 'note',    label: 'Musical note', svg: MUSICAL_NOTE },
    { id: 'heart',   label: 'Heart',        svg: HEART },
    { id: 'star',    label: 'Star',         svg: STAR },
    { id: 'rainbow', label: 'Rainbow',      svg: RAINBOW },
    { id: 'sparkle', label: 'Sparkle',      svg: SPARKLE },
  ],
  other: [
    { id: 'heart',     label: 'Heart',     svg: HEART },
    { id: 'star',      label: 'Star',      svg: STAR },
    { id: 'paw',       label: 'Paw print', svg: PAW },
    { id: 'butterfly', label: 'Butterfly', svg: BUTTERFLY },
    { id: 'flower',    label: 'Flower',    svg: FLOWER },
    { id: 'rainbow',   label: 'Rainbow',   svg: RAINBOW },
    { id: 'sparkle',   label: 'Sparkle',   svg: SPARKLE },
    { id: 'moon',      label: 'Moon',      svg: MOON },
  ],
}

export function getStickers(species: Species): StickerDef[] {
  return [...(STICKER_SETS[species] ?? STICKER_SETS.other), ...STICKER_SETS.generic]
    .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
}
