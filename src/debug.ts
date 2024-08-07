const DEBUG = true;

export const debug = {
  log: ((...args) => {
    if (DEBUG) console.log(...args);
  }) satisfies typeof console.log,
};
