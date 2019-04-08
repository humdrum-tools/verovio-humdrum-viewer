//
// Humdrum file syntax validator for ace editor.
// vim: ts=3
//
// Based on humdrum toolkit tool "humdrum":
//    https://github.com/humdrum-tools/humdrum/blob/master/toolkit-source/c-programs/humdrum_.c
//


function validateHumdrum_Process(hum, onError, onWarning) {
	var current_no_of_spines = 0;
	var first_interpretation_yet = false;
	var new_path = false;
	var tokens;
	var interp = [];
	var i;

	const SPINE_CHARS      = "+^-xv";
	const REGEXP_EXCLUSIVE = /^\*\*/;
	const REGEXP_EMPTY     = /^\s*$/;
	const REGEXP_DURATION  = /(\d+)(%\d*)?/;


	//////////////////////////////
	//
	// validateHumdrum_process.dump_interp --
	//

	function dump_interp(txt) {
		onWarning(txt + interp.map(function(i) {return i.top + "/" + i.bottom}).join(" "), i, 0);
		//console.log("Interp at row " + i, interp.map(JSON.stringify).join());
	}



	//////////////////////////////
	//
	// validateHumdrum_process.process_local --
	//

	function process_local(fields) {
		var position = 0;
		if (new_path) {
			if (!onError("Record containing add-spine indicator has not followed by exclusive interpretation for that spine", i, 0)) {
				return false;
			}
			new_path = false;
		}
		if (!first_interpretation_yet) {
			if (!onError("Local comment precedes first exclusive interpretation record", i, 0)) {
				return false;
			}
			current_no_of_spines = fields.length;
		}
		if (fields.length !== current_no_of_spines) {
			if (!onError("Number of sub-comments in local comment does not match the number of currently active spines", i, 0)) {
				return false;
			}
		}
		for (var j = 0; j < fields.length; j++) {
			if (fields[j].charAt(0) === "!") {
				if (fields[j].charAt(1) === "!") {
					if (!onWarning("Local comment may be mistaken for global comment", i, position)) {
						return false;
					}
				}
			} else {
				if (!onError("Missing initial exclamation mark in local comment", i, position)) {
					return false;
				}
			}
			position += fields[j].length + 1;
		}
		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.check_new_path --
	//

	function check_new_path(fields) {
		for (var j = 0; j < interp.length; j++) {
			if (interp[j].indicator === "N") {
				if (!REGEXP_EXCLUSIVE.test(fields[j])) {
					if (!onError("Record containing add-spine indicator has not been followed by exclusive interpretation for that spine", i, 0)) {
						return false;
					}
				}
				interp[j].indicator = "*";
			}
		}
		new_path = false;
		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.check_first_interp --
	//

	function check_first_interp(fields) {
		var position = 0;
		/* Every spine must contain only an exclusive interpretation */
		for (var j = 0 ; j < fields.length; j++) {
			if (fields[j] === "*") {
				if (!onError("First exclusive interpretation record contains a null interpretation", i, position)) {
					return false;
				}
			}
			if (!REGEXP_EXCLUSIVE.test(fields[j])) {
				if (!onError("First exclusive interpretation record contains a non-exclusive interpretation", i, position)) {
					return false;
				}
			}
			if (fields[j].charAt(0) === "*" && (SPINE_CHARS.indexOf(fields[j].charAt(1)) >= 0)) {
				if (!onError("First exclusive interpretation record contains a spine-path indicator", i, position)) {
					return false;
				}
			}
			position += fields[j].length + 1;
		}
		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.store_new_interps --
	//

	function store_new_interps(fields) {
		var new_interp;
		var position = 0;
		/* Loop through each currently active spine */
		for (var j = 0; j < fields.length; j++) {
			if (j >= interp.length) {
				new_interp = interp[j] = {}
				new_interp.indicator = "";
				new_interp.name = "";
				new_interp.hasRhythm = false;
				new_interp.top = 0;
				new_interp.bottom = 1;
			} else {
				new_interp = interp[j];
			}
			if (REGEXP_EXCLUSIVE.test(fields[j])) {
				if (new_interp.name) {
					if (!onError("Changing spine exclusive interpretation is not allowed", i, position)) {
						return false;
					}
				}
				new_interp.name = fields[j];
				new_interp.hasRhythm = fields[j] === "**kern" || fields[j] === "**recip";
			}
			position += fields[j].length + 1;
		}
		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.store_indicators --
	//

	function store_indicators(fields) {
		var position = 0;
		for (var j = 0; j < fields.length && j < interp.length; j++) {
			if (fields[j].charAt(0) !== "*" ||
					( (fields[j].length > 1)
						&& (SPINE_CHARS.indexOf(fields[j].charAt(1)) < 0))) {
				if (!onError("Spine-path indicators mixed with keyword interpretations", i, position)) {
					return false;
				}
			}
			if (fields[j] === "*") {
				interp[j].indicator = "*";
			} else {
				interp[j].indicator = fields[j].charAt(1);
			}
			position += fields[j].length;
		}
		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.process_indicators --
	//

	function process_indicators() {
		var j, current, k, error, found, exchange, temp;
		for (j = 0; j < interp.length; j++) {
			current = interp[j];
			switch(current.indicator) {

				case "^": //do_split
					current.indicator = "*";
					interp.splice(j, 0, {
						indicator: current.indicator,
						name:      current.name,
						hasRhythm: current.hasRhythm,
						top:       current.top,
						bottom:    current.bottom
					});
					j++;
					current_no_of_spines++;
					break;

				case "-": //do_terminate
					if (current.top > 0) {
						if (!onError("Spine terminated " + current.top + "/" + current.bottom + " too early", i, 0)) {
							return false;
						}
					}
					interp.splice(j, 1);
					current_no_of_spines--;
					j--;
					break;

				case "x": //do_exchange
					current.indicator = "*";
					k = j + 1;
					exchange = -1;
					error = false;
					found = false;
					while (k < interp.length) {
						if (interp[k].indicator === "x") {
							if (found) {
								error = true;
							} else {
								exchange = k;
								found = true;
							}
							interp[k].indicator = "*";
						}
						k++;
					}
					if (error || exchange < 0) {
						if (!onError("Improper number of exchange-path indicators", i, 0)) {
							return false;
						}
					} else {
						temp = current.name;
						current.name = interp[exchange].name;
						interp[exchange].name = temp;
					}
					break;

				case "v": //do_join
					current.indicator = "*";
					if (j === interp.length - 1) {
						if (!onError("Single join-path indicator found at end of interpretation record", i, 0)) {
							return false;
						}
					} else if (interp[j + 1].indicator !== 'v'){
						if (!onError("Join-path indicator is not adjacent to another join-path indicator", i, 0)) {
							return false;
						}
					} else {
						j = j + 1;
						while (j < interp.length && interp[j].indicator === "v") {
							if (current.name !== interp[j].name) {
								if (!onError("Exclusive interpretations do not match for designated join spines", i, 0)) {
									return false;
								}
							}
							if (current.top * interp[j].bottom !== current.bottom * interp[j].top) {
								if (!onError("Note durations do not match for designated join spines", i, 0)) {
									return false;
								}
							}
							interp.splice(j, 1);
							current_no_of_spines--;
						}
						j = j - 1;
					}
					break;

				case "+": //do_add
					interp.splice(j + 1, 0, {
						indicator: "N",
						name: "",
						hasRhythm: false
					});
					current.indicator = "*";
					new_path = true;
					current_no_of_spines++;
					break;
			}
		}
		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.process_interpretation --
	//

	function process_interpretation(fields) {
		var spine_path_record,
				position = 0;

		// If a new path indicator occurred in the previous record, check the
		// current record for an exclusive interpretation in that spine
		if (new_path) {
			if (!check_new_path(fields)) {
				return false;
			}
		}

		// Each spine must begin with an asterisk and cannot contain 2
		// asterisks without anything following

		for (var j = 0; j < fields.length; j++) {
			if (fields[j].charAt(0) !== "*") {
				if (!onError("Missing initial asterisk in interpretation keyword", i, position)) {
					return false;
				}
			} else if (fields[j] === "**") {
				if (!onError("Null exclusive interpretation found", i, position)) {
					return false;
				}
			}
			position += fields[j].length + 1;
		}

		// If this is the first interpretation, set the variables and check
		// that it is a valid 'first interpretation' record.
		if (!first_interpretation_yet) {

			first_interpretation_yet = true;
			current_no_of_spines = fields.length;
			if (!check_first_interp(fields) || !store_new_interps(fields)) {
				return false;
			}

		} else {
			// Otherwise, determine if the record is a spine path record or not

			if (fields.length !== current_no_of_spines) {
				if (!onError("Incorrect number of spines in interpretation record", i, 0)) {
					return false;
				}
				current_no_of_spines = fields.length;
			}

			spine_path_record = false;
			for (j = 0; j < fields.length && !spine_path_record; j++) {
				spine_path_record = (fields[j].charAt(0) === "*")
						&& (fields[j].length === 2)
						&& (SPINE_CHARS.indexOf(fields[j].charAt(1)) >= 0);
			}

			// If it is a spine path record, store and process the indicators
			if (spine_path_record) {
				if (!store_indicators(fields) || !process_indicators()) {
					return false;
				}

				if (current_no_of_spines === 0) {
					first_interpretation_yet = false;
				}
			} else {
				// Otherwise, store the new interpretations
				if (!store_new_interps(fields)) {
					return false;
				}
			}
		}
		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.process_data --
	//

	function process_data(fields) {
		var subtokens, position = 0;

		function reduceSpineRational(top, bottom, spine) {
			var c, a = Math.round(top), b = Math.round(bottom);
			while (b !== 0) {
				c = a % b;
				a = b;
				b = c;
			}
			spine.top = Math.floor(top / a);
			spine.bottom = Math.floor(bottom / a);
		}

		if (new_path) {
			if (!onError("Record containing add-spine indicator has not been followed by exclusive interpretation for that spine", i, 0)) {
				return false;
			}
			new_path = false;
		}

		if (!first_interpretation_yet) {
			if (!onError("Data record appears before first exclusive interpretation record", i, 0)) {
				return false;
			}
			current_no_of_spines = fields.length;
		} else if (current_no_of_spines !== fields.length) {
			if (!onError("Number of tokens in data record does not match the number of currently active spines", i, position)) {
				return false;
			}
		}

		//shortest non zero duration in line
		var min_top = 0, min_bottom = 1, empty_min_top = 0, empty_min_bottom = 1;

		for (var j = 0; j < fields.length; j++) {
			var spine = interp[j];

			if (j > 0) {
				if (fields[j].charAt(0) === "!") {
					if (fields[j].charAt(1) === "!") {
						if (!onWarning("Data token may be mistaken for global comment", i, position)) {
							return false;
						}
					} else {
						if (!onWarning("Data token may be mistaken for local comment", i, position)) {
							return false;
						}
					}
				} else if (REGEXP_EXCLUSIVE.test(fields[j])) {
					if (!onWarning("Data token may be mistaken for exclusive interpretation", i, position)) {
						return false;
					}
				} else if (fields[j].charAt(0) === "*") {
					if (!onWarning("Data token may be mistaken for tandem interpretation", i, position)) {
						return false;
					}
				}
			}

			subtokens = fields[j].split(" ");
			if (spine && spine.hasRhythm) {
				var note = subtokens[0];

				if (note.charAt(0) !== "=") {
					var bottom, top, isGrace = note.indexOf("q") >= 0, m;

					if (m = REGEXP_DURATION.exec(note)) {

						//check if previous note is off
						if (!isGrace && spine.top > 0) {
							if (!onError("Rhythm off by " + spine.top + "/" + spine.bottom + " at field " + (j + 1), i, j)) {
								return false;
							}
							spine.top = 0;
							spine.bottom = 1;
						}

						//parse duration
						bottom = parseInt(m[1])
						if (m[1].charAt(0) === "0") {
							if (bottom > 0) {
								if (!onError("Non-zero duration starts with zero", i, j)) {
									return false;
								}
							} else if (m[2]) {
								if (!onError("Invalid duration denominator", i, j)) {
									return false;
								}
							}
							bottom = 1;
							top = (1 << m[1].length);
						} else {
							if (m[2] && m[2].length > 1) {
								top = parseInt(m[2].substr(1));
							} else {
								if (m[2] && !onError("Incorrect percent sign in duration", i, j)) {
									return false;
								}
								top = 1;
							}
						}
					}

					//adjust current note duration, find shortest duration in a row
					if (!isGrace && m) {

						//dots are needed only here
						var dots = 0, c = 0, ot = top; //count dots
						while ((c = note.indexOf(".", c)) >= 0) {
							top = 2 * top + ot;
							bottom *= 2;
							c++;
						}

						//save shortest duration
						if (min_top === 0 || (min_top * bottom > top * min_bottom)) {
							min_top = top;
							min_bottom = bottom;
						}

						//add duration
						if (spine.bottom === bottom) {
							spine.top += top;
						} else {
							reduceSpineRational(
								spine.top * bottom + top * spine.bottom,
								spine.bottom * bottom,
								spine);
						}
					} else {
						//otherwise check if the remaining duration is shorter than current minimum
						if (note.indexOf("%") >= 0) {
							if (!onError("Invalid percent sign", i, j)) {
								return false;
							}
						}
						if (empty_min_top === 0 || (empty_min_top * spine.bottom > spine.top * empty_min_bottom)) {
							empty_min_top = spine.top;
							empty_min_bottom = spine.bottom;
						}
					}
				}
			}

			if (subtokens.length > 1 && subtokens.indexOf(".") >= 0) {
				if (!onError("Multiple-stop contains null token", i, position)) {
					return false;
				}
			}
			position += fields[j].length + 1;
		}

		// adjust pending notes if there was any rhythm in a row
		if (min_top > 0) {
			//check if any pending note ends earlier
			if (empty_min_top > 0 && (empty_min_top * min_bottom < empty_min_bottom * min_top)) {
				min_top = empty_min_top;
				min_bottom = empty_min_bottom;
			}
			for (j = 0; j < fields.length && j < interp.length; j++) {
				var spine = interp[j];
				if (!spine.hasRhythm) continue;
				if (spine.bottom === min_bottom) {
					spine.top -= min_top;
				} else {
					reduceSpineRational(
						spine.top * min_bottom - spine.bottom * min_top,
						spine.bottom = spine.bottom * min_bottom,
						spine);
				}
				//this code should never execute
				if (spine.top < 0) {
					dump_interp(min_top + "/" + min_bottom + "] ");
					if (!onError("Missing note at field " + (j + 1) + " " + fields[j], i, position)) {
						return false;
					}
					spine.top = 0; spine.bottom = 1;
				}
			}
		}

		return true;
	}



	//////////////////////////////
	//
	// validateHumdrum_process.process_tokens --
	//

	function process_tokens(fields) {
		var position = 0;
		for (var j = 0; j < fields.length; j++) {
			if (REGEXP_EMPTY.test(fields[j])) {
				if (!onError("Illegal empty token", i, position)) {
					return;
				}
			}
			position += fields[j].length + 1;
		}
		return true
	}


	/////////////////////////////////////////////////////////////////////////


	//main loop through rows
	for (i = 0; i < hum.length; i++) {
		tokens = hum[i];

		if (tokens.length === 1 && tokens[0] === "") {
			if (!onWarning("Illegal empty record", i, 0)) {
				return;
			}
			continue;
		}

		if (tokens[0].charAt(0) === "!" && tokens[0].charAt(1) === "!") {
			// process_global();
			continue;
		}

		process_tokens(tokens);

		if (tokens[0].charAt(0) === "!") {
			if (!process_local(tokens)) {
				return;
			}
		} else if (tokens[0].charAt(0) === "*") {
			if (!process_interpretation(tokens)) {
				return;
			}
		} else {
			if (!process_data(tokens)) {
				return;
			}
		}
	}

	if (current_no_of_spines !== 0) {
		// at this point i is > 0
		if (!onWarning("All spines have not been properly terminated.", i - 1, 0)) {
			return;
		}
		for (var j = 0; j < current_no_of_spines; j++) {
			if (interp && interp[j] && (interp[j].hasRhythm && interp[j].top > 0)) {
				if (!onError("Rhythm off by " + interp[j].top + "/" + interp[j].bottom, i - 1, 0)) {
					return;
				}
			}
		}
	}

} // end function validateHumdrum_Process



