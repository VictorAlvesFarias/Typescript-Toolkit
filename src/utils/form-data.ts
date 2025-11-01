export function objectToFormData(data: { [key: string]: any }): FormData {
    const formData = new FormData();

    function appendFormData(formData: FormData, value: any, keyPrefix: string) {
        if (Array.isArray(value)) {
            value.forEach((item, idx) => {
                const arrayKey = `${keyPrefix}-${idx + 1}`;

                appendFormData(formData, item, arrayKey);
            });
        } else if (value && typeof value === 'object' && !(value instanceof File)) {
            Object.keys(value).forEach(subKey => {
                const objectKey = `${keyPrefix}-${subKey}`;
                
                appendFormData(formData, value[subKey], objectKey);
            });
        } else if (value !== undefined && value !== null) {
            formData.append(keyPrefix, value);
        }
    }

    Object.keys(data).forEach(key => {
        appendFormData(formData, data[key], key);
    });

    return formData;
}