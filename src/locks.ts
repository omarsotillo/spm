import findUp from 'find-up';
import { Manager } from './managers';
import path from 'path';

export const JS_LOCK_FILES: Record<string, Manager> = {
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
};

export const BACKEND_MANAGERS: Record<string, Manager> = {
  'Gemfile.lock': 'bundler',
};

export const MANAGERS: Record<string, Manager> = {
  ...JS_LOCK_FILES,
  ...BACKEND_MANAGERS,
};

export async function findManagersBasedOnLockfiles(): Promise<
  Manager[] | undefined
> {
  // TODO: Contribute Find multiple https://github.com/sindresorhus/find-up
  let managers_pathes: Array<string | undefined> = [];

  managers_pathes.push(await findUp(Object.keys(JS_LOCK_FILES)));
  managers_pathes.push(await findUp(Object.keys(BACKEND_MANAGERS)));

  managers_pathes = <Array<string>>cleanArray(managers_pathes, undefined);

  const managers = isArrayEmpty(managers_pathes)
    ? undefined
    : managers_pathes.map((element) => {
        return MANAGERS[path.basename(element as string)];
      });
  return managers;
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
