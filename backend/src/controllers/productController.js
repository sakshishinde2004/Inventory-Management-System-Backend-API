import Product from "../models/product.js";
import fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    const filepath = req.file?.path;

    let uploadResult;
    if (filepath) {
      uploadResult = await cloudinary.uploader.upload(filepath, {
        folder: "products",
      }).catch((error) => console.log(error));
    }

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image: uploadResult?.url || "",
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    let updatedImage = image;

    if (req.file) {
      if (image) {
        const publicId = image.split("/").pop().split(".")[0]; 
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
      updatedImage = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, stock, image: updatedImage },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const imageUrl = product.image;
    if (imageUrl) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`).catch(console.error);
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


export const increaseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    );

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Stock increased successfully", product });
  } catch (error) {
    console.error("Error increasing stock:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const decreaseStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ success: false, message: "Quantity must be greater than 0" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock available" });
    }

    product.stock -= quantity;
    await product.save();

    res.status(200).json({ success: true, message: "Stock decreased successfully", product });
  } catch (error) {
    console.error("Error decreasing stock:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lt: ["$stock", "$low_stock_threshold"] },
    });

    res.status(200).json({
      success: true,
      message: "Low stock products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
