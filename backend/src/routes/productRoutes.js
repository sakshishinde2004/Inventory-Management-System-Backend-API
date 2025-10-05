import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  increaseStock,
  decreaseStock,
  getLowStockProducts,
} from "../controllers/productController.js";
import upload from "../middleware/uploadimage.js";

const router = express.Router();

router.post("/", upload.single('image'), createProduct);
router.get("/", getAllProducts);
router.put("/:id", upload.single('image'), updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/increase-stock", increaseStock);
router.post("/:id/decrease-stock", decreaseStock);
router.get("/low-stock", getLowStockProducts);

export default router;