const express = require("express");
require('dotenv').config()
const app = express();
const authRoutes = require("./src/routes/authRoutes");
const db = require("./src/database/connection");
const PORT = process.env.PORT || 3000; // Provide a default port

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRoutes);

app.get('/', (req, res) => {
  res.status(200).send("Welcome to user service");
});

app.use((err, req, res,next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("User service running on port : " + PORT);
    });
  })
  .catch((error) => {
    console.error(error);
  });
