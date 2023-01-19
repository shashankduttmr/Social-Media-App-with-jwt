const mongoose = require('mongoose')

const {Schema} = mongoose

const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    firstname:{
        type:String,
        required:[true]
    },
    lastname:{
        type:String,
        required:[true]
    },
    email:{
        type:String,
        required:[true]
    },
    username:{
        type:String,
        required:[true]
    },
    password:{
        type:String,
        required:[true]
    },
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
})

UserSchema.pre('save', async function(){
    const hash = await bcrypt.hash(this.password, 10)
    
    this.password = hash
})

module.exports = mongoose.model('User', UserSchema)