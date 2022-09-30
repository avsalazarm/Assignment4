/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Astrid Salazar Student ID: 159580182 Date: September 30th, 2022
*
*  Online (Cyclic) Link: https://dull-lime-sea-lion-kilt.cyclic.app
*
********************************************************************************/ 

var express = require ("express");
const path = require("path");
const data = require('./blog-service.js')
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

