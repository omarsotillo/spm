export function parseCommand(command: string, args: string[]) {
  if (!args.length) return command;
  return command.replace('{0}', args.join(' '));
}
