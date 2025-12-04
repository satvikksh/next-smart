// data/mockGuides.ts
import { Guide } from '../types/guide';

export const mockGuides: Guide[] = [
  {
    id: 'guide-001',
    name: 'Amit Sharma',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    location: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    rating: 4.8,
    pricePerDay: 85,
    experience: 8,
    specialty: ['Historical', 'Cultural', 'Food'],
    languages: ['Hindi', 'English', 'Rajasthani'],
    toursCompleted: 245,
    availability: {
      from: '2024-01-15',
      to: '2024-12-31'
    },
    description: 'Expert in Rajasthani culture and history with 8 years of experience. Specializes in heritage walks, palace tours, and authentic local food experiences.',
    verified: true,
    contactInfo: {
      email: 'amit.sharma@example.com',
      phone: '+91 9876543210',
      whatsapp: '+91 9876543210'
    },
    certifications: ['Government Licensed Tour Guide', 'Food Safety Certified'],
    vehicleAvailable: true,
    maxGroupSize: 15,
    responseTime: 'within 1 hour',
    badges: ['Top Rated', 'Fast Response', 'Heritage Specialist']
  },
  {
    id: 'guide-002',
    name: 'Maria Rodriguez',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    location: 'Barcelona',
    state: 'Catalonia',
    country: 'Spain',
    rating: 4.9,
    pricePerDay: 120,
    experience: 12,
    specialty: ['Art', 'Architecture', 'Food'],
    languages: ['Spanish', 'English', 'French', 'Catalan'],
    toursCompleted: 189,
    availability: {
      from: '2024-03-01',
      to: '2024-11-30'
    },
    description: 'Art historian specializing in Gaudí architecture and modernist art. Offers immersive tours of Sagrada Familia, Park Güell, and local art galleries.',
    verified: true,
    contactInfo: {
      email: 'maria.rodriguez@example.com',
      phone: '+34 600123456'
    },
    certifications: ['Art History Degree', 'Official Tourism Guide'],
    vehicleAvailable: false,
    maxGroupSize: 10,
    responseTime: 'within 2 hours',
    badges: ['Art Expert', 'Architecture Guide']
  },
  {
    id: 'guide-003',
    name: 'Kenji Tanaka',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    location: 'Kyoto',
    state: 'Kansai',
    country: 'Japan',
    rating: 4.7,
    pricePerDay: 95,
    experience: 6,
    specialty: ['Cultural', 'Temples', 'Traditional Arts'],
    languages: ['Japanese', 'English'],
    toursCompleted: 156,
    availability: {
      from: '2024-02-01',
      to: '2024-12-15'
    },
    description: 'Specialist in Japanese tea ceremonies, Zen gardens, and temple tours. Provides authentic cultural experiences including kimono dressing and calligraphy workshops.',
    verified: true,
    contactInfo: {
      email: 'kenji.tanaka@example.com',
      phone: '+81 801234567'
    },
    certifications: ['National Certified Guide', 'Tea Ceremony Master'],
    vehicleAvailable: true,
    maxGroupSize: 8,
    responseTime: 'within 3 hours',
    badges: ['Cultural Expert', 'Traditional Arts']
  },
  {
    id: 'guide-004',
    name: 'Sophie Martin',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    location: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    rating: 4.9,
    pricePerDay: 110,
    experience: 10,
    specialty: ['Art', 'Food', 'Fashion'],
    languages: ['French', 'English', 'Italian'],
    toursCompleted: 210,
    availability: {
      from: '2024-01-01',
      to: '2024-12-31'
    },
    description: 'Parisian native with expertise in French art, cuisine, and fashion. Offers Louvre tours, pastry-making classes, and shopping guide services.',
    verified: true,
    vehicleAvailable: false,
    maxGroupSize: 12,
    responseTime: 'within 1 hour',
    badges: ['Food Expert', 'Art Lover']
  },
  {
    id: 'guide-005',
    name: 'Carlos Silva',
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005-128?w=400',
    location: 'Rio de Janeiro',
    state: 'Rio de Janeiro',
    country: 'Brazil',
    rating: 4.6,
    pricePerDay: 75,
    experience: 5,
    specialty: ['Adventure', 'Beach', 'Nightlife'],
    languages: ['Portuguese', 'English', 'Spanish'],
    toursCompleted: 98,
    availability: {
      from: '2024-02-15',
      to: '2024-11-30'
    },
    description: 'Adventure guide specializing in hiking, beach activities, and Rio nightlife. Knows all the best spots for samba, caipirinhas, and breathtaking views.',
    verified: true,
    vehicleAvailable: true,
    maxGroupSize: 20,
    responseTime: 'within 30 minutes',
    badges: ['Adventure Guide', 'Local Expert']
  },
  {
    id: 'guide-006',
    name: 'Lena Schmidt',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
    location: 'Berlin',
    state: 'Berlin',
    country: 'Germany',
    rating: 4.8,
    pricePerDay: 90,
    experience: 7,
    specialty: ['Historical', 'Architecture', 'Nightlife'],
    languages: ['German', 'English', 'French'],
    toursCompleted: 134,
    availability: {
      from: '2024-03-01',
      to: '2024-12-20'
    },
    description: 'History buff specializing in Cold War Berlin, street art, and modern architecture. Offers alternative tours beyond typical tourist paths.',
    verified: true,
    vehicleAvailable: false,
    maxGroupSize: 15,
    responseTime: 'within 2 hours',
    badges: ['History Expert', 'Alternative Tours']
  },
  {
    id: 'guide-007',
    name: 'Raj Patel',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    location: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    rating: 4.5,
    pricePerDay: 65,
    experience: 4,
    specialty: ['Food', 'Local Experience', 'Shopping'],
    languages: ['Hindi', 'English', 'Marathi', 'Gujarati'],
    toursCompleted: 87,
    availability: {
      from: '2024-01-01',
      to: '2024-12-31'
    },
    description: 'Mumbai street food expert and local experience guide. Knows all the hidden gems, local markets, and authentic eateries away from tourist crowds.',
    verified: true,
    vehicleAvailable: true,
    maxGroupSize: 8,
    responseTime: 'within 1 hour',
    badges: ['Food Specialist', 'Local Expert']
  },
  {
    id: 'guide-008',
    name: 'Giovanni Rossi',
    image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400',
    location: 'Rome',
    state: 'Lazio',
    country: 'Italy',
    rating: 4.9,
    pricePerDay: 130,
    experience: 15,
    specialty: ['Historical', 'Food', 'Religious'],
    languages: ['Italian', 'English', 'Spanish'],
    toursCompleted: 302,
    availability: {
      from: '2024-02-01',
      to: '2024-11-30'
    },
    description: 'Roman historian with deep knowledge of ancient Rome, Vatican City, and Italian cuisine. Offers exclusive access to some historical sites.',
    verified: true,
    certifications: ['Archaeology Degree', 'Official Vatican Guide'],
    vehicleAvailable: true,
    maxGroupSize: 10,
    responseTime: 'within 4 hours',
    badges: ['History Master', 'Vatican Expert']
  }
];

