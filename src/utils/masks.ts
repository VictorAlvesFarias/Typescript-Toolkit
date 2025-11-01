export function setMask(value: string, [regex, replacement]: [RegExp, string]): string {
    value = value?.replace(/\D/g, '')
    value = value?.replace(regex, replacement)

    return value
}