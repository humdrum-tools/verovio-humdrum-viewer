

//////////////////////////////
//
// getScaleFromPercentSize --  This is used to set the scale of the music
//    from a CGI parameter.  The default scale used for Verovio is 40,
//    so a parameter size of 100.0% will set the scale TO 40.  If the
//    scale is too small (< 5) or too large (>500), it will be limited
//    to those values.  A size of 0 will set scale to 40.  Currently
//    this function does not store the calculated SCALE value in
//    localStorage so that the music size can be returned to in a
//    later session.  This seems best, since any custom SCALE should
//    not be overridden by a scale for a particular work included in
//    the URL.
//

function getScaleFromPercentSize(string, baseScale) {
	if (!baseScale) {
		baseScale = 40;
	}
	if (!string) {
		return baseScale;
	}
	var mysize;
	try {
		mysize = parseFloat(string);
	} catch(err) {
		mysize = 100.0;
	}
	var scale = parseInt(baseScale * mysize / 100.0 + 0.5);
	if (scale < 15) {
		scale = 15;
	} else if (scale > 500) {
		scale = 500;
	}
	return scale;
}


