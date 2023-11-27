import * as mongoose from 'mongoose';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const dbProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: () => mongoose.connect('mongodb://localhost/test'),
  },
];
