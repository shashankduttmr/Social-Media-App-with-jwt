const mongoose = require('mongoose')

const {Schema} = mongoose

const CommentSchema = new Schema({
    rating:{
        type:Number,
        required:[true],
        min:[1],
        max:[5]
    },
    body:{
        type:String,
        required:[true]
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Comment', CommentSchema)