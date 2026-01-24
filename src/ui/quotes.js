/**
 * Fetches a random daily quote from the Quotable API.
 *
 * If fetch fails, returns a default encouraging quote.
 *
 * @async
 * @returns {Promise<string>} A string containing the quote and author.
 */
export async function getDailyQuote () {
  try {
    const resp = await fetch('https://api.quotable.io/random')
    const data = await resp.json()
    return `${data.content} — ${data.author}`
  } catch (e) {
    return 'Keep your head up — things will get better.'
  }
}
