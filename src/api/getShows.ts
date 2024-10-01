import type { Show } from './types'

export default async function getShows(page: number): Promise<Show[]> {
  const query = new URLSearchParams({
    page: page as unknown as string
  }).toString()

  const url = `https://api.tvmaze.com/shows?${query}`

  const response = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  })

  // throw if the response is not ok
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await response.json()
}
