const Role = require("../models/role");
const User = require("../models/user");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

const existeEmail = async (correo = "") => {
  //verificar si el correo existe
  const existeEmail = await User.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya está registrado en la BD`);
  }
};

const existeUsuarioPorId = async (id = "") => {
  //verificar si el correo existe
  const existeUsuario = await User.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe en la BD`);
  }
};

module.exports = { esRoleValido, existeEmail, existeUsuarioPorId };
