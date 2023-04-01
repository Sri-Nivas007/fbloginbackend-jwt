const express = require("express");
const MongoDBConnect = require("./connections/mongodbconnect");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("../fbbackend/Router/router");

// const { generateToken, validateToken } = require("./auth/JWT");

dotenv.config();

const port =process.env.PORT || 4000;;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

MongoDBConnect()
  .then((res) => {
    app.listen(port);
    console.log("Connected to Port");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", router);

app.get("/", (req, res) => {
  res.send("api check");
});
