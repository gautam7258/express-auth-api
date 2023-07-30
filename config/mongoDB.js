const mongoose = require("mongoose");

const connectDB = async (URI) => {
    try {
        await mongoose.connect(URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            
        });
    }catch(error){
        console.error(error)
    }
}

module.exports = connectDB;