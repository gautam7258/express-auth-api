const usersDb = {
	users: require("../models/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		{return res
			.status(400)
			.json({ message: "Username and password is required" })}

	//check user exists
	const foundUser = usersDb.users.find((u) => u.username === user);
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

		const otherUsers = usersDb.users.filter(
			(u) => u.username !== foundUser.username
		);

		const currentUser = { ...foundUser, refreshToken };
		usersDb.setUsers([...otherUsers, currentUser]);

		await fsPromises.writeFile(
			path.join(__dirname, "..", "models", "users.json"),
			JSON.stringify(usersDb.users)
		);
       
		res.cookie("jwt", refreshToken,{httpOnly:true, sameSite:'None', maxAge:24*60*60*1000});// 1 day max age
		res.json({accessToken});

	} else {
		res.sendStatus(401);
	}
};

module.exports = { handleLogin };
