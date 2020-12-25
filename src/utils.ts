export function remove<T>(array: T[], value: T) {
  const index: number = array.indexOf(value);

  if (index >= 0) array.splice(index, 1);

  return array;
}

export function cleanArray<T>(array: T[], value: T): Array<T> {
  return array.filter((el) => {
    return el != value;
  });
}

export function isArrayEmpty<T>(array: T[]): boolean {
  if (!Array.isArray(array) || !array.length) return true;
  return false;
}
