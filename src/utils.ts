import { Page } from 'puppeteer'

import { SONG_INFO_PATH, THUMB_PATH } from '@/consts.js'

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

interface WriteSongInfoProps {
  artist: string
  title: string
}

export async function writeSongInfo({ artist, title }: WriteSongInfoProps) {
  const content = `${artist} - ${title}`
  const encoder = new TextEncoder()
  const data = encoder.encode(content)

  console.log('Writing song info to file...')
  await Deno.writeFile(SONG_INFO_PATH, data)
}
