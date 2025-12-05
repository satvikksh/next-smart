export type Place = {
  key: string;
  title: string;
  location: string;
  img: string;
  intro: string;
  description: string;
  highlights: string[];
};

export const places: Record<string, Place> = {
  'taj-mahal': {
    key: 'taj-mahal',
    title: 'Taj Mahal, Agra',
    location: 'Agra, Uttar Pradesh',
    img: '/tajmahal.jpg',
    intro: 'An ivory-white marble mausoleum on the banks of the Yamuna river.',
    description: 'The Taj Mahal was built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal. It is famous for its symmetrical architectural beauty.',
    highlights: ['Symbol of eternal love', 'Best time: sunrise or sunset', 'UNESCO site']
  },

  'amber-fort': {
    key: 'amber-fort',
    title: 'Amber Fort, Jaipur',
    location: 'Jaipur, Rajasthan',
    img: '/amberfort.jpg',
    intro: 'A majestic fort built with red sandstone and marble.',
    description: 'Located on a hill, Amber Fort is known for its artistic Hindu-style architecture, large ramparts, and historic courtyards.',
    highlights: ['Sheesh Mahal (Mirror Palace)', 'Elephant rides', 'Scenic hilltop view']
  },

  'backwaters-kerala': {
    key: 'backwaters-kerala',
    title: 'Kerala Backwaters, Alleppey',
    location: 'Alleppey, Kerala',
    img: '/keralabackwaters.jpg',
    intro: 'A serene network of lagoons, lakes and canals.',
    description: 'The Kerala backwaters offer houseboat cruises, picturesque coconut groves, and a peaceful escape into nature.',
    highlights: ['Houseboat stay', 'Natural views', 'Traditional Kerala cuisine']
  },

  'varanasi-ghats': {
    key: 'varanasi-ghats',
    title: 'Ghats of Varanasi',
    location: 'Varanasi, Uttar Pradesh',
    img: '/varanasighats.jpg',
    intro: 'One of the world’s oldest living cities on the Ganges.',
    description: 'Varanasi renowned for spiritual aura, Ganga aarti, temples, and riverside traditions.',
    highlights: ['Ganga Aarti', 'Boat ride', 'Spiritual capital of India']
  },

  'goa-beaches': {
    key: 'goa-beaches',
    title: 'Beaches of Goa',
    location: 'Goa, India',
    img: '/goabeach.jpg',
    intro: 'Pristine beaches known for nightlife and seafood.',
    description: 'Goa is famous for its coastal beauty, Portuguese heritage, and vibrant beach culture.',
    highlights: ['Seafood', 'Beach parties', 'Water sports']
  },

  'manali': {
    key: 'manali',
    title: 'Manali',
    location: 'Manali, Himachal Pradesh',
    img: '/manali.jpg',
    intro: 'A high-altitude Himalayan resort town.',
    description: 'Manali is known for snow-capped mountains, adventure sports, and riverside camps.',
    highlights: ['Snowfall', 'Paragliding', 'Rohtang Pass']
  },

  'mysore-palace': {
    key: 'mysore-palace',
    title: 'Mysore Palace',
    location: 'Mysore, Karnataka',
    img: '/mysorepalace.jpg',
    intro: 'A royal palace with Indo-Saracenic architecture.',
    description: 'Historic palace famous for grand lighting every Sunday and cultural heritage.',
    highlights: ['Royal architecture', 'Evening lights', 'Museum inside']
  },

  'golden-temple': {
    key: 'golden-temple',
    title: 'Golden Temple',
    location: 'Amritsar, Punjab',
    img: '/goldentemple.jpg',
    intro: 'The holiest place of Sikhism.',
    description: 'Known for golden architecture, langar service, and spiritual significance.',
    highlights: ['Golden reflection lake', 'World’s largest community kitchen', 'Peaceful atmosphere']
  },

  'munnar': {
    key: 'munnar',
    title: 'Munnar Tea Gardens',
    location: 'Munnar, Kerala',
    img: '/munnar.jpg',
    intro: 'A hill station covered in tea plantations.',
    description: 'Munnar offers misty valleys, tea factories and breathtaking green landscapes.',
    highlights: ['Tea plantations', 'Cool climate', 'Scenic viewpoints']
  },

  'rann-of-kutch': {
    key: 'rann-of-kutch',
    title: 'Rann of Kutch',
    location: 'Kutch, Gujarat',
    img: '/rannofkutch.jpg',
    intro: 'A white salt-desert that sparkles under moonlight.',
    description: 'The Great Rann of Kutch is known for its surreal landscape and annual cultural festival.',
    highlights: ['White desert', 'Rann Utsav', 'Moonlight beauty']
  }
};
