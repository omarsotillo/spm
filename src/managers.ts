import { Commands } from './command';

export type Manager = keyof typeof MANAGERS;

export type ManagerOptions = {
  commands: Commands;
  registry: string;
  //developmentFlag: string | undefined;
};

// Support configuration for library servers
export const MANAGERS: Record<string, ManagerOptions> = {
  pnpm: {
    commands: {
      r: 'pnpm run {0}',
      i: 'pnpm i',
      a: 'pnpm i {0}',
      u: 'pnpm update {0}',
      l: 'pnpm list',
      o: 'pnpm outdated',
    },
    registry: 'https://registry.npmjs.org/{0}',
  },
  npm: {
    commands: {
      r: 'npm run {0}',
      i: 'npm i',
      a: 'npm i {0}',
      u: 'npm update {0}',
      l: 'npm list',
      o: 'npm outdated',
    },
    registry: 'https://registry.npmjs.org/{0}',
  },
  yarn: {
    commands: {
      r: 'yarn run {0}',
      i: 'yarn install',
      a: 'yarn {G} add {0}',
      u: 'yarn {G} upgrade {0}',
      l: 'yarn list',
      o: 'yarn outdated',
    },
    registry: 'https://registry.yarnpkg.com/{0}',
  },
  bundler: {
    commands: {
      r: 'bundler exec {0}',
      i: 'bundler install',
      a: 'bundler add {0}',
      u: 'bundler update {0}',
      l: 'bundle list',
      o: 'bundler outdated',
    },
    registry: 'https://rubygems.org/gems/{0}',
  },
  composer: {
    commands: {
      r: 'bundler run {0}',
      i: 'php composer.phar {G} install {0}',
      a: 'php composer.phar {G} install {0}',
      u: 'php composer.phar {G} update {0}',
      l: 'php composer.phar {G} list',
      o: 'php composer.phar outdated',
    },
    registry: 'https://packagist.org/packages/{0}',
  },
};
