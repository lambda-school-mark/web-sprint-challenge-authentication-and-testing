const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../users/user-model");
const constants = require("../config/constants");

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  const hash = bcrypt.hashSync(password);

  User.add({ username, password: hash })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "could not register" });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findBy({ username: username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = signToken(user);
        res
          .status(200)
          .json({ message: `${user.username}, you are logged in`, token });
      } else {
        res.status(401).json({ message: "invalid" });
      }
    })
    .catch((error) => {
      res.status(401).json({ message: "failed to login" });
    });
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, constants.jwtSecret, options);
}

module.exports = router;
