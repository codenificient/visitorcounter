const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

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
app.use(express.json());

// Get request to app root
app.get("/api", async function (req, res) {
  // Storing the records from the Visitor table
  let visitors = await Visitor.findOne({ name: "tioyedev" });

  // If the app is being visited first
  // time, so no records
  if (visitors == null) {
    // Creating a new default record
    const beginCount = new Visitor({
      name: "tioyedev",
      count: 1,
    });

    // Saving in the database
    beginCount.save();

    // Sending thee count of visitor to the browser
    res.sendStatus(200).json({ success: true, count: 1 });

    // Logging when the app is visited first time
    console.log("First visitor arrived");
  } else {
    // Incrementing the count of visitor by 1
    visitors.count += 1;

    // Saving to the database
    visitors.save();

    // Sending thee count of visitor to the browser
    res.sendStatus(200).json({ success: true, count: visitors.count });

    // Logging the visitor count in the console
    console.log("New visitor arrived: ", visitors.count);
  }
});

app.get("/api/new/:name", async function (req, res) {
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

// Creating server to listen at localhost 3000
app.listen(PORT, function (req, res) {
  // Logging when the server has started
  console.log("listening to server " + PORT);
});

module.exports = app;
