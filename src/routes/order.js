import {
  confirmOrder,
  createOrder,
  getOrder,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order/order.js";
import { verifyToken } from "../middleware/auth.js";

export const orderRoutes = async (fastify, options) => {
  fastify.addHook("preHandler", async (req, reply) => {
    const isAuthenticated = await verifyToken(req, reply);
    if (!isAuthenticated) {
      return reply.code(401).send({ message: "UnAuthenicated" });
    }
  });
  fastify.post("/order", createOrder);
  fastify.get("/order", getOrder);
  fastify.patch("/order/:orderId/status", updateOrderStatus);
  fastify.post("/order/:orderId/confirm", confirmOrder);
  fastify.post("/order/:orderId", getOrderById);
};
