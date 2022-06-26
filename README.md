[![npm](https://img.shields.io/npm/v/@liviamedeiros/promise-abort.svg)](https://npmjs.com/package/@liviamedeiros/promise-abort)

# promise-abort

Syntax sugar for `AbortError` in promises.

# Installation

```console
$ npm i @liviamedeiros/promise-abort
```

`index.min.mjs` is a minified export file for browsers and similar environments.

# Usage

```mjs
import { abortableAsync } from '@liviamedeiros/promise-abort';

// sugaring fetch, result is proxied function
const sweetFetch = abortableAsync(fetch,
  err => (console.info(`fetch got aborted: ${err}`), 'fallback result')
);

const controller = new AbortController();
setTimeout(() => controller.abort(), 100);

// if able to fetch fast, returns response
// if not, prints info and returns 'fallback result'
// if got error, throws it
await sweetFetch('https://url.with.long/response/time', {
  signal: controller.signal
});
```

```mjs
import { abort, inject } from '@liviamedeiros/promise-abort';

// rough prototype extension
Promise.prototype.abort = abort;

// shorthand
inject();

// if fast, resolves with response
// if slow, prints info and resolves with 'fallback result'
// if got error, prints it
fetch('https://url.with.long/response/time', {
  signal: AbortSignal.timeout(100)
})
.abort(err => (console.info(`fetch got aborted: ${err}`), 'fallback result'))
.catch(err => console.error(`fetch got error: ${err}`));
```

# Rationale

[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) and [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) are becoming more and more common, making many async functions effectively cancellable. However, there is no common way to distinguish between abortions and arbitrary exceptions.

In many scenarios, `AbortError` should be handled separately from other errors. Sometimes they should be silently omitted while everything else is carefully handled; sometimes only abortion is handled and errors are falling through.

This module provides syntax sugar, implicitly handling `AbortError`s.

# Docs

### `Promise.prototype.abort([onAbort])`

This method might be injected automatically via `inject()` or manually as `abort`.

It can be used in promise chains before any other error handling. `onAbort` might be an unary handler function that receives `AbortError` and returns any value, or directly an arbitrary value. `.abort()` resolves with that value. `undefined` by default.

### `abortableAsync(fn[, onAbort])`

Decoratorish method, returns Proxy of `fn`. `onAbort` is the same as above: unary handler or fallback value.

## Trivia

`abortableAsync` accepts as third parameter an `isAbort(err)` function to determine that error is abort. By default, it checks that `err.name === 'AbortError'`.

`inject` accepts object for assigning as first parameter, property name as second and `isAbort` as third.

`abort` is unadjustable.

# License

[GPL-3.0-or-later](https://github.com/LiviaMedeiros/promise-abort/blob/master/LICENSE)
