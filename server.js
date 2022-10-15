/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Astrid Salazar Student ID: 159580182 Date: September 30th, 2022
*
*  Online (Cyclic) Link: https://kind-gray-scarab-hat.cyclic.app
*
********************************************************************************/ 
const multer = require('multer');
const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const upload = multer(); // no { storage: storage } 

cloudinary.config({
  cloud_name: 'Cloud Name',
  api_key: 'API Key',
  api_secret: 'API Secret',
  secure: true
});

var express = require ("express");
const path = require("path");
const data = require('./blog-service.js');
const e = require('express');
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

app.use(express.static('public')); 

app.get("/", function(req,res){
  res.redirect('/about');
});

app.get("/about", function(req, res){
   res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/posts", function(req, res){
  data.getAllPosts().then((data)=>{
    res.json(data);
  });
});

//new function so the user can access the form and add a new post
app.get("/posts/add", function(req, res){
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
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
 
app.get("/posts?category", function(req, res){
  data.getPostsbyCategories(category).then((data)=>{
    res.json(data);
  });
});

app.get("/posts?minDate", function(req, res){
  data.getPostsByMinDate(minDateStr).then((data)=>{
    res.json(data);
  });
});


app.get("/posts/id", function(req, res){
  data.getPostById(id).then((data)=>{
    res.json(data);
  });
});



app.get("/blog", function(req, res){
  data.getPublishedPosts().then((data)=>{
    res.json(data);
  });
});

app.get("/categories", function(req, res){
  data.getCategories().then((data)=>{
    res.json(data);
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

