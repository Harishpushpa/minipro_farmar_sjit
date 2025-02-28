const { default: mongoose } = require('mongoose')


const Userschema= new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, required: true, enum: ["Farmer", "Middleman"] }, // Role validation
  });

module.exports=mongoose.model("Users",Userschema);
