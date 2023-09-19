exports.validate = (schema, object) => {
    if (typeof object === 'object' && object !== null) {
        let valid = true;
        let errorText = '';
        for (let key in schema) {
            if (!object[key]) {
                if (schema[key].default) {
                    object[key] = typeof schema[key].default === 'function' ? schema[key].default() : schema[key].default
                } else if (schema[key].required) {
                    valid = false;
                    errorText += `${key} field is required; `;
                }
            }
            if (schema[key].validator) {
                let isValid;
                if (!object[key] && !schema[key].required) {
                    isValid = true;
                } else {
                    isValid = schema[key].validator(object[key]);
                }
                if (!isValid) {
                    valid = false;
                    errorText += `${key} field is unvalid = ${object[key]}; `
                }
            }
            for (let key in object) {
                if (schema[key] === undefined && key !== 'id') {
                    delete object[key];
                }
            }
        }
        if (valid) return object;
        throw new Error(errorText);
    } else {
        throw new Error('Non valid object') 
    }
}