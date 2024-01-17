import Validator from "validator";
import isEmpty from "lodash/isEmpty";

export default function validateinput(data) {
  let errors = {};

  if (Validator.isEmpty(data.name)) {
    errors.title_jp = "Please enter name";
  }
  // if(Validator.isEmpty(data.title_en)) {
  //     errors.title_en = 'Please enter English title'
  // }
  if (Validator.isEmpty(data.title)) {
    errors.description_en = "Please enter title";
  }
  if (Validator.isEmpty(data.linkdetail)) {
    errors.description_jp = "Please enter Link description";
  }
  if (Validator.isEmpty(data.level) || Validator.isEmpty(data.sdktype)) {
    errors.openDate = "Please enter valid data";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
