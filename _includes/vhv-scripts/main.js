//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Mon Dec  6 13:00:55 CET 2021
// Filename:       _includes/vhv-scripts/main.html
// Web Address:    https://verovio.humdrum.org/scripts/main.js
// Syntax:         JavaScript 1.8/ECMAScript 5/6
// vim:            ts=3
//
// Description:   Main javascript file for VHV.
//


// Functions related to load and save buffers,
// also related to the load/save toolbar:
{% include vhv-scripts/buffer/main.js %}

// Functions related to filtering and also related
// to the filter toolbar:
{% include vhv-scripts/filtering/main.js %}

// IIIF image interaction
{% include vhv-scripts/iiif/main.js %}

// Functions related to loading files:
{% include vhv-scripts/loading/main.js %}

// Functions related to the menu (see also _includes/menu):
{% include vhv-scripts/menu/main.js %}

// MusicXML related functions
{% include vhv-scripts/musicxml/main.js %}

// Functions related to saving files:
{% include vhv-scripts/saving/main.js %}

// Functions for musical searching, and also
// related to search toolbar:
{% include vhv-scripts/searching/main.js %}

// Functions for to Google spreadsheet interaction
// and also related to spreadsheet toolbar:
{% include vhv-scripts/spreadsheet/main.js %}

// Functions related to sound playback:
{% include vhv-scripts/timemap/main.js %}

// Functions related to the toolbar:
{% include vhv-scripts/toolbar/main.js %}




// Global variables for the VHV interface:
{% include vhv-scripts/global-variables.js %}

// Initialization functions:
{% include vhv-scripts/setup.js %}

// Functions related to graphical editing:
{% include vhv-scripts/editor.js %}

// Functions related to repertory indexes:
{% include vhv-scripts/hmdindex.js %}

// General functions, mostly for text
// processing:
{% include vhv-scripts/utility.js %}

// Functions for processing Humdrum text:
{% include vhv-scripts/utility-humdrum.js %}

// Functions related to svg manipulation:
{% include vhv-scripts/utility-svg.js %}

// Functions related to svg manipulation:
{% include vhv-scripts/utility-ace.js %}

// Splitter prototypes for dealing with split
// windowing system for text and notation:
{% include vhv-scripts/splitter.js %}

// Functions related to verovio options:
{% include vhv-scripts/verovio-options.js %}

// Uncategorized files:
{% include vhv-scripts/misc.js %}

// Measure highlighting:
{% include vhv-scripts/highlight.js %}

// Main event listener functions:
{% include vhv-scripts/listeners.js %}



