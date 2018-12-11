const express = require("express");
const router = express.Router();
const Product = require("./../../models/Product");
const isEmpty = require("./../../validators/is-empty");
const filterId = require("./../../utils/filterId");

const validateProductInput = require("./../../validators/products");

router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then(record => res.json(record))
    .catch(err => console.log(err));
});

router.get("/", (req, res) => {
  const form_data = isEmpty(req.query)
    ? {}
    : {
        name: {
          $regex: "^" + req.query.s
        }
      };

  Product.find(form_data)
    .sort({ name: 1 })
    .then(categories => {
      return res.json(categories);
    })
    .catch(err => console.log(err));
});

router.put("/", (req, res) => {
  console.log(req.body);

  const { isValid, errors } = validateProductInput(req.body);

  if (!isValid) {
    return res.status(401).json(errors);
  }
  const body = filterId(req);

  Product.findOne({
    name: req.body.name
  }).then(product => {
    if (product) {
      errors["name"] = "Product already exists";
      return res.status(401).json(errors);
    } else {
      const newProduct = new Product({
        ...body
      });
      newProduct
        .save()
        .then(product => res.json(product))
        .catch(err => console.log(err));
    }
  });
});

router.post("/barcode", (req, res) => {
  Product.findOne({ barcode: req.body.barcode }).then(product => {
    if (product) {
      console.log(product);
      return res.json(product);
    }

    return res.status(401).json({ success: 0, msg: "Barcode not found" });
  });
});

router.post("/:id", (req, res) => {
  const { isValid, errors } = validateProductInput(req.body);

  if (!isValid) {
    return res.status(401).json(errors);
  }

  const body = filterId(req);

  Product.findById(req.params.id).then(product => {
    if (product) {
      product.set({
        ...body
      });

      product
        .save()
        .then(product => res.json(product))
        .catch(err => console.log(err));
    } else {
      console.log("ID not found");
    }
  });
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then(response => res.json({ success: 1 }))
    .catch(err => console.log(err));
});

module.exports = router;
