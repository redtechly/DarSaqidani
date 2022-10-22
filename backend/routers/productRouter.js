import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 100;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
    const seller = req.query.seller || '';
    const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
          ? { price: -1 }
          : order === 'toprated'
            ? { rating: -1 }
            : { _id: -1 };
    const count = await Product.count({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .populate('seller', 'seller.name seller.logo')
      .sort({ updatedAt: - 1 })
    res.send({ products, page});
  })
);

productRouter.post(
  '/bot',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.body.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.body.category || '';
    const seller = req.body.seller || '';
    const isActive = true;
    

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const sellerFilter = seller ? { seller } : {};
    const categoryFilter = category ? { category: { $regex: category, $options: 'i' } } : {};
    const isActiveFilter = isActive ? { isActive } : {};
    const count = await Product.count({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
    
    });
    const products = await Product.find({
      ...sellerFilter,
      ...nameFilter,
      ...categoryFilter,
      ...isActiveFilter
    })
      .sort({ updatedAt: - 1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
      function manychatjson(json,cardnum=10) {
        if (cardnum>num || cardnum == 0)
            cardnum = num;
        //{if you want to edit} edit the num varibles to the length of the list you want to repart about
        var title = "name";
        var subtitle = "description";
        var image_url = "image";
        var price = "price";
        var num = json["products"].length,i;
        var manychat = {"version": "v2","content": {"messages": [],"actions": [],"quick_replies": [
          {
            "type": "node",
            "caption": "القائمة الرئيسية 🏡",
            "target": "Home"
          },
          {
            "type": "node",
            "caption": "رجوع",
            "target": "Back"
          },
          {
            "type": "node",
            "caption": "عرض السلة 🛒",
            "target": "Cart"
          }
        ]}};
        for (i = 0; i < Math.floor(num/cardnum); i++)   {
            manychat["content"]["messages"].push({"type": "cards","elements": [],"image_aspect_ratio": "horizontal"});
            for (let j = 0; j < cardnum; j++)   {
                /*edit each vaible the way you want it to display
                don't forget the other for loop*/
                var subtitle = json["products"][(i*cardnum)+j]["description"];
                var image_url = json["products"][(i*cardnum)+j]["image"];
                var xtitle = json["products"][(i*cardnum)+j][title];
                var xprice = json["products"][(i*cardnum)+j][price];
                var v = xtitle + " السعر "+ xprice + " دينار "

                manychat["content"]["messages"][i]["elements"].push({"title": v,"subtitle": subtitle,"image_url": image_url,"action_url": "https://manychat.com","buttons": [
                  {
                    "type": "node",
                    "caption": "أضف لسلة 🛒",
                    "target": "CollectData",
                    "actions": [
                      {
                        "action": "set_field_value",
                        "field_name": "ProductID",
                        "value": json["products"][(i * cardnum) + j]["_id"]
                      },
                      {
                        "action": "set_field_value",
                        "field_name": "ProductName",
                        "value": json["products"][(i * cardnum) + j]["name"]
                      },
                      {
                        "action": "set_field_value",
                        "field_name": "ImageUrl",
                        "value": json["products"][(i * cardnum) + j]["image"]
                      },
                      {
                        "action": "set_field_value",
                        "field_name": "ProductPrice",
                        "value": json["products"][(i * cardnum) + j]["price"]
                      }
                      
                    ]
                  }
                ]});
            }
        }
        if (num%cardnum > 0)   {
            manychat["content"]["messages"].push({"type": "cards","elements": [],"image_aspect_ratio": "horizontal"});
                for(let j = 0; j < num%cardnum; j++)    {
                    //this one
                    var subtitle = json["products"][(i*cardnum)+j]["description"];
                    var image_url = json["products"][(i*cardnum)+j]["image"];
                    var xtitle = json["products"][(i*cardnum)+j][title];
                    var xprice = json["products"][(i*cardnum)+j][price];
                    var v = xtitle + " السعر "+ xprice + " دينار "

                    manychat["content"]["messages"][i]["elements"].push({"title": v,"subtitle": subtitle,"image_url": image_url,"action_url": "https://manychat.com","buttons": [
                      {
                        "type": "node",
                        "caption": "أضف لسلة 🛒",
                        "target": "CollectData",
                        "actions": [
                          {
                            "action": "set_field_value",
                            "field_name": "ProductID",
                            "value": json["products"][(i * cardnum) + j]["_id"]
                          },
                          {
                            "action": "set_field_value",
                            "field_name": "ProductName",
                            "value": json["products"][(i * cardnum) + j]["name"]
                          },
                          {
                            "action": "set_field_value",
                            "field_name": "ImageUrl",
                            "value": json["products"][(i * cardnum) + j]["image"]
                          },
                          {
                            "action": "set_field_value",
                            "field_name": "ProductPrice",
                            "value": json["products"][(i * cardnum) + j]["price"]
                          }
                          
                        ]
                      }
                    ]});    
                }
        }
        return manychat;
    }

    res.send( manychatjson({products}) );
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
    const seller = await User.findOne({ isSeller: true });
    if (seller) {
      const products = data.products.map((product) => ({
        ...product,
        seller: seller._id,
      }));
      const createdProducts = await Product.insertMany(products);
      res.send({ createdProducts });
    } else {
      res
        .status(500)
        .send({ message: 'No seller found. first run /api/users/seed' });
    }
  })
);

productRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'seller.name seller.logo seller.rating seller.numReviews'
    );
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample name ' + Date.now(),
      seller: req.user._id,
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 1000,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    });
    const createdProduct = await product.save();
    res.send({ message: 'Product Created', product: createdProduct });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      product.isActive = req.body.isActive;
      const updatedProduct = await product.save();
      res.send({ message: 'Product Updated', product: updatedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deleteProduct = await product.remove();
      res.send({ message: 'Product Deleted', product: deleteProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
