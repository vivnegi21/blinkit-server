import fastify from "fastify";
import "dotenv/config.js";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";

const start = async () => {
  await connectDB(process.env.MONGO_URL);

  const app = fastify();
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
};

start();
