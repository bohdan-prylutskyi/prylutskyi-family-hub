const timeouts = {};

export const schedule = (key, delay, fn) => {
  clear(key);
  timeouts[key] = setTimeout(async () => {
    try {
      await fn();
    } finally {
      timeouts[key] = null;
    }
  }, delay);
};

export const clear = (key) => {
  if (timeouts[key]) {
    clearTimeout(timeouts[key]);
    timeouts[key] = null;
  }
};
