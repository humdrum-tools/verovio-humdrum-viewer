


//////////////////////////////
//
// centerCursorHorizontallyInEditor --
//

function centerCursorHorizontallyInEditor() {
	// Center the cursort horizontally:
	// Get distance between cursor and left side of textarea in pixels:
	let cursorLeft = EDITOR.renderer.$cursorLayer.getPixelPosition(0).left;

	// Get width of visible text area
	let scrollerWidth = EDITOR.renderer.$size.scrollerWidth;

	// Move scroller so that left side at same point as cursor minus half width of visible area:
	if (cursorLeft > scrollerWidth / 2) {
		EDITOR.renderer.scrollToX(cursorLeft - scrollerWidth/2);
	}
}



