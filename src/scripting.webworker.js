function compile(src) {
  const guardedSrc = `with (sandbox) {
    ${src}
  }`;
  const compiledFunction = new Function("sandbox", guardedSrc);
  return (sandbox) => {
    const sandboxProxy = new Proxy(sandbox, {
      has: () => true,
      get: (target, key) => {
        if (key === Symbol.unscopables) return undefined;
        return target[key];
      },
    });
    return compiledFunction(sandboxProxy);
  };
}

function createContext(extra) {
  let parsedExtra = {};
  try {
    parsedExtra = JSON.parse(extra);
  } catch (e) {
    console.error(e);
  }
  return {
    console,
    setInterval: (...args) => setInterval(...args),
    setTimeout: (...args) => setTimeout(...args),
    exec: (command, args) => self.postMessage({ command, args }),
    ...parsedExtra,
  };
}

self.onmessage = ({ data: { command, args } }) => {
  switch (command) {
    case 'run':
      const [src, extra] = args;
      const compiled = compile(src);
      compiled(createContext(extra));
      break;
    default:
      throw new Error(`Unknown command "${command}".`);
  }
};