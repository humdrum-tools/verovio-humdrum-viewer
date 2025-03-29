//
// _includes/vhv-scripts/global-variables.js
//
// This file is loaded from _includes/vhv-scripts/main.js and
// contains global variables used by VHV.
//

// CGI: lookup table of key/value pairs from URL parameters.
let CGI = {};

// OPTIONS: debugging parameter to see what options were used
// for the last call to the verovio toolkit.
let OPTIONS = {};

// PDFOPTIONS: debugging parameter to see what options were used
// for the last call to the verovio toolkit when creating PDF files.
let PDFOPTIONS = {};
PDFOPTIONS.pageMarginTop    = 100;
PDFOPTIONS.pageMarginBottom = 100;
PDFOPTIONS.pageMarginLeft   = 50;
PDFOPTIONS.pageMarginRight  = 50;
PDFOPTIONS.pageMarginRight  = 95;

PDFOPTIONS.format = localStorage.PDFOPTIONS_format ? localStorage.PDFOPTIONS_format : "letter";
PDFOPTIONS.orientation = localStorage.PDFOPTIONS_orientation ? localStorage.PDFOPTIONS_orientation : "portrait";

// var turl = "https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/master/index.hmd";

// HMDINDEX: used to store a repertory index in the .hmd format.
let HMDINDEX = null;

// IIIF_MANIFEST: used to store:
let IIIF_MANIFEST = {};

// WKEY: window for displaying keyscape
WKEY = null;

let SCROLL_HASH = true;
let GOTOTOPOFNOTATION = false;

////////////////////////////////////////////////////////////
//
// Verovio variables
//

// vrvWorker: interface to the verovio toolkit via the worker interface.  The worker
// interface allows rendering of notation to be done in a separate thread from the
// user interface, allowing the user interface to be more responsive.  This variable
// is configured in the setup.js file.
let vrvWorker;

//////////////////////////////
//
// verovio-related options: Primarily set in menu system and used in humdrumToSvgOptions().
//

// SCALE: controls the size of the music notation using the verovio "scale" option.
let SCALE          = 40;

// SPACING_STAFF: Set the minimum distance in diatonic steps between staves of music.
let SPACING_STAFF  = 12;

// Need to add a variable SPACING_ADJUST_GROUP to add controls for spacing staff groups.

// SPACING_SYSTEM: Set the minimum distance in diatonc steps between systems of music.
// the verovio option justifyVertically may expand from this minimum distance, and
// musical elements extending outside of this range will also push the systems further
// apart.
let SPACING_SYSTEM = 6;

// LYRIC_SIZE: control the relative size of lyrics in the rendered notation.  Units
// are in terms of diatonic steps (1/2 of the space between staff lines).
let LYRIC_SIZE     = 4.5;

// FONT: controls the musical font used by verovio to render notation.  This is also
// the font variable used to generate PDF files.
let FONT           = "Leland";

// BREAKS: controls whether or not verovio should use system/page breaks
// encoded in the data or decide on its own line breaks.
//     false means use "line" breaking method for verovio "breaks" option.
//     true means use "encoded" breaking method for verovio "breaks" option.
let BREAKS         = false;


///////////////////////////////////////////////////////////
//
// Repertory variables --

// ERASED_WORK_NAVIGATOR: HTML code for the navigator that can be restored
// if alt-e is pressed twice.
ERASED_WORK_NAVIGATOR = "";

// ERASED_FILEINFO: data structure containing the currently displyed
// work from a repertory.
ERASED_FILEINFO = {};

///////////////////////////////////////////////////////////
//
// Toolbar variables
//

let PAGED = false;
if (localStorage.PAGEMODE === "multi") {
	PAGED = true;
}

//////////////////////////////
//
// filter toolbar variables
//

let SEARCHFILTEROBJ = {};
let SEARCHFILTER    = "";
let GLOBALFILTER    = "";
let GLOBAL_VEROVIO_OPTIONS = "";

