import { VideoUpdateDto } from "../dto/video.update-dto";
import { ValidationError } from "../types/validationError"
import { AvailableResolutions } from "../types/video";

const DATA_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

export const videoUpdateDtoValidation = (
  data: VideoUpdateDto,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim() === "" ||
    data.title.trim().length > 40
  ) {
    errors.push({ field: 'title', message: 'Invalid title' });
  }

  if (
    !data.author ||
    typeof data.author !== 'string' ||
    data.author.trim() === "" ||
    data.author.trim().length > 20
  ) {
    errors.push({ field: 'author', message: 'Invalid author' });
  }

  if (!Array.isArray(data.availableResolutions)) {
    errors.push({
      field: 'availableResolutions',
      message: 'availableResolutions must be array',
    });
  } else if ( data.availableResolutions.length === 0 ){
    errors.push({
      field: 'availableResolutions',
      message: 'At least one resolution should be added',
    });
  } else {
    const existingResolutions = Object.values(AvailableResolutions);
    if (
      data.availableResolutions.length > existingResolutions.length
    ) {
      errors.push({
        field: 'availableResolutions',
        message: 'Invalid availableResolutions',
      });
    }
    for (const resolutions of data.availableResolutions) {
      if (!existingResolutions.includes(resolutions)) {
        errors.push({
          field: 'features',
          message: 'Invalid availableResolutions: ' + resolutions,
        });
        break;
      }
    }
  }

  if ( typeof data.canBeDownloaded !== 'boolean') {
    errors.push({ field: 'canBeDownloaded', message: 'Invalid canBeDownloaded' });
  }

  if ( 
    data.minAgeRestriction && (
      typeof data.minAgeRestriction !== 'number' ||
      data.minAgeRestriction < 1 ||
      data.minAgeRestriction > 18 
    )
  ) {
    errors.push({ field: 'minAgeRestriction', message: 'Invalid minAgeRestriction' });
  }

  if ( 
    !data.publicationDate ||
    typeof data.publicationDate !== 'string' ||
    !DATA_REGEX.test(data.publicationDate)
  ) {
    errors.push({ field: 'publicationDate', message: 'Invalid publicationDate' });
  }

  return errors;
};
