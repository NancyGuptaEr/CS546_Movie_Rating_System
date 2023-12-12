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

export const checkStr = (param, paramName) => {
    if (!param) throw `${paramName} must be exist!`;
    if (typeof param !== "string")
      throw `the type of ${paramName} must be string!`;
    param = param.trim();
    if (param.length === 0)
      throw `${paramName} cannot consist of spaces entirely!`;
    return param;
  };
  export const checkDate = (date, whatDate) => {
    date = checkStr(date, whatDate);
    if (
      !date.match(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[0-1])\/[12][0-9]{3}$/gim)
    )
      throw `${whatDate} type is invalid`;
    const [month, day, year] = date.split("/");
    const formatDate = new Date(year, month - 1, day);
    if (
      !(
        formatDate.getFullYear() === +year &&
        formatDate.getMonth() + 1 === +month &&
        formatDate.getDate() === +day
      )
    )
      throw `${whatDate} is invalid`;
    return date;
  };
  
  export const checkName = (param, paramName) => {
    param = checkStr(param, paramName);
    if (!param.match(/^[a-z]{0,25}( [a-z]{0,25}){1,2}$/gi))
      throw `${paramName} must consist of letters and 2-3 spaces`;
    return param;
  };
  