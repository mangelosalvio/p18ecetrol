const express = require("express");
const router = express.Router();
const Order = require("./../../models/Order");
const isEmpty = require("./../../validators/is-empty");
const moment = require("moment-timezone");
const numberFormat = require("./../../utils/numberFormat");

router.get("/:id", (req, res) => {
  Order.findOne(
    {
      uid: req.params.id
    },
    {},
    {
      sort: {
        _id: -1
      }
    }
  )
    .then(order => {
      if (order === null) {
        return res.status(401).json({ error: 1 });
      }
      return res.json(order);
    })
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
  const newOrder = new Order({
    datetime: moment.tz("Asia/Manila").valueOf(),
    items: req.body.items,
    uid: req.body.uid
  });

  newOrder
    .save()
    .then(Sale => {
      return res.json({ success: 1 });
    })
    .catch(err => console.log(err));
});

const printSale = sale => {
  client.connect(
    PORT,
    HOST,
    () => {
      client.write(`Time : ${moment(sale.datetime).format("LLLL")}\n`);
      client.write(`Table # : ${sale.table.name}\n`);
      client.write(`${"-".repeat(37)}\n`);
      sale.orders.forEach(order => {
        client.write(
          `${order.product.name.padEnd(27)}${numberFormat(
            order.amount
          ).padStart(10)}\n`
        );
        if (order.quantity > 1) {
          client.write(`${order.quantity} @ ${numberFormat(order.price)}\n`);
        }
      });

      client.write(`${"-".repeat(37)}\n`);
      if (sale.summary.is_sc === 1) {
        client.write(
          `${"LESS VAT".padStart(27)}${numberFormat(
            sale.summary.less_vat
          ).padStart(10)}\n`
        );
        client.write(
          `${"LESS SC DISC".padStart(27)}${numberFormat(
            sale.summary.less_sc_disc
          ).padStart(10)}\n`
        );
      }

      if (sale.summary.discount_rate > 0) {
        client.write(
          `${"LESS DISC".padStart(27)}${numberFormat(
            sale.summary.less_disc
          ).padStart(10)}\n`
        );
      }
      client.write(
        `${"AMOUNT DUE".padStart(27)}${numberFormat(
          sale.summary.amount_due
        ).padStart(10)}\n\n`
      );

      client.write(
        `${"CHANGE".padStart(27)}${sale.summary.change.padStart(10)}\n`
      );
      client.write("\n\n\n\n\n\n");

      client.destroy();
    }
  );
};

module.exports = router;
