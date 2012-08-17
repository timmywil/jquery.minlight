# jQuery minLight lightbox plugin

minLight is meant to create the most common, simple lightboxes. Tests and more docs coming soon.


## Usage

	$(".minlight-links").minLight({
		container: "#main"
	});


## Options

All options can be overridden by passing an object literal like any other plugin
OR with data-* attributes on the link (which can be very useful when calling minLight on more than one link at a time)
e.g. `<a href="something.jpg" title="alt text" data-fade-time="300" data-img-width="750" data-container="#main" data-target="#awesome-lightbox">Open Lightbox</a>`

Order of precendence: data-* attributes > options passed on creation > defaults

	Lightbox.defaults = {
		fadeTime: "slow",
		easing: "swing",
		container: "body",
		// The actual lightbox the link should correspond to
		// If one already exists hidden on the page,
		// add it here
		target: "",
		maskClass: "",
		imgWidth: "auto",
		imgHeight: "auto",
		// Close the lightbox when the mask is clicked
		closeOnMaskClick: true,
		// Expand the mask to handle document height being larger than window height
		// This is sometimes not ideal if the container is something other than the body
		expandMask: true,
		// The basic skeleton for a lightbox
		// Don"t use a data-* attribute to set this (that's just ugly)
		skeleton: "" +
			"<div class='lightbox'>" +
				"<a href='#' class='lightbox-close ir'>Close</a>" +
			"</div>"
		// onOpen, onClose ( cannot be extended with data-*, so do not include them in defaults )
	};

## Methods

Coming soon