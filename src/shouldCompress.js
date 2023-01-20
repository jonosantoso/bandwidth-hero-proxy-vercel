const isAnimated = require('is-animated')

const MIN_COMPRESS_LENGTH = process.env.MIN_COMPRESS_LENGTH || 2048
const MIN_TRANSPARENT_COMPRESS_LENGTH = MIN_COMPRESS_LENGTH * 10 //~20KB
const APNG_THRESH_LENGTH = MIN_COMPRESS_LENGTH * 25 //~50KB

function shouldCompress(req, buffer) {
  const { originType, originSize, webp } = req.params

  if (!originType.startsWith('image')) return false
  if (originSize === 0) return false
  if (webp && originSize < MIN_COMPRESS_LENGTH) return false
  if (
    !webp &&
    (originType.endsWith('png') || originType.endsWith('gif')) &&
    originSize < MIN_TRANSPARENT_COMPRESS_LENGTH
  ) {
    return false
  }
  
  if((originType.endsWith('png')) && isAnimated(buffer) && originSize < APNG_THRESH_LENGTH){
      //It's an animated png file, let it pass through through if small enough
      return false
  }

  return true
}

module.exports = shouldCompress
