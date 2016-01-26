# Data Plugins

A data plugin must implement three methods.

## Methods

### get(id)
get will be called with an image id, it will look something like this.

```js
plugin.get('343fd021-c37e-4e79-850e-d013bae00b3b')
```

It should return a promise that resolves with an object in the format:
```js
{
  id: 'e10a0a08-1688-4dff-8a26-fea6ff32e2d4',
  size: ​125731,
  name: 'ducks.jpeg',
  mimeType: 'image/jpeg'
}
```

If there is no record that matches the key, the promise should resolve with `null`.

**NOTE:** The only reason the promise should ever reject is if there was some sort of fetching error (e.g. MySQL crashes while running a query). A missing key is a normal occurrence, do not error for this.

### put(record)

put will be called with a record that looks like the following:
```js
plugin.put({
  id: 'e10a0a08-1688-4dff-8a26-fea6ff32e2d4',
  size: ​125731,
  name: 'ducks.jpeg',
  mimeType: 'image/jpeg'
})
```

It should return a promise that resolves when the record has been successfully inserted, and rejects if there was some problem inserting the record.

### getAll()

Should return a promise that resolves with an array of every id stored. This is mostly used for debugging and migration.

```js
[
  'e10a0a08-1688-4dff-8a26-fea6ff32e2d4',
  '59931d36-a1da-4f4b-866f-076176dc6739',
  '346eba81-a0c6-4bdd-8e87-5133e92e31a8',
  'd7f88da4-c386-40c3-a3b4-4de0bf7b96b8',
  'b53962da-62fb-4d9c-bbf8-9209514967e5'
]
```

### init()

Any plugin may also (optionally) provide an `init` method.
If one is found, librarian will wait until the `init()` promise resolves before processing requests.

This is a good way for plugins to check for the availability of external resources.

The `init()` promise should resolve when the plugin is good to go,
and should reject if the plugin will never be able to function correctly.
An example of this would be invalid api keys for the [S3 Storage](https://github.com/librarianjs/s3-storage) plugin or bad connection details for the [Mysql Data](https://github.com/librarianjs/mysql-data) plugin.

## Tests

Your plugin should pass the [data plugin tests](plugin-tests/data-plugin.js).
