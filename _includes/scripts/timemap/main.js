//
// Programmer:     Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:  Fri Jun 23 08:11:13 CEST 2017
// Last Modified:  Fri Jun 23 08:11:16 CEST 2017
// Filename:       _includes/vhv-scripts/timemap.js
// Syntax:         JavaScript 1.8/ECMAScript 5
// vim:            ts=3: ft=javascript
//
// Description:   Timemap processing code for VHV.
//

var TIMEMAP = [];
var LAST_TIMEMAP_INDEX = -1;
var LAST_TIME = -1;
var LOOKAHEAD = 20;  // 20 milliseconds
var INCREMENT = 20;  // 20 milliseconds
var REFRESH;

{% include vhv-scripts/timemap/CheckEventMap.js     %}
{% include vhv-scripts/timemap/CheckTimeMap.js      %}
{% include vhv-scripts/timemap/InitializeTimemap.js %}
{% include vhv-scripts/timemap/ProcessNoteEvents.js %}
{% include vhv-scripts/timemap/TurnOffAllNotes.js   %}
{% include vhv-scripts/timemap/getTimemap.js        %}



