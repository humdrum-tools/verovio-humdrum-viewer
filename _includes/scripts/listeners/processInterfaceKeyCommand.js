{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Tue Mar 18 01:24:20 PDT 2025
// Last Modified: Tue Mar 18 01:24:24 PDT 2025
// Filename:      _includes/scripts/listeners/processInterfaceKeyCommand.js
// Included in:   _includes/scripts/listeners/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   Function for processing keyboard commands on the VHV page.
//
{% endcomment %}

function processInterfaceKeyCommand(event) {

	if (!event.preventDefault) {
		event.preventDefault = function() { };
	}

	if ((!event.altKey) && (event.target.nodeName == "TEXTAREA")) {
		// needed to prevent key commands when editing text
		return;
	}
	if ((!event.altKey) && (document.activeElement.nodeName == "INPUT")) {
		// needed to prevent key commands when running vim command
		return;
	}

	if (event.metaKey) {
		// usually ignore metaKey unless 0:
		if (event.code == KEYS.ZeroKey) {
			MENU.resetTextFontSize();
			SCALE = 40;
			localStorage.SCALE = SCALE;
			displayNotation();
			// not preventingDefault so that web browser can reset size as well.
		}
		return;
	}

	let inputKey = GetKey(event);

	switch (inputKey) {
		case KEYS.AKey:          // UNUSED
			if (event.altKey) {
				if (event.shiftKey) {
					// toggle display of toolbar
					toggleNavigationToolbar();
				} else {
					// toggle display of banner
					toggleVhvTitle();
				}
				event.preventDefault();
			}
			break;

		case KEYS.BKey:
			if (event.altKey) {
				if (event.shiftKey) {
					if (event.ctrlKey) {
						addInvisibleBarlineAboveCurrentPosition();
					} else {
						addBarlineAboveCurrentPosition();
					}
					event.preventDefault();
				} else {
					toggleVhvTitle();
				}
			}
			break;

		case KEYS.CKey:
			if (event.altKey) {
				if (event.shiftKey) {
					togglePlaceColoring();
				} else {
					// compile filtered contents & display in text editor
					compileFilters();
				}
				event.preventDefault();
			}
			break;

		case KEYS.DKey:          // Add null data line
			if (event.altKey) {
				if (event.shiftKey) {
					addDataLineAboveCurrentPosition();
				} else {
					toggleMenuDisplay();
				}
				event.preventDefault();
			}
			break;

		case KEYS.EKey:          // erase text editor contents or Tooggle display of menu with shift key.
			if (event.altKey) {
				if (event.shiftKey) {
					toggleMenuAndToolbarDisplay();
				} else {
					clearContent();
				}
				event.preventDefault();
			}
			break;

		case KEYS.FKey:          // toogle notation update freezing
			if (event.altKey) {
				if (event.shiftKey) {
					displayNotation(false, true);
				} else {
					toggleFreeze();
				}
				event.preventDefault();
			}
			break;

		case KEYS.GKey:          // save current view to SVG image
			if (event.altKey) {
				// displaySvg();
				saveSvgData();
				event.preventDefault();
			}
			break;

		case KEYS.HKey:          // show Humdrum data in text editor
			if (event.altKey) {
				if (!ShowingIndex) {
					showBufferedHumdrumData();
					event.preventDefault();
				}
			}
			break;

		case KEYS.IKey:          // Add null interpretation line
			if (event.altKey) {
				if (event.shiftKey) {
					addInterpretationLineAboveCurrentPosition();
					event.preventDefault();
				}
			}
			break;

		case KEYS.JKey:          // UNUSED
			break;

		case KEYS.KKey:
			if (event.altKey) {
				if (event.shiftKey) {
					addSystemBreakToPreviousBarline();
					event.preventDefault();
				} else {
					addSystemBreakToNextBarline();
					event.preventDefault();
				}
			}
			break;

		case KEYS.LKey:          // toggle color of staff layers
			if (event.altKey) {
				if (event.shiftKey) {
					addLocalCommentLineAboveCurrentPosition();
				} else {
					toggleLayerColoring();
				}
				event.preventDefault();
			}
			break;

	 	case KEYS.MKey:          // show MEI data in text editor
			if (event.altKey) {
				EditorMode = "xml";
				if (event.shiftKey) {
					// display with @type data
					displayMei();
				} else {
					// display without @type data
					displayMeiNoType();
				}
				event.preventDefault();
			}
			break;

	 	case KEYS.NKey:          // toggle display of navigation toolbar
			if (event.altKey) {
				if (event.ctrlKey) {
					toggleNavigationToolbar();
				} else if (event.shiftKey) {
					gotoPrevToolbarDelta();
				} else {
					chooseToolbarMenu();
				}
				event.preventDefault();
			}
			break;

		case KEYS.OKey:          // toggle display of *oclef data
			if (event.altKey) {
				OriginalClef = !OriginalClef;
				console.log("Original clef changed to:", OriginalClef);
				if (!ShowingIndex) {
					displayNotation();
				}
				event.preventDefault();
			}
			break;

		case KEYS.PKey:          // show PDF in separate window
			if (event.altKey) {
				displayPdf();
				event.preventDefault();
			}
			break;

		case KEYS.QKey:          // toggle coloring of appoggiaturas
			if (event.altKey) {
				if (event.shiftKey) {
					// do nothing
				} else {
					toggleAppoggiaturaColoring();
				}
				event.preventDefault();
			}
			break;

		case KEYS.RKey:          // reload Humdrum data from server
			if (event.altKey) {
				if (event.shiftKey) {
					restoreEditorContentsLocally();
					event.preventDefault();
				} else {
					reloadData();
					event.preventDefault();
				}
			}
			break;

		case KEYS.SKey:          // save contents of text editor to file
			if (event.altKey) {
				if (event.shiftKey) {
					saveEditorContentsLocally();
					event.preventDefault();
				} else {
					saveEditorContents();
					event.preventDefault();
				}
			}
			break;

		case KEYS.TKey:          // save PDF file
			// Needed functions are defined in _includes/pdfkit.html
			if (event.altKey) {
				if (event.shiftKey) {
					generatePdfSnapshot();
				} else {
					generatePdfFull();
				}
				event.preventDefault();
			}
			break;

		case KEYS.UKey:              // toggle TSV/CSV display of Humdrum data
			if (event.shiftKey) {
				decreaseTab();
				event.preventDefault();
			} else {
				toggleHumdrumCsvTsv();
				event.preventDefault();
			}
			break;

		case KEYS.VKey:          // toggle vi mode in text editor
			if (event.altKey) {
				toggleEditorMode();
				event.preventDefault();
			}
			break;

	 	case KEYS.WKey:          // adjust notation width parameter
			if (event.altKey) {
				if (event.shiftKey) {
					SPACINGADJUSTMENT -= 0.02;
				} else if (event.ctrlKey) {
					EVENNOTESPACING = !EVENNOTESPACING;
				} else {
					SPACINGADJUSTMENT += 0.02;
				}
				if (SPACINGADJUSTMENT <= 0.0) {
					SPACINGADJUSTMENT = 0.0;
				}
				event.preventDefault();
				displayNotation();
			}
			break;

		case KEYS.XKey:          // UNUSED
			if (event.altKey) {
				if (event.shiftKey) {
					toggleCautionaryAccidentalColoring();
				}
			}
			break;

		case KEYS.YKey:          // show/hide text editor
			if (event.altKey) {
				if (!ShowingIndex) {
					toggleTextVisibility();
				}
				event.preventDefault();
			}
			break;

/*		case KEYS.ZKey:  // use undo key from OS/browser
			if (event.ctrlKey || event.metaKey) {
				EDITOR.undo();
			};
			break;
*/

		case KEYS.ZeroKey:  InterfaceSingleNumber = 0; break;
		case KEYS.OneKey:   InterfaceSingleNumber = 1; break;
		case KEYS.TwoKey:   InterfaceSingleNumber = 2; break;
		case KEYS.ThreeKey: InterfaceSingleNumber = 3; break;
		case KEYS.FourKey:  InterfaceSingleNumber = 4; break;
		case KEYS.FiveKey:  InterfaceSingleNumber = 5; break;
		case KEYS.SixKey:   InterfaceSingleNumber = 6; break;
		case KEYS.SevenKey: InterfaceSingleNumber = 7; break;
		case KEYS.EightKey: InterfaceSingleNumber = 8; break;
		case KEYS.NineKey:  InterfaceSingleNumber = 9; break;

		case KEYS.SpaceKey:          // start/pause MIDI playback
			if (!PLAY) {
				if (PAUSE) {
					play();
					PLAY = true;
					PAUSE = false;
				} else {
					playCurrentMidi();
					PLAY = true;
					PAUSE = false;
				}
			} else {
				PLAY = false;
				PAUSE = true;
				pause();
			}
			event.preventDefault();
			break;

		case KEYS.CommaKey:     // toggle TSV/CSV display of Humdrum data
		                        // decrease tab size in editor
			// See UKey for relocation of comma-command for
			// (related to non-US keyboard layout)
			if (event.shiftKey) {
				decreaseTab();
				event.preventDefault();
			} else {
				//toggleHumdrumCsvTsv();
				//event.preventDefault();
			}
			break;

		case KEYS.DotKey:          // increase tab size in editor
			if (event.shiftKey) {
				increaseTab();
				event.preventDefault();
			}
			break;

		case KEYS.UpKey:          // return to repertory index
			if (event.shiftKey) {
				if (FILEINFO["has-index"] == "true") {
					displayIndex(FILEINFO["location"]);
				}
			}
			event.preventDefault();
			break;

		case KEYS.PgUpKey:          // shift: go to previous repertory work/movement
		case KEYS.LeftKey:          // go to previous page
			if (event.shiftKey) {
				displayWork(FILEINFO["previous-work"]);
			} else {
				gotoPreviousPage();
			}
			event.preventDefault();
			break;

		case KEYS.PgDnKey:          // shift: go to next repertory work/movement
		case KEYS.RightKey:         // go to next page
			if (event.shiftKey) {
				displayWork(FILEINFO["next-work"]);
			} else {
				gotoNextPage();
			}
			event.preventDefault();
			break;

		case KEYS.HomeKey:          // go to the first page
			gotoFirstPage();
			event.preventDefault();
			break;

		case KEYS.EndKey:          // go to the last page
			gotoLastPage();
			event.preventDefault();
			break;

		case KEYS.SlashKey:          // toggle menu display (to be implemented)
			if (event.shiftKey) {
				event.preventDefault();
			}
			break;

		case KEYS.EscKey:
			hideRepertoryIndex();
			event.preventDefault();
			break;

	}
}


