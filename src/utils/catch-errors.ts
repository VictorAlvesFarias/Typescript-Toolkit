function catchErrors(error: any, callback: (error: any, messages: string[]) => void) {
    let messages: string[] = [];

    try {
        const errors = error.response.data.errors

        if (Array.isArray(errors)) {
            errors.forEach(e => messages.push(error))
        }
        else {
            const keys = Object.keys(errors);
            const values = keys.map((key) => errors[key]);

            values.flatMap((item: any) => {
                return item.map((error: any) => messages.push(error));
            });
        }
    } catch (error) {
        messages.push("An unexpected error occurred.");
    }

    callback(error, messages);
}

export {
    catchErrors
}
