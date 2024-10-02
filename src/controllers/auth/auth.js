import jwt from "jsonwebtoken";
import { Customer, DeliveryPartner } from "../../models/index.js";

const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
  const refreshToken = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return { accessToken, refreshToken };
};

export const loginCustomer = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }
    const { accessToken, refreshToken } = generateToken(customer);

    return reply.send({
      message: customer
        ? "Login SuccessFul"
        : "Customer created and Logged in ",
      accessToken,
      refreshToken,
      customer,
    });
  } catch (error) {
    reply.status(403).send({ message: "An error occured", error });
  }
};

export const loginDeliveryPartner = async (req, reply) => {
  try {
    const { email, password } = req.body;
    const deliveryPartner = await DeliveryPartner.findOne({ email });
    if (!deliveryPartner) {
      reply.status(404).send({ message: "Delivery partner not found" });
    }
    const isMatched = password === deliveryPartner.password;

    if (!isMatched) {
      reply.status(401).send({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = generateToken(deliveryPartner);

    return reply.send({
      message: "Login SuccessFul",
      accessToken,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    reply.status(403).send({ message: "An error occured" });
  }
};

export const refreshToken = async (req, reply) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(401).send({
      message: "Refresh Token Required",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userId);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userId);
    } else {
      return reply.status(403).send({
        message: "Invalid Role",
      });
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(user);
    return reply.send({
      message: "Refresh Token SuccessFul",
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  } catch (error) {
    return reply.status(403).send({
      message: "Invalid Refresg Token",
      error,
    });
  }
};

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      return reply.status(401).send({ message: "User ID and Role Required" });
    }

    let user;
    if (role === "Customer") {
      user = await Customer.findById(userId);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userId);
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.send({
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "An Error Occured",
      error,
    });
  }
};
