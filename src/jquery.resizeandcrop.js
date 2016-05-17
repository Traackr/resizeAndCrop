/**
 * jQuery Plugin - Resize and Crop
 * Version: 0.4.1
 *
 * Contributor(s):
 *     Mikaël Gravé
 *     Luis Cruz
 *
 * License: Copyright (c) 2013 Traackr Licensed under the MIT license.
 *
 * By default, takes a list of <img> elements and performs a batch resize and crop operation on them.
 * If a "realsrc" attribute is present on the element, the "src" attribute will be treated as a placeholder image and
 * swapped out for a resized and cropped version of the image specified in the "realsrc" attribute. If the "realsrc"
 * image cannot be loaded, the placeholder image will be displayed.
 *
 * Example:
 *     <img src="http://www.example.com/default.png" realsrc="http://www.example.com/example.png" />
 *     <script type="text/javascript">
 *         $(document).ready(function() {
 *             $("img").resizeAndCrop();
 *         });
 *     </script>
 *
 * Options:
 *     width: Integer
 *         Force the width of the resulting resized and cropped image.
 *         Defaults to 0 indicating the image will inherit the width from the "src" attribute image
 *
 *     height: Integer
 *         Force the height of the resulting resized and cropped image.
 *         Defaults to 0 indicating the image will inherit the height from the "src" attribute image
 *
 *     crop: Boolean
 *         Crop the image
 *         Defaults to true
 *
 *     center: Boolean
 *         Center the image when cropping it
 *         Defaults to true
 *
 *     smart: Boolean
 *         Use smart crop + center mode
 *         Defaults to true
 *
 *     preserveSize: Boolean
 *         Float the image within the container if the original image is too small to fit the desired size
 *         Defaults to false
 *
 *     forceResize: Boolean
 *         Force small images to be resized
 *         Defaults to false
 *
 *     imgClass: String
 *         CSS classes to apply to the generated <img> element
 *         Defaults to ''
 *
 *     contClass: String
 *         CSS classes to apply to the generated <div> container element around the <img> element
 *         Defaults to ''
 *
 *     renderStartDelay: Integer
 *         How long in milliseconds to delay before starting to load and render the images
 *         Defaults to 50
 *
 *     renderBatchSize: Integer
 *         How many images to process at one time
 *         Defaults to 10. If set to 0, the whole queue of images will be processed in one pass
 *
 *     renderBatchPause: Integer
 *         How long in milliseconds to pause between processing batches of images
 *         Defaults to 200
 *
 */

