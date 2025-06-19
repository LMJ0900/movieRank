export function getDateType() {
    let now = new Date();
    let offset = now.getTimezoneOffset() * 60000;
    let kst = new Date(now.getTime() + offset + 9 * 60 * 60000);
    kst.setDate(kst.getDate() - 1);

    let year = kst.getFullYear().toString();
    let month = (kst.getMonth() + 1).toString().padStart(2, '0');
    let date = kst.getDate().toString().padStart(2, '0');

    return `${year}${month}${date}`;
}
