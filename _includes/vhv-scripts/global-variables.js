//
// _includes/vhv-scripts/global-variables.js
//
// This file is loaded from _includes/vhv-scripts/main.js and
// contains global variables used by VHV.
//

// CGI: lookup table of key/value pairs from URL parameters.
var CGI = {};

// OPTIONS: debugging parameter to see what options were used
// for the last call to the verovio toolkit.
var OPTIONS = {};

// var turl = "https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/master/index.hmd";

// HMDINDEX: used to store a repertory index in the .hmd format.
var HMDINDEX = null;


var SCROLL_HASH = true;
var GOTOTOPOFNOTATION = false;

////////////////////////////////////////////////////////////
//
// Verovio variables
//

// vrvWorker: interface to the verovio toolkit via the worker interface.  The worker
// interface allows rendering of notation to be done in a separate thread from the
// user interface, allowing the user interface to be more responsive.  This variable
// is configured in the setup.js file.
var vrvWorker;

//////////////////////////////
//
// verovio-related options: Primarily set in menu system and used in humdrumToSvgOptions().
//

// SCALE: controls the size of the music notation using the verovio "scale" option.
var SCALE          = 40;

// SPACING_STAFF: Set the minimum distance in diatonic steps between staves of music.
var SPACING_STAFF  = 12;

// Need to add a variable SPACING_ADJUST_GROUP to add controls for spacing staff groups.

// SPACING_SYSTEM: Set the minimum distance in diatonc steps between systems of music.
// the verovio option justifyVertically may expand from this minimum distance, and
// musical elements extending outside of this range will also push the systems further
// apart.
var SPACING_SYSTEM = 18;

// LYRIC_SIZE: control the relative size of lyrics in the rendered notation.  Units
// are in terms of diatonic steps (1/2 of the space between staff lines).
var LYRIC_SIZE     = 4.5;

// FONT: controls the musical font used by verovio to render notation.
var FONT           = "Leipzig";

// BREAKS: controls whether or not verovio should use system/page breaks
// encoded in the data or decide on its own line breaks.
//     false means use "auto" breaking method for verovio "breaks" option.
//     true means use "encoded" breaking method for verovio "breaks" option.
var BREAKS         = false;


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

var PAGED = false;

//////////////////////////////
//
// filter toolbar variables
//

var SEARCHFILTEROBJ = {};
var SEARCHFILTER    = "";
var GLOBALFILTER    = "";

//////////////////////////////
//
// Music searching toolbar variables
//

var SEARCHCHORDDIRECTION = "chord -d";  // search top note
var BRIEFSEARCHVIEW      = "";  // Do not show only measures with search matches.

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

var SPREADSHEETSCRIPTID = "";
var SPREADSHEETID = "";

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

var INPUT_FONT_SIZE = 1.0;   // used to set font-size in #input (1.0rem is the default);

var FILEINFO = {};


//////////////////////////////
//
// MuseData variables --
//

var MuseDataBuffer = "";


//////////////////////////////
//
// Ace editor variables -- These are variables to control the Ace editor
//    (https://ace.c9.io), which is the text editor used by VHV.
//

// EDITOR: main interface to the ace editor.  This variable is configured in the
// setup.js file.
var EDITOR;
var dummyEDITOR;

// EditorModes: list the various setup for colorizing and editing for each of the
// known data format.  The first index is set with the EditorMode variable, and the
// second index is set with the KeyboardMode variable.
var EditorModes = {
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
	}
};

// EditorMode: specifies what type of data is present in the text editor.
// Setting this will in turn control which colorizing rules to apply to the
// data.
// Values can be:
//     "humdrum"  for Humdrum data
//     "xml"      for XML data (MEI and MusicXML)
//     "musedata" for XML data (MEI and MusicXML)
var EditorMode = "humdrum";

// KeyboardMode: controls if plain ace editor keybindings are used or vim key bindings.
// Values can be:
//     "ace" for the pain text editing mode
//     "vim" for the vim editing mode
var KeyboardMode = "ace";

//var EditorTheme = "ace/theme/solarized_light";
var EditorLine = -1;
var TABSIZE = 12;
var DISPLAYTIME = 0;
var HIGHLIGHTQUERY = null;
var EDITINGID = null;
var SAVEFILENAME = "data.txt";
var SPACINGADJUSTMENT = 0.0;

// no timeout for slow delivery of verovio
window.basketSession.timeout = 1000000000;

var COUNTER = 0;

// used to highlight the current note at the location of the cursor.
var CursorNote;

// RestoreCursorNote: Used to go back to a highlighted note after a redraw.
// This is an ID string rather than an element.
var RestoreCursorNote;

// Increment BasketVersion when the verovio toolkit is updated, or
// the Midi player software or soundfont is updated.
var BasketVersion = 531;
// Basket is no longer working since verovio.js is now over 5MB (maximum for localStorage)
// console.log("VERSION", BasketVersion);

var Actiontime = 0;

var ERASED_DATA = "";

// see https://github.com/ajaxorg/ace/wiki/Embedding-API
// Use EditSession instead of BufferedHumdrumFile:
var BufferedHumdrumFile = "";
var Range = function() { console.log("Range is undefined"); }

var ids   = [];
var ZOOM  = 0.4;
var PLAY  = false;
var PAUSE = false;


// State variables for interface:
var FirstInitialization = false;
var InputVisible        = true;
var LastInputWidth      = 0;
var VrvTitle            = true;
var OriginalClef        = false;
var UndoHide            = false;
var ApplyZoom           = false;
var ShowingIndex        = false;
var FreezeRendering     = false;



//////////////////////////////
//
// Key-code variables for cases in listeners.js:
//

var AKey      = 65;
var BKey      = 66;
var CKey      = 67;
var DKey      = 68;
var EKey      = 69;
var FKey      = 70;
var GKey      = 71;
var HKey      = 72;
var IKey      = 73;
var JKey      = 74;
var KKey      = 75;
var LKey      = 76;
var MKey      = 77;
var NKey      = 78;
var OKey      = 79;
var PKey      = 80;
var QKey      = 81;
var RKey      = 82;
var SKey      = 83;
var TKey      = 84;
var UKey      = 85;
var VKey      = 86;
var WKey      = 87;
var XKey      = 88;
var YKey      = 89;
var ZKey      = 90;
var ZeroKey   = 48;
var OneKey    = 49;
var TwoKey    = 50;
var ThreeKey  = 51;
var FourKey   = 52;
var FiveKey   = 53;
var SixKey    = 54;
var SevenKey  = 55;
var EightKey  = 56;
var NineKey   = 57;
var PgUpKey   = 33;
var PgDnKey   = 34;
var EndKey    = 35;
var HomeKey   = 36;
var LeftKey   = 37;
var UpKey     = 38;
var RightKey  = 39;
var DownKey   = 40;
var EnterKey  = 13;
var SpaceKey  = 32;
var SlashKey  = 191;
var EscKey    = 27;
var BackKey   = 8;
var CommaKey  = 188;
var MinusKey  = 189;
var DotKey    = 190;
var SemiColonKey = 186;
var BackQuoteKey   = 192;
var SingleQuoteKey = 222;



