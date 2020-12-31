import meow from 'meow';
import { Manager, MANAGERS } from './managers';

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

function addArguments(command: string, args: string[]): string | undefined {
  if ((args && !args.length) || args === undefined) return undefined;
  return command.replace('{0}', args.join(' '));
}

function addFlags(command: string, flags: meow.TypedFlags<any>) {
  if (flags === undefined || (flags && !flags?.length)) return command;

  const formattedFlags = Object.entries(flags)
    .filter((flag) => flag[1])
    .map((value) => {
      const array = value as [string, string];
      return '--' + array[0] + '=' + array[1].toString();
    })
    .join(' ');
  return command.concat(' ' + formattedFlags);
}
