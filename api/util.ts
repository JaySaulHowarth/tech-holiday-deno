
export function uintToHex (arr: Uint8Array): string {
  var hexString = '';
  for (let num of arr) {
    hexString += num.toString(16);
  }
  return hexString;
};
