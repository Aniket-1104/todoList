import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//creating todoList database
mongoose.connect(
  "mongodb://localhost:27017/todolistDB",
  { useNewUrlParser: true }
);

const itemsSchema = new mongoose.Schema({
  name: String,
});

//creatring item and work collection in todoList that will follow itemsSchema
const Item = mongoose.model("Item", itemsSchema);
const Work = mongoose.model("Work", itemsSchema);

const item1 = new Item({
  name: "Welcome to your TodoList!",
});

const item2 = new Item({
  name: "Hit + button to add a new item",
});

const item3 = new Item({
  name: "Click the checkbox to delete an item",
});

const defaultItems = [item1, item2, item3];

//Today List

app.get("/", (req, res) => {
  Item.find()
    .then(function (foundItems) {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(function () {
            console.log("Data inserted Succesfully to DB");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else {
        res.render("index.ejs", {
          newListItems: foundItems,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  const itemName = req.body.item;
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  Item.deleteOne({
    _id: checkedItemId,
  })
    .then(function () {
      console.log("Item deleted");
      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
    });
});

//Work List

app.get("/work", (req, res) => {
  Work.find()
    .then(function (foundItems) {
      if (foundItems.length === 0) {
        Work.insertMany(defaultItems)
          .then(function () {
            console.log("Data inserted Succesfully to DB");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/work");
      } else {
        res.render("work.ejs", {
          newWorkItems: foundItems,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/work", (req, res) => {
  const workName = req.body.item;
  const work = new Work({
    name: workName,
  });
  work.save();
  res.redirect("/work");
});

app.post("/deleteWork", (req, res) => {
  const checkedItemId = req.body.checkbox;
  Work.deleteOne({
    _id: checkedItemId,
  })
    .then(function () {
      console.log("Item deleted");
      res.redirect("/work");
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
