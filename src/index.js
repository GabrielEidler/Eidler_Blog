//SETUP

const express = require("express"),
  methodOverride = require("method-override"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  expressSanitizer = require("express-sanitizer");

// APP CONFIG
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
mongoose.connect(
  "mongodb+srv://gabrieleidler:theceltichero159357@cluster0-nh3lc.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

//  MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

/*
  Blog.create({
    title: "Test Blog",
    image:
      "https://pixabay.com/get/51e9d4434e5bb108f5d084609620367d1c3ed9e04e50744e7d2b79d2924ecd_340.jpg",
    body: "HELLO, this is a BLOG Post!!"
  });
*/

//  RESTFULL ROUTES

app.get("/", (req, res) => {
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", (req, res) => {
  //sanitize deletes any <script> tag inside the body post:
  req.body.blog.body = req.sanitize(req.body.blog.body);
  // create blog
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render("new");
      //redirect to indext
    } else {
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
  //find blog
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
      //redirect to index
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
      //redirect to index
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//DESTROY ROUTE

app.delete("/blogs/:id", (req, res) => {
  //destroy blog
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen("8080", () => {
  console.log("server is on!");
});
