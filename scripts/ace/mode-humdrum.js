/* ***** BEGIN LICENSE BLOCK *****
* Distributed under the BSD license:
*
* Copyright (c) 2010, Ajax.org B.V.
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*     * Neither the name of Ajax.org B.V. nor the
*       names of its contributors may be used to endorse or promote products
*       derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
* ***** END LICENSE BLOCK ***** */


// Reference: https://cloud9-sdk.readme.io/docs/highlighting-rules


//
// syntax match Data           "^[^!\*]"            contains=BadTabbing,Chord
// syntax match Chord          "[^\t][^\t]* [^\t]*" contains=ExtraSpace
// syntax match ExtraSpace     "^ "
// syntax match ExtraSpace     " $"
// syntax match ExtraSpace     "  *\t"
// syntax match ExtraSpace     "\t  *"
// syntax match ExtraSpace     "   *"
// syntax match BadTabbing     "\t\t\t*"
// syntax match BadTabbing     "^\t"
// syntax match BadTabbing     "\t$"
// syntax match GlobalComment  "^!![^!].*$"
// syntax match BibRecord      "^!!![^ ].*:.*$"
// syntax match Interpretation "^\*.*$"             contains=BadTabbing,Exclusive
// syntax match Measure        "^=[^\t]*[\t]?"      contains=BadTabbing
// syntax match Measure        "=[^\t]*[\t]"        contains=BadTabbing
// syntax match Measure        "=[^\t]*$"           contains=BadTabbing
// syntax match LocalComment   "^![^!].*$"          contains=BadTabbing
// syntax match Exclusive      "\*\*[^\t]*"

// Reference:
// https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode

define("ace/mode/humdrum_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var HumdrumHighlightRules = function() {
	 this.$rules = {
		"start" : [{
			token : "empty_line",
			regex : "^$"

		}, {
			// discourage tabs within bibliographic entries:
			token : ["bibliographic", "invalid.tab", "bibliographic"],
			regex : /^(!!![^:]+:)(\t+)(.*)$/,
			next : "start"

		// discourage tabs at the end of non-spine lines:
		}, {
			token : ["filter", "invalid.tab"],
			regex : /^(!!!?filter:.*?)(\s+)$/
		}, {
			token : ["filter.used", "invalid.tab"],
			regex : /^(!!!?Xfilter:.*?)(\s+)$/
		}, {
			token : ["universal", "invalid.tab"],
			regex : /^(!!!![^:]+:.*?)(\s+)$/,
		}, {
			token : ["bibliographic", "invalid.tab"],
			regex : /^(!!![^:]+:.*?)(\s+)$/,
			next : "start"

		}, {
			token : "filter",
			regex : /^!!!?filter:.*?$/
		}, {
			token : "filter.used",
			regex : /^!!!?Xfilter:.*?/
		}, {
			token : "universal",
			regex : /^!!!![^:]+:.*?$/,
		}, {
			token : "bibliographic",
			regex : /^!!![^:]+:.*?$/,
			next : "start"

		}, {
			token : "comment.layout",
			regex : /^!!?LO:.*$|^!\t!LO:.*$|^![^!].*\t!LO:.*$/,
			next: "start"
		}, {
			token : "comment.global",
			regex : /^!!.*$/,
			next: "start"
		}, {
			token : ["label", "invalid.tab"],
			regex : /^(\*>[^[]+)(\t+)$/
		}, {
			token : "label",
			regex : /^\*>[^[]+$/
		}, {
			token : "label",
			regex : /^\*>[^[]+\t/
		}, {
			token : ["dot", "invalid.tab"],
			regex : /^([^*!]*)(\t+)$/
		}, {
			token : "exinterp",
			regex : /(\*\*)([^\t ]*)/
		}, {
			token : "terminator",
			regex : /\t\*-(?=\t)/
		}, {
			token : "terminator",
			regex : /\*-$/
		}, {
			token : "terminator",
			regex : /^\*-$/
		}, {
			token : "terminator",
			regex : /^\*-(?=\t)/
		}, {
			token : ["interp", "invalid.tab"],
			regex : /(\*)(\t+)$/
		}, {
			token : ["interp", "invalid.tab"],
			regex : /^(\*\t.*\*)(\t+)$/
		}, {
			token : "interp",
			regex : /^(\*[\*\t]+)$/
		}, {
			token : ["barline", "invalid.tab"],
			regex : /^(=.*)(\t+)$/
		}, {
			token : ["manip", "invalid.tab"],
			regex : /^(\*[\*\t^xv+]+)(\t+)$/
		}, {
			token : "manip",
			regex : /^(\*[\*\t^xv+]+)$/
		}, {
			token : "interp",
			regex : /\*([^\t]*)/
		}, {
			token : "comment",
			regex : /![^\t]*/
		}, {
			//token : ["invalid.space", "invalid.tab"],
			//regex : /( +)(\t\t+)/
			token : "invalid.space",
			regex : /( +)\t\t+/
		}, {
			token : ["invalid.space", "text"],
			regex : /( +)(\t)/
		}, {
			token : "invalid.space",
			// token : ["invalid.tab", "invalid.space"],
			// regex : /(\t\t+)( +)/
			regex : /\t\t+( +)/
		}, {
			token : ["text", "invalid.space"],
			regex : /(\t)( +)/
		}, {
			token : "invalid.space",
			regex : /  +|^ | $/
		}, {
			token : "invalid.tab",
			// regex : /\t\t+|^\t|\t$/
			regex : /^\t|\t$/
		}, {
			token : "invalid.space",
			regex : /  +|^ | $/
/*
		  }, {
			token : ["kern.duration", "kern.note", "kern.other"],
			regex : /([0-9]+\.{0,1})([^\sLJ]*)([LJ]{0,1})
*/
		}, {
			token : "barline",
			regex : /^=.*$/
		}, {
			token : ["dot", "invalid.tab"],
			regex : /^(\.)(\t+)$/
		}, {
			token : ["dot", "invalid.tab"],
			regex : /^(\.\t.*)(\t+)$/
		}, {
			token : "dot",
			regex : /\.\t|^\.\t|^\.$|\.$/
		}, {
			token : "text",
			regex : /[^\t\s]+/
		}, {
			defaultToken : "text"
		}]
	 };
};

oop.inherits(HumdrumHighlightRules, TextHighlightRules);

exports.HumdrumHighlightRules = HumdrumHighlightRules;

});

define("ace/mode/humdrum",["require","exports","module","ace/lib/oop","ace/mode/text"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HumdrumHighlightRules = require("./humdrum_highlight_rules").HumdrumHighlightRules;

var UIWorkerClient = require("ace/worker/worker_client").UIWorkerClient;

var Mode = function() {
	 this.HighlightRules = HumdrumHighlightRules;
	 this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
	this.type = "text";
	this.$id = "ace/mode/humdrum";

	this.createWorker = function(session) {
	  var worker = new UIWorkerClient(["ace"], "ace/mode/humdrum_worker",
		 "HumdrumWorker");

	  worker.attachToDocument(session.getDocument());

	  worker.on("annotate", function(results) {
		 session.setAnnotations(results.data);
	  });

	  worker.on("terminate", function() {
		 session.clearAnnotations();
	  });

	  return worker;
	};


}).call(Mode.prototype);

exports.Mode = Mode;

});