let FILTERS = {% include filter/filters.json %};


//////////////////////////////
//
// Music searching toolbar variables
//

let SEARCHCHORDDIRECTION = "chord -d";  // search top note
let BRIEFSEARCHVIEW      = "";  // Do not show only measures with search matches.

//////////////////////////////
//
// Spreadsheet toolbar variables -- These variables are used to interact
//    with Google spreadsheets from the spreadsheet toolbar:
//       https://doc.verovio.humdrum.org/interface/toolbar/spreadsheet
//    Two variables can be stored in the text box on the spreadsheet toolbar:
//       SPREADSHEETID       == The ID for the spreadsheet from its URL.
//       SPREADSHEETSCRIPTID == The ID for the macro that interfaces with the spreadsheet.
//    These two variables are persistent, and loaded from localStorage when
//    a session is started.
//

let SPREADSHEETSCRIPTID = "";
let SPREADSHEETID = "";

if (localStorage.SPREADSHEETSCRIPTID) {
	SPREADSHEETSCRIPTID = localStorage.SPREADSHEETSCRIPTID;
}
if (localStorage.SPREADSHEETID) {
	SPREADSHEETID = localStorage.SPREADSHEETID;
}



//////////////////////////////
//
// menu interaction variables:
//

let INPUT_FONT_SIZE = 1.0;   // used to set font-size in #input (1.0rem is the default);

let FILEINFO = {};


//////////////////////////////
//
// MuseData variables --
//

let MuseDataBuffer = "";


//////////////////////////////
//
// Ace editor variables -- These are variables to control the Ace editor
//    (https://ace.c9.io), which is the text editor used by VHV.
//

// EDITOR: main interface to the ace editor.  This variable is configured in the
// setup.js file.
let EDITOR;
let dummyEDITOR;

// EditorModes: list the various setup for colorizing and editing for each of the
// known data format.  The first index is set with the EditorMode variable, and the
// second index is set with the KeyboardMode variable.
let EditorModes = {
	humdrum: {
		vim: {
			theme: "ace/theme/humdrum_dark"
		},
		ace: {
			theme: "ace/theme/humdrum_light"
		}
	},
	xml: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	},
	musedata: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	},
	esac: {
		vim: {
			theme: "ace/theme/esac_dark"
		},
		ace: {
			theme: "ace/theme/esac_light"
		}
	},
	mime: {
		vim: {
			theme: "ace/theme/solarized_dark"
		},
		ace: {
			theme: "ace/theme/solarized_light"
		}
	}
};

// EditorMode: specifies what type of data is present in the text editor.
// Setting this will in turn control which colorizing rules to apply to the
// data.
// Values can be:
//     "humdrum"  for Humdrum data
//     "xml"      for XML data (MEI and MusicXML)
//     "musedata" for XML data (MEI and MusicXML)
//     "mime"     for mime-encoded data
//     "esac"     for EsAC data
let EditorMode = "humdrum";

// EditorCursorLine: used to keep track for updating display of EsAC data
let EditorCursorLine = 0;

// KeyboardMode: controls if plain ace editor keybindings are used or vim key bindings.
// Values can be:
//     "ace" for the pain text editing mode
//     "vim" for the vim editing mode
let KeyboardMode = "ace";

//var EditorTheme = "ace/theme/solarized_light";
let EditorLine = -1;
let TABSIZE = 12;
let DISPLAYTIME = 0;
let HIGHLIGHTQUERY = null;
let EDITINGID = null;
let SAVEFILENAME = "data.txt";
let SPACINGADJUSTMENT = 0.0;

// no timeout for slow delivery of verovio
window.basketSession.timeout = 1000000000;

let COUNTER = 0;

// used to highlight the current note at the location of the cursor.
let CursorNote;

// RestoreCursorNote: Used to go back to a highlighted note after a redraw.
// This is an ID string rather than an element.
let RestoreCursorNote;

