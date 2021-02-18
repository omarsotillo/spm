export function remove<T>(array: T[], value: T) {
  const index: number = array.indexOf(value);

  if (index >= 0) array.splice(index, 1);

  return array;
}

export function cleanArray<T>(array: T[], value: T): Array<T> {
  return array.filter(el => {
    return el !== value;
  });
}

export function isArrayEmpty<T>(array: T[]): boolean {
  return !Array.isArray(array) || !array.length;
}

export function formatChoicesForManagers(answers: { libraries: any }) {
  const libraries = answers.libraries;
  const result: Record<string, string[]> = {};

  for (const library of libraries) {
    const splittedString: string[] = library.split('-');
    result[splittedString[0]] = (result[splittedString[0]] || []).concat(
      splittedString[1]
    );
  }
  return result;
}

export function recordHasAtLeastOneKey(object: Record<string, unknown>) {
  return Object.keys(object).length > 0;
}

export function camelToKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}
