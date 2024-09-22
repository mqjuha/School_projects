/**
 * Run before all tests
 */
const beforeAll = done => {
  done();
};

/**
 * Run after all tests
 */
const afterAll = done => {
  done();
};

export const mochaHooks = { beforeAll, afterAll };
