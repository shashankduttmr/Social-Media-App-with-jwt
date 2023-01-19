const mongoose = require('mongoose')

module.exports.connect = function(){
    mongoose.set('strictQuery', true)
    mongoose.connect(process.env.dburl)
        .then(function(){
            console.log('Connected to DB');
        })
        .catch(function(){
            console.log('Connection is failed');
            process.exit(1)
        })   
}