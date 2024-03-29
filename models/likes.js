const mongoose = require('mongoose')

const {Schema} = mongoose

const LikeSchema = new Schema({
    Post:{
        type:Schema.Types.ObjectId,
        ref:'Post'
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Like', LikeSchema)