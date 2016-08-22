//
// reference: https://github.com/rism-ch/verovio/blob/gh-pages/mei-viewer.xhtml
// vim: ts=3

LASTLINE = -1;

function play_midi() {
	var base64midi = vrvToolkit.renderToMidi();
	var song = 'data:audio/midi;base64,' + base64midi;
	$("#player").show();
	$("#play-button").hide();
	$("#player").midiPlayer.play(song);
	PLAY = true;
	LASTLINE = -1;
}


var midiUpdate = function(time) {
	var vrvTime = Math.max(0, 2 * time - 800);
	var elementsattime = JSON.parse(vrvToolkit.getElementsAtTime(vrvTime))
	var matches;
	if (elementsattime.page > 0) {
		if (elementsattime.page != PAGE) {
			PAGE = elementsattime.page;
			loadPage();
		}
		if ((elementsattime.notes.length > 0) && (ids != elementsattime.notes)) {
			ids.forEach(function(noteid) {
  				if ($.inArray(noteid, elementsattime.notes) == -1) {
					$("#" + noteid ).attr("fill", "#000");
  					$("#" + noteid ).attr("stroke", "#000"); 
					//$("#" + noteid ).removeClassSVG("highlighted"); 
 				}
			});
			ids = elementsattime.notes;
/*
			for (var i=0; i<ids.length; i++) {
				if (matches = ids[i].match(/-L(\d+)/)) {
					var line = matches[1];
					if (line != LASTLINE) {
						showIdInEditor(ids[i]);
						LASTLINE = line;
					}
				}
			}
*/
			ids.forEach(function(noteid) {
				if ($.inArray(noteid, elementsattime.notes) != -1) {
					// console.log("NoteID", noteid);

					if (matches = noteid.match(/-L(\d+)/)) {
						var line = parseInt(matches[1]);
console.log("LASTLINE = ", LASTLINE, "line =", line);
						if ((line != LASTLINE) && (line > LASTLINE)) {
							showIdInEditor(noteid);
							LASTLINE = line;
						}
					}

					$("#" + noteid ).attr("fill", "#c00");
					$("#" + noteid ).attr("stroke", "#c00");; 
					//$("#" + noteid ).addClassSVG("highlighted"); 
				}
			}); 
		}
	}
}


//////////////////////////////
//
// midiStop --
//

var midiStop = function() {
	ids.forEach(function(noteid) {
		$("#" + noteid ).attr("fill", "#000");
		$("#" + noteid ).attr("stroke", "#000"); 
		//$("#" + noteid ).removeClassSVG("highlighted"); 
	});
	$("#player").hide();
	$("#play-button").show();
	PLAY = false;
   LASTLINE = -1;
}


$.fn.addClassSVG = function(className) {
	$(this).attr('class', function(index, existingClassNames) {
		return existingClassNames + ' ' + className;
	});
	return this;
};


$.fn.removeClassSVG = function(className){
	$(this).attr('class', function(index, existingClassNames) {
		//var re = new RegExp(className, 'g');
		//return existingClassNames.replace(re, '');
	});
	return this;
};



