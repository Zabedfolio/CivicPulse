import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/civicpulse";
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
});
const db = client.db();

const trustedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.BETTER_AUTH_URL,
  "http://localhost:3000",
].filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (password) => {
        return await bcrypt.hash(password, 10);
      },
      verify: async ({ hash, password }) => {
        if (!hash || !password) return false;
        if (
          hash.startsWith("$2a$") ||
          hash.startsWith("$2b$") ||
          hash.startsWith("$2y$")
        ) {
          return await bcrypt.compare(password, hash);
        }
        if (hash.includes(":")) {
          const [salt, key] = hash.split(":");
          if (!salt || !key) return false;
          const keyBuffer = Buffer.from(key, "hex");
          const derivedKey = crypto.scryptSync(password, salt, keyBuffer.length);
          return crypto.timingSafeEqual(keyBuffer, derivedKey);
        }
        return false;
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "citizen",
        required: false,
      },
      department: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        required: false,
      },
    },
  },
});
