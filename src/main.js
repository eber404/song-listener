import { SONG_SELECTOR, THUMB_SELECTOR, ARTIST_SELECTOR } from '@/consts.js'
import {
  listenSelector,
  writeSongInfo,
  downloadThumb,
  playMusic,
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

        if (!!target.title && !!target.artist && !!target.thumb) {
          writeSongInfo({ title: target.title, artist: target.artist })
          downloadThumb(target.thumb)

          songInfo.song = null
          songInfo.artist = null
          songInfo.thumb = null
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
