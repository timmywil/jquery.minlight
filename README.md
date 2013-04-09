# jQuery minLight lightbox plugin

minLight is meant to create the most common, simple lightboxes that use a customizable fading animation. It is also perfectly suited for mobile jQuery projects.

By default, minLight will open/close lightboxes using a simple javascript fade. However, set the `transition` option to `true` and use your own custom css transitions using an `openClass` and a `closedClass`.

minLight.min.js (4.3kb/1.8kb gzip), included in this repo, is compressed with [uglifyjs](https://github.com/mishoo/UglifyJS).


## Loading minLight
minLight can obviously be included with your scripts at the end of the body, but minLight supports AMD for javascript module love.

With script tags:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
<script src="/js/minLight.js"></script>
```

With AMD loader in an anonymous module:

```js
define([ "jquery", "jquery-plugins/minLight" ], function( $ ) {
	$(function() {
		$(".minlight-links").minLight();
	});
});
```

## Initialization

```js
// Will bind to click
$("a.minlight-links").minLight({
	container: "#main",
	onOpen: function() {
		// context is the lightbox the link has opened
		console.log( this ); // <div class="lightbox"></div>
	}
});

// Will bind to focus
$("input.minlight-input").minLight({
	href: "awesome.jpg"
});
```

## Options

All options can be overridden by passing an object literal like any other plugin,<br>
with the `"option"` method,<br>
OR with data-* attributes on the element,<br>
which can be very useful when calling minLight on more than one element at a time.

e.g.

```html
<a href="something.jpg" title="alt text" data-fade-time="300" data-img-width="750"
	data-container="#main" data-target="#awesome-lightbox">Open Lightbox</a>
```

__Order of precendence: data-* attributes > options passed on creation > defaults__

```js
Lightbox.defaults = {
	// Animation time in ms
	fadeTime: 200,
	easing: "swing",
	container: "body",
	// Set this to true if you'd like to do your own css transition using your own styles
	transition: false,
	// Classes for doing your own transitions
	openClass: "open",
	closedClass: "closed",
	// The actual lightbox the element should correspond to
	// If one already exists hidden on the page,
	// add its ID selector here
	target: "",
	// Classes for the lightbox
	lightboxClass: "lightbox",
	maskClass: "lightbox-mask",
	// Image href (usually assigned from the anchor's href)
	href: "",
	imgWidth: "auto",
	imgHeight: "auto",
	// Close the lightbox when the mask is clicked
	closeOnMaskClick: true,
	// Expand the mask to handle document height being larger than window height
	// This is sometimes not ideal if the container is something other than the body
	expandMask: true,
	// The basic skeleton for a lightbox
	// Don"t use a data-* attribute to set this (that's just ugly)
	skeleton: "<div><a href='#' class='lightbox-close' data-bypass>X</a></div>"
	// onOpen, onClose cannot be extended with data-*, so they are included in defaults
	// they can be passed on creation or changed with the `option` method
};
```

## Methods

Methods can be called in the same way as a widget from the UI widget factory. Pass a method name to minLight. Strings are interpreted as method names.

### `open`

```js
$elem.minLight("open");
```

Open the lightbox

### `close`

```js
$elem.minLight("close");
```

Close the lightbox

### `destroy`

```js
$elem.minLight("destroy");
```

Unbinds all events and removes all data, including the minLight instance on the element.

### `instance`

```js
var minInstance = $elem.minLight("instance");
```

Retreives the minLight instance(s) from the set. If there are multiple, you will get an array of instances. If there is only one, you will just get the instance of minLight.

### `option`

```js
// One at a time
$elem.minLight("option", "onOpen", function() {
	// Replace the onOpen callback
});

// Several options at once
$elem.minLight("option", {
	fadeTime: "fast",
	container: "#main",
	maskClass: "super-mask"
});
```

Any option can be changed. See the defaults above for a list.
