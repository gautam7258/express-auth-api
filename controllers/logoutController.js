const User = require("../models/User");


const handleLogout = async (req, res) => {
	// On client also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	//check refreshToken exists in db
	const foundUser = await User.findOne({refreshToken}).exec();
	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", });
		return res.sendStatus(204);
	}
	//delete refreshToken in database
    //const result = await User.updateOne({username : foundUser.username},{refreshToken:""});
	 foundUser.refreshToken = '';
	 const result = await foundUser.save();
	 console.log(result);

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None" }); // secure:true only allows https
	res.sendStatus(204);
};

module.exports = { handleLogout };
