//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Fri Jan  9 11:19:47 PST 2015
// Last Modified: Thu Jan 22 21:45:50 PST 2015
// Filename:      aton.js
// Syntax:        JavaScript 1.8.5/ECMAScript 5.1
// vim:           ts=3
//
// Description:   AT Object Notation library.  An alternate JavaScript
//                object packing notation to JSON that allows for
//                multi-line property values.
//
// Todo:
//

'use strict';

//////////////////////////////
//
// ATON constructor -- The ATON object is used to manage options for
//    parsing of AT Notation Object strings and stringifying JavaScript
//    objects into ATON strings.
//

function ATON () {
	this.options = {};
	return this;
}



//////////////////////////////
//
// ATON.prototype.defaultOptions -- Defaults for parsing/stringifying ATON
//    strings.  Preparing for a future version of parser, currently mostly
//    inactive.
//

ATON.prototype.defaultOptions = {

	// recordTerminator: String which marks the end of each data record
	// in the incoming/outgoing data.  By default this is the newline character.
	recordTerminator: '\n',

	// metaMarker: String which marks the start of a control record, such as
	// the start/stop of an object value.  This must always occur at the
	// start of an incoming record.
	metaMarker: '@@',

	// objectBegin: The meta key used to indicate the start of a property
	// object value.  This can be an array of strings, with the first one
	// being the control parameter name for starting an object when using
	// stringify().
	objectBegin: ['BEGIN', 'START'],

	// objectEnd: The meta key used to indicate the end of a property
	// object value.  This can be an array of stings, with the first one
	// being the control parameter name for ending an object when using
	// stringify().
	objectEnd: ['END', 'STOP'],

	// commentMarker: Regular expression which indicates a comment record.
	commentMarker: '^@{5,}|^@{1,4}[^@]|^@{,4}$',

	// keyMarker: String which indicates the start of a property key/name.
	// This must always occur at the start of an incoming record.
	keyMarker: '@',

	// keyTerminator: Regular expression which indicates the separator between
	// a property key/name and the property value.
	keyTerminator: '\s*:\s*',

	// keyTerminatorOut: The string used to separate key/value pairs when
	// stringifying an object to ATON.
	keyTerminatorOut: ':\t',

	// forceKeyCase: Set the case of the property name characters.
	//   '' = do not alter case of property name characters.
	//   'lc' = force property name characters to lower case.
	//   'uc' = force property name characters to upper case.
	forceKeyCase: '',

	// forceType: When reading in an ATON file, convert property values
	// matching the given key to the given type.  The types are case
	// insensitive and globally affect all property names in any object.
	// Use "@@TYPE:key:type" records in the ATON file to locally adjust
	// the type if the conversions should not apply globally in the file.
	// Strinified ATON content only contains string types, so "@@TYPE"
	// records can be used to force the type when parsing the ATON string
	// again.  The forceType property value is an object containing
	// sub-properties indexed by a property name.  The allowed types are:
	// 	String	=	default type.
	// 	Number	=	convert to a JavaScript Number.
	//    Integer  =  convert to a JavaScript Number with parseInt().
	forceType: undefined,

   // onlyChildToRoot: If the parsed output contains a single property whose
	// value is an object, then return that property value rather than the
	// root object.  This will convert:
   //    @BEGIN:X
	//    @Y:Z
   //    @END:X
   // into '{"Y":"Z"}' rather than '{"X":{"Y":"Z"}}'
   onlyChildToRoot: false
};



//////////////////////////////
//
// ATON.prototype.getOption -- Return the value of the given option name.
//    First search this.options for the property, then if not found, try
//    the ATON.prototype.defaultOptions object.
//

ATON.prototype.getOption = function (name) {
	if ((typeof this.options === 'undefined')
			|| (this.options[name] === 'undefined')) {
		return this.defaultOptions[name];
	} else if ((typeof this.options === 'object')
			&& (typeof this.options[name] === 'undefined')) {
		return this.defaultOptions[name];
	} else {
		return this.options[name];
	}
}



//////////////////////////////
//
// ATON.prototype.setOption -- Set the value of a particular option.
//

ATON.prototype.setOption = function (name, value) {
   if (typeof this.options === 'undefined') {
			this.options = {};
	}
	this.options[name] = value;
	return this;
}

//
// Alias methods for setOption:
//

