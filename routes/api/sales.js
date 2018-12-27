const express = require("express");
const router = express.Router();
const Sales = require("./../../models/Sales");
const Counter = require("./../../models/Counter");
const Order = require("./../../models/Order");
const isEmpty = require("./../../validators/is-empty");
const moment = require("moment-timezone");
const numberFormat = require("./../../utils/numberFormat");

router.get("/:id", (req, res) => {
  Sales.findById(req.params.id)
    .then(record => res.json(record))
    .catch(err => console.log(err));
});

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
  const form_data = isEmpty(req.query.s)
    ? {}
    : {
        or_no: req.query.s
      };

  Sales.find(form_data)
    .sort({ _id: -1 })
    .then(sales => {
      return res.json(sales);
    })
    .catch(err => console.log(err));
});

router.put("/", (req, res) => {
  Counter.increment("or_no").then(result => {
    const or_no = result.next;

    const newSale = new Sales({
      or_no,
      datetime: moment.tz("Asia/Manila").toDate(),
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
});

module.exports = router;
