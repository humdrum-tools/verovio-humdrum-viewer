

var CGI = {};
var OPTIONS = {}; // used for debugging display options.

// var turl = "https://raw.githubusercontent.com/craigsapp/mozart-piano-sonatas/master/index.hmd";
var HMDINDEX = null;

// verovio variables for a movement:
var vrvWorker;

// verovio-related options:
// Primarily set in menu system and used in humdrumToSvgOptions().
var SCALE = 40;
var SPACING_STAFF = 12;
var SPACING_SYSTEM = 18;
var LYRIC_SIZE = 4.5;
var FONT = "Leipzig";
var BREAKS = false;   // false = "auto", true = "line"
var PAGED = false;
var SEARCHCHORDDIRECTION = "chord -d";  // search top note
var SEARCHFILTER = "";
var SEARCHFILTEROBJ = {};
var GLOBALFILTER = "";
var BRIEFSEARCHVIEW = "";  // Do not show only measures with search matches.
var SPREADSHEETSCRIPTID = "";
var SPREADSHEETID = "";

if (localStorage.SPREADSHEETSCRIPTID) {
	SPREADSHEETSCRIPTID = localStorage.SPREADSHEETSCRIPTID;
}
if (localStorage.SPREADSHEETID) {
	SPREADSHEETID = localStorage.SPREADSHEETID;
}


// menu interaction variables:
var INPUT_FONT_SIZE = 1.0;   // used to set font-size in #input (1.0rem is the default);

var FILEINFO = {};
var EDITOR;
var dummyEDITOR;

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

var EditorMode = "humdrum";
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


var COUNTER = 0;


