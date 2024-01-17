import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateinput(data) {
    let errors = {};

    if(Validator.isEmpty(data.username)) {
        errors.username = 'Please enter username'
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Please enter password'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
