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

module.exports.getCategories = function() {
    return new Promise((resolve, reject)=>{
        if(categories.length == 0){
            reject("File is empty, no posts displayed");
        }else{
            resolve(categories);
        }
    });
}