import { toPersianDigits } from '../utils/format'

export const activityFilters = [
  { id: 'all', label: 'همه' },
  { id: 'requests', label: 'درخواست‌ها' },
  { id: 'followers', label: 'دنبال‌کننده' },
  { id: 'comments', label: 'نظرات' },
  { id: 'likes', label: 'پسندها' },
]

/**
 * @typedef {'like' | 'like_multi' | 'follow_request' | 'comment' | 'reply' | 'follow' | 'comment_like'} ActivityType
 */

/** @type {{ id: string, type: ActivityType, filter: string, actors: { name: string, avatar: string }[], othersCount?: number, body: string, timeAgo: string }[]} */
export const activities = [
  {
    id: 'a1',
    type: 'like_multi',
    filter: 'likes',
    actors: [
      {
        name: 'آرش',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
      },
      {
        name: 'سارا',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      },
    ],
    othersCount: 5,
    body: 'پست شما را پسندیدند.',
    timeAgo: `${toPersianDigits(3)} دقیقه پیش`,
  },
  {
    id: 'a2',
    type: 'like',
    filter: 'likes',
    actors: [
      {
        name: 'لیلا صبوری',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      },
    ],
    body: 'پست شما را پسندید',
    timeAgo: `${toPersianDigits(3)} دقیقه پیش`,
  },
  {
    id: 'a3',
    type: 'follow_request',
    filter: 'requests',
    actors: [
      {
        name: 'مریم سعیدی',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      },
    ],
    body: 'درخواست دنبال کردن فرستاد',
    timeAgo: `${toPersianDigits(5)} ساعت پیش`,
  },
  {
    id: 'a4',
    type: 'comment',
    filter: 'comments',
    actors: [
      {
        name: 'محمد رضایی',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      },
    ],
    body: 'به پست شما پاسخ داد: عالیه! ادامه بده',
    timeAgo: `${toPersianDigits(15)} دقیقه پیش`,
  },
  {
    id: 'a5',
    type: 'reply',
    filter: 'comments',
    actors: [
      {
        name: 'سارا امینی',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      },
    ],
    body: 'به نظر شما پاسخ داد',
    timeAgo: `${toPersianDigits(45)} دقیقه پیش`,
  },
  {
    id: 'a6',
    type: 'follow',
    filter: 'followers',
    actors: [
      {
        name: 'تیم طراحی',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
      },
    ],
    body: 'شما را دنبال کرد',
    timeAgo: `${toPersianDigits(2)} ساعت پیش`,
  },
  {
    id: 'a7',
    type: 'comment_like',
    filter: 'likes',
    actors: [
      {
        name: 'علی احمدی',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      },
    ],
    body: 'نظر شما را پسندید',
    timeAgo: `${toPersianDigits(3)} ساعت پیش`,
  },
  {
    id: 'a8',
    type: 'like',
    filter: 'likes',
    actors: [
      {
        name: 'نیکا مرادی',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
      },
    ],
    body: 'پست شما را پسندید',
    timeAgo: `${toPersianDigits(1)} روز پیش`,
  },
]

export function getActivitiesByFilter(filterId) {
  if (filterId === 'all') return activities
  return activities.filter((item) => item.filter === filterId)
}
