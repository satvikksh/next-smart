// scripts/fill-signatures.ts
import "dotenv/config";
import { dbConnect } from "../src/lib/ConnectDB";
import User from "../src/models/users";
import { generateSignature } from "../src/utils/generateSignature";

async function assignSignatureToUser(userId: string) {
  let attempts = 0;
  while (attempts < 10) {
    attempts++;
    const candidate = generateSignature();
    try {
      // attempt atomic update only if signature is still null
      const res = await User.findOneAndUpdate(
        { _id: userId, signature: null }, // ensure we don't overwrite
        { $set: { signature: candidate } },
        { new: true }
      ).exec();

      if (res) return res.signature;
      // if res null, maybe signature was set concurrently — break
      return null;
    } catch (err: any) {
      // duplicate key error on signature — try another
      if (err.code === 11000) {
        console.warn(`signature collision, retrying... (${attempts})`);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed to assign unique signature after 10 attempts");
}

async function run() {
  try {
    await dbConnect();
    console.log("Connected to DB — starting migration");

    // find users that have signature null or missing
    const cursor = User.find({ $or: [{ signature: null }, { signature: { $exists: false } }] }).cursor();

    let count = 0;
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const id = doc._id;
      try {
        const sig = await assignSignatureToUser(id.toString());
        console.log(`Updated user ${id} signature -> ${sig}`);
        count++;
      } catch (err) {
        console.error(`Failed to update user ${id}:`, err);
      }
    }

    console.log(`Migration finished, ${count} users updated.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

run();
