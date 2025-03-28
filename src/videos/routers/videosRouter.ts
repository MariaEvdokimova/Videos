import { Request, Response, Router } from "express";
import { db } from "../../db/videos.db";
import { VideoInputDto } from "../dto/video.input-dto";
import { Video } from "../types/video";
import { HttpStatus } from "../../core/types/http-statuses";
import { VideoUpdateDto } from "../dto/video.update-dto";
import { videoInputDtoValidation } from "../validation/videoInputDtoValidation";
import { createErrorMessages } from "../../core/utils/error.utils";
import { videoUpdateDtoValidation } from "../validation/videoUpdateDtoValidation";

export const videosRouter = Router({});

videosRouter.get("",(_, res: Response) => {
  res.status(HttpStatus.Ok).send(db.videos);
})

.post("", (req: Request<{}, {}, VideoInputDto>, res: Response) => {
  const errors = videoInputDtoValidation(req.body);

  if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
  }

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  const newVideo: Video = {
    id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 0,
    title: req.body.title,
    author: req.body.author,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: currentDate.toISOString(),
    availableResolutions: req.body.availableResolutions
  };

  db.videos.push(newVideo);
  res.status(HttpStatus.Created).send(newVideo);
})

.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const video = db.videos.find(( video ) => video.id === id);
  
  if ( !video ) {
    res.status(HttpStatus.NotFound).send();
    return;
  }

  res.status(HttpStatus.Ok).send(video);
})

.put("/:id", (req: Request<{ id: string}, {}, VideoUpdateDto>, res: Response) => {
  const errors = videoUpdateDtoValidation(req.body);

  if (errors.length > 0) {
      res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
      return;
  }

  const id = parseInt(req.params.id);
  const index = db.videos.findIndex(( video ) => video.id === id);
  
  if ( index === -1 ) {
    res.status(HttpStatus.NotFound).send();
    return;
  }

  const video = db.videos[index];

  video.title = req.body.title;
  video.author = req.body.author;
  video.availableResolutions = req.body.availableResolutions;
  video.canBeDownloaded = req.body.canBeDownloaded;
  video.minAgeRestriction = req.body.minAgeRestriction;
  video.publicationDate = req.body.publicationDate;
   
  res.status(HttpStatus.NoContent).send();
})

.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = db.videos.findIndex( video => video.id === id );

  if ( index === -1 ) {
    res.status(HttpStatus.NotFound).send();
    return;
  }

  db.videos.splice( index, 1);  
  res.status(HttpStatus.NoContent).send();
})
