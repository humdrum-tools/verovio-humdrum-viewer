define("ace/theme/humdrum_dark",["require","exports","module","ace/lib/dom"],function(e,t,n) {
  t.isDark=true,
  t.cssClass="ace-humdrum-dark",
  t.cssText=".ace-humdrum-dark .ace_gutter { background: #01313f; color: #d0edf7 }\
  .ace-humdrum-dark .ace_print-margin {width: 1px;background: #33555E}\
  .ace-humdrum-dark {background-color: #002b36;color: white}\
  .ace-humdrum-dark .ace_cursor {color: white}\
  .ace-humdrum-dark .ace_marker-layer .ace_selection {background: rgba(255, 255, 0, 0.2)}\
  .ace-humdrum-dark.ace_multiselect .ace_selection.ace_start {box-shadow: 0 0 3px 0px #FDF6E3;}\
  .ace-humdrum-dark .ace_marker-layer .ace_step {background: rgb(255, 255, 0)}\
  .ace-humdrum-dark .ace_marker-layer .ace_bracket {margin: -1px 0 0 -1px;border: 1px solid rgba(147, 161, 161, 0.50)}\
  .ace-humdrum-dark .ace_marker-layer .ace_active-line {background: #194a40}\
  .ace-humdrum-dark .ace_gutter-active-line {background-color : #0e4445}\
  .ace-humdrum-dark .ace_marker-layer .ace_selected-word {border: 1px solid #073642}\
  .ace-humdrum-dark .ace_invisible {color: rgba(147, 161, 161, 0.50)}\
  .ace-humdrum-dark .ace_universal {color: green; background: rgba(255,200,200,0.5)}\
  .ace-humdrum-dark .ace_bibliographic {color: green}\
  .ace-humdrum-dark .ace_filter {color: chartreuse}\
  .ace-humdrum-dark .ace_filter.ace_used {color: olive}\
  .ace-humdrum-dark .ace_exinterp {color: red}\
  .ace-humdrum-dark .ace_terminator {color: red}\
  .ace-humdrum-dark .ace_manip {color: magenta}\
  .ace-humdrum-dark .ace_interp {color: violet}\
  .ace-humdrum-dark .ace_label {color: violet; background: rgba(255,200,255,0.6)}\
  .ace-humdrum-dark .ace_comment {color: #2fc584}\
  .ace-humdrum-dark .ace_unknown {color: darkgoldenrod}\
  .ace-humdrum-dark .ace_comment.ace_global {color: lightblue}\
  .ace-humdrum-dark .ace_comment.ace_layout {color: orange}\
  .ace-humdrum-dark .ace_barline {color: silver; background: rgba(255, 255, 255, 0.125)}\
  .ace-humdrum-dark .ace_invalid.ace_tab {background-color: red}\
  .ace-humdrum-dark .ace_invalid.ace_space {background-color: cyan}\
  .ace-humdrum-dark .ace_kern.ace_note {color: white; font-weight:bold}\
  .ace-humdrum-dark .ace_kern.ace_other {color: tomato}\
  .ace-humdrum-dark .ace_kern.ace_duration {color: silver}\
  .ace-humdrum-dark .ace_dot {color: gray}\
  .ace-humdrum-dark .ace_fold {background-color: #268BD2;border-color: #586E75}\
  .ace-humdrum-dark .ace_indent-guide {background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNgYGBgYHjy8NJ/AAjgA5fzQUmBAAAAAElFTkSuQmCC) right repeat-y}";
  var r=e("../lib/dom");r.importCssString(t.cssText,t.cssClass)
})
