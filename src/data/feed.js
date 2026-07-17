/**
 * Reels-style home feed — 3 loops infinitely in the UI.
 */
export const reels = [
  {
    id: 'r1',
    sellerId: 's4',
    likes: 3200,
    videoUrl: '/videos/reel-product.mp4?v=2',
    poster: 'https://picsum.photos/seed/limoo-reel1/800/1400',
    clips: [
      'https://picsum.photos/seed/limoo-reel1a/800/1400',
      'https://picsum.photos/seed/limoo-reel1b/800/1400',
      'https://picsum.photos/seed/limoo-reel1c/800/1400',
      'https://picsum.photos/seed/limoo-reel1d/800/1400',
      'https://picsum.photos/seed/limoo-reel1e/800/1400',
    ],
    productIds: ['p4', 'p4b', 'p4c'],
  },
  {
    id: 'r2',
    sellerId: 's1',
    likes: 1800,
    videoUrl: '/videos/reel-streetwear.mp4?v=2',
    poster: 'https://picsum.photos/seed/limoo-reel2/800/1400',
    clips: [
      'https://picsum.photos/seed/limoo-reel2a/800/1400',
      'https://picsum.photos/seed/limoo-reel2b/800/1400',
      'https://picsum.photos/seed/limoo-reel2c/800/1400',
    ],
    productIds: ['p1', 'p1b', 'p1c'],
  },
  {
    id: 'r3',
    sellerId: 's3',
    likes: 4100,
    videoUrl: '/videos/reel-yeelight.mp4?v=3',
    poster: undefined,
    clips: [
      'https://picsum.photos/seed/limoo-reel3a/800/1400',
      'https://picsum.photos/seed/limoo-reel3b/800/1400',
      'https://picsum.photos/seed/limoo-reel3c/800/1400',
    ],
    productIds: ['p3', 'p3b', 'p3c'],
  },
]

/** @deprecated kept for any residual imports — prefer `reels` */
export const feedItems = reels.map((r) => ({
  id: r.id,
  type: 'reel',
  productId: r.productIds[0],
  caption: '',
}))
