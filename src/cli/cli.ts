import meow from 'meow';
import chalk from 'chalk';

export const ALLOWED_COMMANDS = [
  'i',
  'install',
  'a',
  'add',
  'u',
  'update',
  'r',
  'run',
  'd',
  'delete',
  'o',
  'outdated',
  'l',
  'list',
];

export function createCli() {
  const cli = meow(
    `
    Usage ⚡️
      $ spm install                  - install all libraries in project package-managers
      $ spm add <library/es>         - add new library/es to the project-managers
      $ spm update <library/es>      - update library/es to the project-managers
      $ spm run <command>            - run a command in the projects package-manager
      $ spm delete <library/es>      - delete a library in the projects package-manager
      $ spm outdated                 - check outdates libraries
      $ spm list                     - list all libraries in all the projects

    Options 🗃 (all command accepts specific manager flags)
      --print, -p        - Will print the command but not execute it
      --global, -g       - Global mode installation. Commands like add will be converted to global
      --development, -d  - Add the command in development mode
      --backend, -b      - Run command in backend package manager only
      --frontend, -f     - Run command in frontend package manager only

    Examples 🎉
      $ spm add react
      📝 Add library in the package-managers that register a react package/library
  `,
    {
      flags: {
        print: {
          type: 'boolean',
          alias: 'p',
        },
        global: {
          type: 'boolean',
          alias: 'g',
        },
        development: {
          type: 'boolean',
          alias: 'd',
        },
        frontend: {
          type: 'boolean',
          alias: 'f',
        },
        backend: {
          type: 'boolean',
          alias: 'b',
        },
      },
    }
  );

  if (!ALLOWED_COMMANDS.includes(cli.input[0])) {
    console.log(
      chalk.bold.red('Command could not be found. Please check usage')
    );
    console.log(cli.help);
    process.exit(2);
  }
  return cli;
}

export function errorNoManagersFound() {
  console.log(
    chalk.bold.red('No package managers were found in this project ☹️.')
  );
  console.log(
    chalk.bold.yellow(
      'Please open an issue specifying the unsupported manager in https://github.com/omarsotillo/spm/issues'
    )
  );

  process.exit(2);
}

export function errorLibraryIsNotInAnyRegistries() {
  console.log(chalk.bold.red('Library/ies do not exist in any registries ❌'));
  process.exit(2);
}