(function ($) {

  $.fn.resizeAndCrop = function (options) {

    // Supported configuration parameters
    var settings = {
      // Force resulting image size?
      // (0=inherit from placeholder img element)
      'width': 0,
      'height': 0,

      // Crop resulting image?
      'crop': true,

      // Center when cropping?
      'center': true,

      // Smart crop+center mode?,
      'smart': true,

      // If the original image is too small to fit
      // the wished sized, do we make it float
      // within a larger container?
      'preserveSize': false,

      // Force small images to be resized?
      'forceResize': false,

      // Optional classes for resulting img element
      // and div container element
      'imgClass': '',
      'contClass': '',

      // Start loading/rendering after...
      'renderStartDelay': 50, // ms

      // Load images by batch of...
      'renderBatchSize': 10, // #images

      // Pause in between batches
      'renderBatchPause': 200  // ms
    };

    var queue = [];

    // If options exist, lets merge them
    // with our default settings
    if (options) {
      $.extend(settings, options);
    }

    this.each(function () {
      queue.push(this); // Defer loading
    });
    setTimeout(_run, settings.renderStartDelay || 0); // Start loading images
    return this;

    /**
     * Bind images a batch at a time
     */
    function _run() {
      var max = settings.renderBatchSize || queue.length, // If batch size is 0, render the whole queue in one pass
          i = 0;
      for (; i < max && queue.length; i++) {
        _bindImage(queue.shift());
      }
      if (queue.length) {
        setTimeout(_run, settings.renderBatchPause || 0);
      }
    }

    /**
     * Bind an IMG element to the loader & triggers the actual load.
     * @param {DOM Element} imgEl <img> element detected in the DOM tree and that needs to be "loaded", resized and cropped.
     * @param
     */
    function _bindImage(imgEl) {
      var $img = $(imgEl),
          realSrc = $img.attr("realsrc") || $img.attr("src");
      if (!realSrc) {
        return;
      }
      // Temp image, not yet connected to DOM
      var newImg = $(document.createElement('img'));
      // Important: We pass the DOM img object, not the jQ one
      newImg.bind("load", {img: imgEl}, _onload);

      // carry over alt and title if they exist
      var altStr, titleStr;
      if (typeof (altStr = $img.attr('alt')) !== 'undefined') {
        newImg.attr("alt", altStr);
      }
      if (typeof (titleStr = $img.attr('title')) !== 'undefined') {
        newImg.attr("title", titleStr);
      }

      // Load image (in the background -- not visible yet)
      newImg.attr("src", realSrc);
    }

    /**
     * Where the magic happens: once an image has successfully loaded (or failed), it is resized/cropped (of needed)
     * and the temp DOM img element used for the loading is swapped with the DOM img element that was originally
     * in the HTML source.
     * @param {DOM Event} e DOM event. Its payload contains e.img (original DOM img element in the HTML source while 'this'
     * points to the temp DOM img element used for the loading.)
     */
    function _onload(e) {
      // Notes on image elements used below:
      //   'this'   is a DOM image object, it's a temporary IMG element that serves to load the desired image.
      //   $origImg is the jQ wrapper object for the above image element.
      //   curImg   is the DOM element matching the <img realsrc> tag in your HTML page
      //   $curImg  is the jQ wrapper object for the previous image element.
      // All the work is done on the temporary image object (this/$origImg). Once it's loaded and sized properly,
      // we encapsulate it within a containing <div> (cont) that is also used for cropping the image by using
      // a masking technique (faux-cropping using CSS overflow hidden).
      // Finally, we swap the original <img> node with that <div> node.

      // Original image (natural size), temp node
      var $origImg = $(this),
          // Can't use origImg.width() because not visible
          origW = this.width,
          origH = this.height,
          // Current placeholder image in markup (DOM object)
          curImg = e.data.img,
          // Current placeholder image in markup (jQuery object)
          $curImg = $(curImg),
          // Requested width (do not use $curImg.width()!)
          reqW = settings.width || parseInt($(curImg).css("width")) || curImg.width,
          // Requested height
          reqH = settings.height || parseInt($(curImg).css("height")) || curImg.height,
          // What it will finally be...
          cropW = settings.forceResize ? reqW : Math.min(origW, reqW),
          cropH = settings.forceResize ? reqH : Math.min(origH, reqH),
          // Encapsulating <div>
          cont;

      // Check loaded image is valid
      if (!origW || !origH) {
        // Invalid, do nothing
        return;
      }

      // No-crop mode, same dimensions: just act as a deferred loader
      if (!settings.crop && reqW == origW && reqH == origH) {
        $curImg.attr("src", $origImg.attr("src"));
        return;
      }

      // Resize image
      if (cropW * origH < cropH * origW) {
        this.width = Math.round(origW * cropH / origH);
        this.height = cropH;
      } else {
        this.width = cropW;
        this.height = Math.round(origH * cropW / origW);
      }

      // Style it
      if (settings.imgClass) {
        $origImg.addClass(settings.imgClass);
      }

      if (!settings.crop) {
        $curImg.replaceWith($origImg); // Swap nodes
        return;
      }

      // Crop

      // Create container element (mask)
      cont = $(document.createElement('div'));
      cont.addClass("resize-and-crop");
      if (settings.preserveSize) {
        cont.width(reqW).height(reqH);
      } else {
        // Crop it
        cont.width(cropW).height(cropH);
        // Center it
        if (settings.center) {
          $origImg.css('left', -Math.max(0, Math.round(( this.width - cropW ) / 2)));
          if (settings.smart && this.height / this.width > 1.2) {
            $origImg.css('top', 0);
          } else {
            $origImg.css('top', -Math.max(0, Math.round(( this.height - cropH ) / 2)));
          }
        }
      }

      // Style it
      if (settings.contClass) {
        cont.addClass(settings.contClass);
      }

      // Insert image into container
      cont.append($origImg);

      // Swap nodes
      $curImg.replaceWith(cont);
    }
  };
})(jQuery);