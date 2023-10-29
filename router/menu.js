const express = require("express");
const MenuController = require("../controllers/menu");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

// ENPOINT
api.post("/menu", [md_auth.asureAuth], MenuController.createMenu);
api.get("/menu", MenuController.getMenus);
api.patch("/menu/:id", [md_auth.asureAuth], MenuController.upDateMenu);
api.delete("/menu/:id", [md_auth.asureAuth], MenuController.deleteMenu);
module.exports = api;
