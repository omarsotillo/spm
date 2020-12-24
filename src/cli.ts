import meow from 'meow';
import chalk from 'chalk';
export const ALLOWED_COMMANDS = ['i', 'a', 'u', 'r'];

export function createCli() {
  const cli = meow(
    `
    Usage ⚡️
      $ spm i - install all libraries with package manager
      $ spm a - add a new library
      $ spm r - run a command in the package manager
      $ spm u - update a specific package
  
    Options 🗃
      --javascript, -j Command will be run only for javascript managers
      --backend, -b    Command will be run only for other managers
      --debug, -d      Will print only the command
      --global, -g     Global mode installation
  
    Examples 🎉
      $ spm i
      ✍ executes "<manager> install" all packages in all the managers 
  `,
    {
      flags: {
        debug: {
          type: 'boolean',
          alias: 'd',
        },
        javascript: {
          type: 'boolean',
          alias: 'j',
        },
        backend: {
          type: 'boolean',
          alias: 'b',
        },
        global: {
          type: 'boolean',
          alias: 'g',
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
    chalk.bold.red('No package managers were found in this project.')
  );
  console.log(
    chalk.bold.yellow(
      'If you are using one maybe is not currently supported ☹️. '
    )
  );
  console.log(
    'Please open an issue specifying the unsupported package manager'
  );

  process.exit(2);
}
