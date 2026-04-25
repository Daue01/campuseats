import type { CategoryOption, FAQItem } from '@/lib/types'

export const PRODUCT_CATEGORIES: CategoryOption[] = [
  { id: 'meals', label: 'Meals' },
  { id: 'snacks', label: 'Snacks' },
  { id: 'drinks', label: 'Drinks' },
  { id: 'services', label: 'Services' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'tech', label: 'Tech' },
  { id: 'books', label: 'Books' },
]

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does CampusEats work?',
    answer:
      'Students discover verified campus vendors, browse active products, and connect directly with stores from one marketplace.',
  },
  {
    id: 'faq-2',
    question: 'Who can sell on CampusEats?',
    answer:
      'Any campus-based vendor can create a vendor account, upload a brand logo, add products, and manage their storefront from the vendor dashboard.',
  },
  {
    id: 'faq-3',
    question: 'Do I need an app to use it?',
    answer:
      'No. CampusEats is a responsive web app that works well on phones, tablets, and desktop browsers.',
  },
]

export const BRAND = {
  name: 'CampusEats',
  email: 'hello@campuseats.app',
}
