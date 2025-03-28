import { AvailableResolutions } from "../types/video"

export type VideoUpdateDto = {
  title: string,
  author: string,
  canBeDownloaded: boolean,
  minAgeRestriction: number | null,
  publicationDate: string,
  availableResolutions: AvailableResolutions[]
}
