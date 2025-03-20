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
}

export const COMPANY_DATA: Company[] = [
  {
    id: 'virgin-atlantic',
    name: 'Virgin Atlantic',
    description: 'Leading airline committed to sustainable aviation and reducing carbon emissions through innovative solutions.',
    location: {
      latitude: 51.4700,
      longitude: -0.4543
    },
    images: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Virgin_Atlantic_logo.svg/2560px-Virgin_Atlantic_logo.svg.png',
      banner: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1972&auto=format&fit=crop'
      ]
    }
  },
  {
    id: 'virgin-hotels',
    name: 'Virgin Hotels',
    description: 'Luxury hotel chain focused on sustainable hospitality and environmental conservation.',
    location: {
      latitude: 41.8781,
      longitude: -87.6298
    },
    images: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Virgin_Hotels_logo.svg/2560px-Virgin_Hotels_logo.svg.png',
      banner: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
      ]
    }
  },
  {
    id: 'virgin-limited-edition',
    name: 'Virgin Limited Edition',
    description: 'Collection of unique retreats and luxury properties committed to environmental preservation.',
    location: {
      latitude: -4.2634,
      longitude: 55.2888
    },
    images: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Virgin_Limited_Edition_logo.svg/2560px-Virgin_Limited_Edition_logo.svg.png',
      banner: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop'
      ]
    }
  },
  {
    id: 'virgin-wines',
    name: 'Virgin Wines',
    description: 'Sustainable wine producer focusing on organic farming and eco-friendly packaging.',
    location: {
      latitude: 52.0406,
      longitude: 0.7594
    },
    images: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Virgin_Wines_logo.svg/2560px-Virgin_Wines_logo.svg.png',
      banner: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?q=80&w=2070&auto=format&fit=crop'
      ]
    }
  },
  {
    id: 'virgin-money',
    name: 'Virgin Money',
    description: 'Financial services provider committed to sustainable banking and green investments.',
    location: {
      latitude: 55.9533,
      longitude: -3.1883
    },
    images: {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Virgin_Money_logo.svg/2560px-Virgin_Money_logo.svg.png',
      banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2425&auto=format&fit=crop',
      gallery: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2425&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop'
      ]
    }
  }
];