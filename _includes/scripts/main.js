{% comment %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Tue Mar 18 00:56:55 PDT 2025
// Filename:      _includes/scripts/main.html
// Included in:   scripts/main.js
// Syntax:        ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   JavaScript code interface for VHV.
//
{% endcomment %}


// Functions related to load and save buffers,
// also related to the load/save toolbar:
{% include scripts/buffer/main.js %}

// Functions related to filtering and also related
// to the filter toolbar:
{% include scripts/filtering/main.js %}

// IIIF image interaction
{% include scripts/iiif/main.js %}

// Functions related to loading files:
{% include scripts/loading/main.js %}

// Functions related to the menu (see also _includes/menu):
{% include scripts/menu/main.js %}

// MusicXML related functions
{% include scripts/musicxml/main.js %}

// PDF related functions
{% include scripts/pdf/main.js %}

// Functions related to saving files:
{% include scripts/saving/main.js %}

// Functions for musical searching, and also
// related to search toolbar:
{% include scripts/searching/main.js %}

// Functions for to Google spreadsheet interaction
// and also related to spreadsheet toolbar:
{% include scripts/spreadsheet/main.js %}

// Functions related to sound playback:
{% include scripts/timemap/main.js %}

// Functions related to the toolbar:
{% include scripts/toolbar/main.js %}




// Global variables for the VHV interface:
{% include scripts/global-variables.js %}

// Initialization functions:
{% include scripts/setup.js %}

// Functions related to graphical editing:
{% include scripts/editor/main.js %}

// Functions related to repertory indexes:
{% include scripts/hmdindex.js %}

// General functions, mostly for text
// processing:
{% include scripts/utility.js %}

// Functions for processing Humdrum text:
{% include scripts/utility-humdrum.js %}

// Functions related to svg manipulation:
{% include scripts/utility-svg.js %}

// Functions related to svg manipulation:
{% include scripts/utility-ace.js %}

// Splitter prototypes for dealing with split
// windowing system for text and notation:
{% include scripts/splitter.js %}

// Functions related to verovio options:
{% include scripts/options/main.js %}

// Uncategorized files:
{% include scripts/misc.js %}

// Measure highlighting:
{% include scripts/highlight.js %}

// Main event listener functions:
{% include scripts/listeners/main.js %}

// Display of Pre/Post HTML content
{% include scripts/html/main.js %}

// Drag-and-drop files onto page:
{% include scripts/drop/main.js %}


