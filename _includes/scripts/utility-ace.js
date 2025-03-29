


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



//////////////////////////////
//
// setEditorModeAndKeyboard --
//

function setEditorModeAndKeyboard() {
	if (EDITOR) {
		EDITOR.setTheme(EditorModes[EditorMode][KeyboardMode].theme);
		EDITOR.getSession().setMode("ace/mode/" + EditorMode);
		// null to reset to default (ace) mode
		EDITOR.setKeyboardHandler(KeyboardMode === "ace" ? null : "ace/keyboard/" + KeyboardMode);
	}
};



//////////////////////////////
//
// toggleEditorMode -- Switch between plain text editing and vim editing.
//     This is used by the alt-v keyboard shortcut.
//

function toggleEditorMode() {
	if (KeyboardMode == "ace") {
		KeyboardMode  = "vim";
	} else {
		KeyboardMode  = "ace";
	};
	setEditorModeAndKeyboard();
};



//////////////////////////////
//
// showIdInEditor -- Highlight the current line of data being played,
//     and center it.  But only do this if Humdrum data is being shown
//     in the editor (MEI data is not time-ordered by notes, only by
//     measure).
//

function showIdInEditor(id) {
	if (EditorMode == "xml") {
		// MusicXML data has no IDs so cannot use this function
		return;
	}
	if (EditorMode == "esac") {
		// EsAC data has no IDs so cannot use this function
		return;
	}
	var matches = id.match(/-[^-]*L(\d+)/);
	if (!matches) {
		return;
	}
	var row = parseInt(matches[1]);
	EDITOR.gotoLine(row, 0);
	EDITOR.centerSelection();
	// console.log("PLAYING ROW", row);
}



//////////////////////////////
//
// getMode -- return the Ace editor mode to display the data in:
//    ace/mode/humdrum  == for Humdrum
//    ace/mode/esac  == for Humdrum
//    ace/mode/xml   == for XML data (i.e., MEI, or SVG)
//

function getMode(text) {
	if (!text) {
		return "humdrum";
	}
	if (text.match(/^\s*</)) {
		return "xml";
		clearAllAceMarkers();
	} else if (text.substring(0, 2000).match(/Group memberships:/)) {
		clearAllAceMarkers();
		return "musedata";
	} else if (text.substring(0, 2000).match(/^[A-Za-z0-9+\/\s]+$/)) {
		clearAllAceMarkers();
		return "mime";
	} else if (text.substring(0, 2000).match(/^CUT\[/m)) {
		return "esac";
	} else {
		clearAllAceMarkers();
		return "humdrum";
	}
}



//////////////////////////////
//
// highlightNoteInScore -- Called when the cursor has changed position
//     int the editor.
//

function highlightNoteInScore(event) {
	if (EditorMode == "xml") {
		xmlDataNoteIntoView(event);
	} else {
		humdrumDataNoteIntoView(event);
	}
}



//////////////////////////////
//
// dataIntoView -- When clicking on a note (or other itmes in SVG images later),
//      go to the corresponding line in the editor.
//

function	dataIntoView(event) {
	if (EditorMode == "xml") {
		xmlDataIntoView(event);
	} else {
		humdrumDataIntoView(event);
	}
}



//////////////////////////////
//
// xmlDataNoteIntoView --
//

function xmlDataNoteIntoView(event) {
	var location = EDITOR.selection.getCursor();
	var line = location.row;
	if (EditorLine == line) {
		// already highlighted (or close enough)
		return;
	}
	// var column = location.column;
	var text = EDITOR.session.getLine(line);
	var matches = text.match(/xml:id="([^"]+)"/);
	if (!matches) {
		markItem(null, line);
		return;
	}
	var id = matches[1];
	var item;
	if (Splitter.rightContent) {
		// see: https://www.w3.org/TR/selectors
		var item = Splitter.rightContent.querySelector("#" + id);
		// console.log("ITEM", item);
	}
	markItem(item, line);
}



//////////////////////////////
//
// humdrumDataNoteIntoView --
//

function humdrumDataNoteIntoView(event) {
	var location = EDITOR.selection.getCursor();
	var line = location.row;
	var column = location.column;
	var text = EDITOR.session.getLine(line);
	var fys = getFieldAndSubtoken(text, column);
	var field = fys.field;
	var subspine = fys.subspine;
	var query = HIGHLIGHTQUERY;
	HIGHLIGHTQUERY = "";
	// the following code causes problems with note highlighting
	// after another note was edited.
	//	if (!query) {
	//		query = EDITINGID;
	//		HIGHLLIGHTQUERY = EDITINGID;
	//		// EDITINGID = null;
	//	}
	if (!query) {
		var query = "L" + (line+1) + "F" + field;
		if (subspine > 0) {
			query += "S" + subspine;
		}
	}
	var item = 0;
	if (Splitter.rightContent) {
		// see: https://www.w3.org/TR/selectors
		var items = Splitter.rightContent.querySelectorAll("g[id$='" +
			query + "']");
		if (items.length == 0) {
			// cannot find (hidden rest for example)
			return;
		}
		// give priority to items that possess qon/qoff classes.
		for (var i=0; i<items.length; i++) {
			if (items[i].className.baseVal.match(/qon/)) {
				item = items[i];
				break;
			}
		}
		if (!item) {
			item = items[items.length-1];
		}
		if (item.id.match(/^accid/)) {
			item = items[items.length-2];
		}
	}
	markItem(item);
}




//////////////////////////////
//
// gotoLineFieldInEditor --
//

function gotoLineFieldInEditor(row, field) {
	let linecontent = EDITOR.session.getLine(row-1);

	let col = 0;
	if (field > 1) {
		let tabcount = 0;
		for (let i=0; i<linecontent.length; i++) {
			col++;
			if (linecontent[i] == '\t') {
				if ((i > 0) && (linecontent[i-1] != '\t')) {
					tabcount++;
				}
			}
			if (tabcount == field - 1) {
				break;
			}
		}
	}

	EDITOR.gotoLine(row, col);

	// 0.5 = center the cursor vertically:
	EDITOR.renderer.scrollCursorIntoView({row: row-1, column: col}, 0.5);
	centerCursorHorizontallyInEditor();

}




