import puppeteer from 'puppeteer'

import { PLAY_PAUSE_SELECTOR } from '@/consts.js'

export async function browserHandler({ browserUrl, musicProviderUri }) {
  const res = await fetch(browserUrl)
  const data = await res.json()
  const { webSocketDebuggerUrl } = data

  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl,
    defaultViewport: { width: 1280, height: 800 },
  })

  const page = await browser.newPage()

  await page.goto(musicProviderUri)
  await page.waitForSelector(PLAY_PAUSE_SELECTOR)
  await page.click(PLAY_PAUSE_SELECTOR)

  return { page }
}
