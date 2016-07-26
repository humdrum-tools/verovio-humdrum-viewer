//
// reference: https://github.com/rism-ch/verovio/blob/gh-pages/mei-viewer.xhtml
// vim: ts=3

function play_midi() {
	var base64midi = vrvToolkit.renderToMidi();
	var song = 'data:audio/midi;base64,' + base64midi;
	$("#player").show();
	$("#play-button").hide();
	$("#player").midiPlayer.play(song);
	PLAY = true;
}


var midiUpdate = function(time) {
	var vrvTime = Math.max(0, 2 * time - 800);
	var elementsattime = JSON.parse(vrvToolkit.getElementsAtTime(vrvTime))
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
			ids.forEach(function(noteid) {
				if ($.inArray(noteid, elementsattime.notes) != -1) {
					//console.log(noteid);
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



