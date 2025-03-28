import { Response, Router } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { db } from "../../db/videos.db";

export const testingRouter = Router({});

testingRouter
  .delete("/all-data", ( _, res: Response) => {
    db.videos = [];
    res.sendStatus(HttpStatus.NoContent);
  })
