export const mockProducts = [
  {
    id: 'p1',
    name: 'Minimalist Cotton Tee',
    price: 999.00,
    category: 'men',
    brand: 'Stuckfit',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
    description: 'A premium heavy-weight cotton t-shirt with a relaxed fit.',
    isNew: true,
    isTrending: true
  },
  {
    id: 'p2',
    name: 'Oversized Linen Shirt',
    price: 1899.00,
    category: 'women',
    brand: 'Stuckfit',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
    description: 'Breathable linen shirt perfect for summer styles.',
    isNew: false,
    isTrending: true
  },
  {
    id: 'p3',
    name: 'Urban Cargo Pants',
    price: 2499.00,
    category: 'men',
    brand: 'Stuckfit',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
    description: 'Multi-pocket canvas cargo pants designed for utility.',
    isNew: true,
    isTrending: false
  },
  {
    id: 'p4',
    name: 'Tailored Blazer Jacket',
    price: 4500.00,
    category: 'women',
    brand: 'Stuckfit',
    images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500'],
    description: 'Classic double-breasted blazer for modern business looks.',
    isNew: false,
    isTrending: false
  },
  {
    id: 'p5',
    name: 'Minimalist Leather Cap',
    price: 799.00,
    category: 'accessories',
    brand: 'Stuckfit',
    images: ['https://images.unsplash.com/photo-1534215754734-18e55d13ce35?w=500'],
    description: 'Genuine leather cap with an adjustable strap.',
    isNew: false,
    isTrending: true
  }
];

export const mockOrders = [
  {
    id: 'ORD-8924',
    customer: 'Sarah Jenkins',
    date: '2024-06-12T14:45:00Z',
    total: 2898.00,
    status: 'Delivered',
    paymentStatus: 'Paid'
  },
  {
    id: 'ORD-8925',
    customer: 'David Miller',
    date: '2024-06-14T09:15:00Z',
    total: 999.00,
    status: 'Processing',
    paymentStatus: 'Paid'
  },
  {
    id: 'ORD-8926',
    customer: 'Michael Chen',
    date: '2024-06-15T11:20:00Z',
    total: 5299.00,
    status: 'Shipped',
    paymentStatus: 'Paid'
  },
  {
    id: 'ORD-8927',
    customer: 'Emma Watson',
    date: '2024-06-16T16:05:00Z',
    total: 1899.00,
    status: 'Processing',
    paymentStatus: 'Upcoming'
  }
];

export const mockUsers = [
  {
    id: 'u1',
    name: 'Yuvraj Singh',
    email: 'admin@stuckfit.com',
    role: 'Admin',
    joinDate: '2023-11-15T08:30:00Z',
    status: 'Active'
  },
  {
    id: 'u2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    role: 'Customer',
    joinDate: '2024-01-22T14:45:00Z',
    status: 'Active'
  },
  {
    id: 'u3',
    name: 'Michael Chen',
    email: 'mchen99@example.com',
    role: 'Customer',
    joinDate: '2024-02-10T09:15:00Z',
    status: 'Inactive'
  },
  {
    id: 'u4',
    name: 'Emma Watson',
    email: 'emma.w@example.com',
    role: 'Customer',
    joinDate: '2024-03-01T11:20:00Z',
    status: 'Active'
  }
];

export const mockMessages = [
  {
    id: 'm1',
    name: 'Emma Watson',
    email: 'emma.w@example.com',
    date: '2024-06-14T10:00:00Z',
    subject: 'Order Tracking Help',
    message: 'Hello, I ordered a Linen Shirt yesterday but haven\'t received any tracking information yet. Can you please check my status?',
    status: 'Unread'
  },
  {
    id: 'm2',
    name: 'Michael Chen',
    email: 'mchen99@example.com',
    date: '2024-06-12T15:30:00Z',
    subject: 'Return and Exchange Policy',
    message: 'Hi Stuckfit, I would like to exchange my cargo pants for a different size. How do I start the return process?',
    status: 'Replied',
    reply: 'Hi Michael, we\'ve sent an exchange shipping label to your email. You can return the pants and we\'ll send the new size immediately.'
  },
  {
    id: 'm3',
    name: 'David Miller',
    email: 'david.m@example.com',
    date: '2024-06-11T09:45:00Z',
    subject: 'Bulk discount request',
    message: 'Hello! We are looking to buy 50 pieces of the Minimalist Cotton Tee for our corporate retreat. Do you support bulk orders or discounts?',
    status: 'Resolved'
  }
];