// convert all input keys into lower case.
ATON.prototype.setLCKeys = function () { this.setOption('forceKeyCase', 'lc'); return this; }
// convert all input keys into upper case.
ATON.prototype.setUCKeys = function () { this.setOption('forceKeyCase', 'uc'); return this; }
// OC = original case (don't alter case of key letters).
ATON.prototype.setOCKeys = function () { this.setOption('forceKeyCase', ''); return this; }
ATON.prototype.unsetKeyCase = function ()  { this.setOCKeys(); }

ATON.prototype.setOnlyChildRoot = function () { 
	this.setOption('onlyChildToRoot', true);
}
ATON.prototype.unsetOnlyChildRoot = function () { 
	this.setOption('onlyChildToRoot', false);
}



//////////////////////////////
//
// ATON.prototype.getOptionString -- Return the value of the given option
//    name, guaranteeing that it is a string.  If the value is an array,
//		return the first element.  If the value is undefined then return an
//    empty string.
//

ATON.prototype.getOptionString = function (name) {
	var value = this.getOption(name);
	if (typeof value === 'string') {
		return value;
	} else if (value instanceof Array) {
		return value.length ? value[0].toString() : '';
	} else if (typeof value === 'number') {
		return String(value);
	} else {
		return '';
	}
}



//////////////////////////////
//
// ATON.prototype.resetOptions --
//

ATON.prototype.resetOptions = function () {
	this.options = {};
};



//////////////////////////////
//
// ATON.prototype.parse -- parse ATON content and return the JavaScript
//   object that it describes.
//

ATON.prototype.parse = function (string) {
	var output = this.parseRecordArray(string.split(/\n/));
	if (this.getOption('onlyChildToRoot')) {
		var keys = Object.keys(output);
		if ((keys.length === 1) && (typeof output[keys[0]] === 'object')) {
			return output[keys[0]];
		}
	} 
	return output;
};



//////////////////////////////
//
// ATON.prototype._initializeParsingStateVariables -- Initalize
//    ATON string parsing variables.  This is a pseudo private member
//    of the ATON class and has no function outside of the class.
//

ATON.prototype._initializeParsingStateVariables = function () {
	return {
		action:     undefined,
		label:      undefined,
		labelbegin: undefined,
		labelend:   undefined,
		curobj:     undefined,
		curobjname: undefined,
		curkey:     undefined, // name of current property being processed
		ocurkey:    undefined, // same as curkey, but not case adjustments
		newkey:     undefined, // name of next property to be processed
		onewkey:    undefined, // same as newkey, no case adjustment
		newvalue:   undefined, // initial value of next property to be processed
		linenum:    undefined, // Current line parsing, 1-indexed.
		node:       [],        // Object parsing hierarchy.
		typer:      {},        // Database of properties to typecast.
		output:     {},         // Final output from parser.
		// options:
		keycase:    this.getOptionString('forceKeyCase')
	};
}



//////////////////////////////
//
// ATON.prototype.parseRecordArray -- Parse ATON data from a list of
//   individual records.
//

ATON.prototype.parseRecordArray = function (records) {
	if (!(records instanceof Array) || (records.length === 0) ||
			(typeof records[0] !== 'string')) {
		return {};
	}

	var parsingVariables = this._initializeParsingStateVariables();
	parsingVariables.curobj = parsingVariables.output;

	for (var i=0; i<records.length; i++) {
		parsingVariables.linenum = i+1;
		try {
			this._parseRecord(records[i], parsingVariables);
		} catch(error) {
			console.log(error);
			process.exit(1);
		}
	}

	// Remove whitespace around last property value:
	var v = parsingVariables;
	this._cleanParameter(v);

	return v.output;
};



//////////////////////////////
//
// ATON.prototype._parseRecord -- read an individual ATON record and process
//    according to the variable object given as the second parameter.  This
//    is a pseudo-private method which is only useful inside of the ATON
//    object.
//

