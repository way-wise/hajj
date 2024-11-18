import * as migration_20241118_053433_migration from './20241118_053433_migration';

export const migrations = [
  {
    up: migration_20241118_053433_migration.up,
    down: migration_20241118_053433_migration.down,
    name: '20241118_053433_migration'
  },
];
