/**
 * @license minlight.js v@VERSION
 * Updated: @DATE
 * A minimal lightbox that fades in/out a specified target
 * Copyright (c) 2013 timmy willison
 * Released under the MIT license
 * https://github.com/timmywil/jquery-minlight/blob/master/MIT-LICENSE.txt
 */

(function( factory ) {
	// Define the plugin using AMD if present
	// Skips commonjs as this is not meant for that environment
	if ( typeof define === 'function' && define.amd ) {
		define([ 'jquery' ], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {
	'use strict';

	var datakey = '__minlight',

		// Used to convert camelCase to dashed
		rupper = /([A-Z])/g,

		slice = Array.prototype.slice,

	/**
	 * @constructor
	 * @param {Element} elem - Element in charge of opening the lightbox with a click or focus
	 * @param {Object} options - An object literal containing options to override default options
	 */
	Lightbox = function( elem, options ) {

		// Don't remake
		var d = $.data( elem, datakey );
		if ( d ) {
			return d;
		}

		// Allow instantiation without `new` keyword
		if ( !(this instanceof Lightbox) ) {
			return new Lightbox( elem, options );
		}

		this.elem = elem;
		var $elem = this.$elem = $(elem);

		// Extend default options
		this.options = options = $.extend( {}, Lightbox.defaults, options );

		// Extend options with any data-* attributes present on the elem
		$.each( options, function( key ) {
			var opt = $elem.attr( 'data-' + key.replace(rupper, '-$1').toLowerCase() );
			if ( opt !== undefined ) {
				options[ key ] = opt;
			}
		});

		this.content = options.content;
		this._setTarget();
		this.bind();
		this.opened = false;
		$.data( elem, datakey, this );
	};

	// All options can be overridden by passing an object literal like any other plugin
	//   OR with data-* attributes on the element (which can be very useful when calling minlight on more than one element at a time)
	// e.g. <a href='something.jpg' title='alt text' data-fade-time='300' data-img-width='750' data-container='#main' data-target='#awesome-lightbox'>Click here</a>
	//
	// Order of precendence: data-* attributes > options passed on creation > defaults
	Lightbox.defaults = {
		// Namespace for binding events
		namespace: '.minlight',
		// Animation time in ms
		fadeTime: 200,
		easing: 'swing',
		container: 'body',
		// Set this to true if you'd like to do your own css transition using your own styles
		transition: false,
		// Classes for the lightbox
		lightboxClass: 'lightbox',
		maskClass: 'lightbox-mask',
		// Classes for doing your own transitions
		openClass: 'lightbox-open',
		closedClass: 'lightbox-closed',
		// Selector for finding all user-defined close buttons in the target
		// for quick binding to close
		closeSelect: '',
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
		target: '',
		// Image href (usually assigned from the anchor's href)
		href: '',
		imgWidth: 'auto',
		imgHeight: 'auto',
		// The basic skeleton for a lightbox
		// Don't use a data-* attribute to set this (that's just ugly)
		skeleton: '<div><a href="#" class="lightbox-close" data-bypass="true">X</a></div>'
		// onOpen, onClose, willOpen, willClose cannot be extended with data-*, so they are included in defaults
		// they can be passed on creation or changed with the `option` method
		// they can also be bound on the element as "minlightopen" and "minlightclose"
	};

	Lightbox.prototype = {
		constructor: Lightbox,

		/**
		 * @returns {Object} The minlight instance
		 */
		instance: function() {
			return this;
		},

		/**
		 * Opens the lightbox
		 */
		open: function( fn ) {
			this._openClose( false, fn );
		},

		/**
		 * Close the lightbox
		 */
		close: function( fn ) {
			this._openClose( true, fn );
		},

		/**
		 * Toggle the lightbox depending on css display
		 * @param {Function} fn Callback to be called on open/close completion
		 */
		toggle: function( fn ) {
			// Toggle on click
			this[ this.opened ? 'close' : 'open' ]( fn );
		},

		/**
		 * Bind all minimal Lightbox clicks (toggling elem, close button, mask)
		 */
		bind: function() {
			var tabIndex,
				elem = this.elem,
				$elem = this.$elem,
				$closers = this.$close,
				options = this.options,
				ns = options.namespace,
				events = {},
				self = this;

			// Bind minlight events from options
			$.each([ 'Open', 'Close' ], function() {
				// onOpen, onClose
				var m = options[ 'on' + this ];
				if ( $.isFunction(m) ) {
					events[ 'minlight' + this.toLowerCase() + ns ] = m;
				}
				// willOpen, willClose
				m = options[ 'will' + this ];
				if ( $.isFunction(m) ) {
					events[ 'minlightwill' + this.toLowerCase() + ns ] = m;
				}
			});

			// Use click for links
			if ( $.nodeName(elem, 'a') || $.nodeName(elem, 'button') ) {
				events[ 'click' + ns ] = function( e ) {
					e.preventDefault();
					self.toggle();
				};

			// Use focus if focusable
			// jQuery checks focusable internally when retrieving tabIndex
			} else if ( (tabIndex = $elem.prop('tabIndex')) !== undefined && tabIndex !== -1 ) {
				events[ 'focus' + ns ] = function() {
					self.open(function() {
						$elem.blur();
					});
				};
			}

			if ( !$.isEmptyObject(events) ) {
				$elem.on( events );
			}

			// Bind any close links
			if ( options.closeOnMaskClick ) {
				$closers = $closers.add( this.$mask );
			}
			$closers.on( 'click' + ns, function( e ) {
				e.preventDefault();
				self.close();
			});
		},

		/**
		 * Unbind all minimal lightbox clicks
		 */
		unbind: function() {
			this.$elem
				.add( this.$mask )
				.add( this.$close ).off( this.options.namespace );
		},

		/**
		 * Destroy the current minimal lightbox instances
		 */
		destroy: function() {
			this.unbind();
			this._removeTarget();
			$.removeData( this.elem, datakey );
		},

		/**
		 * Get/set option on an existing minlight instance
		 * @returns {Array|undefined} If getting, returns an array of all values
		 *   on each minlight for a given key. If setting, continue chaining.
		 */
		option: function( key, value ) {
			var options;
			if ( !key ) {
				// Avoids returning direct reference
				return $.extend( {}, this.options );
			}

			if ( typeof key === 'string' ) {
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
		 * Internally sets options
		 * @param {Object} options - An object literal of options to set
		 */
		_setOptions: function( options ) {
			var self = this;
			$.each( options, function( key, value ) {
				switch( key ) {
					case 'container':
						value = $(value);
						if ( !value.length ) {
							return;
						}
						value.append( self.$mask, self.$target );
						break;
					case 'imgWidth':
					case 'imgHeight':
						// Keep data-* attribute precedence
						if ( self.$img && self.$elem.attr('data-' + key) === undefined ) {
							self.$img[ key.replace('img', '').toLowerCase() ]( value );
						}
						break;
					case 'target':
					case 'disableMask':
						self._removeTarget();
						/* falls through */
					case 'closeOnMaskClick':
					case 'namespace':
						self.unbind();
				}
				self.options[ key ] = value;
				switch( key ) {
					case 'fadeTime':
					case 'easing':
						// Rebind so the fadeTime and easing don't need retrieving on every click
						self.unbind();
						self.bind();
						break;
					case 'target':
					case 'disableMask':
						self._setTarget();
						/* falls through */
					case 'closeOnMaskClick':
					case 'namespace':
						self.bind();
				}
			});
		},

		/**
		 * Triggers a minlight event
		 * @param {String} name
		 * @param {Mixed} [arg1, arg2, arg3, ...] Arguments to append to the trigger
		 */
		_trigger: function ( name ) {
			var args = slice.call( arguments, 1 );
			this.$elem.triggerHandler( 'minlight' + name, args.length ? [this].concat(args) : [this] );
		},

		/**
		 * Opens or closes the lightbox
		 * @param {Boolean} close Whether to close the lightbox
		 * @param {Function} [fn] Complete callback for opening/closing
		 */
		_openClose: function( close, fn ) {
			if ( !$.isFunction(fn) ) { fn = $.noop; }
			var $target = this.$target;
			if ( this.opened ^ close ) {
				// Call complete
				fn.call( $target[0], this );
				return;
			}
			var self = this,
				options = this.options,
				fadeTime = options.fadeTime,
				easing = options.easing,
				mL = $target.outerWidth() / 2 * -1,
				str = close ? 'close' : 'open';

			// Trigger will event
			this._trigger( 'will' + str );

			// Center
			$target.css( 'marginLeft', mL );

			/**
			 * Called after the fadeIn or the transition completes
			 */
			function complete() {
				self.opened = !close;
				if ( close ) {
					// Hide regardless
					$target.hide();
				}
				fn.call( $target[0], self );
				// Trigger event
				self._trigger( str );
			}

			// Transition or fade
			if ( options.transition ) {
				// Display should be shown before adding the class (use opacity to fade in on transition)
				if ( !close ) {
					$target.show();
				}
				// Kick opening/closing to the end of the stack
				setTimeout(function() {
					if ( close ) {
						$target.removeClass( options.openClass ).addClass( options.closedClass );
					} else {
						$target.removeClass( options.closedClass ).addClass( options.openClass );
					}
				});
				setTimeout( complete, fadeTime );
			} else {
				$target.stop()[ close ? 'fadeOut' : 'fadeIn' ]( fadeTime, easing, complete );
			}

			// Handle mask
			if ( !options.disableMask ) {
				if ( !close && options.expandMask ) {
					this._expandMask();
				}
				this.$mask.stop()[ close ? 'fadeOut' : 'fadeIn' ]( fadeTime, easing );
			}
		},

		/**
		 * Sets the lightbox target; creates a lightbox with an image if one does not exist
		 */
		_setTarget: function() {
			var tabIndex;
			var elem = this.elem;
			var $elem = this.$elem;
			var options = this.options;
			var target = options.target;
			var $target = $( target );

			if ( !$target.length ) {
				// If this is an anchor or is focusable like an input,
				// create an automated target
				if ( $.nodeName( elem, 'a' ) || ((tabIndex = $elem.prop('tabIndex')) !== undefined && tabIndex !== -1) ) {
					// Create a new target if they do not exist on the page
					if ( !this.content ) {
						this.content = this.$img = $('<img>').attr({
							alt: $elem.attr('title'),
							src: options.href || elem.href,
							width: options.imgWidth,
							height: options.imgHeight
						});
					}

					$target = $( options.skeleton )
						.prepend( this.content );

					// Unescape characters in the selector
					$target.attr( 'id', target.replace('#', '').replace(/\\/g, '') );

				} else {
					// Move elem to our container
					$target = $elem;
				}
			}

			if ( !$target.length ) {
				$.error( 'minlight - target not found: ' + target );
			}

			// Add target to the container
			if ( !$.contains(document, $target[0]) ) {
				$target.appendTo( options.container ).data( '_minAppended', true );
			}

			$target
				.addClass( options.lightboxClass )
				.data( '_minNumAttached', ($target.data('_minNumAttached') || 0) + 1 );

			if ( options.transition ) {
				$target.addClass( options.closedClass );
			}

			// Create a mask if it does not exist
			if ( options.disableMask ) {
				this.$mask = $();
			} else {
				this.$mask = $target.prev('.' + options.maskClass.split(' ')[0] );
				if ( !this.$mask.length ) {
					this.$mask = $('<div>')
						.addClass( options.maskClass )
						.insertBefore( $target );
				}
			}
			this.$target = $target;
			// Cache close buttons
			this.$close = $target.find('.lightbox-close').add( $target.find( options.closeSelect ) );
		},

		/**
		 * Removes the current target if it is not being used by another instance
		 */
		_removeTarget: function() {
			var $target = this.$target,
				numTargets = $target.data('_minNumAttached'),
				wasAppended = $target.data('_minAppended');

			if ( !numTargets || numTargets <= 1 ) {
				// Only remove the target if it was generated by minlight
				if ( wasAppended ) {
					$target.remove();
				}
				// Remove the mask regardless
				this.$mask.remove();
			}

			// Reduce the number of instances even if removed
			$target.data( '_minNumAttached', numTargets && numTargets - 1 );
		},

		/**
		 * Expands the mask to fit the entire document/window (whichever is bigger)
		 */
		_expandMask: function() {
			var d = $(document).height(),
				w = $(window).height();
			this.$mask.height( d > w ? d : w );
		}
	};

	/**
	 * Extend jQuery
	 * @param {Object|String} options - The name of a method to call on the minlight prototype or an object literal of options
	 * @returns {jQuery|Object} jQuery instance for regular chaining or the return value of a minlight method call
	 */
	$.fn.minlight = function( options ) {
		var instance, args, m, ret;

		// Call methods widget-style
		if ( typeof options === 'string' ) {
			ret = [];
			args = slice.call( arguments, 1 );
			this.each(function() {
				instance = $.data( this, datakey );

				// Ignore methods beginning with `_`
				if ( instance && options.charAt(0) !== '_' &&
					typeof (m = instance[ options ]) === 'function' &&
					// If nothing is returned, do not add to return values
					(m = m.apply( instance, args )) !== undefined ) {

					ret.push( m );
				}
			});

			// Return an array of values for the jQuery instances
			// Or the value itself if there is only one
			// Or keep chaining
			return ret.length ?
				(ret.length === 1 ? ret[0] : ret) :
				this;
		}

		return this.each(function() { new Lightbox( this, options ); });
	};

	return Lightbox;
}));
