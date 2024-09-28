import jwt from "jsonwebtoken";

export const verifyToken = async (req, reply) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.code(401).send({ message: "Unauthorized" });
    }
    const token = authHeader.substring(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;
    return true;
  } catch (error) {
    return reply.status(403).send({
      message: "Invalid or expired token",
    });
  }
};
