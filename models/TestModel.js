const { default: mongoose } = require("mongoose")

const myModelSchema = new mongoose.Schema({
    mystring:{
        type: String, 
        required: true,
        unique: true,
        trim: true
    } 
})
//Export the model
module.exports = mongoose.model("MyModel", myModelSchema);