function catchErrors(error, callback) {
    let messages = [];
    try {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
            errors.forEach(e => messages.push(error));
        }
        else {
            const keys = Object.keys(errors);
            const values = keys.map((key) => errors[key]);
            values.flatMap((item) => {
                return item.map((error) => messages.push(error));
            });
        }
    }
    catch (error) {
        messages.push("An unexpected error occurred.");
    }
    callback(error, messages);
}
export { catchErrors };
