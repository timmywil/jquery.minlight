module('environment');

test('Basic requirements', 7, function() {
	ok( Array.prototype.push, 'Array.push()' );
	ok( Function.prototype.apply, 'Function.apply()' );
	ok( document.getElementById, 'getElementById' );
	ok( document.getElementsByTagName, 'getElementsByTagName' );
	ok( RegExp, 'RegExp' );
	ok( jQuery, 'jQuery' );
	ok( $, '$' );
});

module('minlight', {
	teardown: function() {
		$('.minlight-link, #minlight-input').minlight('destroy');
	}
});

test('Usage', 12, function() {
	var $min = $('.minlight-link').minlight(),
		instance = $min.minlight('instance'),
		$target = instance.$target;

	ok( $min.length, 'minLink is present' );
	ok( $min.data('__minlight'), 'minlight instance added as data' );
	ok( $target[0].parentNode, 'Target added' );
	ok( instance.$mask[0].parentNode, 'Mask added' );

	$min.minlight('destroy');
	ok( !$min.data('__minlight'), 'Method: destroy (data)' );
	ok( !$target[0].parentNode, 'Method: destroy (target removed)' );

	$min.minlight({
		target: '#awesome-lightbox'
	});
	instance = $min.minlight('instance');
	$target = instance.$target;

	equal( $target[0].id, 'awesome-lightbox', 'target is awesome-lightbox' );
	ok( instance.$mask[0].parentNode, 'Mask present' );

	$min.minlight('destroy');
	ok( !$min.data('__minlight'), 'Method: destroy (data)' );
	ok( $target[0].parentNode, 'Method: destroy (target not removed, it existed before)' );

	$min.minlight({
		container: '#qunit-fixture',
		fadeTime: 50,
		onOpen: function( e, min ) {
			equal( min.$target.css('display'), 'block', 'Method: open (check display)' );
			min.close();
		},
		onClose: function( e, min ) {
			equal( min.$target.css('display'), 'none', 'Method: close (check display)' );
			start();
		}
	});

	stop();
	$min.minlight('open');
});

test('Input', 4, function() {
	var $minInput = $('#minlight-input').minlight({
			href: 'frame.jpg',
			container: '#main',
			fadeTime: 50,
			onOpen: function( e, min ) {
				equal( min.$target[0].parentNode.id, 'main', 'Custom container and onOpen set on focus' );
				start();
			}
		}),
		instance = $minInput.minlight('instance'),
		$target = instance.$target;

	ok( instance, 'Instance created from input' );
	equal( $target[0].parentNode.id, 'main', 'Target added to custom container' );
	equal( $target.find('img').attr('src'), 'frame.jpg', 'href option set correctly' );

	stop();
	$minInput.focus();
});

test('Transition', 4, function() {
	var $min = $('.minlight-link').minlight({
		transition: true
	});
	ok( $min.minlight('option', 'transition'), 'Transition option set' );

	stop();
	var openClass = $min.minlight('option', 'openClass');
	var closedClass = $min.minlight('option', 'closedClass');
	var $target = $min.minlight('instance').$target;
	$min.minlight('open', function() {
		ok( $target.hasClass(openClass), 'minlight applies openClass on open' );
		$min.minlight('close', function() {
			ok( $target.hasClass(closedClass), 'minlight applies closedClass on close' );
			ok( !$target.hasClass(openClass), 'minlight removes openClass on close' );
			start();
		});
	});
});

test('Target', 1, function() {
	var $div = $('div').first();
	var min = $div.minlight().minlight('instance');
	equal( $div[0], min.$target[0], 'An unfocusable element is used as the target' );
});

test('No conflict', 1, function() {
	var j = jQuery.noConflict( true );
	ok( j('.minlight-link').minlight().data('__minlight'), 'minlight works in noConflict' );
	// Restore
	window.$ = window.jQuery = j;
});

test('content option', function() {
	expect(1);
	var min = $('.minlight-link').minlight({
		content: ''
	}).minlight('instance');
	equal(min.$target.html().indexOf('img'), -1, 'An image is not added when content is empty string');
});
