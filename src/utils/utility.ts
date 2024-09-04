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
