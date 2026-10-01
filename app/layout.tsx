import type {Metadata} from 'next';
import './globals.css';

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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
