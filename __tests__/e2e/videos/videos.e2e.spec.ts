// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { VideoInputDto } from "../../../src/videos/dto/video.input-dto";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { AvailableResolutions } from "../../../src/videos/types/video";
import { VideoUpdateDto } from "../../../src/videos/dto/video.update-dto";

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
  });

  it("should return videos list; GET /hometask_01/api/videos", async () => {
    await request(app)
      .post("/hometask_01/api/videos")
      .send({ ...testVideoData, name: "newVideo 1" })
      .expect(HttpStatus.Created);

    await request(app)
      .post("/hometask_01/api/videos")
      .send({ ...testVideoData, name: "newVideo 2" })
      .expect(HttpStatus.Created);

    const videoListResponse = await request(app)
      .get("/hometask_01/api/videos")
      .expect(HttpStatus.Ok);

    expect(videoListResponse.body).toBeInstanceOf(Array);
    expect(videoListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it("should return video by id; GET /hometask_01/api/videos/:id", async () => {
    const createResponse = await request(app)
      .post("/hometask_01/api/videos")
      .send({ ...testVideoData, name: "Another Video" })
      .expect(HttpStatus.Created);

    const getResponse = await request(app)
      .get(`/hometask_01/api/videos/${createResponse.body.id}`)
      .expect(HttpStatus.Ok);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });

  it("should update video; PUT /hometask_01/api/videos/:id", async () => {
    const createResponse = await request(app)
      .post("/hometask_01/api/videos")
      .send({ ...testVideoData, name: "Another Video" })
      .expect(HttpStatus.Created);

    const videoUpdateData: VideoUpdateDto = {
      title: "Updated Name",
      author: "New authtor",
      canBeDownloaded: true,
      minAgeRestriction: 17,
      publicationDate: new Date().toISOString(),
      availableResolutions: [ AvailableResolutions.P144 ],
    };

    await request(app)
      .put(`/hometask_01/api/videos/${ createResponse.body.id}`)
      .send(videoUpdateData)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/hometask_01/api/videos/${createResponse.body.id}`,
    );

    expect(videoResponse.body).toEqual({
      ...videoUpdateData,
      id: createResponse.body.id,
      createdAt: expect.any(String),
    });
  });

  it("DELETE /hometask_01/api/videos/:id and check after NOT FOUND", async () => {
    const {
      body: { id: createdVideoId },
    } = await request(app)
      .post("/hometask_01/api/videos")
      .send({ ...testVideoData, name: "new Video" })
      .expect(HttpStatus.Created);

    await request(app)
      .delete(`/hometask_01/api/videos/${createdVideoId}`)
      .expect(HttpStatus.NoContent);

    const videoResponse = await request(app).get(
      `/hometask_01/api/videos/${createdVideoId}`,
    );
    expect(videoResponse.status).toBe(HttpStatus.NotFound);
  });
  
})
