const formfields = {
    email: 'Email',
    password: 'Password',
}

module.exports = {
    email: 'Email',
    password: 'Password',
    login: 'Log In',

    form: {
        default: (name) => `Validation error on field ${formfields[name]}`,
        required: (name) => `${formfields[name]} is required`,
        enum: (name, values) => `${formfields[name]} must be one of [${values}]`,
        whitespace: (name) => `${formfields[name]} cannot be empty`,
        date: {
          format: (name) => `${formfields[name]} is invalid for format date`,
          parse: (name) => `${formfields[name]} could not be parsed as date`,
          invalid: (name) => `${formfields[name]} is invalid date`,
        },
        types: {
          string: (name, type) => `${formfields[name]} is not a valid ${type}`,
          method: (name, type) => `${formfields[name]} is not a valid ${type}`,
          array: (name, type) => `${formfields[name]} is not a valid ${type}`,
          object: (name, type) => `${formfields[name]} is not a valid ${type}`,
          number: (name, type) => `${formfields[name]} is not a valid ${type}`,
          date: (name, type) => `${formfields[name]} is not a valid ${type}`,
          boolean: (name, type) => `${formfields[name]} is not a valid ${type}`,
          integer: (name, type) => `${formfields[name]} is not a valid ${type}`,
          float: (name, type) => `${formfields[name]} is not a valid ${type}`,
          regexp: (name, type) => `${formfields[name]} is not a valid ${type}`,
          email: (name, type) => `${formfields[name]} is not a valid ${type}`,
          url: (name, type) => `${formfields[name]} is not a valid ${type}`,
          hex: (name, type) => `${formfields[name]} is not a valid ${type}`,
        },
        string: {
          len: (name, len) => `${formfields[name]} must be exactly ${len} characters`,
          min: (name, min) => `${formfields[name]} must be at least ${min} characters`,
          max: (name, max) => `${formfields[name]} cannot be longer than ${max} characters`,
          range: (name, min, max) => `${formfields[name]} must be between ${min} and ${max} characters`,
        },
        number: {
          len: (name, len) => `${formfields[name]} must equal ${len}`,
          min: (name, min) => `${formfields[name]} cannot be less than ${min}`,
          max: (name, max) => `${formfields[name]} cannot be greater than ${max}`,
          range: (name, min, max) => `${formfields[name]} must be between ${min} and ${max}`,
        },
        array: {
          len: (name, len) => `${formfields[name]} must be exactly ${len} in length`,
          min: (name, min) => `${formfields[name]} cannot be less than ${min} in length`,
          max: (name, max) => `${formfields[name]} cannot be greater than ${max} in length`,
          range: (name, min, max) => `${formfields[name]} must be between ${min} and ${max} in length`,
        },
        pattern: {
          mismatch: (name, pattern) => `${formfields[name]} does not match pattern ${pattern}`,
        },
    },
}