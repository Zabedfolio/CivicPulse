import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/civicpulse";
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
});
const db = client.db();

const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  (process.env.NODE_ENV !== "production" ? "dev-only-better-auth-secret-change-me" : undefined);

const trustedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.BETTER_AUTH_URL,
  "http://localhost:3000",
].filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  emailAndPassword: {
    enabled: true,
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
