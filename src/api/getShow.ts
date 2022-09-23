import type { Show } from './types'

/**
 * TODO: improve the type for the embed param
 */
export default async function getShow(id: number, embed?: string[]): Promise<Show> {
  let url = `https://api.tvmaze.com/shows/${id}`

  if (embed && embed.length > 0) {
    url += '?' + embed.map((item) => `embed[]=${item}`).join('&')
  }

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
