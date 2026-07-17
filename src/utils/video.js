/** Derive poster path from a reel video URL, e.g. /videos/foo.mp4?v=1 → /videos/foo-poster.jpg */
export function posterForVideo(videoUrl) {
  const pathname = videoUrl.split('?')[0]
  return pathname.replace(/\.mp4$/i, '-poster.jpg')
}
