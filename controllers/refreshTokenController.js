const usersDb = {
	users: require("../models/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};

const jwt = require("jsonwebtoken");


const handleRefreshToken = (req, res) => {
	const cookies = req.cookies;
	//Check if cookies and jwt exists
	
	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	//check user exists
	const foundUser = usersDb.users.find((u) => u.refreshToken === refreshToken);
	if (!foundUser) return res.sendStatus(403); //Forbidden

	// evaluate jwt
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.username !== decoded.username)
			return res.sendStatus(403);
		const roles = Object.values(foundUser.roles);
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: decoded.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "60s" }
		);
		res.json({ accessToken });
	});
};

module.exports = { handleRefreshToken };
