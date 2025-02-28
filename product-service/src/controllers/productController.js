const Product = require("../models/product");

exports.createProduct = async (req, res) => {
  try {
    const { role, user_id } = req.user;
    if (role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, price, stock } = req.body;
    const product = await Product.create({ vendor_id: user_id, name, price, stock });
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const {id} = req.params;

    const products = await Product.findOne({
      where: {product_id:id},
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { role, user_id } = req.user;
    if (role !== "vendor" && role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    let condition = {};

    if (role === "vendor") {
      condition.vendor_id = user_id;
    }

    const products = await Product.findAll({
      where: condition,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, user_id } = req.user;

    if (role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, price, stock, version } = req.body;

    const [updatedRows] = await Product.update(
      { name, price, stock, version: version + 1 },
      {
        where: {
          product_id: id,
          vendor_id: user_id,
          version: version,
        },
      }
    );

    if (updatedRows === 0) {
      return res.status(409).json({
        message: "Product not found or version conflict. Please try again.",
      });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== "customer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { quantity, version } = req.body;

    const product = await Product.findOne({
      where: {
        product_id: id,
        version: version,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedStock = product.stock - quantity;

    const [updatedRows] = await Product.update(
      { stock: updatedStock, version: version + 1 },
      {
        where: {
          product_id: id,
          version: version,
        },
      }
    );

    if (updatedRows === 0) {
      return res.status(409).json({
        message: "Product not found or version conflict. Please try again.",
      });
    }

    res.status(200).json({ message: "Product stock updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, user_id } = req.user;

    if (role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedRows = await Product.destroy({
      where: { product_id: id, vendor_id: user_id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({
        message:
          "Product not found or you do not have access to delete this product",
      });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
