// src/utils/generateSignature.ts
import crypto from "crypto";

export function generateSignature(prefix = "sig", bytes = 12) {
  // returns something like: sig_4f7a3b2c9d8e7f1a2b3c
  return `${prefix}_${crypto.randomBytes(bytes).toString("hex")}`;
}
