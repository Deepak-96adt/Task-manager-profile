import express from "express";
var route = express.Router();

import * as userController from "../controller/user.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

route.post("/register", userController.register);
route.post("/login", userController.login);
route.get("/fetch", authenticateToken, userController.fetch);
route.patch("/update", authenticateToken, userController.update);
route.delete("/delete", authenticateToken, userController.deleteUser);

export default route;