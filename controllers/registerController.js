const User = require("../models/User")
const bcrypt = require("bcrypt");

const handleRegister = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res
			.status(400)
			.json({ message: "Username and password is required" });

	//duplicate check
	const duplicate = await User.findOne({username: user}).exec();
	if (duplicate) return res.sendStatus(409);

	try {
		//hashing password
		const hashedPassword = await bcrypt.hash(pwd, 12);

		//create and store
		const newUser = await User.create({
			username: user,
			password: hashedPassword,
		});
		console.log(newUser)
		res.status(201).json({ message: `New user ${user} is Created!`});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { handleRegister };
