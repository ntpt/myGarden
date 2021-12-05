const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.editProfile = async (req, res) => {
  try {
    var userID = req.params.userID;
    const user = await User.findById(userID);
    var name = req.body.name != undefined ? req.body.name : user.name;
    var email = req.body.email != undefined ? req.body.email : user.email;
    var phone = req.body.phone != undefined ? req.body.phone : user.phone;
    var avatar = req.body.avatar != undefined ? req.body.avatar : user.avatar;

    const updateUser = await User.updateOne(
      { _id: userID },
      { $set: { name, email, phone, avatar } }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getProfile = async (req, res) => {
  var userID = req.params.userID;

  try {
    const user = await User.findById(userID).select(
      "name avatar email phone favoritePlant "
    );

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ msg: err });
  }
};

exports.login = async (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(401).json({ msg: "not-registered" });
    } else {
      // Match password
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          res.status(201).json({ user });
        } else {
          res.status(400).json(error);
        }
      });
    }
  });
};

exports.register = async (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      res.status(400).json({ msg: "existed" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              res.status(200).json(newUser);
            })
            .catch((error) => res.status(400).json(error));
        });
      });
    }
  });
};
