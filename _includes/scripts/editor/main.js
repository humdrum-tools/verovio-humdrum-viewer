{% comment.js %}
//
// Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date: Wed May  3 12:11:00 PDT 2023
// Last Modified: Wed May  3 12:11:03 PDT 2023
// Filename:      _includes/vhv-scripts/editor/main.js
// Included in:   _includes/vhv-scripts/main.js
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

{% include vhv-scripts/editor/processNotationKey.js                        %}
{% include vhv-scripts/editor/setBeamAboveMarker.js                        %}
{% include vhv-scripts/editor/setBeamBelowMarker.js                        %}
{% include vhv-scripts/editor/deleteBeamDirectionMarker.js                 %}
{% include vhv-scripts/editor/setDynamAboveMarker.js                       %}
{% include vhv-scripts/editor/setDynamBelowMarker.js                       %}
{% include vhv-scripts/editor/deleteDynamDirectionMarker.js                %}
{% include vhv-scripts/editor/setHairpinAboveMarker.js                     %}
{% include vhv-scripts/editor/setHairpinBelowMarker.js                     %}
{% include vhv-scripts/editor/deleteHairpinDirectionMarker.js              %}
{% include vhv-scripts/editor/setAboveMarker.js                            %}
{% include vhv-scripts/editor/setBelowMarker.js                            %}
{% include vhv-scripts/editor/deleteDirectionMarker.js                     %}
{% include vhv-scripts/editor/createEmptyLine.js                           %}
{% include vhv-scripts/editor/setSlurAboveMarker.js                        %}
{% include vhv-scripts/editor/setSlurBelowMarker.js                        %}
{% include vhv-scripts/editor/deleteSlurDirectionMarker.js                 %}
{% include vhv-scripts/editor/leftEndMoveBack.js                           %}
{% include vhv-scripts/editor/addSlur.js                                   %}
{% include vhv-scripts/editor/addSlurStart.js                              %}
{% include vhv-scripts/editor/addSlurEnd.js                                %}
{% include vhv-scripts/editor/deleteSlurStart.js                           %}
{% include vhv-scripts/editor/deleteSlurEnd.js                             %}
{% include vhv-scripts/editor/deleteSlur.js                                %}
{% include vhv-scripts/editor/leftEndMoveForward.js                        %}
{% include vhv-scripts/editor/rightEndMoveForward.js                       %}
{% include vhv-scripts/editor/rightEndMoveBack.js                          %}
{% include vhv-scripts/editor/setTieAboveMarker.js                         %}
{% include vhv-scripts/editor/setTieBelowMarker.js                         %}
{% include vhv-scripts/editor/deleteTieDirectionMarker.js                  %}
{% include vhv-scripts/editor/setStemAboveMarker.js                        %}
{% include vhv-scripts/editor/setStemBelowMarker.js                        %}
{% include vhv-scripts/editor/deleteStemMarker.js                          %}
{% include vhv-scripts/editor/transposeNote.js                             %}
{% include vhv-scripts/editor/toggleEditorialAccidental.js                 %}
{% include vhv-scripts/editor/toggleSharp.js                               %}
{% include vhv-scripts/editor/toggleFlat.js                                %}
{% include vhv-scripts/editor/toggleNatural.js                             %}
{% include vhv-scripts/editor/toggleExplicitAccidental.js                  %}
{% include vhv-scripts/editor/toggleStaccato.js                            %}
{% include vhv-scripts/editor/toggleAccent.js                              %}
{% include vhv-scripts/editor/toggleMarcato.js                             %}
{% include vhv-scripts/editor/toggleTenuto.js                              %}
{% include vhv-scripts/editor/toggleStaccatissimo.js                       %}
{% include vhv-scripts/editor/toggleGraceNoteType.js                       %}
{% include vhv-scripts/editor/toggleMinorTrill.js                          %}
{% include vhv-scripts/editor/toggleMordent.js                             %}
{% include vhv-scripts/editor/toggleLigatureStart.js                       %}
{% include vhv-scripts/editor/toggleColorationStart.js                     %}
{% include vhv-scripts/editor/togglePedalStart.js                          %}
{% include vhv-scripts/editor/toggleColorationEnd.js                       %}
{% include vhv-scripts/editor/toggleLigatureEnd.js                         %}
{% include vhv-scripts/editor/togglePedalEnd.js                            %}
{% include vhv-scripts/editor/toggleMajorTrill.js                          %}
{% include vhv-scripts/editor/toggleArpeggio.js                            %}
{% include vhv-scripts/editor/toggleFermata.js                             %}
{% include vhv-scripts/editor/toggleVisibility.js                          %}
{% include vhv-scripts/editor/setEditorContents.js                         %}
{% include vhv-scripts/editor/getEditorContents.js                         %}
{% include vhv-scripts/editor/toggleMarkedNote.js                          %}
{% include vhv-scripts/editor/addLocalCommentLineAboveCurrentPosition.js   %}
{% include vhv-scripts/editor/addInterpretationLineAboveCurrentPosition.js %}
{% include vhv-scripts/editor/addDataLineAboveCurrentPosition.js           %}
{% include vhv-scripts/editor/addBarlineAboveCurrentPosition.js            %}
{% include vhv-scripts/editor/addInvisibleBarlineAboveCurrentPosition.js   %}
{% include vhv-scripts/editor/addSystemBreakToNextBarline.js               %}
{% include vhv-scripts/editor/addSystemBreakToPreviousBarline.js           %}
{% include vhv-scripts/editor/createNullLine.js                            %}
{% include vhv-scripts/editor/addNullLine.js                               %}
{% include vhv-scripts/editor/addSpineToRight.js                           %}
{% include vhv-scripts/editor/getBeamParent.js                             %}
{% include vhv-scripts/editor/getBeamChild.js                              %}
{% include vhv-scripts/editor/startNewBeam.js                              %}
{% include vhv-scripts/editor/endNewBeam.js                                %}
{% include vhv-scripts/editor/removeBeamInfo.js                            %}
{% include vhv-scripts/editor/addBeamStart.js                              %}
{% include vhv-scripts/editor/addBeamEnd.js                                %}



