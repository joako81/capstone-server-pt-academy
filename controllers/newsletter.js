// newsletter.js

const Newsletter = require("../models/newsletter");

// Functions

function suscribeEmail(req, res) {
  if (req.body) {
    const { firstname, lastname, email } = req.body;

    if (!email) {
      res.status(400).send({ msg: "Email Obligatorio" });
    } else if (!firstname || !lastname) {
      res.status(400).send({ msg: "Nombre y apellido obligatorios" });
    } else {
      const uppercaseFirstname = firstname.toUpperCase();
      const uppercaseLastname = lastname.toUpperCase();

      const newsletter = new Newsletter({
        firstname: uppercaseFirstname,
        lastname: uppercaseLastname,
        email: email.toLowerCase(),
      });

      newsletter.save((error) => {
        if (error) {
          res.status(400).send({ msg: "El email ya está registrado" });
        } else {
          res
            .status(200)
            .send({ msg: "Se han registrado correctamente tus datos" });
        }
      });
    }
  } else {
    res.status(400).send({ msg: "Objeto req.body no definido" });
  }
}

function getEmails(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  Newsletter.paginate({}, options, (error, emailsStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al obtener los emails" });
    } else {
      res.status(200).send(emailsStored);
    }
  });
}

function deleteEmail(req, res) {
  const { id } = req.params;
  Newsletter.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el registro" });
    } else {
      res.status(200).send({ msg: "Registro eliminado correctamente" });
    }
  });
}

module.exports = {
  suscribeEmail,
  getEmails,
  deleteEmail,
};
