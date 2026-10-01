export interface ResortSettings {
  name: string;
  address: string;
  whatsapp: string;
  landline: string;
  email: string;
  upiId: string;
  userName: string;
  userEmail: string;
}

export const DEFAULT_SETTINGS: ResortSettings = {
  name: 'TFC GARDEN',
  address: 'Near Bus Stand, Sri Anandpur Sahib, Punjab',
  whatsapp: '7379097909',
  landline: '7379097909',
  email: 'tfcgardenresorts@gamil.com',
  upiId: '7789060606@ptyes',
  userName: 'Manjeet Singh',
  userEmail: 'manjeet789singh8@gmail.com',
};

export interface PropertyTourItem {
  id: string;
  title: string;
  category:
    | 'AC Rooms & Suites'
    | 'Bamboo Huts'
    | 'Banquet & Wedding Halls'
    | 'Restaurant & Dining'
    | 'Garden & Fun Zone';
  badgeText: string;
  description: string;
  image: string;
  targetSection: string;
}

export const PROPERTY_TOUR_ITEMS: PropertyTourItem[] = [
  {
    id: 'tour-1',
    title: 'TFC Luxury AC Bedroom Suite',
    category: 'AC Rooms & Suites',
    badgeText: 'AC ROOMS & SUITES',
    description:
      'Plush king bedding, warm cove ceiling illumination, and dual-zone split AC comfort.',
    image: '/images/luxury_ac_bedroom.jpg',
    targetSection: '#rooms-section',
  },
  {
    id: 'tour-2',
    title: 'TFC Grand Banquet & Reception Stage',
    category: 'Banquet & Wedding Halls',
    badgeText: 'BANQUET & WEDDING HALLS',
    description:
      'Ornate chandelier hall with bespoke floral stage backdrop and dressed celebration seating.',
    image: '/images/wedding_stage_decor.jpg',
    targetSection: '#wedding-card-section',
  },
  {
    id: 'tour-3',
    title: 'TFC Family Restaurant & Indoor Dining Hall',
    category: 'Restaurant & Dining',
    badgeText: 'RESTAURANT & DINING',
    description:
      'Warm timber dining tables, ambient pendant lighting, and multi-cuisine family hospitality.',
    image: '/images/restaurant_vip_dining.jpg',
    targetSection: '#restaurant-section',
  },
  {
    id: 'tour-4',
    title: 'TFC Handcrafted Garden Bamboo Huts',
    category: 'Bamboo Huts',
    badgeText: 'BAMBOO HUTS',
    description:
      'Authentic woven bamboo cottages nestled along manicured garden walkways with lantern lighting.',
    image: '/images/bamboo_hut_night.jpg',
    targetSection: '#bamboo-sanctuary-section',
  },
  {
    id: 'tour-5',
    title: 'TFC Outdoor Garden Lawn & Family Fun Zone',
    category: 'Garden & Fun Zone',
    badgeText: 'GARDEN & FUN ZONE',
    description:
      'Expansive green celebration lawn and dedicated family recreation and kids fun zone.',
    image: '/images/garden_fun_zone.jpg',
    targetSection: '#packages-section',
  },
  {
    id: 'tour-6',
    title: 'Maharaja Travertine & Teak Executive Suite',
    category: 'AC Rooms & Suites',
    badgeText: 'AC ROOMS & SUITES',
    description:
      'Spacious architectural suite with designer furnishings and panoramic sanctuary views.',
    image: '/images/luxury_ac_bedroom.jpg',
    targetSection: '#rooms-section',
  },
  {
    id: 'tour-7',
    title: 'Cathedral Woven Bamboo Cottage Interior',
    category: 'Bamboo Huts',
    badgeText: 'BAMBOO HUTS',
    description:
      'Soaring sustainable Guadua bamboo arches with configurable AC and natural breeze modes.',
    image: '/images/bamboo_room_interior.jpg',
    targetSection: '#bamboo-sanctuary-section',
  },
  {
    id: 'tour-8',
    title: 'Suryavanshi Royal Wedding Pavilion',
    category: 'Banquet & Wedding Halls',
    badgeText: 'BANQUET & WEDDING HALLS',
    description:
      'Vaulted destination wedding hall for up to 700 guests with royal catering complex.',
    image: '/images/wedding_banquet_hall.jpg',
    targetSection: '#wedding-card-section',
  },
  {
    id: 'tour-9',
    title: 'TFC Resort Sanctuary & Lotus Water Pavilion',
    category: 'Garden & Fun Zone',
    badgeText: 'GARDEN & FUN ZONE',
    description:
      'Signature TFC Garden architectural arrival courtyard framed by tropical greenery.',
    image: '/images/bamboo_hut_night.jpg',
    targetSection: '#bamboo-sanctuary-section',
  },
  {
    id: 'tour-10',
    title: 'TFC Interconnected Family AC Residence',
    category: 'AC Rooms & Suites',
    badgeText: 'AC ROOMS & SUITES',
    description:
      'Two-bedroom family suite with private lounge area and direct garden fun-zone access.',
    image: '/images/luxury_ac_bedroom.jpg',
    targetSection: '#rooms-section',
  },
];

export interface GuestReview {
  id: string;
  category:
    | 'Bamboo & Hut Stay'
    | 'Wedding & Celebration'
    | 'Family & AC Rooms'
    | 'Restaurant & Food Delivery';
  badgeText: string;
  headline: string;
  quote: string;
  author: string;
  subtitle: string;
  verificationCode: string;
  date: string;
  rating: number;
}

