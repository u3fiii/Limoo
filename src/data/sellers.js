export const sellers = [
  {
    id: 's1',
    name: 'کالر استریت',
    handle: 'as.street',
    avatar: 'https://picsum.photos/seed/limoo-streetwear/100/100',
    bio: 'تی‌شرت و جین استریت‌ویر',
  },
  {
    id: 's2',
    name: 'کافه گرافیک',
    handle: 'cafe.graphic',
    avatar: 'https://picsum.photos/seed/limoo-s2/100/100',
    bio: 'پرینت، پوستر و گیفت‌باکس',
  },
  {
    id: 's3',
    name: 'خانه هوشمند',
    handle: 'smart.home',
    avatar: 'https://picsum.photos/seed/limoo-smarthome/100/100',
    bio: 'چراغ و گجت شیائومی و ییلیایت',
  },
  {
    id: 's4',
    name: 'دنیای دیجیتال',
    handle: 'digital.world',
    avatar: 'https://picsum.photos/seed/limoo-digital/100/100',
    bio: 'لوازم جانبی و گجت اپل',
  },
]

export function getSellerById(id) {
  return sellers.find((s) => s.id === id)
}
