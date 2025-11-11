import TouristCard from './components/touristCard';
import { places } from './data/places';


export default function HomePage() {
  const placeList = Object.values(places);
  return (
	<>
	  <section>
		<div className="hero-bg text-center p-12 rounded-2xl shadow-lg border border-slate-700 text-white">
		  <h1 className="text-5xl font-bold text-blue-400 mb-4">Welcome to S.M.A.R.T.</h1>
		  <p className="text-xl text-slate-300 mb-2">Smart Monitoring and Response System for Tourist</p>
		</div>
	  </section>

	  <section className="mt-12 grid md:grid-cols-3 gap-8">
		<div className="bg-slate-800 p-8 rounded-xl">Verified Guides</div>
		<div className="bg-slate-800 p-8 rounded-xl">Multi-Level Expertise</div>
		<div className="bg-slate-800 p-8 rounded-xl">Digital Tourist ID</div>
	  </section>

	  <section className="mt-12">
		<h2 className="text-4xl font-bold text-center mb-8">Discover India&apos;s Wonders</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		  {placeList.map(p => (
			<TouristCard
			  key={p.key}
			  slug={p.key}
			  title={p.title}
			  img={p.img}
			  intro={p.intro}
			/>
		  ))}
		</div>
	  </section>
	</>
  );
}