export const GUEST_REVIEWS: GuestReview[] = [
  {
    id: 'rev-1',
    category: 'Bamboo & Hut Stay',
    badgeText: 'BAMBOO & HUT STAY',
    headline: '“The Heart Hut floral gateway and evening lantern ambiance are magical”',
    quote:
      'We drove up from Delhi for a weekend getaway near Virasat-e-Khalsa and booked the standalone Garden Hut Room. Walking through the Heart Hut archway onto the manicured lawn at sunset was breathtaking. Quiet, private, and thoughtfully designed.',
    author: 'Dr. Ananya Verma & Rohan Mehta',
    subtitle: 'New Delhi • TFC Garden Hut Room (Heart Hut)',
    verificationCode: 'TFC-2026-9104',
    date: 'September 2026',
    rating: 5,
  },
  {
    id: 'rev-2',
    category: 'Restaurant & Food Delivery',
    badgeText: 'RESTAURANT & FOOD DELIVERY',
    headline: '“Zero table reservation charge and authentic Turban Kitchen flavors”',
    quote:
      'Whether we reserve a VIP Table or Outdoor Garden Table for dinner with no table charge, or order The Turban Kitchen Dal Makhani and Deluxe Thali with free delivery within 3 km, the food quality and hospitality at TFC Garden are consistently top-notch.',
    author: 'Maninder Singh & Friends',
    subtitle: 'Sri Anandpur Sahib • VIP Lounge Table & 3 km Express Home Delivery',
    verificationCode: 'TFC-2026-9381',
    date: 'September 2026',
    rating: 5,
  },
  {
    id: 'rev-3',
    category: 'Wedding & Celebration',
    badgeText: 'WEDDING & CELEBRATION',
    headline: '“Customising 63 items on the Wedding Card made our reception effortless”',
    quote:
      'We booked the TFC Grand Wedding Package at ₹1,35,000 which included 7 AC rooms plus 1 room free, stage decor, DJ, and full banquet lawn access. The interactive menu checklist let our family select every live stall and sweet dish smoothly.',
    author: 'Sardar Gurpreet Singh & Family',
    subtitle: 'Chandigarh • Grand Wedding Package (450 Guests)',
    verificationCode: 'TFC-2026-8842',
    date: 'August 2026',
    rating: 5,
  },
  {
    id: 'rev-4',
    category: 'Family & AC Rooms',
    badgeText: 'FAMILY & AC ROOMS',
    headline: '“Spacious Royal AC Family Room right next to the kids garden fun zone”',
    quote:
      'Our parents and kids loved the interconnected family suite and the ₹35,500 Family Stay package. The children spent hours on the garden swings while we enjoyed evening chai in the bamboo pavilion.',
    author: 'Harleen Kaur & Vikramjit Gill',
    subtitle: 'Ludhiana • TFC Royal AC Family Room',
    verificationCode: 'TFC-2026-8719',
    date: 'August 2026',
    rating: 5,
  },
  {
    id: 'rev-5',
    category: 'Bamboo & Hut Stay',
    badgeText: 'BAMBOO & HUT STAY',
    headline: '“Soaring Guadua bamboo interiors with whisper-quiet AC cooling”',
    quote:
      'The TFC All-Inclusive Bamboo Stay Package at ₹16,000 gave us handcrafted bamboo cottage accommodation with morning coffee, breakfast, lunch, and special candlelit dinner all included. Truly a five-star eco sanctuary.',
    author: 'Kabir Bedi & Simran Sandhu',
    subtitle: 'Amritsar • TFC Eco Bamboo Room',
    verificationCode: 'TFC-2026-8590',
    date: 'July 2026',
    rating: 5,
  },
  {
    id: 'rev-6',
    category: 'Wedding & Celebration',
    badgeText: 'WEDDING & CELEBRATION',
    headline: '“Best ring ceremony & birthday venue near Sri Anandpur Sahib Bus Stand”',
    quote:
      'Right near the Bus Stand with ample parking, royal stage decoration, and mouthwatering Paneer Tikka and Jalebi Rabri live counters. Every single guest praised the warm hospitality.',
    author: 'Rajeshwar Sharma & Family',
    subtitle: 'Rupnagar • Ring Ceremony & Banquet Hall',
    verificationCode: 'TFC-2026-8412',
    date: 'July 2026',
    rating: 5,
  },
];

export interface RoomType {
  id: string;
  name: string;
  shortCategory: 'Bamboo Room' | 'Hut Room' | 'Couple Room' | 'Family Room';
  badge: string;
  availabilityText: string;
  cottageCountText?: string;
  subtitleTag?: string;
  viewText: string;
  pricePerNight: number;
  description: string;
  maxGuests: number;
  climateText: string;
  sqft: number;
  image: string;
  isBambooSanctuary: boolean;
  facilities: string[];
}

export const ROOM_TYPES: RoomType[] = [
  {
    id: 'room-bamboo',
    name: 'TFC Eco Bamboo Room',
    shortCategory: 'Bamboo Room',
    badge: 'BAMBOO ROOM',
    availabilityText: '4 Rooms Available',
    cottageCountText: '4 Cottages Open',
    subtitleTag: '100% Handcrafted Guadua Bamboo Room',
    viewText: 'Private Bamboo Grove & Garden View',
    pricePerNight: 3999,
    description:
      'Signature handcrafted eco-friendly Bamboo Room featuring woven Guadua bamboo interiors, warm lantern lighting, and configurable AC or natural garden breeze.',
    maxGuests: 2,
    climateText: 'AC / Non-AC Configurable',
    sqft: 540,
    image: '/images/bamboo_room_interior.jpg',
    isBambooSanctuary: true,
    facilities: [
      'Selectable Eco-AC or Natural Breeze',
      'King Organic Mattress',
      'Private Bamboo Sit-Out Veranda',
      'Rain Shower & Brass Fixtures',
      'High-Speed Wi-Fi 6',
      'Complimentary Morning Breakfast',
    ],
  },
  {
    id: 'room-hut',
    name: 'TFC Garden Hut Room (Heart Hut)',
    shortCategory: 'Hut Room',
    badge: 'HUT ROOM',
    availabilityText: '4 Rooms Available',
    cottageCountText: '4 Cottages Open',
    subtitleTag: 'Signature Thatched Garden Hut Room',
    viewText: 'Lush Botanical Garden Walkway View',
    pricePerNight: 3999,
    description:
      'Charming standalone Garden Hut Room (Heart Hut) nestled along TFC Hotel’s manicured green lawn walkway—crafted for peaceful, nature-immersed stays.',
    maxGuests: 2,
    climateText: 'AC / Non-AC Configurable',
    sqft: 620,
    image: '/images/bamboo_hut_night.jpg',
    isBambooSanctuary: true,
    facilities: [
      'Standalone Conical Thatched Hut',
      'AC & Natural Cross-Ventilation',
      'Romantic Private Garden Sit-Out',
      'Plush King Canopy Bed',
      '24/7 Room & Dining Service',
      'Complimentary Farm-Fresh Breakfast',
    ],
  },
  {
    id: 'room-couple',
    name: 'TFC Luxury AC Couple Room',
    shortCategory: 'Couple Room',
    badge: 'COUPLE ROOM',
    availabilityText: '6 Rooms Available',
    viewText: 'Emerald Courtyard & Garden View',
    pricePerNight: 2499,
    description:
      'Designed specifically for couples seeking privacy and modern comfort, featuring warm cove ceiling lights, modern wood paneling, split AC, and garden views.',
    maxGuests: 2,
    climateText: 'AC',
    sqft: 440,
    image: '/images/luxury_ac_bedroom.jpg',
    isBambooSanctuary: false,
    facilities: [
      'Plush King Bed with Quilted Headboard',
      'Whisper-Quiet Split AC',
      'Warm Golden Cove Mood Lighting',
      'Private Sit-Out Balcony',
      'Smart 4K TV & High-Speed Wi-Fi',
      'Complimentary Couple Breakfast',
    ],
  },
  {
    id: 'room-family',
    name: 'TFC Royal AC Family Room',
    shortCategory: 'Family Room',
    badge: 'FAMILY ROOM',
    availabilityText: '4 Rooms Available',
    viewText: 'Panoramic Garden & Fun Zone View',
    pricePerNight: 4999,
    description:
      'Spacious air-conditioned Family Room accommodating up to 5 guests with generous bedding, private sit-out lounge, and direct access to the garden fun zone.',
    maxGuests: 5,
    climateText: 'AC',
    sqft: 820,
    image: '/images/luxury_ac_bedroom.jpg',
    isBambooSanctuary: false,
    facilities: [
      'Spacious Double King Beds for 5',
      'Dual-Zone Climate AC',
      'Private Family Lounge & Dining Nook',
      'Direct Garden & Kids Fun Zone Access',
      '4K Smart Hospitality Display & Wi-Fi',
      'Complimentary Family Breakfast',
    ],
  },
];

