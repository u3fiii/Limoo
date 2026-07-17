export const aiDescriptionTones = [
  {
    id: 'formal',
    label: 'رسمی',
    hint: 'لحن محترمانه و حرفه‌ای',
  },
  {
    id: 'friendly',
    label: 'دوستانه',
    hint: 'صمیمی و قابل اعتماد',
  },
  {
    id: 'sales',
    label: 'فروشنده حرفه‌ای',
    hint: 'تاکید روی مزیت و ارزش کالا',
  },
  {
    id: 'concise',
    label: 'مختصر و مفید',
    hint: 'کوتاه، مستقیم و شفاف',
  },
  {
    id: 'detailed',
    label: 'پر جزئیات',
    hint: 'رنگ، سایز و جزئیات بیشتر',
  },
]

const toneTemplates = {
  formal: (title) =>
    `${title} با کیفیت مطلوب و اصالت کالا ارائه می‌شود. مشخصات دقیق، وضعیت ظاهری و شرایط ارسال پس از هماهنگی اعلام خواهد شد. برای اطلاعات تکمیلی در خدمت شما هستیم.`,
  friendly: (title) =>
    `سلام! ${title} رو داریم و واقعاً حالش خوبه 😊 اگه سوالی داشتی راحت بپرس؛ رنگ، سایز و هر چیز دیگه‌ای که لازم داری بگو تا راهنماییت کنیم.`,
  sales: (title) =>
    `${title} — انتخابی عالی برای خریدی مطمئن! کیفیت ساخت بالا، ظاهر تمیز و ارزش خرید مناسب. موجودی محدود؛ برای رزرو سریع پیام بده.`,
  concise: (title) =>
    `${title}. سالم، تمیز و آماده ارسال. قیمت منصفانه. پیام بده برای جزئیات.`,
  detailed: (title) =>
    `${title}\n\n• وضعیت: سالم و بدون ایراد\n• رنگ و سایز: طبق عکس‌ها\n• ارسال: سراسر کشور\n• بسته‌بندی: مطمئن\n\nبرای هماهنگی رنگ، سایز یا بازدید حضوری پیام بده.`,
}

export function generateListingDescription(title, toneId) {
  const trimmed = title.trim() || 'این کالا'
  const template = toneTemplates[toneId] ?? toneTemplates.friendly
  return template(trimmed)
}
