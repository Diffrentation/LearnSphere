import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env", // ensure this path is correct relative to this file
});

const buildDirectMongoUri = () => {
  const hosts = process.env.MONGO_DIRECT_HOSTS?.split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  const replicaSet = process.env.MONGO_REPLICA_SET;

  if (!process.env.MONGO_URI || !hosts?.length || !replicaSet) {
    return null;
  }

  const sourceUri = new URL(process.env.MONGO_URI);
  const credentials = sourceUri.username
    ? `${sourceUri.username}${sourceUri.password ? `:${sourceUri.password}` : ""}@`
    : "";
  const options = new URLSearchParams(sourceUri.search);

  options.set("tls", "true");
  options.set("authSource", "admin");
  options.set("replicaSet", replicaSet);

  return `mongodb://${credentials}${hosts.join(",")}${sourceUri.pathname}?${options.toString()}`;
};

const shouldTryDirectConnection = (error) =>
  ["ECONNREFUSED", "ETIMEOUT", "ENOTFOUND", "ESERVFAIL", "EAI_AGAIN"].includes(
    error?.code
  );

const connectDB = async () => {
  try {
    let connectionInstance;

    try {
      connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
      const directMongoUri = buildDirectMongoUri();

      if (!shouldTryDirectConnection(error) || !directMongoUri) {
        throw error;
      }

      console.warn(
        `MongoDB SRV DNS lookup failed (${error.code}). Retrying with the configured direct Atlas hosts...`
      );
      await mongoose.disconnect().catch(() => undefined);
      connectionInstance = await mongoose.connect(directMongoUri);
    }
    console.log(`\n✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
