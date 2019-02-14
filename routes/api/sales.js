const express = require("express");
const router = express.Router();
const Sales = require("./../../models/Sales");
const Counter = require("./../../models/Counter");
const Order = require("./../../models/Order");
const isEmpty = require("./../../validators/is-empty");
const moment = require("moment-timezone");
const numberFormat = require("./../../utils/numberFormat");
const sumBy = require("lodash/sumBy");

const net = require("net");
const HOST = process.env.PRINTER_HOST;
const PORT = process.env.PRINTER_PORT;
const client = new net.Socket();

client.on("error", err => {
  console.log("Unable to Connect");
});

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
        printSale(Sale);
        return res.json({ success: 1 });
      })
      .catch(err => console.log(err));
  });
});

const printSale = sale => {
  client.connect(PORT, HOST, () => {
    client.write("\x1b\x40");
    client.write("\x1b\x61\x01");
    client.write("WALAWAD'S HYPERMART\n");
    client.write("Owned & Operated By: WALAWAD CORP\n");
    client.write("BRGY.17, BACOLOD CITY\n");
    client.write("VAT REG TIN: 4444-444-444-444\n");
    client.write("MIN: 123456789012345\n");
    client.write("PTU: FP123455-1234-123456-000000\n");
    client.write("SN: LGZ123455\n");
    client.write("MACHINE: 001\n\n");

    client.write("\x1b\x61\x00");
    client.write(`Time : ${moment(sale.datetime).format("LLLL")}\n`);
    client.write(`SI# : ${sale.or_no.toString().padStart(8, "0")}\n`);
    client.write("-".repeat(40));

    client.write("\x1b\x61\x00");

    sale.items.forEach(item => {
      client.write(
        `${item.product.name}\x0d\x1b\x61\x02${numberFormat(
          item.amount
        )}\n\x1b\x61\x00`
      );
      if (item.quantity > 1) {
        client.write(
          `${item.quantity} @ ${numberFormat(item.product.price)}\n`
        );
      }
    });

    client.write("-".repeat(40));

    client.write(
      `AMOUNT DUE\x0d\x1b\x61\x02${numberFormat(
        sumBy(sale.items, o => o.amount)
      )}\n\x1b\x61\x00`
    );
    client.write(
      `CASH TENDERED\x0d\x1b\x61\x02${numberFormat(
        sale.payment_amount
      )}\n\x1b\x61\x00`
    );

    client.write(
      `CHANGE \x0d\x1b\x61\x02\x1b\x21\x1c${numberFormat(
        sale.change
      )}\n\n\x1b\x61\x00`
    );

    client.write("\x1b\x40");
    client.write("\x1b\x61\x01");
    client.write("OFFICIAL RECEIPT\n");
    client.write("THANK YOU COME AGAIN\n");
    client.write("MSALVIO TECHNOLOGIES\n");
    client.write("Brgy. Taculing, Bacolod City\n");
    client.write("ACC# 123-123451234123-123412 2/14/2019\n");
    client.write(
      "This receipt shall be valid for five\nyears from the date of the permit\n"
    );

    client.write("\x1b\x40");
    client.write("\x1b\x61\x00");

    client.write("\n\n\n\n\n\n");
    client.destroy();
  });
};
module.exports = router;
