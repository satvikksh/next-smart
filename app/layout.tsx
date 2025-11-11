import './globals.css';
import Header from './components/header';


export const metadata = { title: 'S.M.A.R.T.', description: 'Smart Monitoring and Response System for Tourist' };


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="bg-slate-900 text-slate-200">
<Header />
<main className="container mx-auto px-6 py-8">{children}</main>
</body>
</html>
);
}