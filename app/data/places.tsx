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
location: 'Uttar Pradesh',
img: '/tajmahal.jpg',
intro: 'A UNESCO World Heritage Site...',
description: 'The Taj Mahal is renowned for its harmonious and symmetrical design...',
highlights: ['A symbol of eternal love', 'Best time to visit: sunrise or sunset']
},
// add other entries similarly (jaipur, kerala, varanasi, goa, himalayas)
};