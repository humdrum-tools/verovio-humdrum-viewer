//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Sun Apr 17 17:21:46 PDT 2016
// Last Modified:  Fri Jan  1 18:07:00 PST 2021
// Filename:       _includes/vhv-scripts/main.js
// Web Address:    https://verovio.humdrum.org/scripts/main.js
// Syntax:         JavaScript 1.8/ECMAScript 5/6
// vim:            ts=3
//
// Description:   Main javascript file for VHV.
//

// Global variables for the VHV interface:
{% include vhv-scripts/global-variables.js %}

// Initialization functions:
{% include vhv-scripts/setup.js %}

// Functions related to graphical editing:
{% include vhv-scripts/editor.js %}

// Functions related to sound playback:
{% include vhv-scripts/timemap.js %}

// Functions related to repertory indexes:
{% include vhv-scripts/hmdindex.js %}

// Functions related to filtering and also related
// to the filter toolbar:
{% include vhv-scripts/filtering.js %}

// Functions for to Google spreadsheet interaction
// and also related to spreadsheet toolbar:
{% include vhv-scripts/spreadsheet.js %}

// Functions for musical searching, and also
// related to search toolbar:
{% include vhv-scripts/searching.js %}

// Functions related to the toolbar:
{% include vhv-scripts/toolbar.js %}

// Functions related to saving files:
{% include vhv-scripts/saving.js %}

// Functions related to loading files:
{% include vhv-scripts/loading.js %}

// Functions related to the menu
// (see also _includes/menu):
{% include vhv-scripts/menu.js %}

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

// Functions related to load and save buffers,
// also related to the load/save toolbar:
{% include vhv-scripts/buffer.js %}

// Functions related to verovio options:
{% include vhv-scripts/verovio-options.js %}

// Uncategorized files:
{% include vhv-scripts/misc.js %}

// Measure highlighting:
{% include vhv-scripts/highlight.js %}

// Main event listener functions:
{% include vhv-scripts/listeners.js %}

// PDF file creating/downloading
{% include vhv-scripts/pdf.js %}

// MusicXML export
{% include vhv-scripts/convertToMusicXmlAndSave.js %}



