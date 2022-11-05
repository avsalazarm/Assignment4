/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Astrid Salazar Student ID: 159580182 Date: November 4th, 2022
*
*  Online (Cyclic) Link: https://kind-gray-scarab-hat.cyclic.app
*
********************************************************************************/ 
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const express = require ("express");
const path = require("path");
const data = require('./blog-service.js');
const app = express();
const exphbs = require('express-handlebars');
const stripjs = require('strip-js');

const HTTP_PORT = process.env.PORT || 8080;


// Handlebars app engine config
app.engine('.hbs', exphbs.engine({
  extname: '.hbs',
  helpers: {
    navLink: function (url, options) {
      return '<li' +
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
    safeHTML: function (context) {
      return stripjs(context);
    }
  }
}));

app.set('view engine', '.hbs');

cloudinary.config({
  cloud_name: 'Cloud Name',
  api_key: 'API Key',
  api_secret: 'API Secret',
  secure: true
});

const upload = multer(); // no { storage: storage } 

app.use(express.static('public')); 

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}


/*This will add the property "activeRoute" to "app.locals" whenever the route changes, 
ie: if our route is "/blog/5", the app.locals.activeRoute value will be "/blog ".*/
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});


app.get("/", function(req,res){
  res.redirect('/blog');
});

app.get("/about", function(req, res){
   res.render("about.hbs",{about:data})
});

app.get("/posts", (req, res) => {
  if (req.query.hasOwnProperty('category')) {
    data.getPostsByCategory(req.query.category).then((data) => {
      res.render('posts', { posts: data });
    }).catch((err) => {
      res.render("posts", { message: "no results" });
    });
  } else if (req.query.hasOwnProperty('minDate')) {
    data.getPostsByMinDate(req.query.minDate).then((data) => {
      res.render('posts', { posts: data });
    }).catch((err) => {
      res.render("posts", { message: "no results" });
    });
  } else {
    data.getAllPosts()
      .then((data) => {
        res.render('posts', { posts: data });
      })
      .catch((err) => {
        res.render("posts", { message: "no results" });
      });
  }
});

//new function so the user can access the form and add a new post
app.get("/posts/add", function(req, res){
  res.render("addPost.hbs",{addPost:data})
});

//controls what happens to the data after the user inputs something
app.post("/posts/add",upload.single("featureImage"),(req, res)=>{
  if(req.file){
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                  resolve(result);
              } else {
                  reject(error);
              }
            }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};

async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
}

upload(req).then((uploaded)=>{
    processPost(uploaded.url);
  });
}else{
  processPost("");
}

function processPost(imageUrl){
    req.body.featureImage = imageUrl;
    data.addPost(req.body).then(post=>{
      res.redirect("/posts");
    }).catch(err=>{
      res.status(500).send(err);
    })
  }
});
 
app.get("/posts:category", function(req, res){
  data.getPostsByCategory(req.params.id).then(data=>{
    res.json(data);
  }).catch(err=>{
      res.json({message: err});
  });
});

app.get("/posts:minDate", function(req, res){
  data.getPostsByMinDate(req.params.id).then(data=>{
    res.json(data);
  }).catch(err=>{
      res.json({message: err});
  });
});


app.get("/posts/:id", (req, res)=>{
  data.getPostById(req.params.id).then(data=>{
    res.json(data);
  }).catch(err=>{
      res.json({message: err});
  });
});
app.get("/blog", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};

  // declare empty array to hold "post" objects
  let posts = [];

  // if there's a "category" query, filter the returned posts by category
  if (req.query.category) {
    // Obtain the published "posts" by category
    data.getPublishedPostsByCategory(Number(req.query.category)).then((data) => {
      data.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      viewData.posts = data;
      viewData.post = data[0];
    }).catch((err) => {
      viewData.message = "no results";
    });
  } else {
    // Obtain the published "posts"
    data.getPublishedPosts().then((data) => {
      data.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
      viewData.posts = data;
      viewData.post = data[0];
    }).catch((err) => {
      viewData.message = "no results";
    });
  }

  // sort the published posts by postDate
  posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));

  // Obtain the full list of "categories"
  data.getCategories().then((data) => {
    viewData.categories = data;
  }).catch((err) => {
    viewData.categoriesMessage = "no results";
  });

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData })

});


app.get('/blog/:id', async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};
  try{
      // declare empty array to hold "post" objects
      let posts = [];
      // if there's a "category" query, filter the returned posts by category
      if(req.query.category){
          // Obtain the published "posts" by category
          posts = await data.getPublishedPostsByCategory(req.query.category);
      }else{
          // Obtain the published "posts"
          posts = await data.getPublishedPosts();
      }
      // sort the published posts by postDate
      posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
      // store the "posts" and "post" data in the viewData object (to be passed to the view)
      viewData.posts = posts;
  }catch(err){
      viewData.message = "no results";
  }
  try{
      // Obtain the post by "id"
      viewData.post = await data.getPostById(req.params.id);
  }catch(err){
      viewData.message = "no results"; 
  }
  try{
      // Obtain the full list of "categories"
      let categories = await data.getCategories();
      // store the "categories" data in the viewData object (to be passed to the view)
      viewData.categories = categories;
  }catch(err){
      viewData.categoriesMessage = "no results"
  }
  // render the "blog" view with all of the data (viewData)
  res.render("blog", {data: viewData})
});


app.get("/categories", (req, res) => {
  data.getCategories().then((data) => {
      res.render("categories", { categories: data });
    })
    .catch((err) => {
      res.render("categories", { message: "no results" });
    });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

data.initialize().then(function(){
  app.listen(HTTP_PORT, onHttpStart);
}).catch(function(err){
    console.log("Unable to start server: " + err);
})

