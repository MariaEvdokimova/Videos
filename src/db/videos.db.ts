import { Video } from "../videos/types/video";

export const db = {
  videos: <Video[]>[
    {
      id: 0,
      title: "title1",
      author: "author1",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2025-03-25T20:08:59.130Z",
      publicationDate: "2025-03-26T20:08:59.130Z",
      availableResolutions: [
        "P144"
      ]
    },
    {
      id: 1,
      title: "title2",
      author: "author2",
      canBeDownloaded: true,
      minAgeRestriction: 18,
      createdAt: "2025-03-26T20:08:59.130Z",
      publicationDate: "2025-03-276T20:08:59.130Z",
      availableResolutions: [
        "P2160"
      ]
    },
  ],
};