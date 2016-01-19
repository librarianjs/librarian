# Cache Plugins

Cache plugins are used to cache image data so that slower or more expensive storage
solutions (e.g. Amazon S3) are not touched more than necessary if a file is accessed repeatedly in a short time window.

A cache plugin must implement a `get` and `put` method. The speed of cache invalidation is up to the specific library to decide.

## get(id)

get will be called with an image id, it will look something like this.

```js
plugin.get('343fd021-c37e-4e79-850e-d013bae00b3b')
```

It should return a promise that resolves with a buffer of image data:
```js
<Buffer 47 49 46 38 39 61 3d 00 44 00 f7 a8 00 9a 2c 33 ...>
```

If there is no record that matches the key, the promise should resolve with `null`.

**NOTE:** The only reason the promise should ever reject is if there was some sort of fetching error (e.g. Redis crashes randomly). A missing key is a normal occurrence, do not error for this.

## put(id, record)

put will be called with a record that looks like the following:
```js
plugin.put('e10a0a08-1688-4dff-8a26-fea6ff32e2d4', imageDataBuffer)
```

It should return a promise that resolves when the record has been successfully saved, and rejects if there was some problem saving the file.

Your `get` and `put` methods should pass the [cache plugin tests](plugin-tests/cache-plugin.js).
