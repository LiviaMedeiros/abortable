const abortable = (promise, isAbort = e => e?.name === 'AbortError') =>
  async function abort(onAbort) {
    return (promise ?? this).catch(err => {
      if (isAbort(err))
        return typeof onAbort === 'function'
          ? onAbort(err)
          : onAbort;
      throw err;
    });
  };

const abortableAsync = (fn, onAbort, isAbort) => {
  if (fn?.constructor.name !== 'AsyncFunction')
    throw new TypeError(`fn must be an AsyncFunction, got ${fn}`);
  return new Proxy(fn, {
    apply: async (...$) => abortable(Reflect.apply(...$), isAbort)(onAbort)
  })
}

const abort = abortable();

const inject = (target = Promise.prototype, name = 'abort', isAbort) =>
  !target.abort && Object.defineProperty(
    target,
    name,
    {
      value: abortable(null, isAbort),
      writable: true,
      enumerable: false,
      configurable: true,
    }
  );

export {
  abortableAsync,
  abort,
  inject,
};
