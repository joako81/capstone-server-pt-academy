const Course = require("../models/course");
const image = require("../utils/image");

//Functions
function createCourse(req, res) {
  const course = new Course({
    title: req.body.title,
    miniature: req.body.miniature,
    description: req.body.description,
    url: req.body.url,
    price: req.body.price,
    score: req.body.score,
    status: req.body.status,
    active: req.body.active,
    created_at: new Date(),
  });

  const imagePath = image.getFilePath(req.files.miniature);
  course.miniature = imagePath;

  course.save((error, courseStored) => {
    if (error) {
      res.status(400).send({ msg: "Error al crear el curso" });
    } else {
      res.status(201).send(courseStored);
    }
  });
}

function getCourses(req, res) {
  //paginado dinámico
  const { page = 1, limit = 10 } = req.query;

  // páginado dinámico
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { created_at: "desc" },
  };

  Course.paginate({}, options, (error, courses) => {
    if (error) {
      res.status(400).send("Hubo un error al obtener los cursos");
    } else {
      res.status(200).send(courses);
    }
  });
}

function updateCourse(req, res) {
  const { id } = req.params;
  const courseData = req.body;

  if (req.files.miniature) {
    const imagePath = image.getFilePath(req.files.miniature);
    courseData.miniature = imagePath;
  }

  Course.findByIdAndUpdate({ _id: id }, courseData, (error, courseUpdated) => {
    if (error) {
      res.status(400).send({ msg: "No se pudo actualizarse el curso" });
    } else {
      res.status(200).send({ msg: "Actualización correcta", courseUpdated });
    }
  });
}

function deleteCourse(req, res) {
  const { id } = req.params;

  Course.findByIdAndDelete(id, (error) => {
    if (error) {
      return res
        .status(400)
        .send({ msg: "No se ha podido eliminar el curso correctamente" });
    } else {
      res.status(200).send({ msg: "El curso ha sido eliminado correctamente" });
    }
  });
}

function getCourse(req, res) {
  const { url } = req.params;

  Course.findOne({ url }, (error, courseStored) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" });
    } else if (!courseStored) {
      res.status(404).send({ msg: "Curso no encontrado" });
    } else {
      res.status(200).send(courseStored);
    }
  });
}

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  getCourse,
};
