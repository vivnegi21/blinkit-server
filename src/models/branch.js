import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  liveLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  deliveryPartner: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
    },
  ],
  isActivated: {
    type: Boolean,
    default: false,
  },
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