ATON.prototype._parseRecord = function (line, v) {
	var matches;
	if (line.match(/^@{5,}|^@+\s|^@{1,4}$/)) {
		// Filter out comment lines.
		return;
	} else if ((typeof v.curkey === 'undefined') && line.match(/^[^@]|^$/)) {
		// Ignore unassociated text.
		return;
	} else if (matches = line.match(/^@@[^@ ]/)) {
		// Control message.
		// End current property.
		this._cleanParameter(v);
		v.curkey  = undefined;
		v.ocurkey = undefined;
		if (matches = line.match(/^@@(BEGIN|START)\s*:\s*(.*)\s*$/i)) {
			v.label  = matches[2];
			if (typeof v.curobj[v.label] === 'undefined') {
				// create a new object and enter into it
				v.curobj[v.label] = {};
				v.node.push({label:v.label, startline:v.linenum});
				v.curobj = v.curobj[v.label];
			} else if (v.curobj[v.label] instanceof Array) {
				// Append at end of array of objects with same v.label and
				// update the array index in the last v.node entry.
				v.curobj[v.label].push({});
				v.node.push({});
				v.node[v.node.length-1].index = v.curobj[v.label].length - 1;
				v.node[v.node.length-1].label = v.label;
				v.node[v.node.length-1].startline = v.linenum;
				v.curobj = v.curobj[v.label][v.curobj[v.label].length - 1];
			} else {
				// Single string value already exists. Convert it to an array
				// and then append new object and enter it.
				var temp = v.curobj[v.label];
				v.curobj[v.label] = [v.curobj[v.label], {}];
				v.node.push({});
				v.node[v.node.length-1].index = v.curobj[v.label].length - 1;
				v.node[v.node.length-1].label = v.label;
				v.node[v.node.length-1].startline = v.linenum;
				v.curobj = v.curobj[v.label][v.curobj[v.label].length - 1];
			}
		} else if (matches = line.match(/^@@(END|STOP)\s*:?\s*(.*)\s*$/i)) {
			// End an object, so go back to the parent.
			if (typeof v.curkey !== 'undefined') {
				// clean whitespace of last read property:
				v.curobj[v.curkey] = v.curobj[v.curkey].replace(/^\s+|\s+$/g, '');
				v.curkey = undefined;
				v.ocurkey = undefined;
			}
			v.action     = matches[1];
			v.labelend   = matches[2];
			v.labelbegin = v.node[v.node.length - 1].label;
			if (typeof v.node[v.node.length-1].startline === 'undefined') {
				throw new Error('No start for ' + v.action + ' tag on line '
					+ v.node[v.node.length-1].startline + ': ' + line);
				v.output = {};
				// return v.output;
			}
			if (typeof v.labelend !== 'undefined') {
				// ensure that the v.label begin/end tags match
				if ((v.labelbegin !== v.labelend) && (v.labelend !== "")) {
					throw new Error('Labels do not match on lines '
						+ v.node[v.node.length-1].startline + ' and '
						+ v.linenum + ': "' + v.labelbegin
						+ '" compared to "' + v.labelend + '".');
					v.output = {};
					// return v.output;
				}
			}
			// Go back to the parent object.
			if (!v.node) {
				throw new Error('Error on line ' + v.linenum +
					': already at object root.');
				v.output = {};
				// return v.output;
			}
			v.node.pop();
			v.curobj = v.node.reduce(function (obj, x) {
					return (obj[x.label] instanceof Array) ?
							obj[x.label][x.index] : obj[x.label];
				}, v.output);
		} else if (matches=line.match(/^@@TYPE\s*:\s*([^:]+)\s*:\s*(.*)\s*$/i)) {
			// Automatic property value conversion.
			v.typer[matches[1]] = matches[2];
		}
	} else if (matches = line.match(/^@([^\s:@][^:]*)\s*:\s*(.*)\s*$/)) {
		// New property
		v.newkey   = matches[1];
		v.onewkey  = v.newkey;
		v.newvalue = matches[2];
		this._cleanParameter(v);
		if (v.keycase === 'uc') {
			v.ocurkey = v.newkey;
			v.curkey  = v.newkey.toUpperCase();
		} else if (v.keycase === 'lc') {
			v.ocurkey = v.newkey;
			v.curkey  = v.newkey.toLowerCase();
		} else {
			v.ocurkey = v.newkey;
			v.curkey  = v.newkey;
		}
		if (typeof v.curobj[v.curkey] === 'undefined') {
			// create a new property
			v.curobj[v.curkey] = v.newvalue;
		} else if (v.curobj[v.curkey] instanceof Array) {
			// append next object to end of array
			v.curobj[v.curkey].push(v.newvalue);
		} else {
			// convert property value to array, and then append
			v.curobj[v.curkey] = [v.curobj[v.curkey], v.newvalue];
		}
	} else if (typeof v.curkey !== 'undefined') {
		// Continuing value from property started previously
		// If the line starts with a backslash, remove it since it is an
		//escape for the "@" sign or a literal "\" at the start of a line:
		// \@some data line   -=>  @some data line
		// \\@some data line  -=>  \@some data line
		// Only "@" and "\@" at the start of the line need to be esacaped;
		// otherwise, all other "@" and "\" characters are literal.
		// If another property marker is used other than "@", then that
		// character (or string) needs to be backslash escaped at the
		// start of a multi-line value line.
		if (line.charAt(0) !== '@') {
			if (line.slice(0,2) === '\\@') {
				line = line.slice(1);
			}
			if (line.slice(0,3) === '\\\\@') {
				line = line.slice(1);
			}
			if (v.curobj[v.curkey] instanceof Array) {
				v.curobj[v.curkey][v.curobj[v.curkey].length - 1] += '\n' + line;
			} else {
				v.curobj[v.curkey] += '\n' + line;
			}
		}
	}
};



