/** Explore grid — discovery posts (mock) */
export const explorePosts = [
  {
    id: 'e1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&w=600&h=800&fit=crop&q=80',
    views: 5200,
    tags: ['مد', 'استریت'],
  },
  {
    id: 'e2',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&w=600&h=800&fit=crop&q=80',
    views: 3100,
    tags: ['خرید', 'مد'],
  },
  {
    id: 'e3',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&w=600&h=800&fit=crop&q=80',
    views: 8900,
    tags: ['استایل'],
  },
  {
    id: 'e4',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&w=600&h=800&fit=crop&q=80',
    views: 4200,
    tags: ['مد'],
  },
  {
    id: 'e5',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&w=600&h=800&fit=crop&q=80',
    views: 6700,
    tags: ['لباس'],
  },
  {
    id: 'e6',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&w=600&h=800&fit=crop&q=80',
    views: 2800,
    tags: ['استریت'],
  },
  {
    id: 'e7',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&w=600&h=800&fit=crop&q=80',
    views: 1500,
    tags: ['خانه', 'نور'],
  },
  {
    id: 'e8',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&w=600&h=800&fit=crop&q=80',
    views: 9400,
    tags: ['گجت'],
  },
  {
    id: 'e9',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&w=600&h=800&fit=crop&q=80',
    views: 3600,
    tags: ['جین', 'مد'],
  },
  {
    id: 'e10',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&w=600&h=800&fit=crop&q=80',
    views: 7100,
    tags: ['دیجیتال'],
  },
  {
    id: 'e11',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&w=600&h=800&fit=crop&q=80',
    views: 4800,
    tags: ['مد'],
  },
  {
    id: 'e12',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&w=600&h=800&fit=crop&q=80',
    views: 11200,
    tags: ['موبایل', 'تکنولوژی'],
  },
  {
    id: 'e13',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&w=600&h=800&fit=crop&q=80',
    views: 2200,
    tags: ['خانه', 'لامپ'],
  },
  {
    id: 'e14',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&w=600&h=800&fit=crop&q=80',
    views: 3900,
    tags: ['تی‌شرت'],
  },
  {
    id: 'e15',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&w=600&h=800&fit=crop&q=80',
    views: 5600,
    tags: ['لپ‌تاپ', 'دیجیتال'],
  },
]

export function filterExplorePosts(query) {
  const q = query.trim().toLowerCase()
  if (!q) return explorePosts
  return explorePosts.filter((post) =>
    post.tags.some((tag) => tag.includes(q) || q.includes(tag)),
  )
}
