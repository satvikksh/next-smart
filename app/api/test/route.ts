import { NextResponse } from "next/server";
import { dbConnect } from "../../src/lib/ConnectDB";

export async function GET() {
  await dbConnect();
  return NextResponse.json({ message: "MongoDB Connected Successfully 🎉" });
}
