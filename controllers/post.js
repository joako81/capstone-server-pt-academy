const Post = require("../models/post");
const image = require("../utils/image");

//Functions

function createPost(req, res) {
  const post = new Post(req.body);
  post.created_at = new Date();

  const imagePath = image.getFilePath(req.files.miniature);
  post.miniature = imagePath;

  post.save((error, postStored) => {
    if (error) {
      res.status(400).send({ msg: "El post no se pudo crear correctamente" });
    } else {
      res.status(201).send(postStored);
    }
  });
}

function getPosts(req, res) {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { created_at: "desc" },
  };

  Post.paginate({}, options, (error, postsStored) => {
    if (error) {
      res.status(400).send({ msg: "El post no se pudo obtener" });
    } else {
      res.status(200).send(postsStored);
    }
  });
}

function updatePost(req, res) {
  const { id } = req.params;
  const postData = req.body;

  if (req.files.miniature) {
    const imagePath = image.getFilePath(req.files.miniature);
    postData.miniature = imagePath;
  }
  Post.findByIdAndUpdate({ _id: id }, postData, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar el post" });
    } else {
      res.status(200).send({ msg: "Actualizado con exito" });
    }
  });
}

function deletePost(req, res) {
  const { id } = req.params;
  Post.findByIdAndDelete(id, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al eliminar el Post" });
    } else {
      res.status(200).send({ msg: "Eliminado correctamente" });
    }
  });
}

function getPost(req, res) {
  const { path } = req.params;

  Post.findOne({ path }, (error, postStored) => {
    if (error) {
      res.status(500).send({ msg: "Error del servidor" });
    } else if (!postStored) {
      res.status(400).send({ msg: "El post no existe" });
    } else {
      res.status(200).send(postStored);
    }
  });
}

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPost,
};
