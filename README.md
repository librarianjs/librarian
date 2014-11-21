# Librarian (PRE-ALPHA)

An express module responsible for managing dynamic file uploads and downloads:

## Features

### Existing
- Uploading
- Downloading

### Planned
- Previews
- Compression
- Caching Headers

## Usage

Bare bones example app
```
var app = require( 'librarian' )( options )
app.listen( 8888 )
```

## Endpoints

### File Upload

#### POST|PUT /upload

Upload the file. Potentially add flags for permissions and actions for this upload.

- Compression (0-10)
- Embeddable (true|false)
- extra.* attributes (text)

Returns the same data as `GET /<id>`

### File Access

#### GET /:id

Download the file
#### GET /:id/meta

Metadata about the file:

- ID (id)
- File Name (fileName)
- File Size in bytes (fileSize)
- Mime-type (mimeType)
- Caching Information
- Play length (video)
- Resolution (image|video)
- extra.*

#### GET /:id/preview
#### GET /:id/thumbnail

A 256x256 or 512x512 preview of the file.
If an image, a very small, compressed snippet of it. If a .pdf, a placeholder image:

![PDF LOGO](http://upload.wikimedia.org/wikipedia/commons/9/9b/Adobe_PDF_icon.png)

#### GET /:id/embed (FUTURE)

If the system supports generating an embedded document for this kind of file, send that. Otherwise, send the preview.

#### GET /:id/:width[x:height]
#### GET /:id/sm[all]
#### GET /:id/med[ium]
#### GET /:id/large

Get the file resized to the correct dimensions.
If a proper thumbnail exists or can be created for this size, it is sent, otherwise `/:id/preview` is sent.

If only a width is specified, the height will be auto-generated based on the original aspect ratio.

### File Modification

#### PUT|PATCH /:id

Overwrite the file.
Triggers regeneration of all metadata, added attributes will be untouched.

#### PATCH /:id/meta
Change any writable attributes of file metadata.

- File Name
- Extra.* attributes

## Alternate Storage and Metadata Engines

Librarian comes with a storage and metadata engine.

By default, the storage engine uses the local file system.

By default, the metadata engine uses a local sqlite database.

### Storage Engine

The storage engine must implement the following methods

#### `get( filePath, callback )`

Retrieve the file from the storage location.

Should trigger the callback with a file buffer or pipe as the second argument.

The first argument should be `null` if there was no error,
true if the file does not exist,
and an `Error` if there was another error.

#### `overwrite( filePath, file, callback )`

Write a new file over a pre-existing file.

The first argument should be `null` if there was no error,
true if the pre-existing file does not exist,
and an `Error` if there was another error.

#### `put( metaId, file, callback )`

Write a new file to a the specified path

The first argument should be `null` if there was no error
and an `Error` if there was an error.

### Metadata Engine

The metadata engine must implement the following methods

#### `get( fileId, callback )`

Access a metadata object about a file. Including at least the following:

- ID
- File Name
- File Size
- Mime-type
- extra.*

Should trigger the callback with a metadata object as the second argument.
Pass any errors as the first argument, otherwise pass null

#### `all( callback )`

Access an array of all file metadata objects stored in the db.

Should trigger the callback with the metadata as the second argument.
Pass any errors as the first argument, otherwise pass null

#### `patch( fileId, newKeys, callback )`

All provided keys will update the changeable values of the file.
Some values are auto-generated, such as mime-type and file size.
However, the filename and attributes can be updated in this manner.

Should trigger the callback with a metadata object as the only argument

#### `new( meta, callback )`

Insert a new meta object into the metaEngine.

Should trigger the callback with the created metadata object