//////////////////////////////
//
// ATON.prototype._cleanParameter -- Remove whitespace from beginning
//    and ending of value.  If the type should be cast to another form,
//    also do that.  This is a pseudo-private method of the ATON class.
//

ATON.prototype._cleanParameter = function (v) {
	if ((typeof v.curkey !== 'undefined') && v.curobj && v.curobj[v.curkey]) {
		var value;
		if (v.curobj[v.curkey] instanceof Array) {
			value = v.curobj[v.curkey][v.curobj[v.curkey].length-1];
		} else if (typeof v.curobj[v.curkey] === 'string') {
			value = v.curobj[v.curkey];
		}
		value = value.replace(/^\s+|\s+$/g, '');
		if (v.typer && (typeof v.typer[v.ocurkey] !== 'undefined')) {
			var newtype = v.typer[v.ocurkey];
			if (newtype.match(/number/i)) {
				value = Number(value);
			} else if (newtype.match(/integer/i)) {
				value = parseInt(value);
			} else if (newtype.match(/json/i)) {
				value = JSON.parse(value);
			}
		}
		if (v.curobj[v.curkey] instanceof Array) {
			v.curobj[v.curkey][v.curobj[v.curkey].length-1] = value;
		} else if (typeof v.curobj[v.curkey] === 'string') {
			v.curobj[v.curkey] = value;
		}
	}
}



//////////////////////////////
//
// ATON.prototype.stringify -- Convert a JavaScript object into an ATON
//    string.  If an array, then each element in the array must be an
//    object.
//

ATON.prototype.stringify = function (obj, nodelabel) {
	var output = '';
	if (typeof obj !== 'object') {
		// can only process objects, not plain strings or numbers
		return output;
	}

	if (obj instanceof Array) {
		for (var i=0; i<obj.length; i++) {
			output += this.stringify(obj[i], nodelabel);
		}
	} else {
		if (nodelabel) {
			output += this.getOptionString('metaMarker');
			output += this.getOptionString('objectBegin');
			output += this.getOptionString('keyTerminatorOut');
			output += nodelabel;
			output += this.getOptionString('recordTerminator');
		}

		Object.keys(obj).forEach(function (name) {
			var value = obj[name];
			if (value instanceof Function) {
				// ignoring functions (for now at least)
				return;
			} else if ((value instanceof Array) && value.length) {
				for (var j=0; j<value.length; j++) {
					if (typeof value[j] === 'object') {
						output += this.stringify(value[j], name);
					} else {
						output += this._printSingleParameter(name, value[j]);
					}
				}
			} else if (typeof value === 'object') {
				output += this.stringify(value, name);
			} else {
				output += this._printSingleParameter(name, value);
			}
		}, this);

		if (nodelabel) {
			output += this.getOptionString('metaMarker');
			output += this.getOptionString('objectEnd');
			output += this.getOptionString('keyTerminatorOut');
			output += nodelabel;
			output += this.getOptionString('recordTerminator');
		}
	}

	return output;
}



//////////////////////////////
//
// ATON.prototype._printSingleParameter -- A pseudo-private method which
//    is a helper function for ATON.prototype.stringify().  Prints a
//    simple ATON parameter (not an object or an array).
//

ATON.prototype._printSingleParameter = function (name, value) {
	var output = '';
	output += this.getOptionString('keyMarker');
	output += name;
	output += this.getOptionString('keyTerminatorOut');
	output += value;
	output += this.getOptionString('recordTerminator');
	return output;
};



///////////////////////////////////////////////////////////////////////////
//
// Export ATON constructor if running in node:
//

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
	module.exports = ATON;
};



