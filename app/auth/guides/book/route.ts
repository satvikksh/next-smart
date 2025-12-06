// // app/api/guides/book/route.ts
// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { dbConnect } from '../../../src/lib/ConnectDB';
// import { getSessionBySignedToken } from '../../../src/lib/session';
// // import Booking from '../components/BookingModel'; // make a Booking mongoose model
// // import Guide from '../../../src/models/guide'; // guide model

// export async function POST(req: Request) {
//   try {
//     const jar = cookies();
//     const signedSession = jar.get('session_id')?.value;
//     const session = await getSessionBySignedToken(signedSession);

//     if (!session) {
//       return NextResponse.json({ error: 'UNAUTH' }, { status: 401 });
//     }

//     const body = await req.json();
//     const { guideId, desiredDate, notes } = body;

//     if (!guideId) {
//       return NextResponse.json({ error: 'guideId required' }, { status: 400 });
//     }

//     await dbConnect();
//     const guide = await Guide.findById(guideId);
//     if (!guide) return NextResponse.json({ error: 'Guide not found' }, { status: 404 });

//     // create server-side bookingId (unique, secure)
//     const bookingId = `BKG-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

//     const bookingDoc = await Booking.create({
//       bookingId,
//       user: session.user._id,
//       guide: guide._id,
//       desiredDate: desiredDate || null,
//       notes: notes || '',
//       status: 'confirmed',
//       createdAt: new Date(),
//     });

//     // Notify the guide here (email/push/in-app) with bookingId...
//     // sendNotificationToGuide(guide, bookingDoc)

//     return NextResponse.json({ success: true, bookingId });
//   } catch (err) {
//     console.error('BOOK API ERR', err);
//     return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
//   }
// }
