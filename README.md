# jQuery Resize and Crop Plugin

Resize and crop images on the fly, while preserving their aspect ratio. A placeholder image is used initially; the
actual image loading, cropping and resizing happens in the background. Optimized for rendering hundreds of images on
the same page without blocking the browser event loop; images are loaded in batches with a pause in between each batch.
This maximizes UI responsiveness while ensuring image loading is not blocking AJAX calls.

## Installation Via bower

	bower install jquery-resizeandcrop

## Usage

Include `jquery.resizeandcrop.css` and `jquery.resizeandcrop.js` files on the page and call the plugin on any image:

	<html>
		<head>
			<link rel="stylesheet" type="text/css" href="jquery.resizeandcrop.css">
		</head>
		<body>
			<img class="crop-me" src="placeholder.png" realsrc="imagetoloadandcrop.png" />
			<script type="text/javascript" src="jquery.resizeandcrop.js"></script>
			<script>
				$("img.crop-me").resizeAndCrop();
			</script>
		</body>
	</html>

In the above example, the `placeholder.png` image will display, while the image in the `realsrc` attribute of the `<img>`
tag gets loaded, resized, and cropped. The image will be resized to match the size of `placeholder.png` by default, but
you can override this by specifying the size in the `<img>` tag via a CSS class, in-line CSS style, or `width` / `height`
attributes:

	<img src="placeholder.png" realsrc="imagetoloadandcrop.png" style="width: 200px; height: 200px;">

By default, if the original image is smaller than the placeholder, it won't get resized. You can change this by setting
`forceResize` to `true`. The full list of options are below.

Several examples of using the plugin can be found in the `examples/index.html` file.

## Options

The plugin sets options via a key-value object parameter:

	$('img.cropme').resizeAndCrop( { center: false, imgClass: "foo" } );


Available Options:

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Type</th>
			<th>Default Value</th>
			<th>Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>`width`</td>
			<td>integer</td>
			<td>Width of the placeholder image</td>
			<td>Force the width of resized image to this value.</td>
		</tr>
		<tr>
			<td>`height`</td>
			<td>integer</td>
			<td>Height of the placeholder image</td>
			<td>Force the height of the resized image to this value.</td>
		</tr>
		<tr>
			<td>`preserveSize`</td>
			<td>boolean</td>
			<td>`false`</td>
			<td>If the original image is smaller than the placeholder, preserve the space occupied by the placeholder
			and make the image float in its left-top corner.</td>
		</tr>
		<tr>
			<td>`forceResize`</td>
			<td>boolean</td>
			<td>`false`</td>
			<td>If the original image is smaller than the placeholder, enlarge it to fit the placeholder (it can make
			it blurry).</td>
		</tr>
		<tr>
			<td>`crop`</td>
			<td>boolean</td>
			<td>`true`</td>
			<td>When `false`, only resize the image (if needed), do not crop it. That means the image might get
			distorted if the aspect ratio of the original image is different from the aspect ratio of the placeholder.
			It also allows for using this plugin as a simple image loader (deferred loading).</td>
		</tr>
		<tr>
			<td>`center`</td>
			<td>boolean</td>
			<td>`true`</td>
			<td>When `true`, the cropped portion of the image is centered. If you set it to `false`, the cropped portion
			is always the top-left part of the image.</td>
		</tr>
		<tr>
			<td>`smart`</td>
			<td>boolean</td>
			<td>`true`</td>
			<td>Only applicable when `center` is set to `true` (default). The vertical centering is optimized for
			people's portraits. If the height/width ratio is bigger than 1.2, the vertical centering is disabled and
			the centering only applies horizontally. This option is intended to be used when you expect photos that
			could be medium closeups or full shot portrait (head, body and feet) because the head is usually in the top
			part of the picture and vertically centering does not work well.</td>
		</tr>
		<tr>
			<td>`imgClass`</td>
			<td>string</td>
			<td></td>
			<td>Optional class to add to the `<img>` element showing the resized and cropped image.</td>
		</tr>
		<tr>
			<td>`contClass`</td>
			<td>string</td>
			<td></td>
			<td>Optional class to add to the `<div>` element that acts as a container for the `<img>` element showing the resized and cropped image.</td>
		</tr>
		<tr>
			<td>`renderStartDelay`</td>
			<td>integer</td>
			<td>50</td>
			<td>Time in milliseconds to delay before loading/rendering images. Set to zero to immediately load/render images.</td>
		</tr>
		<tr>
			<td>`renderBatchSize`</td>
			<td>integer</td>
			<td>10</td>
			<td>Number of images to load at once. The event loop is freed up after each batch to maximize UI responsiveness.</td>
		</tr>
		<tr>
			<td>`renderBatchPause`</td>
			<td>integer</td>
			<td>200</td>
			<td>Time in milliseconds to pause before processing the next batch of images. It is important to have big
			enough pause when you load large sets of images, otherwise the UI may become very unresponsive.</td>
		</tr>
	</tbody>
</table>

## License

Copyright (c) 2013 Traackr Licensed under the MIT license.