// Helper function to get guides by location
export function getGuidesByCountry(country: string): Guide[] {
  return mockGuides.filter(guide => guide.country.toLowerCase() === country.toLowerCase());
}

export function getGuidesByState(state: string): Guide[] {
  return mockGuides.filter(guide => guide.state.toLowerCase() === state.toLowerCase());
}

export function getGuidesByCity(city: string): Guide[] {
  return mockGuides.filter(guide => guide.location.toLowerCase() === city.toLowerCase());
}

export function getGuideById(id: string): Guide | undefined {
  return mockGuides.find(guide => guide.id === id);
}

// Sample function to simulate API call
export async function fetchGuides(filters?: {
  location?: string;
  country?: string;
  minRating?: number;
  maxPrice?: number;
}): Promise<Guide[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredGuides = [...mockGuides];
  
  if (filters) {
    if (filters.location) {
      filteredGuides = filteredGuides.filter(
        guide => guide.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    if (filters.country) {
      filteredGuides = filteredGuides.filter(
        guide => guide.country.toLowerCase() === filters.country!.toLowerCase()
      );
    }
    
    if (filters.minRating) {
      filteredGuides = filteredGuides.filter(
        guide => guide.rating >= filters.minRating!
      );
    }
    
    if (filters.maxPrice) {
      filteredGuides = filteredGuides.filter(
        guide => guide.pricePerDay <= filters.maxPrice!
      );
    }
  }
  
  return filteredGuides;
}