export interface EventPreset {
  id: string;
  title: string;
  guestsText: string;
  defaultGuests: number;
  defaultTimeSlot: string;
  defaultZone: string;
  image: string;
}

export const EVENT_PRESETS: EventPreset[] = [
  {
    id: 'party',
    title: 'Party Booking',
    guestsText: 'Up to 150 Guests',
    defaultGuests: 150,
    defaultTimeSlot: 'Evening Gala (06:00 PM - 11:00 PM)',
    defaultZone: 'VIP Banquet & Bamboo Lounge',
    image: '/images/restaurant_vip_dining.jpg',
  },
  {
    id: 'birthday',
    title: 'Birthday Party Booking',
    guestsText: 'Up to 120 Guests',
    defaultGuests: 120,
    defaultTimeSlot: 'Afternoon / Evening Celebration',
    defaultZone: 'Garden Lawn & Celebration Hall',
    image: '/images/garden_fun_zone.jpg',
  },
  {
    id: 'arrange-marriage',
    title: 'Arrange Marriage Booking',
    guestsText: 'Up to 400 Guests',
    defaultGuests: 400,
    defaultTimeSlot: 'Full Day Ceremony (09:00 AM - 06:00 PM)',
    defaultZone: 'Combined AC Hall & Garden Lawn',
    image: '/images/wedding_stage_decor.jpg',
  },
  {
    id: 'wedding',
    title: 'Wedding Booking',
    guestsText: 'Up to 500 Guests',
    defaultGuests: 300,
    defaultTimeSlot: 'Full Day Grand Wedding (09:00 AM - 11:30 PM)',
    defaultZone: 'Combined AC Hall & Garden Lawn',
    image: '/images/wedding_banquet_hall.jpg',
  },
  {
    id: 'ring-ceremony',
    title: 'Ring Ceremony Booking',
    guestsText: 'Up to 200 Guests',
    defaultGuests: 200,
    defaultTimeSlot: 'Morning / Evening Ring Ceremony',
    defaultZone: 'Grand AC Reception Stage Hall',
    image: '/images/wedding_stage_decor.jpg',
  },
];

export interface WeddingMenuSection {
  id: string;
  title: string;
  page: 1 | 2;
  column: 'left' | 'right';
  twoColumnGrid?: boolean;
  items: { id: string; name: string; defaultChecked: boolean }[];
}

