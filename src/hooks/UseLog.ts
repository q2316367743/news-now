export const useLog = (name: string) => {
  return {
    log: (message: string) => {
      console.log(`[${name}]: ${message}`);
    },
    debug: (...messages: Array<any>) => {
      console.debug(`[${name}]: ${messages.join("\t\t")}`);
    },
    error: (...messages: Array<any>) => {
      console.error(`[${name}]: ${messages.join("\t\t")}`);
    },
  };
};
