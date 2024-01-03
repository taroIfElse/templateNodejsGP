const { request, response } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { validationResult } = require("express-validator");

const generarJWT = (uid) => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    const usuario = await User.findOne({ correo });

    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario o contraseña incorrectos",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario o contraseña incorrectos",
      });
    }

    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Login exitoso",
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al iniciar sesión, por favor, contacta al administrador",
    });
  }
};

const usersGet = async (req = request, res = response) => {
  // const query = req.query;
  const { limit = "", from = "" } = req.query;

  const [total, users] = await Promise.all([
    User.countDocuments(),
    User.find({ estado: true }).skip(from).limit(limit),
  ]);

  res.json({
    msg: "get API - controller",
    // total,
    // usuarios,
    total,
    users,
  });
};

const usersPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const user = new User({ nombre, correo, password, rol });

  //hash de contraseña
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);
  //guardar en la bd
  await user.save();
  res.json({
    msg: "post API - controller",
    user,
  });
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;

  const { _id, password, google, correo, ...resto } = req.body;

  //TODO: Validar contra DB
  if (password) {
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, resto);
  res.json({
    msg: "put API - controller",
    user,
  });
};

const usersPatch = (req = request, res = response) => {
  const { name, age } = req.body;
  res.json({
    msg: "patch API - controller",
    name,
    age,
  });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { estado: false });
  res.json({
    msg: "delete API - controller",
    user,
  });
};

module.exports = {
  login,
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
};
