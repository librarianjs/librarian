# Data Plugins

A data plugin must implement two methods.

## get(id)
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

## put(record)

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

Your `get` and `put` methods should pass the [data plugin tests](plugin-tests/data-plugin.js).
