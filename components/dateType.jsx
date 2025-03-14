let today = new Date();
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
let year = yesterday.getFullYear().toString();
let month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
let date = yesterday.getDate().toString().padStart(2, '0');
export const dateType = `${year}${month}${date}`