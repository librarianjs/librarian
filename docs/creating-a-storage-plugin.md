# Storage Plugins

Storage plugins are used to store image data.

A storage plugin must implement two methods.

## Methods

### get(id)

get will be called with an image id, it will look something like this.

```js
plugin.get('343fd021-c37e-4e79-850e-d013bae00b3b')
```

It should return a promise that resolves with a buffer of image data:
```js
<Buffer 47 49 46 38 39 61 3d 00 44 00 f7 a8 00 9a 2c 33 ...>
```

If there is no image that matches the key, the promise should resolve with `null`.

**NOTE:** The only reason the promise should ever reject is if there was some sort of fetching error (e.g. Amazon S3 returns a 500 error). A missing key is a normal occurrence, do not error for this.

### put(id, record)

put will be called with a record that looks like the following:
```js
plugin.put('e10a0a08-1688-4dff-8a26-fea6ff32e2d4', imageDataBuffer)
```

It should return a promise that resolves when the file has been successfully saved, and rejects if there was some problem saving the file.

### init()

Any plugin may also (optionally) provide an `init` method.
If one is found, librarian will wait until the `init()` promise resolves before processing requests.

This is a good way for plugins to check for the availability of external resources.

The `init()` promise should resolve when the plugin is good to go,
and should reject if the plugin will never be able to function correctly.
An example of this would be invalid api keys for the [S3 Storage](https://github.com/librarianjs/s3-storage) plugin or bad connection details for the [Mysql Data](https://github.com/librarianjs/mysql-data) plugin.

## Tests

Your plugin should pass the [storage plugin tests](plugin-tests/storage-plugin.js).
