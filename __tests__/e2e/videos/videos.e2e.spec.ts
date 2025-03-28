// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { VideoInputDto } from "../../../src/videos/dto/video.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { AvailableResolutions } from "../../../src/videos/types/video";

describe("Videos API", () => {
  const app = express();
  setupApp(app);

  const testVideoData: VideoInputDto = {
    title: "newVideo",
    author: "Peter Pen",
    availableResolutions: [ AvailableResolutions.P1080 ]
  }

  beforeAll( async () => {
    await request(app)
      .delete("/hometask_01/api/testing/all-data")
      .expect(HttpStatus.NoContent)
  });

  it("should create video. POST /hometask_01/api/videos", async () => {
    const createVideoResponse = await request(app)
      .post("/hometask_01/api/videos")
      .send({...testVideoData, title: 'newVideo 1'})
      .expect(HttpStatus.Created);
      
    expect(createVideoResponse.body.canBeDownloaded).toBe(false)
  })
})
