import "dotenv/config";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/index.js";

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "session",
});

sessionStore.on("error", (err) => {
  console.log("Session store error", err);
});

export const authenticate = async (email, password) => {
  if (email && password) {
    const user = await Admin.findOne({ email });
    if (!user) {
      return null;
    } else {
      if (user.password === password) {
        return Promise.resolve({ email: email, password: password });
      } else return null;
    }
  } else {
    return null;
  }
};

export const PORT = process.env.PORT || 3000;

export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
