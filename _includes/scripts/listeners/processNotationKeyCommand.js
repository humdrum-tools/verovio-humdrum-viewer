{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:26:27 PDT 2025
// Last Modified: Tue Mar 18 01:26:32 PDT 2025
// Filename:      _includes/vhv-scripts/listeners/processNotationKeyCommand.js
// Included in:   _includes/vhv-scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Function for processing notation key commands on the VHV page.
//
{% endcomment %}

function processNotationKeyCommand(event) {
	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	// only works outside of the editor.
	if (event.altKey || event.target.nodeName == "TEXTAREA") {
		return;
	}
	if (document.activeElement.nodeName == "INPUT") {
		// needed to suppress key commands when running vim command
		return;
	}

	//undo doesn't need CursorNote
	if (event.code === KEYS.ZKey && (event.ctrlKey || event.metaKey)) {
		EDITOR.undo();
		return;
	};

	if (!CursorNote) {
		return;
	}
	if (!CursorNote.id) {
		return;
	}

	let inputKey = GetKey(event);

	switch (inputKey) {
		case KEYS.AKey:
			processNotationKey("a", CursorNote);
			break;

		case KEYS.BKey:
			processNotationKey("b", CursorNote);
			break;

		case KEYS.CKey:
			processNotationKey("c", CursorNote);
			break;

		case KEYS.DKey:
			if (event.shiftKey) {
				processNotationKey("D", CursorNote);
			}
			break;

		// case KEYS.EKey:

		case KEYS.FKey:
			processNotationKey("f", CursorNote);
			break;

		// case KEYS.GKey:
		// case KEYS.HKey:

		case KEYS.IKey:
			processNotationKey("i", CursorNote);
			break;

		case KEYS.JKey:
			if (event.shiftKey) {
				processNotationKey("J", CursorNote);
			}
			break;

		case KEYS.KKey:
			if (event.shiftKey) {
				addSystemBreakToPreviousBarline();
				event.preventDefault();
			} else {
				addSystemBreakToNextBarline();
				event.preventDefault();
			}
			break;

		case KEYS.LKey:
			if (event.shiftKey) {
				processNotationKey("L", CursorNote);
			}
			break;

		case KEYS.MKey:
			if (event.shiftKey) {
				processNotationKey("M", CursorNote);
			} else {
				processNotationKey("m", CursorNote);
			}
			break;

		case KEYS.NKey:
			processNotationKey("n", CursorNote);
			break;

		// case KEYS.OKey:

		case KEYS.PKey:
			if (event.shiftKey) {
				processNotationKey("P", CursorNote);
			} else {
				processNotationKey("p", CursorNote);
			}
			break;

		case KEYS.QKey:
			processNotationKey("q", CursorNote);
			break;

		// case KEYS.RKey:

		case KEYS.SKey:
			processNotationKey("s", CursorNote);
			break;

		case KEYS.TKey:
			if (event.shiftKey) {
				processNotationKey("T", CursorNote);
			} else {
				processNotationKey("t", CursorNote);
			}
			break;

		// case KEYS.UKey:

		case KEYS.VKey:
			if (CursorNote.id.match("note-")) {
				processNotationKey("^", CursorNote);
			}
			break;

		case KEYS.WKey:
			if (event.shiftKey) {
				processNotationKey("W", CursorNote);
			} else {
				processNotationKey("w", CursorNote);
			}
			break;

		case KEYS.XKey:
			processNotationKey("X", CursorNote);
			break;

		case KEYS.YKey:
			processNotationKey("y", CursorNote);
			break;

		// case KEYS.ZKey:

		case KEYS.OneKey:
			processNotationKey("1", CursorNote);
			break;

		case KEYS.TwoKey:
			if (event.shiftKey) {
				processNotationKey("@", CursorNote);
			} else {
				processNotationKey("2", CursorNote);
			}
			break;

		case KEYS.ThreeKey:
			if (event.shiftKey) {
				processNotationKey("#", CursorNote);
			} else {
				processNotationKey("3", CursorNote);
			}
			break;

		case KEYS.FourKey:
			processNotationKey("4", CursorNote);
			break;

		case KEYS.FiveKey:
			processNotationKey("5", CursorNote);
			break;

		case KEYS.SixKey:
			if (CursorNote.id.match("note-")) {
				if (event.shiftKey) {
					processNotationKey("^^", CursorNote);
				} else {
					processNotationKey("6", CursorNote);
				}
			} else {
				processNotationKey("6", CursorNote);
			}
			break;

		case KEYS.SevenKey:
			processNotationKey("7", CursorNote);
			break;

		case KEYS.EightKey:
			processNotationKey("8", CursorNote);
			break;

		case KEYS.NineKey:
			processNotationKey("9", CursorNote);
			break;

		case KEYS.MinusKey:
			processNotationKey("-", CursorNote);
			break;

		case KEYS.SingleQuoteKey:
			processNotationKey("'", CursorNote);
			break;

		case KEYS.SemiColonKey:
			if (event.shiftKey) {
				processNotationKey(":", CursorNote);
			} else {
				processNotationKey(";", CursorNote);
			}
			break;

		case KEYS.BackQuoteKey:
			if (event.shiftKey) {
				processNotationKey("~", CursorNote);
			} else {
				processNotationKey("`", CursorNote);
			}
			break;

		case KEYS.UpKey:
			if (event.shiftKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-up-step", CursorNote);
				}
			} else if (event.ctrlKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-up-octave", CursorNote);
				}
			} else {
				event.preventDefault();
				event.stopPropagation();
				goUpHarmonically(CursorNote);
			}
			break;

		case KEYS.DownKey:
			if (event.shiftKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-down-step", CursorNote);
				}
			} else if (event.ctrlKey) {
				event.preventDefault();
				event.stopPropagation();
				if (CursorNote.id.match("note-")) {
					processNotationKey("transpose-down-octave", CursorNote);
				}
			} else {
				event.preventDefault();
				event.stopPropagation();
				goDownHarmonically(CursorNote);
			}
			break;

		case KEYS.DeleteKey:
		case KEYS.BackKey:
			processNotationKey("delete", CursorNote);
			event.stopPropagation();
			break;

		case KEYS.LeftKey:
			if (CursorNote.id.match("slur-")) {
				event.preventDefault();
				event.stopPropagation();
				if (event.shiftKey) {
					processNotationKey("rightEndMoveBack", CursorNote);
				} else {
					processNotationKey("leftEndMoveBack", CursorNote);
				}
			} else {
				// move one note to the left
				event.preventDefault();
				event.stopPropagation();
				goToPreviousNoteOrRest(CursorNote.id);
			}
			break;

		case KEYS.RightKey:
			if (CursorNote.id.match("slur-")) {
				event.preventDefault();
				event.stopPropagation();
				if (event.shiftKey) {
					processNotationKey("rightEndMoveForward", CursorNote);
				} else {
					processNotationKey("leftEndMoveForward", CursorNote);
				}
			} else {
				// move one note to the right
				event.preventDefault();
				event.stopPropagation();
				goToNextNoteOrRest(CursorNote.id);
			}
			break;

		case KEYS.EscKey:
			event.preventDefault();
			event.stopPropagation();
			processNotationKey("esc", CursorNote);
			break;

	}
}



