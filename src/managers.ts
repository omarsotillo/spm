export type Manager = keyof typeof MANAGERS;
export type Command = keyof Commands;

export type Commands = {
  r: string;
  i: string;
  g: string;
  a: string;
  u: string;
};

export type ManagerOptions = {
  commands: Commands;
  library_server: string;
};

// Support configuration for library servers
export const MANAGERS: Record<string, ManagerOptions> = {
  pnpm: {
    commands: {
      r: 'pnpm run {0}',
      i: 'pnpm i',
      g: 'pnpm i -g {0}',
      a: 'pnpm i {0}',
      u: 'pnpm update {0}',
    },
    library_server: 'https://registry.npmjs.org/{0}',
  },
  npm: {
    commands: {
      r: 'npm run {0}',
      i: 'npm i',
      g: 'npm i -g {0}',
      a: 'npm i {0}',
      u: 'npm update {0}',
    },
    library_server: 'https://registry.npmjs.org/{0}',
  },
  yarn: {
    commands: {
      r: 'yarn run {0}',
      i: 'yarn install',
      g: 'yarn global add {0}',
      a: 'yarn add {0}',
      u: 'yarn update {0}',
    },
    library_server: 'https://registry.yarnpkg.com/{0}',
  },
  bundler: {
    commands: {
      r: 'bundler run {0}',
      i: 'bundler install',
      g: 'bundler add {0}',
      a: 'bundler add {0}',
      u: 'bundler update {0}',
    },
    library_server: 'https://rubygems.org/gems/{0}',
  },
};
