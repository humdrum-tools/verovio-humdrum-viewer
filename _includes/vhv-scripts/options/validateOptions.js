

//////////////////////////////
//
// validateOptions -- Make sure verovio options are valid: numbers with a min
//     and max value will clip the option value to that range.  Strings with
//     multiple ALT entries will only be passed if option value is in that 
//     list or is in DEF (default).  Unknown options will not be passed.
//     Warning messages will be sent to the console if invalid options
//     are detected.
//

function validateOptions(options) {

	// Function to check if an option value is a number:
	function isNumber(value) {
		return typeof value === 'number'
		? isFinite(value)
			: (typeof value === 'string' && value !== '' && isFinite(Number(value)));
	}

	// Cleaned options to be returned:
	let output = {};

	for (let key in options) {
		if (!options.hasOwnProperty(key)) {
			console.warn(`Warning: option ${key} is not local to option list.`);
			continue;
		}

		// First check if the option is known:
		let value = options[key];
		let name = VEROVIOOPTIONS[key];
		if (!name) {
			console.error(`Cannot find ${key} in verovio option list`);
			continue;
		}

		// Get the data type of the option:
		let arg = VEROVIOOPTIONS[key].ARG;

		// Process integer options, checking to see if number is in min/max range
		// if the option definition has a min/max value:
		if ((arg === "integer")) {
			// Interger options must have a number as its value:
			if (!isNumber(value)) {
				console.warn(`Expected a number for option ${key}, but got ${value}`);
				continue;
			}

			let min = VEROVIOOPTIONS[key].MIN;
			let max = VEROVIOOPTIONS[key].MAX;

			if (isNumber(min) && Number(value) < Number(min)) {
				// If number is less than MIN, the clip to MIN
				console.warn(`Value ${value} for option ${key} is too small.`);
				console.warn(`Setting to ${min}`);
				value = min;
				output[key] = value;
				continue;
			} else if (isNumber(max) && Number(value) > Number(max)) {
				// If number is greater than MIN, the clip to MAX
				console.warn(`Value ${value} for option ${key} is too large.`);
				console.warn(`Setting to ${max}`);
				value = max;
				output[key] = value;
				continue;
			} else {
				// number in range
				output[key] = value;
				continue;
			}
		} else if ((arg === "float")) {
			// Float options must have a number as its value:
			if (!isNumber(value)) {
				console.warn(`Expected a number for option ${key}, but got ${value}`);
				continue;
			}

			let min = VEROVIOOPTIONS[key].MIN;
			let max = VEROVIOOPTIONS[key].MAX;

			if (isNumber(min) && Number(value) < Number(min)) {
				// If number is less than MIN, the clip to MIN
				console.warn(`Value ${value} for option ${key} is too small.`);
				console.warn(`Setting to ${min}`);
				value = min;
				output[key] = value;
				continue;
			} else if (isNumber(max) && Number(value) > Number(max)) {
				// If number is greater than MIN, the clip to MAX
				console.warn(`Value ${value} for option ${key} is too large.`);
				console.warn(`Setting to ${max}`);
				value = max;
				output[key] = value;
				continue;
			} else {
				// number in range
				output[key] = value;
				continue;
			}
		} else if (arg === "boolean") {
			// Use only 1/0 for true/false:
			if (value) {
				output[key] = 1;
			} else {
				output[key] = 0;
			}
			continue;
		} else if (arg == "string") {
			let def = VEROVIOOPTIONS[key].DEF;
			let alt = VEROVIOOPTIONS[key].ALT;
			if (value === def) {
				// Default value is used (could suppress if default option):
				output[key] = value;
				continue;
			} else if (Array.isArray(alt)) {
				if (alt.includes(value)) {
					// Option value is in the alternate list:
					output[key] = value;
					continue;
				} else {
					console.warn(`Warning: option ${key}'s value ${value} is not in list: ${def}, ${alt.join(", ")}`);
					continue;
				}
			} else {
				// Open-ended string value for option:
				output[key] = value;
				continue;
			}
		}

		console.warn(`SKIPPING OPTION: ${key} VALUE: ${value} ARG: ${arg} `, VEROVIOOPTIONS[key]);
		
	}

	return output;
}



