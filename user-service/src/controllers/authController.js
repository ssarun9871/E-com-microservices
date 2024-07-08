const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SALT_ROUNDS, JWT_SECRET } = process.env;

exports.register = async (req, res) => {
  try {
    const { username, password, role} = req.body;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (user) return res.status(409).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, parseInt(SALT_ROUNDS));

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      role: role
    });

    res.status(201).json({ message: "User created", user_id: newUser.user_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.login = async (req, res) => {
    try{
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username:username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ user_id: user.user_id, role: user.role }, JWT_SECRET);
      
        res.status(200).json({ message: "success", token: token });
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error"});
    }

};
