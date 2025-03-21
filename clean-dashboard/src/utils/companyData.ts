export interface Company {
  id: string;
  name: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  images: {
    logo: string;
    banner: string;
    gallery: string[];
  };
  sector: string;
}

export const COMPANY_DATA: Company[] = [
  {
    id: 'virgin-atlantic',
    name: 'Virgin Atlantic',
    description: 'A British airline that offers passenger services to destinations across North America, the Caribbean, Africa, the Middle East and Asia from its main bases at London Heathrow and London Gatwick. Known for innovative customer service and high-quality travel experiences.',
    location: {
      latitude: 51.4700,
      longitude: -0.4543
    },
    images: {
      logo: 'https://example.com/virgin-atlantic-logo.png',
      banner: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1972&auto=format&fit=crop'
      ]
    },
    sector: 'Transportation'
  },
  {
    id: 'virgin-hotels',
    name: 'Virgin Hotels',
    description: 'A lifestyle hotel brand that combines comfort and innovation with heartfelt service. Focused on providing a personalized hotel experience with the Virgin touch, including innovative amenities and a vibrant atmosphere.',
    location: {
      latitude: 41.8781,
      longitude: -87.6298
    },
    images: {
      logo: 'https://example.com/virgin-hotels-logo.png',
      banner: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Hospitality'
  },
  {
    id: 'virgin-media',
    name: 'Virgin Media',
    description: 'A British telecommunications company that provides telephone, television and internet services in the United Kingdom. Focused on delivering fast broadband and entertainment services through fiber-optic networks.',
    location: {
      latitude: 55.9533,
      longitude: -3.1883
    },
    images: {
      logo: 'https://example.com/virgin-media-logo.png',
      banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2425&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2425&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop'
      ]
    },
    sector: 'Telecommunications'
  },
  {
    id: 'virgin-active',
    name: 'Virgin Active',
    description: 'A chain of health clubs with locations worldwide, focusing on innovative fitness solutions and wellness programs. Offers a wide range of exercise classes, gym facilities, and spa services to promote healthy lifestyles.',
    location: {
      latitude: -4.2634,
      longitude: 55.2888
    },
    images: {
      logo: 'https://example.com/virgin-active-logo.png',
      banner: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Health & Fitness'
  },
  {
    id: 'virgin-galactic',
    name: 'Virgin Galactic',
    description: 'A spaceflight company within the Virgin Group that develops commercial spacecraft and aims to provide suborbital spaceflights to space tourists. Pioneering human spaceflight for private individuals and research missions.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-galactic-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Aerospace'
  },
  {
    id: 'virgin-money',
    name: 'Virgin Money',
    description: 'A financial services brand used by several companies owned in whole or in part by Virgin Group. Offering innovative banking and investment products with a focus on customer experience and digital solutions.',
    location: {
      latitude: 55.9533,
      longitude: -3.1883
    },
    images: {
      logo: 'https://example.com/virgin-money-logo.png',
      banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2425&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2425&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop'
      ]
    },
    sector: 'Financial Services'
  },
  {
    id: 'virgin-voyages',
    name: 'Virgin Voyages',
    description: 'A cruise line that offers a premium adult-only cruise experience with a focus on sophisticated designs, diverse entertainment options, and quality dining. Creating a boutique hotel experience at sea with sustainable practices.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-voyages-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Cruise & Travel'
  },
  {
    id: 'virgin-wines',
    name: 'Virgin Wines',
    description: 'An online wine retailer that sources quality wines from independent winemakers around the world. Focuses on curating exceptional wine selections with personalized recommendations and direct-to-consumer delivery.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-wines-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Food & Beverage'
  },
  {
    id: 'virgin-records',
    name: 'Virgin Records',
    description: 'A record label founded by Richard Branson, now a part of Universal Music Group. Historically known for signing innovative and breakthrough artists across various music genres and pushing creative boundaries.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-records-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Entertainment'
  },
  {
    id: 'virgin-radio',
    name: 'Virgin Radio',
    description: 'A radio brand with stations around the world, offering music, entertainment and news broadcasting. Known for playing contemporary hits and creating engaging audio content for diverse audiences.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-radio-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Media & Broadcasting'
  },
  {
    id: 'virgin-pure',
    name: 'Virgin Pure',
    description: 'A company that provides water purification systems for homes and offices. Focused on delivering pure, filtered water through innovative technology that reduces plastic waste from bottled water.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-pure-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Consumer Goods'
  },
  {
    id: 'virgin-pulse',
    name: 'Virgin Pulse',
    description: 'A global provider of digital health and wellbeing solutions that help organizations improve employee health outcomes. Offers platforms for corporate wellness programs that boost engagement and productivity.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-pulse-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Health Technology'
  },
  {
    id: 'virgin-orbit',
    name: 'Virgin Orbit',
    description: 'A company that provides dedicated, responsive, and affordable launch services for small satellites. Uses a modified Boeing 747 to launch rockets from high altitude, offering flexible satellite deployment options.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-orbit-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Aerospace & Technology'
  },
  {
    id: 'virgin-mobile',
    name: 'Virgin Mobile',
    description: 'A wireless communications brand that operates in various countries, offering mobile phone services, data plans and related products. Focuses on flexible contracts and digital-first customer experiences.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-mobile-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Telecommunications'
  },
  {
    id: 'virgin-holidays',
    name: 'Virgin Holidays',
    description: 'A transatlantic tour operator offering holidays to the USA, Caribbean, Africa, Middle East, and the Far East. Creates tailored vacation experiences with a focus on unique destinations and premium service.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://example.com/virgin-holidays-logo.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    },
    sector: 'Travel & Tourism'
  }
];