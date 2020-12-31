import meow from 'meow';
import { findManagersBasedOnLockfiles } from './locks';
import { Manager } from './managers';
import { execSync } from 'child_process';
import { Command, parseCommand } from './command';
import {
  errorNoManagersFound,
  errorLibraryIsNotInAnyRegistries,
} from './cli/cli';
import { isLibraryOnRegistries } from './fetch';
import { promptToResolveDuplicates } from './cli/prompt';
import { formatChoicesForManagers, recordHasAtLeastOneKey } from './utils';

export async function run(
  cli: meow.Result<any>
): Promise<string | void | Buffer> {
  const managers = await findManagersBasedOnLockfiles(cli.flags);

  if (!managers) {
    return errorNoManagersFound();
  }

  let librariesInRegistries: Record<string, Manager[]> = {};
  const extraArgs = cli.input.slice(1);
  const cliCommand = cli.input[0].charAt(0) as Command;

  if (commandAcceptsLibraries(cliCommand)) {
    librariesInRegistries = await isLibraryOnRegistries(managers, extraArgs);

    if (Object.keys(librariesInRegistries).length === 0) {
      errorLibraryIsNotInAnyRegistries();
    }
  }

  let choices: Record<Manager, string[]> = {};

  if (toInstallInMultipleManagers(librariesInRegistries)) {
    choices = formatChoicesForManagers(
      await promptToResolveDuplicates(librariesInRegistries)
    );
  }

  for (const manager of managers) {
    if (
      recordHasAtLeastOneKey(librariesInRegistries) &&
      !canManagerExecuteLibrary(librariesInRegistries, manager)
    )
      continue;

    const args = recordHasAtLeastOneKey(choices) ? choices[manager] : extraArgs;

    const execCommand = parseCommand(manager, cliCommand, args, cli.flags);

    if (execCommand === undefined) continue; // TODO: better error handling

    if (cli.flags.print) {
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

function commandAcceptsLibraries(cliCommand: string) {
  return cliCommand === 'a' || cliCommand === 'u' || cliCommand === 'd';
}

function canManagerExecuteLibrary(
  existingLibraries: Record<string, Manager[]>,
  manager: string
) {
  return Object.values(existingLibraries).find((value) =>
    value.includes(manager)
  );
}
