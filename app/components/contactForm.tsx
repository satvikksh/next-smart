'use client';
import React from 'react';


export default function ContactForm() {
const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
alert('Message submitted — in the real app POST to an API route');
};


return (
<form onSubmit={handleSubmit} className="space-y-4">
<input required className="w-full px-4 py-2 bg-slate-700 rounded" placeholder="Full name" />
<input required type="email" className="w-full px-4 py-2 bg-slate-700 rounded" placeholder="Email" />
<select className="w-full px-4 py-2 bg-slate-700 rounded">
<option>General Feedback</option>
<option>Complaint</option>
<option>Question</option>
</select>
<textarea required rows={5} className="w-full px-4 py-2 bg-slate-700 rounded" placeholder="Message" />
<button type="submit" className="w-full bg-blue-500 py-3 rounded">Submit</button>
</form>
);
}