// Increment BasketVersion when the verovio toolkit is updated, or
// the Midi player software or soundfont is updated.
let BasketVersion = 531;
// Basket is no longer working since verovio.js is now over 5MB (maximum for localStorage)
// console.log("VERSION", BasketVersion);

let Actiontime = 0;

let ERASED_DATA = "";

// see https://github.com/ajaxorg/ace/wiki/Embedding-API
// Use EditSession instead of BufferedHumdrumFile:
let BufferedHumdrumFile = "";
let Range = function() { console.log("Range is undefined"); }

let IDS   = [];
let ZOOM  = 0.4;
let PLAY  = false;
let PAUSE = false;


// State variables for interface:
let FirstInitialization = false;
let InputVisible        = true;
let LastInputWidth      = 0;
let VrvTitle            = true;
let OriginalClef        = false;
let UndoHide            = false;
let ApplyZoom           = false;
let ShowingIndex        = false;
let FreezeRendering     = false;



//////////////////////////////
//
// Key-code variables for cases in listeners.js:
//
// See also:
//    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
//    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
//    https://keycode.info
//    https://wangchujiang.com/hotkeys
//

let KEYS = {};

// event:             .code           .keyCode   .key (US keyboard)
KEYS.AKey            = "KeyA";         // 65      "A", "a"
KEYS.BKey            = "KeyB";         // 66      "B", "b"
KEYS.CKey            = "KeyC";         // 67      "C", "c"
KEYS.DKey            = "KeyD";         // 68      "D", "d"
KEYS.EKey            = "KeyE";         // 69      "E", "e"
KEYS.FKey            = "KeyF";         // 70      "F", "f"
KEYS.GKey            = "KeyG";         // 71      "G", "g"
KEYS.HKey            = "KeyH";         // 72      "H", "h"
KEYS.IKey            = "KeyI";         // 73      "I", "i"
KEYS.JKey            = "KeyJ";         // 74      "J", "j"
KEYS.KKey            = "KeyK";         // 75      "K", "k"
KEYS.LKey            = "KeyL";         // 76      "L", "l"
KEYS.MKey            = "KeyM";         // 77      "M", "m"
KEYS.NKey            = "KeyN";         // 78      "N", "n"
KEYS.OKey            = "KeyO";         // 79      "O", "o"
KEYS.PKey            = "KeyP";         // 80      "P", "p"
KEYS.QKey            = "KeyQ";         // 81      "Q", "q"
KEYS.RKey            = "KeyR";         // 82      "R", "r"
KEYS.SKey            = "KeyS";         // 83      "S", "s"
KEYS.TKey            = "KeyT";         // 84      "T", "t"
KEYS.UKey            = "KeyU";         // 85      "U", "u"
KEYS.VKey            = "KeyV";         // 86      "V", "v"
KEYS.WKey            = "KeyW";         // 87      "W", "w"
KEYS.XKey            = "KeyX";         // 88      "X", "x"
KEYS.YKey            = "KeyY";         // 89      "Y", "y"
KEYS.ZKey            = "KeyZ";         // 90      "Z", "z"
KEYS.ZeroKey         = "Digit0";       // 48      "0", "("
KEYS.OneKey          = "Digit1";       // 49      "1", "@"
KEYS.TwoKey          = "Digit2";       // 50      "2", "@"
KEYS.ThreeKey        = "Digit3";       // 51      "3", "#"
KEYS.FourKey         = "Digit4";       // 52      "4", "$"
KEYS.FiveKey         = "Digit5";       // 53      "5", "%"
KEYS.SixKey          = "Digit6";       // 54      "6", "^"
KEYS.SevenKey        = "Digit7";       // 55      "7", "&"
KEYS.EightKey        = "Digit8";       // 56      "8", "*"
KEYS.NineKey         = "Digit9";       // 57      "9", "("
// Numpad keys: 0=96 .. 9=105