export const WEDDING_MENU_SECTIONS: WeddingMenuSection[] = [
  // PAGE 1 - LEFT COLUMN
  {
    id: 'welcome-drinks',
    title: 'Welcome Drinks',
    page: 1,
    column: 'left',
    items: [
      { id: 'wd-1', name: 'Coffee', defaultChecked: true },
      { id: 'wd-2', name: 'Tea', defaultChecked: true },
      { id: 'wd-3', name: 'Real Juice', defaultChecked: true },
      { id: 'wd-4', name: 'Cold Drink', defaultChecked: true },
      { id: 'wd-5', name: 'Mineral Water', defaultChecked: true },
    ],
  },
  {
    id: 'welcome',
    title: 'Welcome',
    page: 1,
    column: 'left',
    items: [
      { id: 'wel-1', name: 'Roasted Badam', defaultChecked: true },
      { id: 'wel-2', name: 'Roasted Kaju', defaultChecked: true },
      { id: 'wel-3', name: 'Malai Barfi', defaultChecked: true },
      { id: 'wel-4', name: 'Murgi Chena', defaultChecked: false },
    ],
  },
  {
    id: 'live-snacks',
    title: 'Live Snacks',
    page: 1,
    column: 'left',
    items: [
      { id: 'ls-1', name: 'Paneer Tikka', defaultChecked: true },
      { id: 'ls-2', name: 'Mushroom Tikka', defaultChecked: true },
      { id: 'ls-3', name: 'Malai Chaap', defaultChecked: true },
      { id: 'ls-4', name: 'Veg Seekh Kabab', defaultChecked: true },
      { id: 'ls-5', name: 'Spring Roll', defaultChecked: true },
      { id: 'ls-6', name: 'Manchurian', defaultChecked: false },
      { id: 'ls-7', name: 'Honey Cauliflower', defaultChecked: false },
      { id: 'ls-8', name: 'Veg Cutlet', defaultChecked: false },
      { id: 'ls-9', name: 'French Fries', defaultChecked: false },
      { id: 'ls-10', name: 'Paneer Finger', defaultChecked: false },
      { id: 'ls-11', name: 'Hara Bhara Kebab', defaultChecked: false },
      { id: 'ls-12', name: 'Cheese Chilli', defaultChecked: true },
    ],
  },
  {
    id: 'main-course',
    title: 'Main Course',
    page: 1,
    column: 'left',
    items: [
      { id: 'mc-1', name: 'Paneer Butter Masala', defaultChecked: true },
      { id: 'mc-2', name: 'Kadai Paneer', defaultChecked: true },
      { id: 'mc-3', name: 'Shahi Paneer', defaultChecked: false },
      { id: 'mc-4', name: 'Paneer Lababdar', defaultChecked: false },
      { id: 'mc-5', name: 'Malai Kofta', defaultChecked: true },
      { id: 'mc-6', name: 'Mushroom Matar', defaultChecked: true },
      { id: 'mc-7', name: 'Mix Veg', defaultChecked: false },
      { id: 'mc-8', name: 'Tawa Veg (Live)', defaultChecked: true },
      { id: 'mc-9', name: 'Mushroom Do Pyaza', defaultChecked: false },
      { id: 'mc-10', name: 'Dal Makhani', defaultChecked: true },
      { id: 'mc-11', name: 'Yellow Dal', defaultChecked: false },
      { id: 'mc-12', name: 'Chana Masala', defaultChecked: false },
      { id: 'mc-13', name: 'Pindi Chana', defaultChecked: true },
    ],
  },

  // PAGE 1 - RIGHT COLUMN
  {
    id: 'starters',
    title: 'Starters',
    page: 1,
    column: 'right',
    items: [
      { id: 'st-1', name: 'Paneer Pakoda', defaultChecked: true },
      { id: 'st-2', name: 'Mix Pakoda', defaultChecked: true },
      { id: 'st-3', name: 'Bread Pakoda', defaultChecked: false },
    ],
  },
  {
    id: 'sweets',
    title: 'Sweets',
    page: 1,
    column: 'right',
    items: [
      { id: 'sw-1', name: 'Barfi', defaultChecked: true },
      { id: 'sw-2', name: 'Gulab Jamun', defaultChecked: true },
      { id: 'sw-3', name: 'Rasgulla', defaultChecked: false },
      { id: 'sw-4', name: 'Chamcham', defaultChecked: false },
    ],
  },
  {
    id: 'soup',
    title: 'Soup',
    page: 1,
    column: 'right',
    items: [
      { id: 'sp-1', name: 'Hot & Sour', defaultChecked: true },
      { id: 'sp-2', name: 'Sweet Corn', defaultChecked: true },
    ],
  },
  {
    id: 'extra-fruit-dhaba',
    title: 'Extra-Fresh Fruit & Dhaba',
    page: 1,
    column: 'right',
    items: [
      { id: 'ef-1', name: 'Extra-Fresh Fruit', defaultChecked: true },
      { id: 'ef-2', name: 'Extra Punjabi Dhaba', defaultChecked: true },
    ],
  },
  {
    id: 'extra-setup',
    title: 'Extra',
    page: 1,
    column: 'right',
    items: [
      { id: 'ex-1', name: 'LED Counter', defaultChecked: true },
      { id: 'ex-2', name: 'Stage Decoration', defaultChecked: true },
      { id: 'ex-3', name: 'DJ', defaultChecked: true },
      { id: 'ex-4', name: 'Gate Decoration', defaultChecked: true },
      { id: 'ex-5', name: 'Breakfast', defaultChecked: true },
    ],
  },

  // PAGE 2 - LEFT COLUMN
  {
    id: 'salad-bar',
    title: 'Salad Bar',
    page: 2,
    column: 'left',
    items: [
      { id: 'sb-1', name: 'Green Salad', defaultChecked: true },
      { id: 'sb-2', name: 'Bean Salad', defaultChecked: false },
      { id: 'sb-3', name: 'Cream Salad', defaultChecked: true },
      { id: 'sb-4', name: 'Sirke Wala Pyaaz', defaultChecked: true },
      { id: 'sb-5', name: 'Mixed Pickle', defaultChecked: false },
      { id: 'sb-6', name: 'Papad', defaultChecked: true },
    ],
  },
  {
    id: 'raita-bar',
    title: 'Raita Bar',
    page: 2,
    column: 'left',
    items: [
      { id: 'rb-1', name: 'Veg Raita', defaultChecked: false },
      { id: 'rb-2', name: 'Pineapple Raita', defaultChecked: true },
      { id: 'rb-3', name: 'Mint Raita', defaultChecked: true },
    ],
  },
  {
    id: 'indian-bread-roti',
    title: 'Indian Bread Roti',
    page: 2,
    column: 'left',
    items: [
      { id: 'ibr-1', name: 'Rumali Roti', defaultChecked: true },
      { id: 'ibr-2', name: 'Missi Roti', defaultChecked: true },
      { id: 'ibr-3', name: 'Lachha Paratha', defaultChecked: true },
      { id: 'ibr-4', name: 'Plain Naan', defaultChecked: true },
      { id: 'ibr-5', name: 'Chapati Tandoori', defaultChecked: false },
      { id: 'ibr-6', name: 'Puri', defaultChecked: false },
    ],
  },
  {
    id: 'night-lagan-phere',
    title: 'Night Lagan Phere',
    page: 2,
    column: 'left',
    items: [
      { id: 'nlp-1', name: 'Coffee', defaultChecked: true },
      { id: 'nlp-2', name: 'Biscuits', defaultChecked: true },
      { id: 'nlp-3', name: 'Mathi Small', defaultChecked: true },
    ],
  },

  // PAGE 2 - RIGHT COLUMN
  {
    id: 'live-stalls',
    title: 'Live Stalls',
    page: 2,
    column: 'right',
    twoColumnGrid: true,
    items: [
      { id: 'lst-1', name: 'Mungi Dal Chilla', defaultChecked: true },
      { id: 'lst-9', name: 'Matar Kulcha', defaultChecked: false },
      { id: 'lst-2', name: 'Nutri Kulcha', defaultChecked: false },
      { id: 'lst-10', name: 'Dahi Bada', defaultChecked: false },
      { id: 'lst-3', name: 'Raj Bhog', defaultChecked: false },
      { id: 'lst-11', name: 'Veg Noodles', defaultChecked: true },
      { id: 'lst-4', name: 'Aloo Tikki', defaultChecked: true },
      { id: 'lst-12', name: 'Khasta Papdi Chaat', defaultChecked: false },
      { id: 'lst-5', name: 'Gol Gappa', defaultChecked: true },
      { id: 'lst-13', name: 'Dahi Bhalla', defaultChecked: true },
      { id: 'lst-6', name: 'Masala Dosa', defaultChecked: true },
      { id: 'lst-14', name: 'Pav Bhaji', defaultChecked: true },
      { id: 'lst-7', name: 'Katori Chaat', defaultChecked: false },
      { id: 'lst-15', name: 'Bhelpuri Chaat', defaultChecked: false },
      { id: 'lst-8', name: 'Popcorn', defaultChecked: false },
      { id: 'lst-16', name: 'Sugar Candy', defaultChecked: false },
    ],
  },
  {
    id: 'basmati-rice',
    title: 'Basmati Rice',
    page: 2,
    column: 'right',
    items: [
      { id: 'br-1', name: 'Jeera Rice', defaultChecked: false },
      { id: 'br-2', name: 'Veg Pulao', defaultChecked: true },
      { id: 'br-3', name: 'Mix Veg Rice', defaultChecked: false },
    ],
  },
  {
    id: 'beverages',
    title: 'Beverages',
    page: 2,
    column: 'right',
    items: [
      { id: 'bev-1', name: 'Coffee', defaultChecked: true },
      { id: 'bev-2', name: 'Cold Drink', defaultChecked: true },
      { id: 'bev-3', name: 'Mineral Water', defaultChecked: true },
    ],
  },
  {
    id: 'sweet-desserts',
    title: 'Sweet Desserts',
    page: 2,
    column: 'right',
    items: [
      { id: 'sd-1', name: 'Ice Cream (Amul) 4 Flavours', defaultChecked: true },
      { id: 'sd-2', name: 'Hot Gulab Jamun', defaultChecked: true },
      { id: 'sd-3', name: 'Jalebi Rabri with KESHAR', defaultChecked: true },
      { id: 'sd-4', name: 'Moong Dal Halwa', defaultChecked: true },
      { id: 'sd-5', name: 'Gajar Halwa (Seasonal)', defaultChecked: false },
      { id: 'sd-6', name: 'Rasmalai', defaultChecked: true },
      { id: 'sd-7', name: 'Dakka Kulfi', defaultChecked: false },
      { id: 'sd-8', name: 'Sponzy Rasgulla', defaultChecked: false },
    ],
  },
];

