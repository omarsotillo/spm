import meow from 'meow';
import { Manager, ManagerOptions, MANAGERS } from './managers';
import { camelToKebabCase, recordHasAtLeastOneKey } from './utils';

export type Command = keyof Commands;
export type Commands = {
  i: string;
  a: string;
  u: string;
  r: string;
  l: string;
  d: string;
  o: string;
};

export function parseCommand(
  manager: Manager,
  cliCommand: Command,
  args: string[],
  flags: meow.TypedFlags<any>
): string | undefined {
  const packageManager = MANAGERS[manager];
  let command = (packageManager.commands as any)[cliCommand];

  if (commandNeedsArguments(cliCommand)) {
    command = addGlobalParam(command, flags.global);
    command = addArguments(command, args);
    command = addDevelopmentParam(command, flags.development, packageManager);
  }

  command = addFlags(command, flags);

  return command;
}

function commandNeedsArguments(cliCommand: string): boolean {
  return ['a', 'u', 'r', 'd'].includes(cliCommand);
}

function addGlobalParam(command: string, global: unknown): string {
  if (global) return command.replace('{G}', 'global');
  return command.replace(' {G}', '');
}

function addDevelopmentParam(
  command: string,
  development: unknown,
  packageManager: ManagerOptions
): string {
  if (!development || packageManager.customFlags.dev === undefined)
    return command.replace(' {D}', '');

  return command.replace('{D}', packageManager.customFlags.dev);
}

function addArguments(command: string, args: string[]): string | undefined {
  if ((args && !args.length) || args === undefined) return undefined;
  return command.replace('{0}', args.join(' '));
}

function addFlags(command: string, flags: meow.TypedFlags<any>) {
  if (
    command === undefined ||
    flags === undefined ||
    (flags && !recordHasAtLeastOneKey(flags))
  )
    return command;

  const formattedFlags = formatFlags(flags);
  return formattedFlags === undefined
    ? command
    : command.concat(' ' + formattedFlags);
}

function formatFlags(flags: meow.TypedFlags<any>) {
  return Object.entries(flags)
    .filter((flag) => flag[1])
    .map((value) => {
      const array = value as [string, any];
      return '--' + camelToKebabCase(array[0]);
    })
    .join(' ');
}
