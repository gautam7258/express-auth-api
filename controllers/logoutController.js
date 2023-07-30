const usersDb = {
	users: require("../models/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
	// On client also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	//check refreshToken exists in db
	const foundUser = usersDb.users.find((u) => u.refreshToken === refreshToken);
	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", });
		return res.sendStatus(204);
	}
	//delete refreshToken

	const otherUsers = usersDb.users.filter(
		(u) => u.refreshToken !== refreshToken
	);
	const currentUser = { ...foundUser, refreshToken: "" };
	usersDb.setUsers([...otherUsers, currentUser]);
	await fsPromises.writeFile(
		path.join(__dirname, "..", "models", "users.json"),
		JSON.stringify(usersDb.users)
	);
	res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // secure:true only allows https
	res.sendStatus(204);
};

module.exports = { handleLogout };