KEYS.BackKey         = "Backspace";    // 8       "Backspace"
KEYS.BackQuoteKey    = "Backquote";    // 192     "`", "~"
KEYS.BackSlashKey    = "Backslash";    // 220     "\\"
KEYS.CommaKey        = "Comma";        // 188     ",", "<"
KEYS.DeleteKey       = "Delete";       // 46      "Delete"
KEYS.DotKey          = "Period";       // 190     ".", ">"
KEYS.EnterKey        = "Enter";        // 13      "Enter"
KEYS.EscKey          = "Escape";       // 27      "Escape"
KEYS.MinusKey        = "Minus";        // 189     "-", "_"
KEYS.SemiColonKey    = "Semicolon";    // 186     ";", ":"
KEYS.SingleQuoteKey  = "Quote";        // 222     "'", "\""
KEYS.SlashKey        = "Slash";        // 191     "/"
KEYS.SpaceKey        = "Space"         // 32      " "
KEYS.TabKey          = "Tab";          // 9       "Tab"
KEYS.BracketLeftKey  = "BracketLeft";  // 219     "[", "{"
KEYS.BracketRightKey = "BracketRight"; // 221     "]", "}"
KEYS.EqualKey        = "Equal";        // 187     "=", "+"

KEYS.ControlLeftKey  = "ControlLeft";  // 17      "Control"   event.ctrl
KEYS.ControlRightKey = "ControlRight"; // 17      "Control"   event.ctrl
KEYS.ShiftLeftKey    = "ShiftLeft";    // 16      "Shift"     event.shift
KEYS.ShiftRightKey   = "ShiftRight";   // 16      "Shift"     event.shift

KEYS.LeftKey         = "ArrowLeft";    // 37      "ArrowLeft"
KEYS.UpKey           = "ArrowUp";      // 38      "ArrowUp"
KEYS.RightKey        = "ArrowRight";   // 39      "ArrowRight"
KEYS.DownKey         = "ArrowDown";    // 40      "ArrowDown"

KEYS.PgUpKey         = "PageUp";       // 33      "PageUp"
KEYS.PgDnKey         = "PageDown";     // 34      "PageDown"
KEYS.EndKey          = "End";          // 35      "End"
KEYS.HomeKey         = "Home";         // 36      "Home"

KEYS.F1Key           = "F1";           // 112     "F1"
KEYS.F2Key           = "F2";           // 113     "F2"
KEYS.F3Key           = "F3";           // 114     "F3"
KEYS.F4Key           = "F4";           // 115     "F4"
KEYS.F5Key           = "F5";           // 116     "F5"
KEYS.F6Key           = "F6";           // 117     "F6"
KEYS.F7Key           = "F7";           // 118     "F7"
KEYS.F8Key           = "F8";           // 119     "F8"
KEYS.F9Key           = "F9";           // 120     "F9"
KEYS.F10Key          = "F10";          // 121     "F10"
KEYS.F11Key          = "F11";          // 122     "F11"
KEYS.F12Key          = "F12";          // 123     "F12"
// etc. to F32Key



//////////////////////////////
//
// GetKey --
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
// https://hacks.mozilla.org/2017/03/internationalize-your-keyboard-controls
//

function GetKey(event) {
console.log("EVENT", event);
	let code = event.code;
	let key  = event.key;
	if (key && key === "Dead") {
		return code;
	}


	if (key && key.match(/^[A-Za-z]$/)) {
		return KEYS[`${key.toUpperCase()}Key`];
	}

	// Alt-key hassles which will cause problems entering
	// text that uses the alt key to create characters...

	if (event.altKey) {
		if ((key == "›") && (code == "KeyZ")) {
			return KEYS.YKey;
		} 
		if ((key == "Dead") && (code == "KeyY")) {
			return KEYS.ZKey;
		}
		if ((key == "∫") && (code == "KeyB")) {
			return KEYS.BKey;
		} 
	}

	return event.code;
}



