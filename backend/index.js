const express = require("express");
const connectDB = require("./db/db");
const colors = require("colors");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const mainRouter = require("./routes/index");

const app = express();

connectDB();

// middlewares
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(bodyParser.json());

app.use("/api/v1", mainRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`.yellow.bold);
});
