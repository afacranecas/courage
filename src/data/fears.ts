export type FearCategory = 'fire' | 'mountain' | 'creature'

export function classifyFear(text: string): FearCategory {
  const value = text.toLowerCase()

  if (/speak|talk|tell|present|perform|stage|crowd|conflict|argument|embarrass|judge|attention/.test(value)) {
    return 'fire'
  }

  if (/fail|failure|start|finish|work|school|exam|test|future|change|goal|career|money|unknown|challenge/.test(value)) {
    return 'mountain'
  }

  return 'creature'
}

export const FEAR_CATEGORY_LABELS: Record<FearCategory, string> = {
  fire: 'Ring of Fire',
  mountain: 'Mountain',
  creature: 'Fear Creature'
}
