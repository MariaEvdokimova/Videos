import express, {Express} from "express";
import { videosRouter } from "./videos/routers/videosRouter";
import { testingRouter } from "./testing/routers/testingRouter";
import { setupSwagger } from "./core/swagger/setup-swagger";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send("hello world!!!");
  });

  app.use("/videos", videosRouter);
  app.use("/testing", testingRouter);

  setupSwagger(app);
  return app;
};
