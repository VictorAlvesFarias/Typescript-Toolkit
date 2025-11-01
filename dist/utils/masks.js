export function setMask(value, [regex, replacement]) {
    value = value === null || value === void 0 ? void 0 : value.replace(/\D/g, '');
    value = value === null || value === void 0 ? void 0 : value.replace(regex, replacement);
    return value;
}
