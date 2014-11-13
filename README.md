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
#### POST|PUT /upload/:bucket

Upload the file. Potentially add flags for permissions and actions for this upload.

- Compression (0-10)
- Embeddable (true|false)
- extra.* attributes (text)

Returns the same data as `GET /<id>`

### File Access

#### GET /:id
#### GET /:bucket/:id

Download the file

#### GET /:bucket

Get an array of `/:id/meta` objects for the files in this bucket

#### GET /:id/meta

Metadata about the file:

- ID
- bucket
- Fully qualified name (bucket + ID )
- File Name
- File Size
- Mime-type
- Caching Information
- Play length (video)
- Resolution (image|video)
- Permissions
- extra.*

#### GET /:id/preview

A 256x256 or 512x512 preview of the file.
If an image, a very small, compressed snippet of it. If a .pdf, a placeholder image:

![PDF LOGO](http://upload.wikimedia.org/wikipedia/commons/9/9b/Adobe_PDF_icon.png)

#### GET /:id/embed

If the system supports generating an embedded document for this kind of file, send that. Otherwise, send the preview.

### File Modification

#### PUT /:id

Overwrite the file with a new image of it.
Triggers regeneration of all metadata, added attributes will be left alone

#### PATCH /:id/meta
Change any writable attributes of file metadata.
- File Name
- Extra.* attributes
