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
// Reference:
// https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode

define("ace/mode/mime_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MimeHighlightRules = function() {
	 this.$rules = {
		"start" : [{
			token : "empty_line",
			regex : "^$"
		}, {
			defaultToken : "text"
		}]
	 };
};

oop.inherits(MimeHighlightRules, TextHighlightRules);

exports.MimeHighlightRules = MimeHighlightRules;

});

define("ace/mode/mime",["require","exports","module","ace/lib/oop","ace/mode/text"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var MimeHighlightRules = require("./mime_highlight_rules").MimeHighlightRules;

var UIWorkerClient = require("ace/worker/worker_client").UIWorkerClient;

var Mode = function() {
	 this.HighlightRules = MimeHighlightRules;
	 this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
	this.type = "text";
	this.$id = "ace/mode/mime";

	this.createWorker = function(session) {
	  var worker = new UIWorkerClient(["ace"], "ace/mode/mime_worker", "MimeWorker");

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
