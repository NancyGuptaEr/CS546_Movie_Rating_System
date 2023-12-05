export const checkNull = (value, name) => {
    if(!value){
        throw `${name} must have a valid value.`;
    }
}
export const checkString = (value, name) => {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw `${name} must be a string and it cannot be containing only spaces.`;
        }
}
export const trimString = (arg) => {
    if (typeof arg === 'string') {
        return arg.trim();
    }
    return arg;
}