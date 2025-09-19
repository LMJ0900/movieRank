export const fetchBestsellerData = async (bookApikey : string) => {
    const BestsellerUrl =
    `https://www.aladin.co.kr/ttb/api/ItemList.aspx` +
    `?ttbkey=${bookApikey}` +
    `&QueryType=Bestseller` +
    `&MaxResults=10` +
    `&start=1` +
    `&SearchTarget=Book` +
    `&Cover=Big` +   
    `&output=js` +
    `&Version=20131101`;

    try {
        const res = await fetch(BestsellerUrl);
        if (!res.ok) {
            throw new Error('400 아니면 500 에러');
        }
        const data = await res.json();
        return data.item;
    } catch (error) {
        console.log("🚨 베스트셀러 API 오류:", error);
        return [];
    }
};