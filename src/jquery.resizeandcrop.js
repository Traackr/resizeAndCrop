 /*
  * jQuery Plugin - Resize and Crop - v0.2 - JS
  */

(function( $ ){

  $.fn.resizeAndCrop = function( options ) {  

    // Supported configuration parameters
    var settings = {
      // Force resulting image size?
      // (0=inherit from placeholder img element)
      'width'        : 0,
      'height'       : 0,
      
      // Crop resulting image?
      'crop'         : true,
      
      // Center when cropping?
      'center'       : true,
      
      // Smart crop+center mode?,
      'smart'        : true,
      
      // If the original image is too small to fit
      // the wished sized, do we make it float
      // within a larger container?
      'preserveSize' : false,
      
      // Force small images to be resized?
      'forceResize' : false,
      
      // Optional classes for resulting img element
      // and div container element
      'imgClass'     : '',
      'contClass'    : ''
    };
    
    // If options exist, lets merge them
    // with our default settings
    if ( options ) { 
      $.extend( settings, options );
    }    

    return this.each( function() {        
      // ----------------
      // MAIN PLUGIN CODE
      // ----------------
      var $this   = $(this), // Image object
          realSrc = $this.attr( "realsrc" ) || $this.attr( "src" );
          
      // Check config consistency
      if ( !settings.crop && !realSrc ) {
        return; // Nothing to do
      }
 
      // Create temp image and load it
      var img  = $( document.createElement('img') );
      img.bind( "load", { img: this }, _onload ); // Important: We pass the DOM img objet, not the jQ one
      img.attr( "src", realSrc );
    });
    
    // Where the magic happens
    function _onload( e ) {
      // Notes on image elements used below:
      //   'this'   is a DOM image object, it's a temporary IMG element that serves to load the desired image.
      //   $origImg is the jQ wrapper object for the above image element.
      //   curImg   is the DOM element matching the <img realsrc> tag in your HTML page
      //   $curImg  is the jQ wrapper object for the previous image element.
      // All the work is done on the temporary image object (this/$origImg). Once it's loaded and sized properly,
      // we encapsulate it within a containing <div> (cont) that is also used for cropping the image by using
      // a masking technique (faux-cropping using CSS overflow hidden).
      // Finally, we swap the original <img> node with that <div> node.
      var $origImg = $(this),    // Original image (natural size), temp node
          origW   = this.width, // Can't use origImg.width() because not visible
          origH   = this.height,
          curImg  = e.data.img, // Current placeholder image in markup (DOM object)
          $curImg = $(curImg),  // Current placeholder image in markup (jQuery object)
          reqW    = settings.width  || curImg.width,  // Requested width (do not use $curImg.width()!)
          reqH    = settings.height || curImg.height, // Requested height
          cropW   = settings.forceResize ? reqW : Math.min( origW, reqW ), // What it will finally be...
          cropH   = settings.forceResize ? reqH : Math.min( origH, reqH ),
          cont; // Encapsulating <div>

      // Check loaded image is valid
      if ( !origW || !origH ) {
        return; // Invalid, do nothing
      }
                    
      // No-crop mode, same dimensions: just act as a deferred loader
      if ( !settings.crop && reqW == origW && reqH == origH ) {
        $curImg.attr( "src", $origImg.attr( "src" ) );
        return; // Done!
      }
      
      // Resize image
      if ( cropW * origH < cropH * origW ) {
        this.width = Math.round( origW * cropH / origH );
        this.height = cropH;
      } else {
        this.width = cropW;
        this.height = Math.round( origH * cropW / origW );
      }
      
      // Style it
      if ( settings.imgClass ) {
        $origImg.addClass( settings.imgClass );
      }
            
      if ( !settings.crop ) {
        $curImg.replaceWith( $origImg ); // Swap nodes
        return;
      }

      // Crop

      // Create container element (mask)
      cont = $( document.createElement( 'div' ) );
      cont.addClass( "resize-and-crop" );
      if ( settings.preserveSize ) {
        cont.width(  reqW ).height( reqH );
      } else {
        // Crop it
        cont.width(  cropW ).height( cropH );
        // Center it
        if ( settings.center ) {
          $origImg.css( 'left', - Math.max( 0, Math.round( ( this.width  - cropW ) / 2 ) ) );
          if ( settings.smart && this.height / this.width > 1.2 ) {
            $origImg.css( 'top', 0 );
          } else {
            $origImg.css( 'top',  - Math.max( 0, Math.round( ( this.height - cropH ) / 2 ) ) );
          }
        }
      }
      
      // Style it
      if ( settings.contClass ) {
        cont.addClass( settings.contClass );
      }
      
      // Insert image into container
      cont.append( $origImg );
      
      // Swap nodes
      $curImg.replaceWith( cont );
    }

  };
})( jQuery );
