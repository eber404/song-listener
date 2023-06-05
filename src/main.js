// deno-lint-ignore-file
import { SONG_SELECTOR, THUMB_SELECTOR, ARTIST_SELECTOR } from '@/consts.js'
import {
  listenSelector,
  downloadThumb,
  playMusic,
  writeSongTitle,
  writeSongArtist,
} from '@/services.ts'

async function main() {
  try {
    console.log('Connecting to browser...')
    const { page } = await playMusic()

    const songInfo = {
      artist: null,
      title: null,
      thumb: null,
    }

    const proxyHandler = {
      set: (target, prop, value) => {
        target[prop] = value

        if (!!target.title) {
          writeSongTitle(target.title)
        }

        if (!!target.artist) {
          writeSongArtist(target.artist)
        }

        if (!!target.thumb) {
          downloadThumb(target.thumb)
        }

        return value
      },
    }

    const songInfoProxy = new Proxy(songInfo, proxyHandler)

    console.log('listening to selectors...')
    listenSelector({
      selector: ARTIST_SELECTOR,
      page,
      callback: (value) => {
        songInfoProxy.artist = value
      },
    })

    listenSelector({
      selector: SONG_SELECTOR,
      page,
      callback: (value) => {
        songInfoProxy.title = value
      },
    })

    listenSelector({
      selector: THUMB_SELECTOR,
      page,
      callback: (value) => {
        songInfoProxy.thumb = value
      },
    })
  } catch (error) {
    console.log(error)
  }
}

main()
