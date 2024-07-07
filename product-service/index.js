const express = require("express");
require('dotenv').config();
const app = express();
const productRoutes = require("./src/routes/productRoutes");
const db = require("./src/database/connection");
const PORT = process.env.PORT || 3000; // Provide a default port

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/products", productRoutes);

app.get('/', (req, res) => {
  res.status(200).send("Welcome to the Product Service");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Product service running on port : " + PORT);
    });
  })
  .catch((error) => {
    console.error(error);
  });
