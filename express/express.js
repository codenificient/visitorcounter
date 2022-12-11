"use strict";
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const router = express.Router();

require("dotenv").config();

const PORT = process.env.PORT || 3001;

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
});

const visitorSchema = new mongoose.Schema({
  name: String,
  count: Number,
});

const Visitor = mongoose.model("Visitor", visitorSchema);

app.use(cors());

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

router.get("/new/:name", async function (req, res) {
  const newApp = req.params.name;
  let appName = await Visitor.findOne({ name: newApp });
  if (appName == null) {
    const beginCount = new Visitor({
      name: newApp,
      count: 1,
    });

    beginCount.save();
    res.sendStatus(200).json({ success: true, count: 1 });
  } else {
    appName.count += 1;

    // Saving to the database
    appName.save();

    // Sending thee count of visitor to the browser
    res.sendStatus(200).json({ success: true, count: appName.count });

    // Logging the visitor count in the console
    console.log("New visitor arrived: ", appName.count);
  }
});
router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
