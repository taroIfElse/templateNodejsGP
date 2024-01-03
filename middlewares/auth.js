const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {
  // Solo aplicar validación JWT a métodos diferentes a GET
  if (req.method !== "GET") {
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({
        msg: "No hay token en la petición",
      });
    }

    try {
      const { uid } = jwt.verify(token, process.env.SECRET_KEY);
      req.uid = uid;

      next();
    } catch (error) {
      return res.status(401).json({
        msg: "Token no válido",
      });
    }
  } else {
    // Si es una solicitud GET, simplemente continuar con la ejecución sin validar JWT
    next();
  }
};

module.exports = {
  validarJWT,
};
