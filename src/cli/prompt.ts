import inquirer from 'inquirer';
import { Manager } from '../managers';

export function promptToResolveDuplicates(
  libraries: Record<string, Manager[]>
) {
  return inquirer.prompt({
    type: 'checkbox',
    message:
      'This library exist in both registries. Choose in which package manager to install:',
    name: 'libraries',
    choices: choices(libraries),
    validate: function (answer) {
      if (answer.length < 1) {
        return 'You must choose at least one library.';
      }

      return true;
    },
  });
}

function choices(libraries: Record<string, Manager[]>) {
  const choices = [];
  for (const [key, value] of Object.entries(libraries)) {
    choices.push(new inquirer.Separator(key));
    value
      .map((manager) => {
        return {
          name: manager,
          value: manager + '-' + key,
          short: manager + '-' + key,
        };
      })
      .forEach((option) => {
        choices.push(option);
      });
  }
  return choices;
}
