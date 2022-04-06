import { Express, Request, Response } from "express";
// import {
//   createProductHandler,
//   getProductHandler,
//   updateProductHandler,
// } from "./controller/product.controller";
import { googleOauthHandler } from "./controllers/session.controller";
import {
  addTodo,
  createUserHandler,
  getCurrentUser,
  loginUser,
} from "./controllers/user.controller";
import UserModel from "./models/user.model";
// import validateResource from "./middleware/validateResource";
// import {
//   createProductSchema,
//   deleteProductSchema,
//   getProductSchema,
//   updateProductSchema,
// } from "./schema/product.schema";
// import { createSessionSchema } from "./schema/session.schema";
// import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  app.post("/api/users", createUserHandler);

  app.get("/api/me", getCurrentUser);

  //   app.post(
  //     "/api/sessions",
  //     validateResource(createSessionSchema),
  //     createUserSessionHandler
  //   );

  //   app.get("/api/sessions", requireUser, getUserSessionsHandler);

  //   app.delete("/api/sessions", requireUser, deleteSessionHandler);

  app.get("/api/sessions/oauth/google", googleOauthHandler);

  app.post("/login", loginUser);

  app.post("/add-todo", addTodo);

  //   app.post(
  //     "/api/products",
  //     [requireUser, validateResource(createProductSchema)],
  //     createProductHandler
  //   );

  //   app.put(
  //     "/api/products/:productId",
  //     [requireUser, validateResource(updateProductSchema)],
  //     updateProductHandler
  //   );

  //   app.get(
  //     "/api/products/:productId",
  //     validateResource(getProductSchema),
  //     getProductHandler
  //   );

  //   app.delete(
  //     "/api/products/:productId",
  //     [requireUser, validateResource(deleteProductSchema)],
  //     getProductHandler
  //   );
}

export default routes;
