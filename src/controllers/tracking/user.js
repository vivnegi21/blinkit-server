import { mongo } from "mongoose";
import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, reply) => {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId));
    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }
    let UserModal;

    if (user.role === "Customer") {
      UserModal = Customer;
    } else if (user.role === "DeliveryPartner") {
      UserModal = DeliveryPartner;
    } else {
      return reply.code(400).send({ message: "Invalid user role" });
    }
    const updatedUser = await UserModal.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateData) {
      return reply.code(400).send({ message: "Invalid update data" });
    }
    return reply
      .code(200)
      .send({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    return reply.status(404).send({
      message: "User Not Found",
      error,
    });
  }
};
