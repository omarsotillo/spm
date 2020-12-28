import meow from 'meow';
import { findManagersBasedOnLockfiles } from './locks';
import { Manager } from './managers';
import { execSync } from 'child_process';
import { Command, parseCommand } from './command';
import {
  errorNoManagersFound,
  errorLibraryIsNotInAnyRegistries,
} from './cli/cli';
import { isLibraryOnRegistries } from './registries';
import { promptToResolveDuplicates } from './cli/prompt';
import { formatChoicesForManagers, recordHasAtLeastOneKey } from './utils';

export async function run(cli: meow.Result<any>): Promise<string | void> {
  const cliCommand = cli.input[0].charAt(0) as Command;
  const extraArgs = cli.input.slice(1);

  const managers = await findManagersBasedOnLockfiles();

  if (!managers) {
    return errorNoManagersFound();
  }

  let fetchedLibraries: Record<string, Manager[]> = {};

  if (cliCommand === 'a' || cliCommand === 'u') {
    fetchedLibraries = await isLibraryOnRegistries(managers, extraArgs);

    if (Object.keys(fetchedLibraries).length === 0) {
      errorLibraryIsNotInAnyRegistries();
    }
  }

  let choices: Record<Manager, string[]> = {};

  if (toInstallInMultipleManagers(fetchedLibraries)) {
    choices = formatChoicesForManagers(
      await promptToResolveDuplicates(fetchedLibraries)
    );
  }

  for (const manager of managers) {
    if (
      recordHasAtLeastOneKey(fetchedLibraries) &&
      !canManagerExecuteLibrary(fetchedLibraries, manager)
    )
      continue;

    const args = recordHasAtLeastOneKey(choices) ? choices[manager] : extraArgs;

    const execCommand = parseCommand(manager, cliCommand, args, cli.flags);

    if (execCommand === undefined) continue; // TODO: better error handling

    if (cli.flags['print']) {
      console.log(execCommand);
    } else {
      execSync(execCommand as string, { stdio: 'inherit' });
    }
  }
}

function toInstallInMultipleManagers(
  existingLibraries: Record<string, Manager[]>
): boolean {
  return !Object.keys(existingLibraries).every(
    (k) => existingLibraries[k].length <= 1
  );
}

function canManagerExecuteLibrary(
  existingLibraries: Record<string, Manager[]>,
  manager: string
) {
  return Object.values(existingLibraries).find((value) =>
    value.includes(manager)
  );
}
