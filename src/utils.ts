export function remove<T>(array: T[], value: T) {
  const index: number = array.indexOf(value);

  if (index >= 0) array.splice(index, 1);

  return array;
}
