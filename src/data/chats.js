/**
 * Seed chat threads. Messages use an extensible shape:
 * { id, type: 'text'|'product'|'system'|…, sender, content?, productId?, productState?, note?, timestamp }
 */
export const initialThreads = [
  {
    id: 't1',
    sellerId: 's2',
    lastPreview: 'بله موجوده، فردا پست می‌شه',
    unread: 1,
    basket: [],
    messages: [
      {
        id: 'm1',
        type: 'text',
        sender: 'buyer',
        content: 'سلام، پوستر تایپوگرافی موجوده؟',
        timestamp: Date.now() - 1000 * 60 * 60 * 5,
      },
      {
        id: 'm2',
        type: 'text',
        sender: 'seller',
        content: 'بله موجوده، فردا پست می‌شه',
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
      },
    ],
  },
  {
    id: 't2',
    sellerId: 's3',
    lastPreview: 'سلام!',
    unread: 0,
    basket: [],
    messages: [
      {
        id: 'm1',
        type: 'text',
        sender: 'buyer',
        content: 'سلام!',
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
      },
    ],
  },
]

export const quickReplies = [
  'سلام، موجوده؟',
  'قیمت نهایی چنده؟',
  'ارسال چطوریه؟',
]

export const cannedSellerReplies = [
  'سلام! بله موجوده 🌱',
  'قیمت همونه که تو صفحه هست، تخفیف روی خرید دوم.',
  'ارسال با پست پیشتاز، معمولاً ۲ تا ۳ روزه.',
  'سایزت رو بگو تا دقیق‌تر راهنمایی کنم.',
  'اوکیه، الان برات تو سبد می‌ذارم.',
]
