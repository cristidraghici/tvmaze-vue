import type { Show, ShowSearch } from './types'

export default async function getSearchShows(search: string): Promise<Show[]> {
  const query = new URLSearchParams({
    q: search
  }).toString()

  const url = `https://api.tvmaze.com/search/shows?${query}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })

  // throw if the response is not ok
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json = await response.json()

  return json.map((item: ShowSearch): Show => item.show)
}
