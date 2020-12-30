import { Manager, MANAGERS } from './managers';
import fetch, { Response } from 'node-fetch';

export async function isLibraryOnRegistries(
  managers: Manager[],
  libraries: string[]
): Promise<Record<string, string[]>> {
  const result: Record<string, string[]> = {};

  for (const library of libraries) {
    for (const manager of managers) {
      if (await fetchRegistry(manager, library)) {
        result[library] = (result[library] || []).concat(manager);
      }
    }
  }
  return result;
}

async function fetchRegistry(
  manager: Manager,
  library: string
): Promise<Boolean> {
  const registryUrl = MANAGERS[manager].registryUrl;
  const composedUrl = registryUrl.replace('{0}', library);

  const response = await fetch(composedUrl);
  return checkStatus(response);
}

function checkStatus(response: Response): boolean {
  if (response.ok) {
    return true;
  } else {
    return false;
  }
}
