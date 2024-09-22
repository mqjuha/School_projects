import { Db } from '../db/db.mjs';

export const mochaGlobalSetup = () => {
  const adapter = Db.getMemoryAdapter();
  Db.setInstance(adapter);
};

export const mochaGlobalTeardown = async () => {};
