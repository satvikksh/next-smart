export type Guide = {
name: string;
level: 'local' | 'state' | 'country';
location: string;
rating: number;
specialty: string;
price: number;
img: string;
};


export const guides: Guide[] = [
{ name: 'Satvik Kushwaha', level: 'local', location: 'Jaipur, Rajasthan', rating: 4.9, specialty: 'Historical Forts & Palaces', price: 50, img: '/logo.png' },
{ name: 'Swati Sinha', level: 'state', location: 'Gujarat', rating: 4.8, specialty: 'Cultural & Textile Tours', price: 150, img: '/logo.png' },
{ name: 'Vikram Sahu', level: 'country', location: 'All India', rating: 5.0, specialty: 'Luxury Pan-India Journeys', price: 500, img: '/logo.png' }
];