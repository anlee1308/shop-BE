const ProductModel = require("../model/ProductModel");
const CommentModel = require("../model/commentModel");
const User = require("../model/UserModel");

module.exports = {
  // Get all products
  getAllProduct: async (req, res) => {
    return res.json(await ProductModel.find({}));
  },
  getProduct: async (req, res) => {
    let { page, sort, max, min, search } = req.query;
    sort = sort && parseInt(sort); // chuyển String qua int
    page = page ? page : 1; // nếu không có query page thì trả về page 1
    var filterPrice;
    max ? (filterPrice = { $lte: max }) : {}; // kiểm tra nếu có max thì khởi tạo object max;

    var listProducts, totalProduct; //khởi tạo biến toàn cục

    if (search) {
      if (sort) {
        listProducts = await ProductModel.find({
          title: {
            $regex: "^" + search,
            $options: "i",
          },
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .sort({ newprice: sort })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
        totalProduct = await ProductModel.find({
          title: {
            $regex: "^" + search,
            $options: "i",
          },
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        });
      } else {
        listProducts = await ProductModel.find({
          title: {
            $regex: "^" + search,
            $options: "i",
          },
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
        totalProduct = await ProductModel.find({
          title: {
            $regex: "^" + search,
            $options: "i",
          },
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        });
      }
    } else {
      if (sort) {
        listProducts = await ProductModel.find({
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .sort({ newprice: sort })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
        totalProduct = await ProductModel.find({
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        });
      } else {
        listProducts = await ProductModel.find({
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
      }
      totalProduct = await ProductModel.find({
        newprice: {
          $gte: min ? min : 0,
          ...filterPrice,
        },
      });
    }
    res.json({
      listProducts,
      totalProduct: totalProduct.length,
      productPerPage: listProducts.length,
      totalPage:
        totalProduct.length / 15 < 1
          ? 1
          : parseInt(totalProduct.length / 15) + 1,
    });
  },
  getProductByCategory: async (req, res) => {
    const { category } = req.params;
    let { page, sort, max, min, type } = req.query;
    sort = sort && parseInt(sort); // chuyển String qua int
    page = page ? page : 1; // nếu không có query page thì trả về page 1
    type = type ? type : "1"; // nếu không có type thì trả về type 1
    var filterPrice;
    max ? (filterPrice = { $lte: max }) : {}; // kiểm tra nếu có max thì khởi tạo object max;

    var listProducts, totalProduct; //khởi tạo biến toàn cục
    if (category == "PK") {
      if (sort) {
        listProducts = await ProductModel.find({
          $and: [{ category: { $ne: "Laptop" } }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .sort({ newprice: sort })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
        totalProduct = await ProductModel.find({
          $and: [{ category: { $ne: "Laptop" } }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        });
      } else {
        listProducts = await ProductModel.find({
          $and: [{ category: { $ne: "Laptop" } }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
        totalProduct = await ProductModel.find({
          $and: [{ category: { $ne: "Laptop" } }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        });
      }
    } else {
      if (sort) {
        listProducts = await ProductModel.find({
          $and: [{ category: category }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .sort({ newprice: sort })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
        totalProduct = await ProductModel.find({
          $and: [{ category: category }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        });
      } else {
        listProducts = await ProductModel.find({
          $and: [{ category: category }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        })
          .skip(page == 1 ? 0 : (page - 1) * 15)
          .limit(15);
        totalProduct = await ProductModel.find({
          $and: [{ category: category }, { type }],
          newprice: {
            $gte: min ? min : 0,
            ...filterPrice,
          },
        });
      }
    }

    res.json({
      listProducts,
      totalProduct: totalProduct.length,
      productPerPage: listProducts.length,
      totalPage:
        totalProduct.length / 15 < 1
          ? 1
          : parseInt(totalProduct.length / 15) + 1,
    });
  },
  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await ProductModel.findById(id);
      res.json(product);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  postComment: async (req, res) => {
    const { start, content } = req.body;
    // id product
    const { id } = req.params;
    // id user
    const { _id } = req.user.data;
    try {
      const user1 = await User.findById(_id);
      // console.log(user1)
      const newComment = new CommentModel({
        user: user1,
        start,
        content,
      });
      const temp = await newComment.save();
      // console.log(temp);
      const product = await ProductModel.findById(id);
      console.log(product);
      product.comment.push(temp);
      const newproduct = await product.save();
      return res.json(newproduct);
    } catch (err) {
      res.json(err);
    }
  },
  getComment: async (req, res) => {
    // id product
    const { id } = req.params;
    let { page } = req.query;
    page = page ? page : 1;
    const cmtproduct = await ProductModel.findById(id);
    return res.json({
      listComment: cmtproduct.comment,
      totalPage: parseInt(cmtproduct.comment.length / 10) + 1,
      commentPerPage:
        page == 1
          ? cmtproduct.comment.length < 10
            ? cmtproduct.comment.length
            : 10
          : cmtproduct.comment.length < page * 10
          ? cmtproduct.comment.length - 10 * (page - 1)
          : 10,
      totalComment: cmtproduct.comment.length,
    });
  },
};
