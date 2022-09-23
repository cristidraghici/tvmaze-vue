export type Schedule = {
  time: string
  days: string[]
}

export type Rating = {
  average: number
}

export type Country = {
  name: string
  code: string
  timezone: string
}

export type Network = {
  id: number
  name: string
  country: Country
  officialSite: String
}

export type Externals = {
  tvrage: number
  thetvdb: number
  imdb: string
}

export type Image = {
  medium: string
  original: string
}

export type Self = {
  href: string
}

export type Links = {
  self?: Self
  previousepisode?: Self
  show?: Self
  character?: Self
}

export type Season = {
  id: number
  url: string
  number: number
  name: string
  episodeOrder: number
  premiereDate: string
  endDate: string
  network: Network
  webChannel: string | null
  image: Image
  summary: string
  _links: Links
}

export type Episode = {
  id: number
  url: string
  name: string
  season: number
  number: number
  airdate: string
  airtime: string
  airstamp: string
  runtime: number
  image: Image
  summary: string
  _links: Links
}

export type Person = {
  id: number
  url: string
  country: Country
  birtday: string
  deathday: string | null
  image: Image
  _links: Links
}

export type Character = {
  id: number
  url: string
  name: string
  image: Image
  _links: Links
}

export type Cast = {
  person: Person
  character: Character
  self: boolean
  voice: boolean
}

export type CastCredits = {
  _links: Links
}

export type Crew = {
  type: string
  person: Person
}

export type CrewCredits = {
  type: string
  _links: Links
}

export type Aka = {
  name: string
  country: Country
}

export type Embedded = {
  show?: Show
  seasons?: Season[]
  episodes?: Episode[]
  cast?: Cast[]
  castcredits?: CastCredits[]
  crew?: Crew[]
  crewcredits?: CrewCredits[]
  akas?: Aka[]
}

export type Show = {
  id: number
  url: string
  name: string
  type: string
  language: string
  genres: string[]
  status: string
  runtime: number
  averageRuntime: number
  premiered: string
  ended: string
  officialSite: string
  schedule: Schedule
  rating: Rating
  weight: number
  network: Network
  webChannel: string | null
  dvdCountry: Country | null
  externals: Externals
  image: Image
  summary: string
  updated: number
  _links: Links
  _embedded?: Embedded
}

export type ShowSearch = {
  score: number
  show: Show
}
