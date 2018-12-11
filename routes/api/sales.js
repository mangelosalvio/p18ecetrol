const express = require("express");
const router = express.Router();
const Sales = require("./../../models/Sales");
const Order = require("./../../models/Order");
const isEmpty = require("./../../validators/is-empty");
const moment = require("moment-timezone");
const numberFormat = require("./../../utils/numberFormat");

/* const net = require("net");
const HOST = "192.168.254.1";
const PORT = 9100;
const client = new net.Socket(); */

/* client.on("error", err => {
  console.log("Unable to Connect");
}); */

router.get("/invoices", (req, res) => {
  console.log(req.query);
  Sales.find({
    datetime: {
      $gte: req.query.startDate,
      $lte: req.query.endDate
    }
  })
    .then(sales => res.json(sales))
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

  Table.find(form_data)
    .then(table => {
      return res.json(table);
    })
    .catch(err => console.log(err));
});

router.put("/", (req, res) => {
  const newSale = new Sales({
    datetime: moment.tz("Asia/Manila").valueOf(),
    items: req.body.items,
    uid: req.body.uid,
    payment_amount: req.body.payment_amount,
    change: req.body.change
  });

  newSale
    .save()
    .then(Sale => {
      Order.deleteMany({ uid: req.body.uid })
        .then(() => {
          console.log("deleted successfully");
        })
        .catch(err => console.log(err));
      return res.json({ success: 1 });
    })
    .catch(err => console.log(err));
});

module.exports = router;
