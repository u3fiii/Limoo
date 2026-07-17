import { getSellerById } from './sellers'

/**
 * Seed chat threads. Messages use an extensible shape:
 * { id, type: 'text'|'product'|'system'|…, sender, content?, productId?, productState?, note?, timestamp }
 *
 * Optional display overrides: contactName, contactAvatar, online
 */
function atToday(hours, minutes) {
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.getTime()
}

function atDaysAgo(days, hours, minutes) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  date.setHours(hours, minutes, 0, 0)
  return date.getTime()
}

function seedThread({
  id,
  sellerId,
  contactName,
  contactAvatar,
  online = false,
  lastPreview,
  unread = 0,
  timestamp,
}) {
  return {
    id,
    sellerId,
    contactName,
    contactAvatar,
    online,
    lastPreview,
    unread,
    basket: [],
    messages: [
      {
        id: `${id}-m1`,
        type: 'text',
        sender: 'seller',
        content: lastPreview,
        timestamp,
      },
    ],
  }
}

export const initialThreads = [
  seedThread({
    id: 't1',
    sellerId: 's2',
    contactName: 'سارا احمدی',
    contactAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    online: true,
    lastPreview: 'قیمت نهایی چنده؟',
    unread: 6,
    timestamp: atToday(10, 23),
  }),
  seedThread({
    id: 't2',
    sellerId: 's1',
    contactName: 'محمدعلی صادقی',
    contactAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    online: true,
    lastPreview: 'اختیار دارید قربان',
    unread: 1,
    timestamp: atToday(9, 41),
  }),
  seedThread({
    id: 't3',
    sellerId: 's3',
    contactName: 'سارا سادات موسوی',
    contactAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    lastPreview: 'بله بله، اتفاقا به آقای منصوری هم گفتم',
    timestamp: atToday(21, 4),
  }),
  seedThread({
    id: 't4',
    sellerId: 's4',
    contactName: 'امیرحسین میرطالبی نسب',
    contactAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastPreview: 'خوش آمدید',
    timestamp: atToday(8, 15),
  }),
  seedThread({
    id: 't5',
    sellerId: 's5',
    contactName: 'نرگس کریمی',
    contactAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    online: true,
    lastPreview: 'فردا ارسال می‌کنم، ممنون از صبرت',
    unread: 3,
    timestamp: atToday(11, 7),
  }),
  seedThread({
    id: 't6',
    sellerId: 's6',
    contactName: 'رضا محمدپور',
    contactAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    lastPreview: 'سایز L موجوده، رنگ مشکی هم داریم',
    timestamp: atToday(7, 52),
  }),
  seedThread({
    id: 't7',
    sellerId: 's7',
    contactName: 'مریم حسینی',
    contactAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    online: true,
    lastPreview: 'عکس واقعی محصول رو برات فرستادم',
    unread: 2,
    timestamp: atToday(13, 18),
  }),
  seedThread({
    id: 't8',
    sellerId: 's8',
    contactName: 'علی رضایی',
    contactAvatar:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
    lastPreview: 'پرداخت در محل هم امکان‌پذیره',
    timestamp: atToday(6, 30),
  }),
  seedThread({
    id: 't9',
    sellerId: 's9',
    contactName: 'فاطمه نوری',
    contactAvatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
    lastPreview: 'کد تخفیف ۱۰٪ برات فعال کردم',
    unread: 1,
    timestamp: atDaysAgo(1, 22, 14),
  }),
  seedThread({
    id: 't10',
    sellerId: 's1',
    contactName: 'حسین مرادی',
    contactAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    lastPreview: 'سلام، سفارش رسید؟',
    timestamp: atDaysAgo(1, 18, 45),
  }),
  seedThread({
    id: 't11',
    sellerId: 's2',
    contactName: 'زهرا اکبری',
    contactAvatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    online: true,
    lastPreview: 'بسته‌بندی gift wrap هم داریم',
    timestamp: atDaysAgo(1, 15, 20),
  }),
  seedThread({
    id: 't12',
    sellerId: 's3',
    contactName: 'پارسا جعفری',
    contactAvatar:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
    lastPreview: 'گارانتی ۱۸ ماهه داره',
    timestamp: atDaysAgo(2, 12, 8),
  }),
  seedThread({
    id: 't13',
    sellerId: 's4',
    contactName: 'الهام شریفی',
    contactAvatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    lastPreview: 'ارسال اکسپرس تا فردا می‌رسه',
    unread: 4,
    timestamp: atDaysAgo(2, 9, 33),
  }),
  seedThread({
    id: 't14',
    sellerId: 's5',
    contactName: 'مهدی طاهری',
    contactAvatar:
      'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop',
    lastPreview: 'مدل جدیدش هم هفته بعد میاد',
    timestamp: atDaysAgo(3, 20, 11),
  }),
  seedThread({
    id: 't15',
    sellerId: 's6',
    contactName: 'نگین صادقی',
    contactAvatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
    online: true,
    lastPreview: 'ممنون از خریدت، حتما نظرت رو بگو',
    timestamp: atDaysAgo(4, 16, 55),
  }),
  seedThread({
    id: 't16',
    sellerId: 's7',
    contactName: 'کامران باقری',
    contactAvatar:
      'https://images.unsplash.com/photo-1463453091185-9138b5b493f7?w=100&h=100&fit=crop',
    lastPreview: 'کارت کالا به سبد اضافه شد',
    timestamp: atDaysAgo(5, 14, 2),
  }),
  seedThread({
    id: 't17',
    sellerId: 's8',
    contactName: 'شیما رحیمی',
    contactAvatar:
      'https://images.unsplash.com/photo-1531746020798-e6953b6a9118?w=100&h=100&fit=crop',
    lastPreview: 'برای خرید دوم ۱۵٪ تخفیف داری',
    unread: 1,
    timestamp: atDaysAgo(6, 11, 40),
  }),
  seedThread({
    id: 't18',
    sellerId: 's9',
    contactName: 'آرمان کیانی',
    contactAvatar:
      'https://images.unsplash.com/photo-1552374196-c4e7b6ef9923?w=100&h=100&fit=crop',
    lastPreview: 'سلام! بله موجوده 🌱',
    timestamp: atDaysAgo(7, 8, 27),
  }),
]

export function getThreadContact(thread) {
  const seller = getSellerById(thread.sellerId)
  return {
    name: thread.contactName ?? seller?.name ?? 'ناشناس',
    avatar: thread.contactAvatar ?? seller?.avatar ?? '',
    online: Boolean(thread.online),
  }
}

export function filterChatThreads(threads, query) {
  const q = query.trim()
  if (!q) return threads

  return threads.filter((thread) => {
    const { name } = getThreadContact(thread)
    return name.includes(q) || thread.lastPreview.includes(q)
  })
}

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
