# Librarian

An express module responsible for managing dynamic file uploads and downloads:

## Installation

```bash
npm install librarian
```

## Features

- Easy file uploading
- Lazy file resizing

## Usage

Bare bones example app
```
var librarian = require('librarian')
var app = librarian()
app.listen( 8888 )
```

## Options

Librarian takes an options object that may contain any of the following keys:

### cors

The cors value will be passed directly into the express [cors](https://www.npmjs.com/package/cors) middleware.
If you leave this option out, cors will not be used.

### storage

A storage plugin is used to store the binary image data.

- ✔ [In Memory](https://github.com/librarianjs/memory-storage) (default)
- ✔ [Amazon S3](https://github.com/librarianjs/s3-storage)
- ✘ Google Cloud ([Help Develop](docs/creating-a-storage-plugin.md))
- ✘ File System ([Help Develop](docs/creating-a-storage-plugin.md))
- ✘ MySQL ([Help Develop](docs/creating-a-storage-plugin.md))

### data

A data plugin is used to store file metadata.
This includes things like size, filename, and mimetype.

- ✔ [In Memory](https://github.com/librarianjs/memory-data) (default)
- ✔ [MySQL](https://github.com/librarianjs/mysql-data)
- ✘ PostreSQL ([Help Develop](docs/creating-a-data-plugin.md))
- ✘ MongoDB ([Help Develop](docs/creating-a-data-plugin.md))

### cache

A cache plugin is used to cache data fetched from the storage plugin.

If this option is `false`, caching will be disabled.
Otherwise it must be an instance of one of the following:

- ✔ [In Memory](https://github.com/librarianjs/memory-cache) (default)
- ✘ Redis ([Help Develop](docs/creating-a-cache-plugin.md))
- ✘ File System ([Help Develop](docs/creating-a-cache-plugin.md))

## Storage and Metadata Plugins

Librarian accepts plugins for storage, caching, and file data.
By default, librarian uses in memory implementations of all of these.
You can probably get away with using the in memory cache for small setups,
but **DO NOT** use the in memory storage/data plugins in production.

## Endpoints

### POST /

Returns
```js
{
  id: 'e10a0a08-1688-4dff-8a26-fea6ff32e2d4',
  size: 125731,
  name: 'ducks.jpeg',
  mimeType: 'image/jpeg'
}
```

#### GET /:id?width={preset,int}

**Response**
The requested image or a blank 404

**Presets**

Name | Value
--- | ---
thumbnail | 256
small | 512
medium | 1024
large | 2048


#### GET /:id/info

**Response**
```js
{
  id: 'e10a0a08-1688-4dff-8a26-fea6ff32e2d4',
  size: 125731,
  name: 'ducks.jpeg',
  mimeType: 'image/jpeg'
}
```
