import type {Metadata} from 'next';
import {Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono} from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'TFC Garden — Hotel, Bamboo Sanctuary & Banquet Suite',
  description:
    'Official hospitality and booking suite for TFC Garden (Near Bus Stand, Sri Anandpur Sahib, Punjab) featuring Eco Bamboo Huts, AC Suites, Interactive Wedding Menu Cards, Restaurant Table Reservations, and Free 3 km Home Delivery.',
  openGraph: {
    title: 'TFC Garden — Hotel, Bamboo Sanctuary & Banquet Suite',
    description:
      'Official hospitality and booking suite for TFC Garden (Near Bus Stand, Sri Anandpur Sahib, Punjab) featuring Eco Bamboo Huts, AC Suites, Interactive Wedding Menu Cards, Restaurant Table Reservations, and Free 3 km Home Delivery.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TFC Garden — Hotel, Bamboo Sanctuary & Banquet Suite',
    description:
      'Official hospitality and booking suite for TFC Garden (Near Bus Stand, Sri Anandpur Sahib, Punjab) featuring Eco Bamboo Huts, AC Suites, Interactive Wedding Menu Cards, Restaurant Table Reservations, and Free 3 km Home Delivery.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} scroll-smooth`}
    >
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        ></script>
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#F8F5EE] text-[#14281D] font-sans antialiased selection:bg-[#1E5E3A] selection:text-white"
      >
        {children}
      </body>
    </html>
  );
}