export interface RestaurantTable {
  id: string;
  code: string;
  type: 'Couple Table' | 'Family Table' | 'VIP Table' | 'Outdoor Table';
  zone:
    | 'Bamboo Dining Area'
    | 'Rooftop Seating'
    | 'Indoor Seating Hall'
    | 'Family Seating Area'
    | 'VIP Lounge'
    | 'Garden Seating Area';
  status: 'AVAILABLE' | 'RESERVED';
  reservedNote?: string;
  maxGuests: number;
  features: [string, string];
}

export const RESTAURANT_TABLES: RestaurantTable[] = [
  {
    id: 'T-01',
    code: 'T-01',
    type: 'Couple Table',
    zone: 'Bamboo Dining Area',
    status: 'AVAILABLE',
    maxGuests: 2,
    features: ['Candlelit Couple Seating', 'Woven Bamboo Canopy'],
  },
  {
    id: 'T-02',
    code: 'T-02',
    type: 'Couple Table',
    zone: 'Rooftop Seating',
    status: 'RESERVED',
    reservedNote: 'Reserved for 19:30 Dinner',
    maxGuests: 2,
    features: ['Sunset Panorama Couple Table', 'Private Lantern Alcove'],
  },
  {
    id: 'T-03',
    code: 'T-03',
    type: 'Couple Table',
    zone: 'Indoor Seating Hall',
    status: 'AVAILABLE',
    maxGuests: 2,
    features: ['Cosy AC Couple Table', 'Warm Ambient Lighting'],
  },
  {
    id: 'T-04',
    code: 'T-04',
    type: 'Family Table',
    zone: 'Family Seating Area',
    status: 'AVAILABLE',
    maxGuests: 4,
    features: ['Spacious 4-Person Family Booth', 'High-Chair Ready'],
  },
  {
    id: 'T-05',
    code: 'T-05',
    type: 'Family Table',
    zone: 'Indoor Seating Hall',
    status: 'RESERVED',
    reservedNote: 'Reserved for 20:00 Dinner',
    maxGuests: 6,
    features: ['6-Person AC Family Dining Table', 'Near Live Kitchen'],
  },
  {
    id: 'T-06',
    code: 'T-06',
    type: 'Family Table',
    zone: 'Bamboo Dining Area',
    status: 'AVAILABLE',
    maxGuests: 6,
    features: ['Handcrafted Bamboo Family Pavilion', 'Garden Breeze'],
  },
  {
    id: 'T-07',
    code: 'T-07',
    type: 'Family Table',
    zone: 'Family Seating Area',
    status: 'AVAILABLE',
    maxGuests: 8,
    features: ['Large 8-Person Family Table', 'Private Server Call Button'],
  },
  {
    id: 'T-08',
    code: 'T-08',
    type: 'VIP Table',
    zone: 'VIP Lounge',
    status: 'AVAILABLE',
    maxGuests: 6,
    features: ['Private AC VIP Lounge Table', 'Dedicated Hospitality Service'],
  },
  {
    id: 'T-09',
    code: 'T-09',
    type: 'VIP Table',
    zone: 'VIP Lounge',
    status: 'AVAILABLE',
    maxGuests: 8,
    features: ['8-Person Royal VIP Group Table', 'Priority Kitchen Service'],
  },
  {
    id: 'T-10',
    code: 'T-10',
    type: 'VIP Table',
    zone: 'Bamboo Dining Area',
    status: 'RESERVED',
    reservedNote: 'Reserved for 20:30 Group Banquet',
    maxGuests: 6,
    features: ['Dedicated VIP Bamboo Gazebo', 'Private Garden View'],
  },
  {
    id: 'T-11',
    code: 'T-11',
    type: 'Outdoor Table',
    zone: 'Garden Seating Area',
    status: 'AVAILABLE',
    maxGuests: 4,
    features: ['Open Garden Lawn Outdoor Table', 'Starlit Evening Lanterns'],
  },
  {
    id: 'T-12',
    code: 'T-12',
    type: 'Outdoor Table',
    zone: 'Garden Seating Area',
    status: 'AVAILABLE',
    maxGuests: 6,
    features: ['Outdoor Garden & Fun Zone View', 'Fresh Open-Air Dining'],
  },
  {
    id: 'T-13',
    code: 'T-13',
    type: 'Outdoor Table',
    zone: 'Rooftop Seating',
    status: 'AVAILABLE',
    maxGuests: 4,
    features: ['Open-Sky Rooftop Outdoor Table', 'Evening Breeze'],
  },
  {
    id: 'T-14',
    code: 'T-14',
    type: 'Outdoor Table',
    zone: 'Garden Seating Area',
    status: 'AVAILABLE',
    maxGuests: 8,
    features: ['8-Person Outdoor Garden Group Table', 'Near Kids Fun Zone'],
  },
];

export interface DeliveryMenuItem {
  id: string;
  name: string;
  category:
    | 'Breakfast & Morning Special'
    | 'Soups & Shorba'
    | 'Tandoori & Continental Starters'
    | 'Chinese, Burgers, Pizza & Snacks'
    | 'Royal Main Course & Handi'
    | 'Indian Breads, Rice & Thalis'
    | 'Desserts & Beverages';
  portion: string;
  prepTime: string;
  description: string;
  price: number;
  isPopular?: boolean;
}

