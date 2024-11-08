import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();
routes.post("/user", UserController.store)
routes.get("/user", UserController.getWithParameter)
routes.delete("/user/:id", UserController.delete)
routes.put("/user/:id", UserController.update)
routes.put("/user/password-reset/:id", UserController.resetPassword)
export default routes;