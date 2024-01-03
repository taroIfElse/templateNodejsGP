const { Router } = require("express");
const { validarJWT } = require("../middlewares/auth");
const {
  usersGet,
  usersPost,
  usersPatch,
  usersDelete,
  usersPut,
  login,
} = require("../controllers/users.controller");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validarCampos");
const {
  esRoleValido,
  existeEmail,
  existeUsuarioPorId,
} = require("../helpers/dbValidators");

const router = Router();

// Ruta para el login
router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").notEmpty(),
    validarCampos,
  ],
  login
);

// Rutas protegidas con validación de JWT
router.use(validarJWT);

// Rutas CRUD de usuarios
router.get("/", usersGet);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check(
      "password",
      "El password es obligatorio y debe tener al menos 6 caracteres"
    )
      .notEmpty()
      .isLength({ min: 6 }),
    check("correo").custom(existeEmail),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usersPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usersPut
);

router.patch("/", usersPatch);

router.delete(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usersDelete
);

module.exports = router;
