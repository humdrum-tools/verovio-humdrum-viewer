{% comment.js %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Wed May  3 12:11:00 PDT 2023
// Last Modified: Wed May  3 12:11:03 PDT 2023
// Filename:      _includes/scripts/editor/main.js
// Included in:   _includes/scripts/main.js
// Syntax:        HTML; ECMAScript 6; Jekyll/Liquid
// vim:           ts=3:nowrap
//
// Description:   This file collects all files in this directory into
//                a single file that is included in the head element
//                of the webpage.  Each javascript function is stored
//                in a separate file based on the name of the function.
//
{% endcomment.js %}

// InterfaceSingleNumber: digit typed on the keyboard before
// certain commands, suh as slurs, which indicates the number
// of notes to include under the slur.  Or "2" for double-flats/
// sharps, or for the transposing interval when changing pitch.
var InterfaceSingleNumber = 0;

{% include scripts/editor/processNotationKey.js                        %}
{% include scripts/editor/setBeamAboveMarker.js                        %}
{% include scripts/editor/setBeamBelowMarker.js                        %}
{% include scripts/editor/deleteBeamDirectionMarker.js                 %}
{% include scripts/editor/setDynamAboveMarker.js                       %}
{% include scripts/editor/setDynamBelowMarker.js                       %}
{% include scripts/editor/deleteDynamDirectionMarker.js                %}
{% include scripts/editor/setHairpinAboveMarker.js                     %}
{% include scripts/editor/setHairpinBelowMarker.js                     %}
{% include scripts/editor/deleteHairpinDirectionMarker.js              %}
{% include scripts/editor/setAboveMarker.js                            %}
{% include scripts/editor/setBelowMarker.js                            %}
{% include scripts/editor/deleteDirectionMarker.js                     %}
{% include scripts/editor/createEmptyLine.js                           %}
{% include scripts/editor/setSlurAboveMarker.js                        %}
{% include scripts/editor/setSlurBelowMarker.js                        %}
{% include scripts/editor/deleteSlurDirectionMarker.js                 %}
{% include scripts/editor/leftEndMoveBack.js                           %}
{% include scripts/editor/addSlur.js                                   %}
{% include scripts/editor/addSlurStart.js                              %}
{% include scripts/editor/addSlurEnd.js                                %}
{% include scripts/editor/deleteSlurStart.js                           %}
{% include scripts/editor/deleteSlurEnd.js                             %}
{% include scripts/editor/deleteSlur.js                                %}
{% include scripts/editor/leftEndMoveForward.js                        %}
{% include scripts/editor/rightEndMoveForward.js                       %}
{% include scripts/editor/rightEndMoveBack.js                          %}
{% include scripts/editor/setTieAboveMarker.js                         %}
{% include scripts/editor/setTieBelowMarker.js                         %}
{% include scripts/editor/deleteTieDirectionMarker.js                  %}
{% include scripts/editor/setStemAboveMarker.js                        %}
{% include scripts/editor/setStemBelowMarker.js                        %}
{% include scripts/editor/deleteStemMarker.js                          %}
{% include scripts/editor/transposeNote.js                             %}
{% include scripts/editor/toggleEditorialAccidental.js                 %}
{% include scripts/editor/toggleSharp.js                               %}
{% include scripts/editor/toggleFlat.js                                %}
{% include scripts/editor/toggleNatural.js                             %}
{% include scripts/editor/toggleExplicitAccidental.js                  %}
{% include scripts/editor/toggleStaccato.js                            %}
{% include scripts/editor/toggleAccent.js                              %}
{% include scripts/editor/toggleMarcato.js                             %}
{% include scripts/editor/toggleTenuto.js                              %}
{% include scripts/editor/toggleStaccatissimo.js                       %}
{% include scripts/editor/toggleGraceNoteType.js                       %}
{% include scripts/editor/toggleMinorTrill.js                          %}
{% include scripts/editor/toggleMordent.js                             %}
{% include scripts/editor/toggleLigatureStart.js                       %}
{% include scripts/editor/toggleColorationStart.js                     %}
{% include scripts/editor/togglePedalStart.js                          %}
{% include scripts/editor/toggleColorationEnd.js                       %}
{% include scripts/editor/toggleLigatureEnd.js                         %}
{% include scripts/editor/togglePedalEnd.js                            %}
{% include scripts/editor/toggleMajorTrill.js                          %}
{% include scripts/editor/toggleArpeggio.js                            %}
{% include scripts/editor/toggleFermata.js                             %}
{% include scripts/editor/toggleVisibility.js                          %}
{% include scripts/editor/setEditorContents.js                         %}
{% include scripts/editor/getEditorContents.js                         %}
{% include scripts/editor/toggleMarkedNote.js                          %}
{% include scripts/editor/addLocalCommentLineAboveCurrentPosition.js   %}
{% include scripts/editor/addInterpretationLineAboveCurrentPosition.js %}
{% include scripts/editor/addDataLineAboveCurrentPosition.js           %}
{% include scripts/editor/addBarlineAboveCurrentPosition.js            %}
{% include scripts/editor/addInvisibleBarlineAboveCurrentPosition.js   %}
{% include scripts/editor/addSystemBreakToNextBarline.js               %}
{% include scripts/editor/addSystemBreakToPreviousBarline.js           %}
{% include scripts/editor/createNullLine.js                            %}
{% include scripts/editor/addNullLine.js                               %}
{% include scripts/editor/addSpineToRight.js                           %}
{% include scripts/editor/getBeamParent.js                             %}
{% include scripts/editor/getBeamChild.js                              %}
{% include scripts/editor/startNewBeam.js                              %}
{% include scripts/editor/endNewBeam.js                                %}
{% include scripts/editor/removeBeamInfo.js                            %}
{% include scripts/editor/addBeamStart.js                              %}
{% include scripts/editor/addBeamEnd.js                                %}



