import { Manager, MANAGERS } from './managers';
import fetch, { Response } from 'node-fetch';

export async function isLibraryOnRegistries(
  managers: Manager[],
  libraries: string[]
): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};
  for (const library of libraries) {
    for (const manager of managers) {
      const exists = await existInRegistryServer(manager, library);
      if (exists) {
        result[library] = (result[library] || []).concat(manager);
      }
    }
  }
  return result;
}

async function existInRegistryServer(
  manager: Manager,
  library: string
): Promise<Boolean> {
  const url = MANAGERS[manager].registry.replace('{0}', library);
  const response = await fetch(url);
  return checkStatus(response);
}

const checkStatus = (response: Response): boolean => {
  if (response.ok) {
    return true;
  } else {
    return false;
  }
};
