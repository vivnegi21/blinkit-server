import mongoose from "mongoose";
import "dotenv/config.js";
import { Category, Product } from "./src/models/index.js";
import { categories, products } from "./seedDb.js";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);
    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});
    // console.log(",......", categoryMap);
    const productWithCategoriesIds = products.map((product) => {
      return {
        ...product,
        category: categoryMap[product.category],
      };
    });
    await Product.insertMany(productWithCategoriesIds);

    console.log("DB seeded Successfully ✅");
  } catch (error) {
    console.log("Error seeding database: ", error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
