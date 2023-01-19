const mongoose = require('mongoose')

const {Schema} = mongoose

const PostSchema = new Schema({
    imgs:[
        {
            url:String,
            filename:String
        }
    ],
    name:{
        type:String,
        required:[true]
    },
    description:{
        type:String,
        required:[true]
    },
    location:{
        type:String,
        required:[true]
    },
    geomatry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
          coordinates: {
            type: [Number],
            required: true
        }
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:'Like'
        }
    ],
    comments:[
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Post', PostSchema)