export const DELIVERY_MENU_ITEMS: DeliveryMenuItem[] = [
  // Breakfast & Morning Special (6)
  {
    id: 'dish-1',
    name: 'Tandoori Aloo / Gobhi / Mix Parantha (With Curd & Butter)',
    category: 'Breakfast & Morning Special',
    portion: '1 Large Parantha',
    prepTime: '15 mins',
    description:
      'Crisp clay-oven or tawa stuffed parantha served hot with fresh curd, white butter, and tangy pickle.',
    price: 90,
    isPopular: true,
  },
  {
    id: 'dish-2',
    name: 'Special Paneer Stuffed Parantha (With Curd & Butter)',
    category: 'Breakfast & Morning Special',
    portion: '1 Large Parantha',
    prepTime: '15 mins',
    description:
      'Generously stuffed spiced cottage cheese parantha served with fresh curd, butter, and pickle.',
    price: 120,
    isPopular: true,
  },
  {
    id: 'dish-3',
    name: 'Butter Toast / Jam Toast & Masala Poha',
    category: 'Breakfast & Morning Special',
    portion: '1 Plate',
    prepTime: '12 mins',
    description:
      'Light morning breakfast option with toasted bread slices, Amul butter, or homestyle peanut-tempered poha.',
    price: 100,
  },
  {
    id: 'dish-4',
    name: 'Amritsari Chole Bhature (2 Fluffy Bhature)',
    category: 'Breakfast & Morning Special',
    portion: '2 Pcs Plate',
    prepTime: '15 mins',
    description:
      'Pindi-style spiced chickpeas served with two golden puffed bhature, pickled onions, and green chutney.',
    price: 140,
    isPopular: true,
  },
  {
    id: 'dish-5',
    name: 'Puri Bhaji & Halwa Morning Platter',
    category: 'Breakfast & Morning Special',
    portion: '4 Puris Plate',
    prepTime: '15 mins',
    description:
      'Traditional Punjabi aloo masala bhaji with four crisp puris and warm suji halwa.',
    price: 130,
  },
  {
    id: 'dish-6',
    name: 'Grilled Veg Cheese Club Sandwich',
    category: 'Breakfast & Morning Special',
    portion: '4 Triangles',
    prepTime: '12 mins',
    description:
      'Triple-decker jumbo bread sandwich layered with garden veggies, mint chutney, and melted cheese.',
    price: 150,
  },

  // Soups & Shorba (4)
  {
    id: 'dish-7',
    name: 'Cream of Tomato Soup (With Crispy Croutons)',
    category: 'Soups & Shorba',
    portion: '1 Bowl',
    prepTime: '12 mins',
    description:
      'Rich, velvety vine-ripened tomato soup finished with fresh cream and toasted garlic bread croutons.',
    price: 110,
  },
  {
    id: 'dish-8',
    name: 'Veg Manchow Soup (With Crispy Fried Noodles)',
    category: 'Soups & Shorba',
    portion: '1 Bowl',
    prepTime: '12 mins',
    description:
      'Spicy Indo-Chinese vegetable broth flavoured with ginger, garlic, soy, and topped with crunchy noodles.',
    price: 120,
    isPopular: true,
  },
  {
    id: 'dish-9',
    name: 'Veg Hot & Sour / Sweet Corn Soup',
    category: 'Soups & Shorba',
    portion: '1 Bowl',
    prepTime: '12 mins',
    description:
      'Choice of tangy-peppery Hot & Sour vegetable soup or comforting creamy Sweet Corn soup.',
    price: 120,
  },
  {
    id: 'dish-10',
    name: 'Lemon Coriander Clear Soup',
    category: 'Soups & Shorba',
    portion: '1 Bowl',
    prepTime: '12 mins',
    description:
      'Refreshing vitamin-rich vegetable broth infused with fresh lemon juice, coriander leaves, and diced veggies.',
    price: 110,
  },

  // Tandoori & Continental Starters (8)
  {
    id: 'dish-11',
    name: 'Royal Paneer Tikka / Paneer Achari Tikka',
    category: 'Tandoori & Continental Starters',
    portion: '8 Pieces',
    prepTime: '20 mins',
    description:
      'Fresh malai paneer cubes marinated in hung curd and tandoori spices, char-grilled with capsicum & onion.',
    price: 260,
    isPopular: true,
  },
  {
    id: 'dish-12',
    name: 'Paneer Malai Tikka (Creamy Cashew Marinade)',
    category: 'Tandoori & Continental Starters',
    portion: '8 Pieces',
    prepTime: '20 mins',
    description:
      'Melt-in-mouth cottage cheese cubes roasted in a rich cashew-cream and cardamom marinade.',
    price: 280,
    isPopular: true,
  },
  {
    id: 'dish-13',
    name: 'Afghani Malai Soya Chaap / Masala Tandoori Chaap',
    category: 'Tandoori & Continental Starters',
    portion: 'Full Plate',
    prepTime: '20 mins',
    description:
      'Succulent soya chaap char-grilled in clay oven, tossed with cream, butter, chaat masala, and onion rings.',
    price: 220,
    isPopular: true,
  },
  {
    id: 'dish-14',
    name: 'Tandoori Stuffed Mushroom Tikka',
    category: 'Tandoori & Continental Starters',
    portion: '10 Pieces',
    prepTime: '20 mins',
    description:
      'Button mushrooms stuffed with spiced paneer and herbs, skewered and roasted in the clay tandoor.',
    price: 240,
  },
  {
    id: 'dish-15',
    name: 'Hara Bhara Kebab / Dahi Ke Sholay',
    category: 'Tandoori & Continental Starters',
    portion: '8 Pieces',
    prepTime: '18 mins',
    description:
      'Spinach, green pea, and cottage cheese medallions pan-seared golden and served with mint dip.',
    price: 210,
  },
  {
    id: 'dish-16',
    name: 'Veg Seekh Kebab Platter',
    category: 'Tandoori & Continental Starters',
    portion: '4 Skewers',
    prepTime: '20 mins',
    description:
      'Minced garden vegetables and aromatic spices moulded onto skewers and roasted over charcoal.',
    price: 200,
  },
  {
    id: 'dish-17',
    name: 'TFC Assorted Royal Tandoori Platter',
    category: 'Tandoori & Continental Starters',
    portion: '16 Pieces',
    prepTime: '25 mins',
    description:
      'Chef’s grand platter with Paneer Tikka, Malai Chaap, Mushroom Tikka, and Veg Seekh Kebab.',
    price: 420,
    isPopular: true,
  },
  {
    id: 'dish-18',
    name: 'Crispy Corn Salt & Pepper / Peanut Masala',
    category: 'Tandoori & Continental Starters',
    portion: 'Full Plate',
    prepTime: '15 mins',
    description:
      'Golden fried sweet corn kernels tossed with bell peppers, spring onions, and cracked black pepper.',
    price: 180,
  },

  // Chinese, Burgers, Pizza & Snacks (9)
  {
    id: 'dish-19',
    name: 'Cheese Chilli Dry / Gravy (Cottage Cheese)',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: 'Full Plate',
    prepTime: '18 mins',
    description:
      'Wok-tossed cottage cheese cubes with crunchy capsicum, onions, green chillies, andoriental sauces.',
    price: 250,
    isPopular: true,
  },
  {
    id: 'dish-20',
    name: 'Veg Manchurian Dry / Gravy',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: '8 Balls Plate',
    prepTime: '18 mins',
    description:
      'Crispy vegetable dumplings simmered in a savoury garlic-ginger soy coriander sauce.',
    price: 190,
    isPopular: true,
  },
  {
    id: 'dish-21',
    name: 'Veg Hakka Noodles / Singapuri Chilli Garlic Noodles',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: 'Full Plate',
    prepTime: '15 mins',
    description:
      'High-flame wok-tossed noodles with julienned cabbage, carrots, bell peppers, and spring onions.',
    price: 170,
  },
  {
    id: 'dish-22',
    name: 'Crispy Honey Chilli Potato / Cauliflower',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: 'Full Plate',
    prepTime: '16 mins',
    description:
      'Crunchy potato fingers glazed in sweet and spicy honey-chilli sauce topped with toasted sesame seeds.',
    price: 180,
  },
  {
    id: 'dish-23',
    name: 'Crispy Veg Spring Rolls (With Schezwan Dip)',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: '8 Pieces',
    prepTime: '15 mins',
    description:
      'Golden fried pastry rolls stuffed with spiced Indo-Chinese noodles and crunchy vegetables.',
    price: 160,
  },
  {
    id: 'dish-24',
    name: 'TFC Farm Fresh Loaded Veg Pizza (9 Inch)',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: '9" Regular',
    prepTime: '20 mins',
    description:
      'Hand-stretched crust topped with mozzarella, sweet corn, olives, jalapenos, capsicum, and paneer tikka.',
    price: 280,
    isPopular: true,
  },
  {
    id: 'dish-25',
    name: 'Penne Alfredo White Sauce / Arrabbiata Red Pasta',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: 'Full Bowl',
    prepTime: '18 mins',
    description:
      'Italian penne pasta tossed in rich cheesy bechamel cream or spiced tomato basil sauce with garlic bread.',
    price: 220,
  },
  {
    id: 'dish-26',
    name: 'Maharaja Crispy Paneer & Cheese Burger + Fries',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: 'Combo Meal',
    prepTime: '15 mins',
    description:
      'Toasted sesame bun with spiced paneer patty, cheddar slice, chipotle mayo, and salted French fries.',
    price: 160,
  },
  {
    id: 'dish-27',
    name: 'Peri-Peri Loaded French Fries',
    category: 'Chinese, Burgers, Pizza & Snacks',
    portion: 'Large Basket',
    prepTime: '12 mins',
    description:
      'Crisp golden potato fries dusted with fiery African peri-peri seasoning and cheese drizzle.',
    price: 130,
  },

  // Royal Main Course & Handi (10)
  {
    id: 'dish-28',
    name: 'Kadai Paneer / Paneer Butter Masala',
    category: 'Royal Main Course & Handi',
    portion: 'Full Handi (500ml)',
    prepTime: '20 mins',
    description:
      'Signature rich tomato-cashew butter gravy or roasted coriander-capsicum kadai masala with fresh paneer.',
    price: 270,
    isPopular: true,
  },
  {
    id: 'dish-29',
    name: 'TFC Special Dal Makhani (Slow-Cooked 12 Hours)',
    category: 'Royal Main Course & Handi',
    portion: 'Full Handi (500ml)',
    prepTime: '15 mins',
    description:
      'Whole black lentils simmered overnight on charcoal with white butter, tomato puree, and fresh cream.',
    price: 220,
    isPopular: true,
  },
  {
    id: 'dish-30',
    name: 'Shahi Paneer / Paneer Lababdar',
    category: 'Royal Main Course & Handi',
    portion: 'Full Handi (500ml)',
    prepTime: '20 mins',
    description:
      'Velvety Mughlai saffron-cashew gravy with grated cottage cheese and aromatic whole spices.',
    price: 280,
    isPopular: true,
  },
  {
    id: 'dish-31',
    name: 'Malai Kofta (Rich Cashew Cream Gravy)',
    category: 'Royal Main Course & Handi',
    portion: 'Full Plate (4 Koftas)',
    prepTime: '20 mins',
    description:
      'Soft paneer and dry-fruit dumplings served in a luxurious mildly sweet saffron-cream gravy.',
    price: 270,
  },
  {
    id: 'dish-32',
    name: 'Matar Mushroom / Mushroom Do Pyaza',
    category: 'Royal Main Course & Handi',
    portion: 'Full Handi (500ml)',
    prepTime: '18 mins',
    description:
      'Fresh button mushrooms and sweet green peas cooked in homestyle onion-tomato masala.',
    price: 240,
  },
  {
    id: 'dish-33',
    name: 'Punjabi Yellow Dal Tadka (Desi Ghee Tempering)',
    category: 'Royal Main Course & Handi',
    portion: 'Full Bowl',
    prepTime: '15 mins',
    description:
      'Yellow arhar and moong lentils tempered with desi ghee, roasted cumin, garlic, and Kashmiri red chilli.',
    price: 180,
  },
  {
    id: 'dish-34',
    name: 'Amritsari Pindi Chana / Chana Masala',
    category: 'Royal Main Course & Handi',
    portion: 'Full Bowl',
    prepTime: '18 mins',
    description:
      'Authentic dark-spiced chickpeas roasted with anardana, ginger juliennes, and kasuri methi.',
    price: 200,
  },
  {
    id: 'dish-35',
    name: 'Diwani Handi Mix Veg / Tawa Veg',
    category: 'Royal Main Course & Handi',
    portion: 'Full Bowl',
    prepTime: '18 mins',
    description:
      'Seasonal garden vegetables, baby corn, and paneer tossed on iron tawa with aromatic Punjabi spices.',
    price: 210,
  },
  {
    id: 'dish-36',
    name: 'Soya Chaap Rara / Butter Masala Gravy',
    category: 'Royal Main Course & Handi',
    portion: 'Full Handi',
    prepTime: '20 mins',
    description:
      'Char-grilled soya chaap pieces simmered in a robust spiced minced-soya and tomato gravy.',
    price: 240,
  },
  {
    id: 'dish-37',
    name: 'Palak Paneer / Methi Malai Matar',
    category: 'Royal Main Course & Handi',
    portion: 'Full Bowl',
    prepTime: '18 mins',
    description:
      'Fresh farm spinach puree or fenugreek-cream curry simmered with soft paneer cubes and garlic tadka.',
    price: 250,
  },

  // Indian Breads, Rice & Thalis (6)
  {
    id: 'dish-38',
    name: 'Tandoori Butter Naan / Garlic Naan (2 Pcs)',
    category: 'Indian Breads, Rice & Thalis',
    portion: '2 Pieces',
    prepTime: '10 mins',
    description:
      'Soft clay-oven leavened naan brushed generously with butter and roasted minced garlic.',
    price: 90,
    isPopular: true,
  },
  {
    id: 'dish-39',
    name: 'Lachha Paratha / Missi Roti / Tandoori Roti Basket',
    category: 'Indian Breads, Rice & Thalis',
    portion: '3 Breads Basket',
    prepTime: '12 mins',
    description:
      'Assorted flaky multi-layered Lachha Paratha, spiced gram-flour Missi Roti, and Butter Tandoori Roti.',
    price: 110,
  },
  {
    id: 'dish-40',
    name: 'Amritsari Stuffed Kulcha (With Chana & Raita)',
    category: 'Indian Breads, Rice & Thalis',
    portion: '2 Kulchas Meal',
    prepTime: '18 mins',
    description:
      'Crisp crushed-coriander potato-paneer stuffed kulchas served with Amritsari chole and tangy tamarind onion chutney.',
    price: 190,
    isPopular: true,
  },
  {
    id: 'dish-41',
    name: 'Hyderabadi Veg Dum Biryani (With Burani Raita)',
    category: 'Indian Breads, Rice & Thalis',
    portion: 'Full Handi',
    prepTime: '22 mins',
    description:
      'Long-grain aged basmati rice layered with saffron, mint, fried onions, and spiced vegetables in sealed handi.',
    price: 230,
    isPopular: true,
  },
  {
    id: 'dish-42',
    name: 'Jeera Basmati Rice / Kashmiri Veg Pulao',
    category: 'Indian Breads, Rice & Thalis',
    portion: 'Full Bowl',
    prepTime: '15 mins',
    description:
      'Fragrant basmati rice tempered with royal cumin or tossed with garden peas, cashews, and raisins.',
    price: 150,
  },
  {
    id: 'dish-43',
    name: 'TFC Maharaja Deluxe Thali (Complete Meal)',
    category: 'Indian Breads, Rice & Thalis',
    portion: '1 Royal Thali',
    prepTime: '20 mins',
    description:
      'Dal Makhani, Kadai Paneer, Mix Veg, Pineapple Raita, Jeera Rice, 1 Butter Naan, 1 Lachha Paratha, Salad, Papad & 2 Hot Gulab Jamuns.',
    price: 320,
    isPopular: true,
  },

  // Desserts & Beverages (4)
  {
    id: 'dish-44',
    name: 'Hot Gulab Jamun (4 Pcs) / Kesari Rasmalai (2 Pcs)',
    category: 'Desserts & Beverages',
    portion: '1 Dessert Box',
    prepTime: '10 mins',
    description:
      'Golden khoya dumplings in cardamom rose syrup or chilled saffron-pistachio rasmalai.',
    price: 110,
    isPopular: true,
  },
  {
    id: 'dish-45',
    name: 'Desi Ghee Moong Dal Halwa / Jalebi with Rabri',
    category: 'Desserts & Beverages',
    portion: '1 Bowl',
    prepTime: '12 mins',
    description:
      'Rich slow-roasted moong dal halwa studded with almonds or crisp saffron jalebis topped with thick rabri.',
    price: 140,
  },
  {
    id: 'dish-46',
    name: 'Punjabi Sweet / Salted Chaas & Mango Lassi',
    category: 'Desserts & Beverages',
    portion: '350ml Tall Glass',
    prepTime: '8 mins',
    description:
      'Thick hand-churned Punjabi lassi topped with malai, pistachio slivers, or roasted cumin.',
    price: 90,
  },
  {
    id: 'dish-47',
    name: 'Fresh Lime Soda / Cold Coffee with Ice Cream',
    category: 'Desserts & Beverages',
    portion: '350ml Bottle',
    prepTime: '8 mins',
    description:
      'Refreshing sweet-salted fresh lime soda or creamy blended café frappe with vanilla ice cream.',
    price: 110,
  },
];

