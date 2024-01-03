const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config.db");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = require("../routes/user.routes");

    //Conectar a base de datos
    this.database();

    //Middlewares
    this.middlewares();

    //Rutas
    this.routes();
  }

  async database() {
    await dbConnection();
  }

  middlewares() {
    //cors
    this.app.use(cors());
    //Lectura y parseo del body
    this.app.use(express.json());
    //Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use("/api/users", this.usersPath);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }
}
module.exports = Server;
