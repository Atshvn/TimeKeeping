

export const VnToEn = (str) => {
    let newStr = str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replaceAll(" ", "_");

    return newStr;
}