export interface ResortPackage {
  id: string;
  title: string;
  filterCategory:
    | 'Bamboo Stay Package'
    | 'Dining Package'
    | 'Family Package'
    | 'Wedding Package';
  topLeftBadge: string;
  topRightBadge: string;
  bottomLeftMeta: string;
  price: number;
  priceFormatted: string;
  description: string;
  inclusions: string[];
  ctaText: string;
  image: string;
}

export const RESORT_PACKAGES: ResortPackage[] = [
  {
    id: 'pkg-bamboo-stay',
    title: 'TFC All-Inclusive Bamboo Stay Package',
    filterCategory: 'Bamboo Stay Package',
    topLeftBadge: 'BAMBOO STAY PACKAGE',
    topRightBadge: 'Includes All Meals & Morning Coffee',
    bottomLeftMeta: 'All-Inclusive Bamboo Package • Up to 2 Guests',
    price: 16000,
    priceFormatted: '₹16,000',
    description:
      'Complete Bamboo Stay Package at ₹16,000 rent including handcrafted Bamboo Room accommodation, Morning Coffee, Breakfast, Lunch, and Dinner.',
    inclusions: [
      'Bamboo Room / Bamboo Hut Stay (AC / Non-AC Configurable)',
      'Morning Coffee Included',
      'Fresh Breakfast Included',
      'Full Lunch Included',
      'Special Dinner Included',
    ],
    ctaText: 'Book Bamboo Stay Package',
    image: '/images/bamboo_hut_night.jpg',
  },
  {
    id: 'pkg-dining',
    title: 'TFC Bamboo Dining Area & VIP Lounge Package',
    filterCategory: 'Dining Package',
    topLeftBadge: 'DINING PACKAGE',
    topRightBadge: 'Food & Drinks Included',
    bottomLeftMeta: 'Bamboo Dining Area or VIP Lounge • Up to 4 Guests',
    price: 2999,
    priceFormatted: '₹2,999',
    description:
      'Complete Dining Package at ₹2,999 rent featuring reserved seating in the Bamboo Dining Area or VIP Lounge with Food and Drinks included.',
    inclusions: [
      'Reserved Table in the Bamboo Dining Area or VIP Lounge',
      'Full Food Included (Starters, Main Course, Indian Breads, Rice & Sweet Desserts)',
      'Drinks & Beverages Included (Welcome Drinks, Real Juice, Cold Drinks, Coffee & Mineral Water)',
    ],
    ctaText: 'Book Dining Package',
    image: '/images/restaurant_vip_dining.jpg',
  },
  {
    id: 'pkg-family',
    title: 'TFC Garden Family Stay',
    filterCategory: 'Family Package',
    topLeftBadge: 'FAMILY PACKAGE',
    topRightBadge: 'Ideal for Families of 4–6',
    bottomLeftMeta: '3 Days / 2 Nights • Up to 5 Guests',
    price: 35500,
    priceFormatted: '₹35,500',
    description:
      'Designed to bring grandparents, parents, and children together with spacious interconnected living and TFC Garden Fun Zone adventures at ₹35,500.',
    inclusions: [
      '2 Nights in Two-Bedroom Family Residence or Family Bamboo Villa',
      'Unlimited Access to TFC Garden Fun Zone & Outdoor Recreation Lawn',
      'Reserved 6-Person Family Table in the TFC Family Restaurant Hall',
      'Private Family Cinema & Bonfire Night Under the Stars',
      'Complimentary Extra Bed & Kids Meals',
    ],
    ctaText: 'Book Family Package',
    image: '/images/garden_fun_zone.jpg',
  },
  {
    id: 'pkg-wedding',
    title: 'TFC Grand Wedding Package',
    filterCategory: 'Wedding Package',
    topLeftBadge: 'WEDDING PACKAGE',
    topRightBadge: '7 AC Rooms + 1 Room Free',
    bottomLeftMeta: 'Full Wedding Celebration Package • Up to 500 Guests',
    price: 135000,
    priceFormatted: '₹1,35,000',
    description:
      'Complete TFC Wedding Package at ₹1,35,000 including 7 AC Rooms + 1 Room Free, LED Decoration, Stage Decoration, and DJ.',
    inclusions: [
      '7 AC Rooms + 1 Room FREE Included (Total 8 Rooms for Family & Guests)',
      'LED Decoration & LED Counter Included',
      'Grand Stage Decoration Included',
      'DJ Sound System & Lighting Included',
      'Exclusive Access to TFC Grand Wedding Hall & Outdoor Garden Lawn',
    ],
    ctaText: 'Book Wedding Package',
    image: '/images/wedding_banquet_hall.jpg',
  },
];
