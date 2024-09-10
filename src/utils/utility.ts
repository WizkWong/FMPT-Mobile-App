export const capitalizedCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();

export const adjustMoulderSize = (nettInput: number): number => {
  if (nettInput === undefined || nettInput === null) {
    return nettInput;
  }
  const decimalPart = nettInput.toString().split(".")[0];
  if (!decimalPart) {
    return nettInput;
  }
  if (decimalPart.length === 1 || decimalPart.length === 2) {
    return nettInput + 0.5;
  }
  return nettInput + 10;
};

export const isZeroOrEmptyNumber = (value: number | undefined | null): boolean =>
  value === undefined || value === null || value === 0;

export const convertToDateString = (dateString: string) => {
  if (dateString === null || dateString === undefined) {
    return dateString;
  }
  const dateObject = new Date(dateString);
  
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const day = String(dateObject.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}