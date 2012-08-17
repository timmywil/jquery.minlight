/**
 * @license minLight.js
 * A minimal lightbox that fades in/out a specified target
 *   and builds a target with an image only if it is not already on the page
 * Copyright (c) 2012 timmy willison
 * Dual licensed under the MIT and GPL licenses.
 * http://timmywillison.com/licence/
 */

(function( factory ) {
	// Define the plugin using AMD if present
	// Skips commonjs as this is not meant for that environment
	if ( typeof define === "function" && define.amd ) {
		define([ "jquery" ], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {
	"use strict";

	var // Used to construct an id for the target using
		// the data-target selector (even if it's not an id)
		rselect = /[\#\.\s\,]/g,

		// Used to convert camelCase to dashed
		rupper = /([a-z]+)([A-Z])/g,
		fdashed = function( all, precedes, letter ) {
			return precedes + ("-" + letter).toLowerCase();
		},

		slice = Array.prototype.slice,

	/**
	 * @constructor
	 * @param {!Object} $link - jQuery object of the current anchor
	 * @param {Object} options - An object literal containing options to override default options
	 */
	Lightbox = function( link, options ) {
		this.link = link;
		var $link = this.$link = $(link);

		// Extend options with any data-* attributes present on the link
		$.each( options, function( key ) {
			var opt = $link.attr( "data-" + key.replace(rupper, fdashed) );
			if ( opt !== undefined ) {
				options[ key ] = opt;
			}
		});
		this.options = options;
		this._setTarget( options.target );
		this.bind();
	};

	// All options can be overridden by passing an object literal like any other plugin
	//   OR with data-* attributes on the link (which can be very useful when calling minLight on more than one link at a time)
	// e.g. <a href="something.jpg" title="alt text" data-fade-time="300" data-img-width="750" data-container="#main" data-target="#awesome-lightbox">Click here</a>
	//
	// Order of precendence: data-* attributes > options passed on creation > defaults
	Lightbox.defaults = {
		fadeTime: "slow",
		easing: "swing",
		container: "body",
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

	Lightbox.prototype = {

		/**
		 * Sets the lightbox target; creates a lightbox with an image if one does not exist
		 * @param {String} target - A selector for the target
		 * @private
		 */
		_setTarget: function( target ) {
			var id,
				link = this.link,
				$link = this.$link,
				options = this.options,
				$target = $( target );

			if ( !$target.length ) {
				// Create a new target and mask if they do not exist on the page
				id = $target.selector.replace( rselect, "" );
				this.$img = $("<img>").attr({
					alt: $link.attr("title"),
					src: link.href,
					width: options.imgWidth,
					height: options.imgWeight
				});
				$target = $( options.skeleton ).attr( "id", id ).data( "_minGenerated", true )
					.prepend( this.$img )
					.appendTo( options.container );
			} else {
				$target.data( "_minNumAttached", ($target.data("_minNumAttached") || 0) + 1 );
			}
			if ( !$target.length ) {
				$.error( "minLight - specified container is not on the page: " + target );
			}
			this.$mask = $target.prev(".lightbox-mask");
			if ( !this.$mask.length ) {
				this.$mask = $("<div class="lightbox-mask"></div>").insertBefore( target ).addClass( options.maskClass );
				if ( options.expandMask ) {
					this._expandMask();
				}
			}
			this.$target = $target;
			this.$close = $target.find(".lightbox-close");
		},

		/**
		 * Expands the mask to fit the entire document/window (whichever is bigger)
		 */
		_expandMask: function() {
			var d = $(document).height(),
				w = $(window).height();
			this.$mask.height( d > w ? d : w );
		},

		/**
		 * Opens the lightbox
		 */
		open: function() {
			var options = this.options,
				fadeTime = options.fadeTime,
				easing = options.easing;

			this.$mask.stop( true, true ).fadeIn( fadeTime, easing );
			this.$target.stop( true, true ).fadeIn( fadeTime, easing );

			if ( $.isFunction(options.onOpen) ) {
				// Called in the lightbox context
				// Passes the $target
				options.onOpen.call( this, this.$target );
			}
		},

		/**
		 * Close the lightbox
		 */
		close: function() {
			var options = this.options,
				fadeTime = options.fadeTime,
				easing = options.easing;

			this.$mask.stop( true, true ).fadeOut( fadeTime, easing );
			this.$target.stop( true, true ).fadeOut( fadeTime, easing );

			if ( $.isFunction(options.onClose) ) {
				// Called in the lightbox context
				// Passes the $target
				options.onClose.call( this, this.$target );
			}
		},

		/**
		 * Bind all minimal Lightbox clicks (toggling link, close button, mask)
		 */
		bind: function() {
			var $closers = this.$close,
				self = this;

			// Toggle showing the lightbox on the main link
			this.$link
				.bind("click.minlight", function( e ) {
					e.preventDefault();
					if ( self.$target.css("display") !== "none" ) {
						self.close();
					} else {
						self.open();
					}
				});

			// Bind any close links
			if ( this.options.closeOnMaskClick ) {
				$closers = $closers.add( this.$mask );
			}
			$closers.bind( "click.minlight", function( e ) {
				e.preventDefault();
				self.close();
			});
		},

		/**
		 * Unbind all minimal lightbox clicks
		 */
		unbind: function() {
			this.$link
				.add( this.$mask )
				.add( this.$close ).unbind(".minlight");
		},

		/**
		 * Removes the current target if it is not being used by another instance
		 * @private
		 */
		_removeTarget: function() {
			var $target = this.$target,
				numTargets = $target.data("_minNumAttached"),
				isGenerated = $target.data("_minGenerated");

			if ( !numTargets || numTargets <= 1 ) {
				// Only remove the target if it was generated
				if ( isGenerated ) {
					$target.remove();
				}
				// Remove the mask regardless
				this.$mask.remove();
			}

			// Reduce the number of instances even if removed
			$target.data( "_minNumAttached", numTargets && numTargets - 1 );
		},

		/**
		 * Destroy the current minimal lightbox instances
		 */
		destroy: function() {
			this.unbind();
			this._removeTarget();
			this.$link.removeData("_minLight");
		},

		/**
		 * Internally sets options
		 * @param {Object} options - An object literal of options to set
		 * @private
		 */
		_setOptions: function( options ) {
			var self = this;
			$.each( options, function( key, value ) {
				switch( key ) {
					case "container":
						value = $(value);
						if ( !value.length ) {
							return;
						}
						value.append( self.$mask, self.$target );
						break;
					case "target":
						self._removeTarget();
						self._setTarget( value );
						break;
					case "imgWidth":
					case "imgHeight":
						// Keep data-* attribute precedence
						if ( self.$img && self.$link.attr("data-" + key) === undefined ) {
							self.$img[ key.replace("img", "").toLowerCase() ]( value );
						}
				}
				self.options[ key ] = value;
				switch( key ) {
					case "fadeTime":
					case "easing":
						// Rebind so the fadeTime and easing don't need retrieving on every click
						self.unbind();
						self.bind();
				}
			});
		},

		/**
		 * Get/set option on an existing minLight instance
		 * @return {Array|undefined} If getting, returns an array of all values
		 *   on each minLight for a given key. If setting, continue chaining.
		 */
		option: function( key, value ) {
			var options;
			if ( !key ) {
				// Avoids returning direct reference
				return $.extend( {}, this.options );
			}

			if ( typeof key === "string" ) {
				if ( value === undefined ) {
					return this.options[ key ];
				}
				options = {};
				options[ key ] = value;
			} else {
				options = key;
			}

			this._setOptions( options );
		},

		/**
		 * @return {Object} The minLight instance
		 */
		instance: function() {
			return this;
		}
	};

	/**
	 * Extend jQuery
	 * @param {Object|String} options - The name of a method to call on the minLight prototype or an object literal of options
	 * @return {jQuery|Object} jQuery instance for regular chaining or the return value of a minLight method call
	 */
	$.fn.minLight = function( options ) {
		var instance, args, m,
			ret = [];

		// Call methods widget-style
		if ( typeof options === "string" ) {
			args = slice.call( arguments, 1 );
			this.each(function() {
				instance = $.data( this, "_minLight" );

				if ( instance && options.charAt(0) !== "_" && typeof (m = instance[ options ]) === "function" &&
					(m = m.apply( instance, args )) !== undefined ) {

					ret.push( m );
				}
			});

			// Return an array of values for the jQuery instances
			// Or the value itself if there is only one
			return ret.length ?
				(ret.length === 1 ? ret[0] : ret) :
				this;
		}

		// Extend default with given object literal
		options = $.extend( {}, Lightbox.defaults, options );

		return this.each(function() {
			// Attach the new minLight instance to the element
			if ( !$.data(this, "_minLight") ) {
				$.data( this, "_minLight", new Lightbox(this, options) );
			}
		});
	};
}));
