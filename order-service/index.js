const express = require("express");
require('dotenv').config();
const app = express();
const orderRoutes = require("./src/routes/orderRoutes");
const db = require("./src/database/connection");
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/orders", orderRoutes);

app.get('/', (req, res) => {
  res.status(200).send("Welcome to the Order Service");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Order service running on port : " + PORT);
    });
  })
  .catch((error) => {
    console.error(error);
  });
