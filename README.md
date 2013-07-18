# jQuery minlight

minlight creates lightboxes. By default, it uses a simple fading javascript animation. However, set the `transition` option to `true` and use your own custom css transitions that you can trigger through the use of classes.

Specify `openClass` and `closedClass` in options, or use the defaults.

Check out [Effeckt.css](http://h5bp.github.io/Effeckt.css/dist/) for suggested performant CSS animations and transitions to use with your lightboxes.

Due to minlight's tiny footprint, and the fact that it is made to work with CSS (taking advantage of hardward acceleration automatically), it is perfectly suited for mobile.

minlight.min.js (5.0kb/2.1kb gzip!), included in this repo, is compressed with [uglifyjs](https://github.com/mishoo/UglifyJS).


## Loading minlight
minlight can obviously be included with your scripts at the end of the body, but minlight supports AMD for javascript module love.

With script tags:

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="/js/minlight.js"></script>
```

With AMD loader in an anonymous module:

```js
define([ "jquery", "jquery-plugins/minlight" ], function( $ ) {
	$(function() {
		$(".minlight-links").minLight();
	});
});
```

## Initialization

```js
// Will bind to click
$("a.minlight-links").minlight({
	container: "#main",
	onOpen: function( e, minlight ) {
		// context is the minlight element
		// minlight is the minlight instance
		// $target (the lightbox) is available at minlight.$target
	}
});

// Will bind to focus
$("input.minlight-input").minlight({
	href: "awesome.jpg"
});
```

## Options

All options can be overridden by passing an object literal like any other plugin,<br>
with the `"option"` method,<br>
OR with data-* attributes on the element,<br>
which can be very useful when calling minlight on more than one element at a time.

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
	// Classes for the lightbox
	lightboxClass: "lightbox",
	maskClass: "lightbox-mask",
	// Classes for doing your own transitions
	openClass: "lightbox-open",
	closedClass: "lightbox-closed",
	// Selector for finding all user-defined close buttons in the target
	// for quick binding to close
	closeSelect: "",
	// Close the lightbox when the mask is clicked
	closeOnMaskClick: true,
	// Expand the mask to handle document height being larger than window height
	// This is sometimes not ideal if the container is something other than the body
	expandMask: true,
	// Disable the mask
	disableMask: false,
	// The actual lightbox the element should correspond to
	// If one already exists hidden on the page,
	// add its ID selector here
	target: "",
	// Image href (usually assigned from the anchor's href)
	href: "",
	imgWidth: "auto",
	imgHeight: "auto",
	// The basic skeleton for a lightbox
	// Don"t use a data-* attribute to set this (that's just ugly)
	skeleton: "<div><a href='#' class='lightbox-close' data-bypass>X</a></div>"
	// onOpen, onClose, willOpen, willClose cannot be extended with data-*, so they are included in defaults
	// they can be passed on creation or changed with the `option` method
	// they can also be bound on the element as "minlightopen", "minlightclose", "minlightwillopen", "minlightwillclose"
};
```

## Methods

Methods can be called in the same way as a widget from the UI widget factory. Pass a method name to minlight. Strings are interpreted as method names.

### `open`

```js
$elem.minlight("open");
```

Open the lightbox

### `close`

```js
$elem.minlight("close");
```

Close the lightbox

### `destroy`

```js
$elem.minlight("destroy");
```

Unbinds all events and removes all data, including the minlight instance on the element.

### `instance`

```js
var minInstance = $elem.minlight("instance");
```

Retreives the minlight instance(s) from the set. If there are multiple, you will get an array of instances. If there is only one, you will just get the instance of minlight.

### `option`

```js
// One at a time
$elem.minlight("option", "onOpen", function() {
	// Replace the onOpen callback
});

// Several options at once
$elem.minlight("option", {
	fadeTime: "fast",
	container: "#main",
	maskClass: "super-mask"
});
```

Any option can be changed. See the defaults above for a list.

## Events

### `"minlightopen"`

__Arguments Received__

  1. `e` _(jQuery.Event)_: jQuery event object
  2. `min` _(Lightbox)_: The minlight instance

Fired when the lightbox has opened (after animation completion)

### `"minlightclose"`

__Arguments Received__

  1. `e` _(jQuery.Event)_: jQuery event object
  2. `min` _(Lightbox)_: The minlight instance

Fired when the lightbox is closed (after animation completion)

### `"minlightwillopen"`

__Arguments Received__

  1. `e` _(jQuery.Event)_: jQuery event object
  2. `min` _(Lightbox)_: The minlight instance

Fired when the lightbox is about to open (before animation completion)

### `"minlightwillclose"`

__Arguments Received__

  1. `e` _(jQuery.Event)_: jQuery event object
  2. `min` _(Lightbox)_: The minlight instance

Fired when the lightbox is about to close (before animation completion)

