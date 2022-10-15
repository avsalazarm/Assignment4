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

module.exports.getPostsbyCategories = function(category){
    return new Promise(function(resolve,reject){
        var foundCategory = null;
        for(let i = 0; i < posts.length && !foundCategory; i++){
            if(posts[i].category==category){
                foundCategory = posts[i];
            }
        }
        if(!foundCategory){
            reject("Category does not exist - No data to be shown");
        }
        resolve(foundCategory);
    })
}

module.exports.getPostsByMinDate = function(minDateStr){
    return new Promise(function(resolve,reject){
        var foundDate = null;
        for(let i = 0; i < posts.length && !foundDate; i++){
            if(newDate(posts[i].postDate) >= newDate(minDateStr)){
                foundDate = posts[i];
            }
        }
        if(!foundDate){
            reject("Date does not exist - No data to be shown");
        }
        resolve(foundDate);
    })
}

module.exports.getPostsbyId = function(id){
    return new Promise(function(resolve,reject){
        var foundPost = null;
        for(let i = 0; i < posts.length && !foundPost; i++){
            if(posts[i].id==id){
                foundPost = posts[i];
            }
        }
        if(!foundPost){
            reject("ID does not exist - No data to be shown");
        }
        resolve(foundPost);
    })
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
        resolve();
    });
};