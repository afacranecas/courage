export type Ability = {
  name: string
  shortName: string
  description: string
  color: number
  cssColor: string
  icon: string
}

export const ABILITIES: Ability[] = [
  {
    name: 'I stay steady when things feel intense',
    shortName: 'Calm',
    description: 'Your power is Calm.',
    color: 0x59dbe8,
    cssColor: '#59dbe8',
    icon: '~~'
  },
  {
    name: 'I notice when someone needs support',
    shortName: 'Kindness',
    description: 'Your power is Kindness.',
    color: 0xff7eb6,
    cssColor: '#ff7eb6',
    icon: '<3'
  },
  {
    name: 'I can find something good to move toward',
    shortName: 'Hope',
    description: 'Your power is Hope.',
    color: 0xffc857,
    cssColor: '#ffc857',
    icon: '*'
  },
  {
    name: 'I keep trying when things get difficult',
    shortName: 'Persistence',
    description: 'Your power is Persistence.',
    color: 0x8ee26b,
    cssColor: '#8ee26b',
    icon: '>'
  },
  {
    name: 'I find new ways around a problem',
    shortName: 'Creativity',
    description: 'Your power is Creativity.',
    color: 0xff8a4c,
    cssColor: '#ff8a4c',
    icon: '+'
  },
  {
    name: 'I can laugh and bring lightness with me',
    shortName: 'Playfulness',
    description: 'Your power is Playfulness.',
    color: 0xc99cff,
    cssColor: '#c99cff',
    icon: ':)'
  },
  {
    name: 'I like discovering how things work',
    shortName: 'Curiosity',
    description: 'Your power is Curiosity.',
    color: 0x62a8ff,
    cssColor: '#62a8ff',
    icon: '?'
  },
  {
    name: 'I say what is true, even when it is hard',
    shortName: 'Honesty',
    description: 'Your power is Honesty.',
    color: 0xff6b6b,
    cssColor: '#ff6b6b',
    icon: '!'
  },
  {
    name: 'I act even when I feel nervous',
    shortName: 'Bravery',
    description: 'Your power is Bravery.',
    color: 0xf7f06d,
    cssColor: '#f7f06d',
    icon: '^'
  }
]

export function getAbility(name: string) {
  return ABILITIES.find(ability => ability.name === name)
}
