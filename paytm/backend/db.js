const mongoose=require("mongoose");
const zod=require("zod");
mongoose.connect("mongodb+srv://adarsh:Adarsh%4054321@cluster0.o25mqzc.mongodb.net/paytm");
// const UserSchema=mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     username:String,
//     password: String
// });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});
const User=mongoose.model("User",userSchema);


const accountSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true, 
    },
    balance:{
        type:Number,
        default:0
    }

})

const Account=mongoose.model("Account",accountSchema);

module.exports={User,Account}
 