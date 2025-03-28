import { VideoInputDto } from "../dto/video.input-dto";
import { ValidationError } from "../types/validationError"
import { AvailableResolutions } from "../types/video";

export const videoInputDtoValidation = (
  data: VideoInputDto,
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

  return errors;
};
