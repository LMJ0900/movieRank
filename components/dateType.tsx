export function getDateType() {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const kst = new Date(now.getTime() + offset + 9 * 60 * 60000);
    kst.setDate(kst.getDate() - 1);

    const year = kst.getFullYear().toString();
    const month = (kst.getMonth() + 1).toString().padStart(2, '0');
    const date = kst.getDate().toString().padStart(2, '0');

    return `${year}${month}${date}`;
}
