const express = require("express");
const Router = express.Router();
const ProductController = require("../controllers/ProductController");
const Authentication = require("../middleware/Auth");
Router.get(
  "/admin/products",
  Authentication.isAdmin,
  ProductController.getAllProduct
); //get product by search or get all product
Router.get("/products", ProductController.getProduct); //get product by search or get all product
Router.get("/products/:category", ProductController.getProductByCategory); // get product by category
module.exports = Router;
