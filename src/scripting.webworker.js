const contexts = {};

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

function exec(uuid, command, args) {
  return self.postMessage({ uuid, command, args });
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
    exec,

    accelerate: (n) => exec(parsedExtra.uuid, "accelerate", [n]),
    break: (n) => exec(parsedExtra.uuid, "break", [n]),
    rotate: (a) => exec(parsedExtra.uuid, "rotate", [a]),
    shoot: () => exec(parsedExtra.uuid, "accelerate", []),

    ...parsedExtra,
  };
}

self.onmessage = ({ data: { command, args } }) => {
  if (command === 'run') {
    const [src, extra] = args;
    const compiled = compile(src);
    const context = createContext(extra);
    contexts[extra.uuid] = context;
    compiled(contexts[extra.uuid]);
    return;
  }
  throw new Error(`Unknown command "${command}".`);
};