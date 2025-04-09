import mongoose, { model, Schema } from "mongoose";
import bcrypt from 'bcrypt'

// table stracture 
const userSchema = new Schema({

    name: {
        type: String,
        maxLength: [60, 'name should be in 60 latter'],
        minLength : [ 3 , "name must be 3 latter or more"] ,
        required: [true, 'name is reqired!'],
        trim: true   // "   som   "
    },
    email: {
        type: String,
        required: [true, 'email is reqired!'],
        unique: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 
            'Please provide a valid email address'
        ],
        trim: true
    },
    password: {
        type: String,
        minLength: [8, 'password must be 8 charecter or above'],
        required: [true, 'password is reqired!'],
        select: false 
    },
    profile_pic: {
        url: {
            type: String,
            default: 'https://res.cloudinary.com/dab0ekhmy/image/upload/v1728130610/thik-ai/gvjpvq3xljmnw2vwdkag.avif'
        },
        public_id: {
            type: String,
            default: null
        }
    }
    ,
    role: {
        type: String,
        enum: ['user' , 'admin'],
        default: 'user'
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    friendsRequest: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    sendFriendsRequest: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: null
    },
    otp: {
        type: Number
    },
    otpExpiary: {
        type: Date
    },
}, { timestamps: true })


// password hashing ...
userSchema.pre('save', async function(next) {

    // if password is  modified     
     // update password ( forget , reset) then password modified , 
     // if first time i create a user then 
    if (!this.isModified('password')) {
        return next();
    }
    try {
        // hashing password 
        this.password = await bcrypt.hash(this.password, 16)
        next()
    } catch (error) {
        return next(error)
    }
})


// create comparePassword function...
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password , this.password)
}

export const Users = model('user', userSchema)


