
test("Basic requirements", 7, function() {
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$" );
});

test("Usage", 14, function() {
	var $minLink = $(".minlight-link");
		$min = $minLink.minLight(),
		instance = $min.minLight("instance"),
		$target = instance.$target;

	ok( $min.length, "minLink is present" );
	ok( $min.data("_minLight"), "minLight instance added as data" );
	ok( $target[0].parentNode, "Target added" );
	ok( instance.$mask[0].parentNode, "Mask added" );

	$min.minLight("destroy");
	ok( !$min.data("_minLight"), "Method: destroy (data)" );
	ok( !$target[0].parentNode, "Method: destroy (target removed)" );

	$min.minLight({
		container: "#qunit-fixture",
		fadeTime: 50,
		onOpen: function() {
			equal( $(this).css("display"), "block", "Method: open (check display)" );
			start();
		},
		onClose: function() {
			equal( $(this).css("display"), "none", "Method: close (check display)" );
			start();
		}
	});

	stop( 2 );
	$min.minLight("open").minLight("close");

	$min.minLight("option", "onOpen", function() {
		ok( true, "onOpen option changed");
		start();
		start();
	});

	// Using two instead of one here
	// Will hang if the option was not changed
	stop( 2 );
	$min.minLight("open");

	$min.minLight("destroy");
	ok( !$min.data("_minLight"), "Method: destroy (data)" );
	ok( !$target[0].parentNode, "Method: destroy (target removed)" );

	$min.minLight({
		target: "#awesome-lightbox"
	});
	instance = $min.minLight("instance");
	$target = instance.$target;

	ok( $target[0].id, "target is awesome-lightbox" );
	ok( instance.$mask[0].parentNode, "Mask present" );

	$min.minLight("option", {
		fadeTime: 50,
		onClose: function() {
			equal( $(this).css("display"), "none", "Method: close (on user target)" );
			start();
		}
	});

	stop();
	$min.minLight("open").minLight("close");
});

test("No conflict", 1, function() {
	var j = jQuery.noConflict( true );
	ok( j(".minlight-link").minLight().data("_minLight"), "minLight works in noConflict" );
	// Restore
	$ = jQuery = j;
});
