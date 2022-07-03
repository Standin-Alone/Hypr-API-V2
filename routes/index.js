
const path = require('path');
const { readdir } = require('fs');

// MODULAR 
module.exports = function(app){

    readdir(
        path.resolve(__dirname,'../Modules'),
        (err, files) => {
          if (err) throw err;
            
          for (let file of files) {
            
            readdir(
                path.resolve(__dirname,`../Modules/${file}`),
                (err, subFolders) => {
                    for(let subFolder of subFolders)                    
                        app.use('',require(`../modules/${file}/${subFolder}/route`));            
            })
            
        
          }
        }
      );
}