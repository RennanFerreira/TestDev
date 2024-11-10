import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth'

const routes = new Router();
routes.post("/user", authMiddleware, UserController.store)
routes.get("/user", authMiddleware, UserController.getWithParameter)
routes.delete("/user/:id", authMiddleware, UserController.delete)
routes.put("/user/:id", authMiddleware, UserController.update)
routes.put("/user/password-reset/:id", authMiddleware, UserController.resetPassword)
routes.post("/session", SessionController.store) // rota de login
routes.get("/user/all", authMiddleware, UserController.index)
routes.get("/user/get-by-id/:id", authMiddleware, UserController.getById)
export default routes;