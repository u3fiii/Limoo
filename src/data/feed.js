/**
 * Reels-style home feed — 3 categories loop infinitely.
 * Vertical swipe → next category reel.
 * Horizontal swipe → related clips (may be different shops, same category).
 *
 * Posters are auto-derived from videoUrl via posterForVideo() in src/utils/video.js
 */
export const reels = [
  {
    id: 'r1',
    category: 'digital',
    clips: [
      {
        id: 'r1c1',
        sellerId: 's4',
        likes: 3200,
        comments: 96,
        videoUrl: '/videos/reel-product.mp4?v=4',
        productIds: ['p4', 'p4b', 'p4c'],
      },
      {
        id: 'r1c2',
        sellerId: 's5',
        likes: 5100,
        comments: 153,
        videoUrl: '/videos/reel-samsung-s25.mp4?v=4',
        productIds: ['p4d', 'p4e'],
      },
      {
        id: 'r1c3',
        sellerId: 's6',
        likes: 7800,
        comments: 234,
        videoUrl: '/videos/reel-huawei-mate-xt.mp4?v=4',
        productIds: ['p4f', 'p4g'],
      },
    ],
  },
  {
    id: 'r2',
    category: 'streetwear',
    clips: [
      {
        id: 'r2c1',
        sellerId: 's1',
        likes: 1800,
        comments: 54,
        videoUrl: '/videos/reel-streetwear.mp4?v=4',
        productIds: ['p1', 'p1b', 'p1c'],
      },
      {
        id: 'r2c2',
        sellerId: 's7',
        likes: 2400,
        comments: 72,
        videoUrl: '/videos/reel-denim-jeans.mp4?v=4',
        productIds: ['p1b', 'p1c', 'p5'],
      },
      {
        id: 'r2c3',
        sellerId: 's8',
        likes: 920,
        comments: 28,
        videoUrl: '/videos/reel-uniqlo-basics.mp4?v=4',
        productIds: ['p1c', 'p1', 'p5'],
      },
    ],
  },
  {
    id: 'r3',
    category: 'smarthome',
    clips: [
      {
        id: 'r3c1',
        sellerId: 's3',
        likes: 4100,
        comments: 123,
        videoUrl: '/videos/reel-yeelight.mp4?v=4',
        productIds: ['p3'],
      },
      {
        id: 'r3c2',
        sellerId: 's3',
        likes: 2900,
        comments: 87,
        videoUrl: '/videos/reel-xiaomi-lamp.mp4?v=4',
        productIds: ['p3b', 'p3c', 'p6'],
      },
      {
        id: 'r3c3',
        sellerId: 's9',
        likes: 1650,
        comments: 50,
        videoUrl: '/videos/reel-desk-lamp.mp4?v=4',
        productIds: ['p3', 'p3c', 'p6'],
      },
    ],
  },
]

/** @deprecated kept for any residual imports — prefer `reels` */
export const feedItems = reels.map((r) => ({
  id: r.id,
  type: 'reel',
  productId: r.clips[0]?.productIds[0],
  caption: '',
}))

export function getClipsForProduct(productId) {
  const clips = []
  for (const reel of reels) {
    for (const clip of reel.clips) {
      if (clip.productIds?.includes(productId)) {
        clips.push(clip)
      }
    }
  }
  return clips
}

export function getClipsForSeller(sellerId, limit = 6) {
  const clips = []
  for (const reel of reels) {
    for (const clip of reel.clips) {
      if (clip.sellerId === sellerId && !clips.some((c) => c.id === clip.id)) {
        clips.push(clip)
      }
    }
  }
  return clips.slice(0, limit)
}
