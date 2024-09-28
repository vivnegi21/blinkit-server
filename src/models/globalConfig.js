import mongoose from "mongoose";

//add description here inside the column name object
export const AppConfigProperty = {
  firstUserPopUp: {
    description: "tooltip to describe the check ",
  },
  showUserOffer: {
    description: "whether to give user offer popup or not ",
  },
};

//make use of it when you need to specific columns to user
export const AppConfigListProperties = ["firstUserPopUp", "showUserOffer"];

// BASE Global Config Schema
//add columns you want inside the table
const globaConfig = new mongoose.Schema({
  firstUserPopUp: {
    type: Boolean,
  },
  showUserOffer: {
    type: Boolean,
  },
});

const AppConfig = mongoose.model("AppConfiguration", globaConfig);

export default AppConfig;
