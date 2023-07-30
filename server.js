require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const {logger} = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/mongoDB");

const PORT = process.env.PORT || 3000;


///connect to mongoDB
connectDB(process.env.DATABASE_URI);

// custom middleware logger
app.use(logger)

//handle access credentials check before cors!
//fetch cookies requirement
//Access-Control-Allow-Credentials
app.use(credentials)

// Cross-Origin resouse sharing
app.use(cors(corsOptions))

//builtin middlewares for url encoded form-data 
app.use(express.urlencoded({ extended: false }))

// builtin middleware for json
app.use(express.json());

//cookie parser to make and delete JWT cookies
app.use(cookieParser())

//server static files 
app.use(express.static(path.join(__dirname, "/public",)))

//use mvc-pattern routing
app.use('/', require('./routes/root'))
app.use("/register", require("./routes/register"))
app.use("/auth", require("./routes/auth"))
app.use("/refresh", require("./routes/refresh"))
app.use("/logout", require("./routes/logout"))

//protected rotues requires JWT
app.use(verifyJWT)
app.use("/employees", require("./routes/api/employees"))

//Error handling if not route is matched
app.all('*', (req,res)=>{
	res.status(404);
	if(req.accepts('html')){
		res.sendFile(path.join(__dirname, "views","404.html"));
		
	}
	else if(req.accepts('json')){
		res.json({error:"404 Not Found"})
	}else {
		res.type("txt").send("404 Not Found");
	}
}
)
app.use(errorHandler)

//check if mongoDB is connected only then start the server
mongoose.connection.once("open", ()=>{
	console.log(`Connected to MongoDB @${process.env.DATABASE_URI}`)
	app.listen(PORT, () => {
		console.log(`Server is running at Port:${PORT}`);
	})
})


