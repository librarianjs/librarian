# Librarian (Beta)

An express module responsible for managing dynamic file uploads and downloads:

## Features

- Easy file uploading
- Lazy file resizing

## Usage

Bare bones example app
```
var app = require( 'librarian' )( options )
app.listen( 8888 )
```

## Endpoints

### File Upload

#### POST|PUT /upload

Upload the file.
Returns the same data as `GET /:id`

### File Access

#### GET /:id

Download the file with the correct mime-type. Images will be displayed in browser.

#### GET /:id/meta

Metadata about the file:

- ID (id)
- File Name (fileName)
- File Size in bytes (fileSize)
- Mime-type (mimeType)

#### GET /:id/thumb[nail]
#### GET /:id/small
#### GET /:id/medium
#### GET /:id/large
#### GET /:id/:width[px]

Get the file resized to the correct dimensions.

- thumbnail = 256px
- small = 512px
- medium = 1024px
- large = 2048px
  :width = :widthpx

If an invalid width is provided, the original file will be sent

### File Modification

#### PATCH /:id/meta
Change any writable attributes of file metadata.

- File Name

## Storage and Metadata Engines

Librarian requires metadata and storage engines to handle the actual file saving.

The packaged storage engine uses the local file system as file storage space,
and the packaged metadata engine uses a local sqlite database to store metadata.

Librarian can store files and metadata on any platform provided that you supply it with a compatible engine.

Hopefully, these storage engines will be supported in future:

- Amazon S3
- Google Cloud

Ideally the following metadata engines would also be supported:

- MySQL
- PostreSQL

### Storage Engine

The storage engine is responsible for saving and retrieving the actual file data.
The location of the stored data does not matter to librarian.

A valid storage engine must be a Class that implements the following methods:

#### `get( name, callback )`

Retrieve the file from the storage location.

Should trigger the callback with:

1. `new Error( 'reason' )`, or `null` if there was no error.
2. a Buffer or ReadableStream of the file, or false when there is no file.

#### `put( name, file, callback )`

Write a new file to a the specified path.

`file` will be passed in as a ReadableStream

Should trigger the callback with:

1. `new Error( 'reason' )`, or `null` if there was no error.

### Metadata Engine

The metadata engine is responsible for storing various attributes about a file:

- ID
- File Name
- File Size
- Mime-type

A valid metadata engine must be a Class that implements the following methods:

#### `get( id, callback )`

Access a metadata object about the file:

- ID
- File Name
- File Size
- Mime-type

Should trigger the callback with:

1. `new Error( 'reason' )`, or `null` if there was no error.
2. a metadata object

#### `all( callback )`

Access an array of all file metadata objects stored in the db.

Should trigger the callback with:

1. `new Error( 'reason' )`, or `null` if there was no error.
2. an array of all metadata objects

#### `patch( id, changedKeys, callback )`

At this time, fileName is really the only changable attribute. This may change in future however.

Should trigger the callback with:

1. `new Error( 'reason' )`, or `null` if there was no error.
2. the new metadata object

#### `new( meta, callback )`

Insert a new meta object into the metaEngine.

Should trigger the callback with:

1. `new Error( 'reason' )`, or `null` if there was no error.
2. the new metadata object
