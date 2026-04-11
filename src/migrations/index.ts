import * as migration_20260410_181404_init_schema from './20260410_181404_init_schema';
import * as migration_20260411_100147 from './20260411_100147';

export const migrations = [
  {
    up: migration_20260410_181404_init_schema.up,
    down: migration_20260410_181404_init_schema.down,
    name: '20260410_181404_init_schema',
  },
  {
    up: migration_20260411_100147.up,
    down: migration_20260411_100147.down,
    name: '20260411_100147'
  },
];
