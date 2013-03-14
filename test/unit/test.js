
test("Basic requirements", 7, function() {
	ok( Array.prototype.push, "Array.push()" );
	ok( Function.prototype.apply, "Function.apply()" );
	ok( document.getElementById, "getElementById" );
	ok( document.getElementsByTagName, "getElementsByTagName" );
	ok( RegExp, "RegExp" );
	ok( jQuery, "jQuery" );
	ok( $, "$" );
});

test("Usage", 12, function() {
	var $min = $(".minlight-link").minLight(),
		instance = $min.minLight("instance"),
		$target = instance.$target;

	ok( $min.length, "minLink is present" );
	ok( $min.data("__minlight"), "minLight instance added as data" );
	ok( $target[0].parentNode, "Target added" );
	ok( instance.$mask[0].parentNode, "Mask added" );

	$min.minLight("destroy");
	ok( !$min.data("__minlight"), "Method: destroy (data)" );
	ok( !$target[0].parentNode, "Method: destroy (target removed)" );

	$min.minLight({
		target: "#awesome-lightbox"
	});
	instance = $min.minLight("instance");
	$target = instance.$target;

	equal( $target[0].id, "awesome-lightbox", "target is awesome-lightbox" );
	ok( instance.$mask[0].parentNode, "Mask present" );

	$min.minLight("destroy");
	ok( !$min.data("__minlight"), "Method: destroy (data)" );
	ok( $target[0].parentNode, "Method: destroy (target not removed, it existed before)" );

	$min.minLight({
		container: "#qunit-fixture",
		fadeTime: 50,
		onOpen: function( min ) {
			var $this = $(this);
			equal( $this.css("display"), "block", "Method: open (check display)" );
			min.close();
			start();
		},
		onClose: function() {
			equal( $(this).css("display"), "none", "Method: close (check display)" );
			start();
		}
	});

	stop( 2 );
	$min.minLight("open");
});

test("Input", 4, function() {
	var $minInput = $("#minlight-input").minLight({
			href: "frame.jpg",
			container: "#main",
			fadeTime: 50,
			onOpen: function() {
				equal( this.parentNode.id, "main", "Custom container and onOpen set on focus" );
				start();
			}
		}),
		instance = $minInput.minLight("instance"),
		$target = instance.$target;

	ok( instance, "Instance created from input" );
	equal( $target[0].parentNode.id, "main", "Target added to custom container" );
	equal( $target.find("img").attr("src"), "frame.jpg", "href option set correctly" );

	stop();
	$minInput.focus();
});

test("No conflict", 1, function() {
	var j = jQuery.noConflict( true );
	ok( j(".minlight-link").minLight().data("__minlight"), "minLight works in noConflict" );
	// Restore
	window.$ = window.jQuery = j;
});
