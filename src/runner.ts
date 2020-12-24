import meow from 'meow';
import { findManagersBasedOnLockfiles } from './locks';
import { Manager, MANAGERS } from './managers';
import { execSync } from 'child_process';
import { parseCommand } from './command';
import { errorNoManagersFound } from './cli';

export async function run(cli: meow.Result<any>): Promise<string | void> {
  const managers: Manager[] | undefined = await findManagersBasedOnLockfiles();

  if (!managers) {
    return errorNoManagersFound();
  }

  const cliCommand = cli.input[0];
  const extraArgs = cli.input.slice(1);

  // If managers are more than one ask which one wants to install

  managers.forEach((manager) => {
    const packageManager = MANAGERS[manager];
    const execCommand = parseCommand(
      (packageManager.commands as any)[cliCommand],
      extraArgs
    );

    if (cli.flags['debug']) {
      console.log(execCommand);
    } else {
      execSync(execCommand, { stdio: 'inherit' });
    }
  });
}
