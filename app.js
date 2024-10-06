import fastify from "fastify";
import "dotenv/config.js";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { registerRoutes } from "./src/routes/index.js";
import fastifySocketIO from "fastify-socket.io";

const start = async () => {
  await connectDB(process.env.MONGO_URL);

  const app = fastify();

  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });

  await registerRoutes(app); //make routes

  await buildAdminRouter(app);

  app.listen(
    {
      port: PORT,
      host: "0.0.0.0",
    },
    (err, addr) => {
      if (err) {
        console.log(err);
      } else {
        console.log(
          `BLinkit Started on port :http://localhost:${PORT}${admin.options.rootPath}`
        );
      }
    }
  );

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("-------A User Connected------");
      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(`------User Joined Room ${orderId}------`);
      });

      socket.on("disconnect", () => {
        console.log("------User Disconnected------");
      });
    });
  });
};

start();
