const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("../utils/jwt");

function register(req, res) {
  console.log(req.body);
  const { firstname, lastname, email, password } = req.body;
  if (!email) res.status(400).send({ msg: "El email es obligatorio" });

  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  const user = new User({
    firstname,
    lastname,
    email: email.toLowerCase(),
    /* password, */
    role: "user",
    active: "false",
  });

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  user.password = hashPassword;

  user.save((error, userStorage) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el usuario" });
    } else {
      res.status(200).send(userStorage);
    }
  });
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email) res.status(400).send({ msg: "El email es obligatorio" });

  if (!password) res.status(400).send({ msg: "La contraseña es obligatoria" });

  const emailLowerCase = email.toLowerCase();

  User.findOne({ email: emailLowerCase }, (error, userStore) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" });
    } else {
      bcrypt.compare(password, userStore.password, (bcryptError, check) => {
        if (bcryptError) {
          res.status(500).send({ msg: "Error del servidor" });
        } else if (!check) {
          res.status(400).send({ msg: "Contraseña incorrecta" });
        } else if (!userStore.active) {
          res.status(401).send({ msg: "Usuario no activado o no autorizado" });
        } else {
          res.status(200).send({
            access: jwt.createAccesToken(userStore),
            refress: jwt.createRefreshToken(userStore),
          });
        }
      });
    }
  });
}

function refreshAccesToken(req, res) {
  const { token } = req.body;
  if (!token) res.status(400).send({ msg: "token requerido" });

  try {
    const { user_id } = jwt.decode(token, JWT_SECRET_KEY, true);
    User.findOne({ _id: user_id }, (error, userStorage) => {
      if (error) {
        res.status(500).send({ msg: "Error del servidor" });
      } else {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
          if (err) {
            res
              .status(401)
              .send({
                msg: "Token caducado, por favor, ingresa tu contraseña nuevamente",
              });
          } else {
            res.status(200).send({
              accessToken: jwt.createAccesToken(userStorage),
            });
          }
        });
      }
    });
  } catch (err) {
    res.status(500).send({ msg: "Error del servidor" });
  }
}

module.exports = {
  register,
  login,
  refreshAccesToken,
};
