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

## Storage and Metadata Engines

Librarian accepts plugins for storage, caching, and file data.
By default, librarian uses in memory implementations of all of these.
You can probably get away with using the in memory cache for small setups,
but **DO NOT** use the in memory storage/data plugins in production.

### Supported Storage Engines

- ✔ [In Memory](https://github.com/librarianjs/memory-storage)
- ✔ [Amazon S3](https://github.com/librarianjs/s3-storage)
- ✘ Google Cloud ([Help Develop](docs/creating-a-storage-plugin.md))
- ✘ File System ([Help Develop](docs/creating-a-storage-plugin.md))
- ✘ MySQL ([Help Develop](docs/creating-a-storage-plugin.md))

### Supported Data Engines

- ✔ [In Memory](https://github.com/librarianjs/memory-data)
- ✔ [MySQL](https://github.com/librarianjs/mysql-data)
- ✘ PostreSQL ([Help Develop](docs/creating-a-data-plugin.md))
- ✘ MongoDB ([Help Develop](docs/creating-a-data-plugin.md))

###  Supported Cache Engines

- ✔ [In Memory](https://github.com/librarianjs/memory-cache)
- ✘ Redis ([Help Develop](docs/creating-a-cache-plugin.md))
- ✘ File System ([Help Develop](docs/creating-a-cache-plugin.md))

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
