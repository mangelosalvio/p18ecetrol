require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const path = require("path");
const net = require("net");

//passport middleare
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

const db = require("./config/keys").mongoURI;

//routes
const users = require("./routes/api/users");
const products = require("./routes/api/products");
const orders = require("./routes/api/orders");
const sales = require("./routes/api/sales");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/sales", sales);
app.use("/api/orders", orders);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.SERVER_PORT || 5000;
const tcp_port = process.env.TCP_PORT || 1337;
const cashier_tcp_port = process.env.CASHIER_TCP_PORT || 1338;

const server = net.createServer(socket => {
  console.log(
    "Client connect. Client local address : " +
      socket.localAddress +
      ":" +
      socket.localPort +
      ". socket remote address : " +
      socket.remoteAddress +
      ":" +
      socket.remotePort
  );
});

const cashier_server = net.createServer(socket => {
  console.log(
    "Client connect. Client local address : " +
      socket.localAddress +
      ":" +
      socket.localPort +
      ". socket remote address : " +
      socket.remoteAddress +
      ":" +
      socket.remotePort
  );
});

server.listen(process.env.TCP_PORT, () => {
  console.log(`TCP SERVER RUNNING ON PORT ${tcp_port}`);
});

cashier_server.listen(process.env.CASHIER_TCP_PORT, () => {
  console.log(`CASHIER TCP SERVER RUNNING ON PORT ${cashier_tcp_port}`);
});

let sockets = [];
let cashier_sockets = [];

server.on("connection", socket => {
  sockets.push(socket);

  socket.on("close", data => {
    console.log(
      `Closing connection of ${socket.remoteAddress} of port ${
        socket.remotePort
      }`
    );
    /* const index = sockets.indexOf(socket);
    sockets = sockets.splice(index, 1); */
    sockets = [];
  });

  socket.on("error", err => {
    console.log(
      `Error on connection in ${socket.remoteAddress} of port ${
        socket.remotePort
      }`
    );

    /* const index = sockets.indexOf(socket);
    sockets = sockets.splice(index, 1); */

    sockets = [];
  });
});

cashier_server.on("connection", socket => {
  cashier_sockets.push(socket);

  socket.on("close", data => {
    console.log(
      `Closing connection of ${socket.remoteAddress} of port ${
        socket.remotePort
      }`
    );

    cashier_sockets = [];
  });

  socket.on("error", err => {
    console.log(
      `Error on connection in ${socket.remoteAddress} of port ${
        socket.remotePort
      }`
    );

    cashier_sockets = [];
  });
});

app.get("/weight", (req, res) => {
  getWeight().then(object => res.json(object));
});

app.get("/scan-trolley-card", (req, res) => {
  scanTrolleyCard().then(object => res.json(object));
});

app.get("/scan-cashier-trolley-card", (req, res) => {
  scanCashierTrolleyCard().then(object => res.json(object));
});

const getWeight = () => {
  return new Promise((resolve, reject) => {
    sockets.forEach(socket => {
      socket.write("w");
      socket.on("data", data => {
        strData = data.toString().replace(/\'/g, '"');
        object = JSON.parse(strData);
        resolve(object);
      });
    });
  });
};

const scanTrolleyCard = () => {
  return new Promise((resolve, reject) => {
    sockets.forEach(socket => {
      socket.write("tc");
      socket.on("data", data => {
        strData = data.toString().replace(/\'/g, '"');
        object = JSON.parse(strData);
        resolve(object);
      });
    });
  });
};

const scanCashierTrolleyCard = () => {
  return new Promise((resolve, reject) => {
    cashier_sockets.forEach(socket => {
      socket.write("tc");
      socket.on("data", data => {
        strData = data.toString().replace(/\'/g, '"');
        object = JSON.parse(strData);
        resolve(object);
      });
    });
  });
};

app.listen(port, () => console.log(`Server running on PORT ${port}`));
