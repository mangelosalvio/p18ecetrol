const express = require("express");
const router = express.Router();
const Sales = require("./../../models/Sales");
const Counter = require("./../../models/Counter");
const Order = require("./../../models/Order");
const isEmpty = require("./../../validators/is-empty");
const moment = require("moment-timezone");
const numberFormat = require("./../../utils/numberFormat");
const sumBy = require("lodash/sumBy");

/* const net = require("net");
const HOST = process.env.PRINTER_HOST;
const PORT = process.env.PRINTER_PORT;
const client = new net.Socket();

client.on("error", err => {
  console.log("Unable to Connect");
}); */

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

const printSale = sale => {
  client.connect(
    PORT,
    HOST,
    () => {
      client.write(`Time : ${moment(sale.datetime).format("LLLL")}\n`);
      client.write(`SI# : ${sale.or_no}\n`);
      client.write(`${"-".repeat(37)}\n`);
      sale.items.forEach(item => {
        client.write(
          `${item.product.name.padEnd(27)}${numberFormat(item.amount).padStart(
            10
          )}\n`
        );
        if (item.quantity > 1) {
          client.write(
            `${item.quantity} @ ${numberFormat(item.product.price)}\n`
          );
        }
      });

      client.write(`${"-".repeat(37)}\n`);

      client.write(
        `${"AMOUNT DUE".padStart(27)}${numberFormat(
          sumBy(sales.items, o => o.amount)
        ).padStart(10)}\n\n`
      );

      client.write(
        `${"CASH TENDERED".padStart(27)}${sale.payment_amount.padStart(10)}\n`
      );
      client.write(`${"CHANGE".padStart(27)}${sale.change.padStart(10)}\n`);
      client.write("\n\n\n\n\n\n");

      client.destroy();
    }
  );
};

module.exports = router;
