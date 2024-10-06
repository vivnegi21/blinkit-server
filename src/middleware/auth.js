import jwt from "jsonwebtoken";

export const verifyToken = async (req, reply) => {
  console.log("req in middleware===================", req.body);
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({ message: "Unauthorized", authHeader });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    return true;
  } catch (error) {
    return reply.status(403).send({
      message: "Invalid or expired token",
    });
  }
};
