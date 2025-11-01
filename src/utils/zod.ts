export function number(value: string): boolean {
    if (/^[0-9]+$/.test(value)) {
        return true;
    }
    else {
        return false;
    }
}