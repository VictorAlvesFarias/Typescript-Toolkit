function base64ToImage(base64, mimeType) {
    if (base64 == null || mimeType == null) {
        return "";
    }
    return `data:${mimeType};base64,${base64}`;
}
export { base64ToImage };
