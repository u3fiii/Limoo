import { explorePosts } from './explore'
import { products } from './products'

/** Mock seller profile — دنیای بوردگیم منصوری */
export const profileUser = {
  handle: 'mrmansouri',
  name: 'دنیای بوردگیم منصوری',
  verified: true,
  avatar:
    'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&w=200&h=200&fit=crop&q=80',
  stats: {
    followers: 20000,
    following: 76,
    products: 143,
  },
  bio: [
    'عرضه کننده انواع گیم‌بوردهای فارسی و انگلیسی، بهترین‌ها را از ما بخواهید، کیفیت خط قرمز ماست.',
    'ارسال به سراسر ایران',
    '📍 گرگان بلوار ناهارخوران | خرید آنلاین 👇',
  ],
}

const GRID = '?auto=format&w=600&h=800&fit=crop&q=80'

/** Unsplash IDs that fail to load — excluded from grids */
const BLOCKED_IDS = [
  '1586075010923-2dd457f0ee29',
  '1602600620967-9742d2442737',
  '1602874801006-9f3520663116',
  '1625729147599-64d86a457457',
  '1610945265064-0e34e55182f9',
  '1590874103328-eac38a683398',
  '1618384887929-16ec33fab0ef',
  '1593640408182-31c70c8268f4',
]

function toGrid(url) {
  const [base] = url.split('?')
  return `${base}${GRID}`
}

function isAllowed(url) {
  return !BLOCKED_IDS.some((id) => url.includes(id))
}

function makeGridItems(images, prefix, viewsBase) {
  return images.map((image, index) => ({
    id: `${prefix}-${index + 1}`,
    image,
    views: viewsBase + index * 420,
  }))
}

function uniqueImages(urls, limit = 15) {
  const seen = new Set()
  const out = []

  for (const url of urls) {
    if (!isAllowed(url) || seen.has(url)) continue
    seen.add(url)
    out.push(url)
    if (out.length >= limit) break
  }

  return out
}

/** محصولات فروشگاه — اول بوردگیم و گیفت، بعد بقیه کاتالوگ */
const shopProductOrder = [
  'p2',
  'p5',
  'p1',
  'p1b',
  'p1c',
  'p3',
  'p3b',
  'p3c',
  'p4',
  'p4b',
  'p4c',
  'p4d',
  'p4e',
  'p4f',
  'p4g',
  'p6',
]

function collectProductImages(imageIndex = 0) {
  const urls = []

  for (const id of shopProductOrder) {
    const product = products.find((item) => item.id === id)
    if (!product?.images[imageIndex]) continue
    urls.push(toGrid(product.images[imageIndex]))
  }

  for (const product of products) {
    for (const image of product.images) {
      urls.push(toGrid(image))
    }
  }

  return uniqueImages(urls)
}

/** ویدیوها — محتوای اکسپلور / استایل و معرفی کالا */
const videoImages = explorePosts.map((post) => post.image)

/** موردعلاقه‌ها — عکس دوم محصولات + پست‌های کشف مرتبط با خرید */
function collectFavoriteImages() {
  const urls = []

  for (const id of [...shopProductOrder].reverse()) {
    const product = products.find((item) => item.id === id)
    if (product?.images[1]) urls.push(toGrid(product.images[1]))
  }

  for (const post of explorePosts) {
    urls.push(post.image)
  }

  return uniqueImages(urls)
}

export const profileTabs = [
  { id: 'products', label: 'محصولات' },
  { id: 'videos', label: 'ویدیوها' },
  { id: 'favorites', label: 'موردعلاقه‌ها' },
]

export const profileGridByTab = {
  products: makeGridItems(collectProductImages(0), 'p', 1200),
  videos: makeGridItems(videoImages, 'v', 5000),
  favorites: makeGridItems(collectFavoriteImages(), 'f', 800),
}
