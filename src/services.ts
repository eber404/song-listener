import puppeteer, { Page } from 'puppeteer'

import {
  PLAY_PAUSE_SELECTOR,
  REMOTE_BROWSER_URI,
  MUSIC_PROVIDER_URI,
  THUMB_PATH,
  ARTIST_PATH,
  TITLE_PATH,
} from '@/consts.js'

export async function playMusic() {
  const res = await fetch(REMOTE_BROWSER_URI)
  const data = await res.json()
  const { webSocketDebuggerUrl } = data

  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
    defaultViewport: { width: 1280, height: 800 },
  })

  const page = await browser.newPage()

  await page.goto(MUSIC_PROVIDER_URI)
  await page.waitForSelector(PLAY_PAUSE_SELECTOR)
  await page.click(PLAY_PAUSE_SELECTOR)

  return { page }
}

interface ListenSelectorProps {
  selector: string
  callback: (props: any) => void
  prevValue: any
  page: Page
}

export async function listenSelector({
  selector,
  callback,
  prevValue,
  page,
}: ListenSelectorProps) {
  const newValue = await page.$eval(selector, (element) =>
    element.innerHTML ? element.innerHTML : element.getAttribute('src')
  )

  if (newValue !== prevValue) {
    callback(newValue)
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  await listenSelector({ selector, callback, prevValue: newValue, page })
}

export async function downloadThumb(url: string) {
  const thumb_url = url.toString().split('?')[0] + '?auto=compress&w=360&h=360'
  const res = await fetch(thumb_url)
  console.log('Downloading thumb...')
  const thumb = await res.arrayBuffer()
  console.log('Writing thumb file...')
  await Deno.writeFile(THUMB_PATH, new Uint8Array(thumb))
}

export async function writeSongArtist(artist: string) {
  const content = `${artist}`
  const encoder = new TextEncoder()
  const data = encoder.encode(content)

  console.log('Writing song artits to file...')
  await Deno.writeFile(ARTIST_PATH, data)
}

export async function writeSongTitle(title: string) {
  console.log('escrevendo a porra do title =>', title)
  const content = `${title}`
  const encoder = new TextEncoder()
  const data = encoder.encode(content)

  console.log('Writing song title to file...')
  await Deno.writeFile(TITLE_PATH, data)
}
