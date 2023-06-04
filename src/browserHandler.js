import puppeteer from 'puppeteer'

import {
  PLAY_PAUSE_SELECTOR,
  REMOTE_BROWSER_URI,
  MUSIC_PROVIDER_URI,
} from '@/consts.js'

export async function browserHandler() {
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
