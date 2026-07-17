export const sellers = [
  {
    id: 's1',
    name: 'کالر استریت',
    handle: 'as.street',
    avatar: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&w=100&h=100&fit=crop&q=80',
    bio: 'تی‌شرت و جین استریت‌ویر',
  },
  {
    id: 's2',
    name: 'کافه گرافیک',
    handle: 'cafe.graphic',
    avatar: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&w=100&h=100&fit=crop&q=80',
    bio: 'پرینت، پوستر و گیفت‌باکس',
  },
  {
    id: 's3',
    name: 'خانه هوشمند',
    handle: 'smart.home',
    avatar: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&w=100&h=100&fit=crop&q=80',
    bio: 'چراغ و گجت شیائومی و ییلیایت',
  },
  {
    id: 's4',
    name: 'دنیای دیجیتال',
    handle: 'digital.world',
    avatar: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&w=100&h=100&fit=crop&q=80',
    bio: 'لوازم جانبی و گجت اپل',
  },
  {
    id: 's5',
    name: 'گلکسی استور',
    handle: 'galaxy.store',
    avatar: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&w=100&h=100&fit=crop&q=80',
    bio: 'موبایل و لوازم جانبی سامسونگ',
  },
  {
    id: 's6',
    name: 'هواوی موبایل',
    handle: 'huawei.mobile',
    avatar: 'https://images.unsplash.com/photo-1598327275667-71a27c7f2d8e?w=100&h=100&fit=crop',
    bio: 'گوشی و گجت هواوی',
  },
  {
    id: 's7',
    name: 'دارک شید',
    handle: 'dark.shade',
    avatar: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=100&h=100&fit=crop',
    bio: 'جین و استایل روزمره',
  },
  {
    id: 's8',
    name: 'یونیکلو',
    handle: 'uniqlo.ir',
    avatar: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop',
    bio: 'بیسیک‌های مردانه',
  },
  {
    id: 's9',
    name: 'نور استودیو',
    handle: 'studio.light',
    avatar: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop',
    bio: 'لامپ و نور میز کار',
  },
]

export function getSellerById(id) {
  return sellers.find((s) => s.id === id)
}
