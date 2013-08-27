# resizeAndCrop

## Overview

**jQuery plugin** to resize and crop images on the fly, while preserving their aspect ratio. A placeholder first shows and the actual image loading, cropping and resizing happens in the background. Optimized for rendering hundreds of images on the same page: images are loaded in batch with a pause in between each batch. This maximizes UI responsiveness while ensuring image loading is not blocking ajax calls.

## Plugin Usage

Include `jquery.resizeandcrop.css` and `jquery.resizeandcrop.js`</a> files.

Then call the plugin on any image using standard jQuery call. For example:

	$('img.cropme').resizeAndCrop();

If you want a placeholder to be display while the original image gets loaded and cropped, use the `realsrc` attribute of the `<img>` tag:

	<img src="placeholder.png" realsrc="imagetoloadandcrop.png">

The image will be resized at the size of the placeholder or whatever size you specify in the `<img>` tag (via a class or `width`/`height` attributes):

	<img src="placeholder.png" realsrc="imagetoloadandcrop.png" style="width:200px;height:200px;">

By default, if the original image is smaller than the placeholder, it won't get resized. You can change this by setting `forceResize` to `true`. See other possible options below.

The plugin is optimized to operate on hundreds of images without blocking the browser event loop. Images are processed in small chunks.

## Optional Parameters

You can pass special optional parameters when call the plugin. Parameters are passed as a key-value object to `resizeAndCrop()`. For example:

	$('img.cropme').resizeAndCrop( { center: false, imgClass: "foo" } );


Supported keys and values are:

### `width` (integer)
 
To force width of resized image to another value than placeholder's width (default).

### `height` (integer)
 
To force height of resized image to another value than placeholder's height (default).

### `preserveSize` (boolean)

If the original image is smaller than the placeholder, preserve the space occupied by the placeholder and make the image float in its left-top corner. Default is `false`.

### `forceResize` (boolean)

If the original image is smaller than the placeholder, enlarge it to fit the placeholder (it can make it blurry).  Default is `false`.

### `crop` (boolean)

When `false`, only resize the image (if needed), do not crop it. That means the image might get distorded if the aspect ratio of the original image is different from the aspect ratio of the placeholder. It also allows for using this plugin as a simple image loader (deferred loading). Default is `true`.

### `center` (boolean)

When `true`, the cropped portion of the image is centered. This is the default behavior. If you set it to `false`, the cropped portion is always the top-left part of the image. Default is `true`.

### `smart` (boolean)

Only applicable when `center` is set to `true` (default). The vertical centering is optimized for people's portraits. If the height/width ratio is bigger than 1.2, the vertical centering is disabled and the centering only applies horizontally. This option is intended to be used when you expect photos that could be medium closeups or full shot portrait (head, body and feet) because the head is usually in the top part of the picture and vertically centering does not work well. Default is `true`.

### `imgClass` (string)

Optional class to add to the `<img>` element showing the resized and cropped image. No default value.

### `contClass` (string)

Optional class to add to the `<div>` element that acts as a container for the `<img>` element showing the resized and cropped image. No default value.

### `renderStartDelay` (integer)

In milliseconds. Start loading/rendering after this initial delay. Set to zero for no delay. Default it 50ms.

### `renderBatchSize` (integer)

Number of images to load at once. The event loop is free'ed up after each batch to maximize UI responsiveness. Default is 10.

### `renderBatchPause` (integer)

In milliseconds. Pause before processing next batch of images. Important to have big enough pauses when you load large sets of images, otherwise the UI may become very unresponsive/jerky. Default is 200ms.
