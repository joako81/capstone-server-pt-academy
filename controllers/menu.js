const Menu = require("../models/menu");

async function createMenu(req, res) {
  const menu = new Menu(req.body);
  (menu.active = false),
    menu.save((error, menuStored) => {
      if (error) {
        res.status(400).send({ message: `Error al crear el menú ${error}` });
      } else {
        res.status(200).send(menuStored);
      }
    });
}

async function getMenus(req, res) {
  const { active } = req.query;
  let response = null;

  if (active === undefined) {
    response = await Menu.find().sort({ order: "asc" });
  } else {
    response = await Menu.find({ active }).sort({ order: "asc" });
  }

  if (!response) {
    res.status(400).send({ message: "no hay menus" });
  } else {
    res.status(200).send(response);
  }
}

async function upDateMenu(req, res) {
  const { id } = req.params;
  const menuData = req.body;
  Menu.findByIdAndUpdate({ _id: id }, menuData, (error) => {
    if (error) {
      res.status(400).send({ msg: "Error al actualizar menu" });
    } else {
      res.status(200).send({ msg: "Menu actualizado correctamente" });
    }
  });
}

async function deleteMenu(req, res) {
  const { id } = req.params;

  try {
    const menu = await Menu.findByIdAndDelete(id);
    if (!menu) {
      res.status(404).send({ msg: "Menú no encontrado" });
    } else {
      res.status(200).send({ msg: "El menú ha sido eliminado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Error al eliminar el menú" });
  }
}

module.exports = { createMenu, getMenus, upDateMenu, deleteMenu };
