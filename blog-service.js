const fs = require("fs");

let categories = [];
let posts = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject) =>{
        fs.readFile('./data/posts.json', (err, data) =>{
            if(err){
                reject(err);
            }else{
                posts = JSON.parse(data);    
                
                //if one file opens correctly then request to read second file
                fs.readFile('./data/categories.json', (err, data) =>{
                    if(err){
                        reject(err);
                    }else{
                        categories = JSON.parse(data);
                        //if both files open correctly then resolve the promise
                        resolve();
                    }
                })
            }
        });
    });
}


module.exports.getAllPosts = function() {
    return new Promise((resolve, reject)=>{
        if(posts.length == 0){
            reject("File is empty, no posts displayed");
        }else{
            resolve(posts);
        }
    });

}

module.exports.getPublishedPosts = function() {
    return new Promise((resolve, reject)=>{
        var filteredPosts = [];
        for(let i = 0; i < posts.length; i++){
            if(posts[i].published == true){
                filteredPosts.push(posts[i]);
            }
        }

        if(filteredPosts == 0){
            reject("No published posts found");
        }else{
            resolve(filteredPosts);
        }
    });
}

module.exports.getPostsbyCategory = function(category){
    return new Promise((resolve,reject)=>{
        let filteredPosts = posts.filter(post=>post.category == category);

        if(filteredPosts.length == 0){
            reject("no results returned")
        }else{
            resolve(filteredPosts);
        }
    });
}

module.exports.getPostsByMinDate = function(minDateStr){
    return new Promise((resolve, reject) => {
        let filteredPosts = posts.filter(post => (new Date(post.postDate)) >= (new Date(minDateStr)))

        if (filteredPosts.length == 0) {
            reject("no results returned")
        } else {
            resolve(filteredPosts);
        }
    });
}

module.exports.getPostsbyId = function(id){
    return new Promise((resolve,reject)=>{
        let foundPost = posts.find(post => post.id == id);

        if(foundPost){
            resolve(foundPost);
        }else{
            reject("no result returned");
        }
    });
}

module.exports.getCategories = function() {
    return new Promise((resolve, reject)=>{
        if(categories.length == 0){
            reject("File is empty, no posts displayed");
        }else{
            resolve(categories);
        }
    });
}

module.exports.addPost = function(postData){
    return new Promise(function(resolve,reject){
        postData.id = posts.length + 1; //automatic creation of an id
        postData.published = (postData.published)? true: false; //if the box is checked it's set to true
        posts.push(postData); //will add the new post to the array
        date = new Date();
        postsData.postDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        postsData.push(post);

        resolve();
    });
};

module.exports.getPublishedPostsByCategory = function() {
    return new Promise((resolve, reject)=>{
        var filteredPosts = [];
        for(let i = 0; i < posts.length; i++){
            if(posts[i].published == true){
                filteredPosts.push(posts[i]);
            }
        }

        if(filteredPosts == 0){
            reject("No published posts found");
        }else{
            resolve(filteredPosts);
        }
    });
}

module.exports.getPublishedPosts = function(category) {
    return new Promise((resolve, reject)=>{
        var filteredPosts = [];
        for(let i = 0; i < posts.length; i++){
            if(posts[i].published == true && post.category == category){
                filteredPosts.push(posts[i]);
            }
        }

        if(filteredPosts == 0){
            reject("No published posts found");
        }else{
            resolve(filteredPosts);
        }
    });
}
