const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		{return res
			.status(400)
			.json({ message: "Username and password is required" })}

	//check user exists
	const foundUser = await User.findOne({username: user});
	if (!foundUser) return res.sendStatus(401);

	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
        const roles = Object.values(foundUser.roles);
		///create JWTS
		const accessToken = jwt.sign(
			{
			UserInfo:{
				username: user,
				roles:roles
			} },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "60s" }
		);

		const refreshToken = jwt.sign(
			{ username: user },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);
		//update the refreshToken in database
	    //const result = await User.updateOne({username : foundUser.username},{refreshToken });
		
		foundUser.refreshToken = refreshToken;
		const result = await foundUser.save();
		console.log(result);
		
		res.cookie("jwt", refreshToken,{httpOnly:true, sameSite:'None', /*secure:true, */ maxAge:24*60*60*1000});// 1 day max age
		res.json({accessToken});

	} else {
		res.sendStatus(401);
	}
};

module.exports = { handleLogin };
