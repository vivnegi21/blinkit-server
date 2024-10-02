import Product from "../../models/products.js";

export const getProductsByCategoryId = async (req, reply) => {
  const { categoryId } = req.params;
  try {
    const products = await Product.find({ category: categoryId })
      .select("-category") //remove category column
      .exec(); //execute the query
    return reply.send(products);
  } catch (error) {
    return reply.status(500).send({ message: "An Error Occurred", error });
  }
};
