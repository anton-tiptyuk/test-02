import * as dotenv from 'dotenv';

const { ENV_FILE: envFileName } = <{ ENV_FILE: string }>process.env;

dotenv.config({ path: envFileName });

import { schema } from './schema';
import { Config } from './config';

const { error, value: envData } = schema.validate(process.env, {
  allowUnknown: true,
});

if (error) throw new Error(`Config validation error: ${error.message}`);

export const config = new Config(<any>envData);
