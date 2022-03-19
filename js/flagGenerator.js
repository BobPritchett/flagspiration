//
// Random Flag Generator
//
// Copyright 2021 Bob Pritchett.
//
// 05/30/21 RDP Created and work begun.
// 06/03/21 RDP Added symbol support.
// 06/06/21 RDP Added multiple symbol option.
// 06/26/21 RDP Added better color palette support and new patterns.
// 06/30/21 RDP Built new flag description language.
// 07/03/21 RDP Adding more flags and references to examples.
// 07/04/21 RDP Path support and more flags.
// 07/06/21 RDP Added support for checking charge contrast on multiple background colors.
// 07/10/21 RDP Added compass line and began transition to intentional fields.
// 07/11/21 RDP Completing intentional fields.
// 07/24/21 RDP Fixed compass line drawing for single color lines.
//

// Public:
// flagGenerator.generateFlag( options );


var flagGenerator = (function() {               // create encapsulating object c.f. https://web.archive.org/web/20181005005954/https://appendto.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/

/* GLOBALS */

let xScale = 1;
let yScale = 1;

let color = 0;
let palette = [];

let variables = new Map();

var pub = {};
	pub.ratios = [ "1:2", "3:5", "2:3" ];		// https://www.fotw.info/flags/xf-size.html

/* TEST CONTROLS */

const flagForceCircleSymbol = false;

/* COLOR PALETTES */

// supports hex values only at this point, for rendering reasons
// https://www.flagcolorcodes.com/
// http://www.warrenmuseum.com/patches/ - Institute of Heraldry colors
// https://www.pantone.com/color-finder/161-C - Pantone to RGB mapping


pub.palettes = [
    // { "name": "Common",				 	"colors": ["white","black","red","blue","green","gold","darkorange","saddlebrown","purple"] },	// removed "gray"
    { "name": "Common",				 		"colors": ["#FFFFFF","#000000","#FF0000","#00FF00","#0000FF","#FFD700","#FF8C00","#8B4513","#800080"] },	// removed "gray"
    // { "name": "Common Bold", 			"colors": ["white","black","red","blue","green","yellow","darkorange","purple"] },
    { "name": "Common Bold", 				"colors": ["#FFFFFF","#000000","#FF0000","#00FF00","#0000FF","#FFFF00","#FF8C00","#800080"] },
	// { "name": "Common Alt", 				"colors": ["white","black","orangered","deepskyblue","limegreen","yellow","darkorange","sienna","silver","darkviolet"] },
	{ "name": "Common Alt", 				"colors": ["#FFFFFF","#000000","#FF4500","#00BFFF","#32CD32","#FFFF00","#FF8C00","#A0522D","#C0C0C0","#9400D3"] },
	{ "name": "Institute of Heraldry", 		"colors": ["#000000","#545859","#9EA2A2","#FFFFFF","#FFCD00","#FFC72C","#FF9E1B","#FC4C02","#E4002B","#BA0C2F","#A50050","#862633","#6F263D","#572932","#5F249F","#A3C7D2","#7BAFD4","#0072CE","#5B7F95","#001489","#00205B","#041E42","#012169","#00C1D4","#003E51","#7A9A01","#64A70B","#00843D","#215732","#004C45","#115740","#284734","#695B24","#CAC7A7","#B0AA7E","#B9975B","#8B6F4E","#B86125","#73391D","#603D20"] },
	{ "name": "Andorra", 					"colors": ["#10069F","#FEDD00","#D50032","#C6AA76"] },
	{ "name": "Antigua and Barbuda", 		"colors": ["#EF3340","#000000","#005EB8","#FFFFFF","#FFD100"] },
	{ "name": "Aruba", 						"colors": ["#418FDE","#FBE122","#FFFFFF","#C8102E"] },
	{ "name": "Azerbaijan", 				"colors": ["#0092BC","#E4002B","#FFFFFF","#00AF66"] },
	{ "name": "Brazil", 					"colors": ["#009739","#FEDD00","#FFFFFF","#012169"] },
	{ "name": "Chad", 						"colors": ["#002664","#FECB00","#C60C30"] },
	{ "name": "Dominican Republic", 		"colors": ["#002D62","#CE1126","#000000","#006300","#EAC102"] },
	{ "name": "Estonia", 					"colors": ["#0072CE","#000000","#FFFFFF"] },
	{ "name": "Gabon", 						"colors": ["#009E60","#FCD116","#4664B2"] },
	{ "name": "Germany", 					"colors": ["#000000","#DD0000","#FFCC00"] },
	{ "name": "Ghana", 						"colors": ["#EF3340","#FFD100","#009739","#000000"] },
	{ "name": "Guinea", 					"colors": ["#CE1126","#FCD116","#009460"] },
	{ "name": "India", 						"colors": ["#FF9933","#FFFFFF","#138808","#000080"] },
	{ "name": "Ireland", 					"colors": ["#009A44","#FFFFFF","#FF8200"] },
	{ "name": "Jordan", 					"colors": ["#CE1126","#000000","#FFFFFF","#007A3D"] },
	{ "name": "Montenegro",					"colors": ["#C40308","#D4AF3A","#1D5E91","#6D8C3E","#B96B29"] },
	{ "name": "Myanmar", 					"colors": ["#FFCD00","#FFFFFF","#43B02A","#EE2737"] },
	{ "name": "Namibia", 					"colors": ["#001489","#FFC72C","#FFFFFF","#DA291C","#009A44"] },
	{ "name": "Niger", 						"colors": ["#E05206","#FFFFFF","#0DB02B"] },
	{ "name": "Paraguay", 					"colors": ["#D52B1E","#FFFFFF","#0038A8","#FEDF00","#000000","#009B3A"] },
	{ "name": "Portugal", 					"colors": ["#046A38","#DA291C","#FFE900","#002D72","#FFFFFF","#000000"] },
	{ "name": "Slovenia", 					"colors": ["#FFFFFF","#003DA5","#FF0000","#FFCD00"] },
	{ "name": "South Africa", 				"colors": ["#E03C31","#FFFFFF","#007749","#001489","#FFB81C","#000000"] },
	{ "name": "Tanzania", 					"colors": ["#1EB53A","#FCD116","#000000","#00A3DD"] },
	{ "name": "USA", 						"colors": ["#BF0D3E","#FFFFFF","#041E42"] },				// https://eca.state.gov/files/bureau/state_department_u.s._flag_style_guide.pdf
	{ "name": "Arizona", 					"colors": ["#BF0A30","#FED700","#CE5C17","#002868"] },	
	{ "name": "Colorado", 					"colors": ["#002868","#FFFFFF","#BF0A30","#FFD700"] },
	{ "name": "Connecticut", 				"colors": ["#0C2D83","#FFFFFF","#FFD300","#129612","#B400B4"] },
	{ "name": "Mississippi", 				"colors": ["#C21F32","#EAAB22","#081F40","#FFFFFF"] },	
	{ "name": "Nevada", 					"colors": ["#0033A0","#FFFFFF","#FFA300","#00843D"] },	
	{ "name": "Chicago", 					"colors": ["#B3DDF2","#FFFFFF","#FF0000"] },
];

/* BOILERPLATE */

const flagSVGStart =    `<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">`;
const flagSVGEnd =      `</svg>`;

/* CONSTANTS */

const FLAG_UNIT = 96;

const flagUnits = new Map([
	// Left, Center, Right, Top, Middle, Bottom
	[ "L",			0 ],
	[ "C",			FLAG_UNIT / 2 ],
	[ "R",			FLAG_UNIT ],
	[ "T",			0 ],
	[ "M",			FLAG_UNIT / 2 ],
	[ "B",			FLAG_UNIT ],
	// width of divisions
	[ "whole",		FLAG_UNIT ],
	[ "half", 		FLAG_UNIT / 2 ],
	[ "third", 		FLAG_UNIT / 3 ],
	[ "quarter", 	FLAG_UNIT / 4 ],
	[ "fifth", 		FLAG_UNIT / 5 ],
	[ "sixth", 		FLAG_UNIT / 6 ],
	[ "seventh", 	FLAG_UNIT / 7 ],
	[ "eighth", 	FLAG_UNIT / 8 ],
	[ "ninth", 		FLAG_UNIT / 9 ],
	[ "tenth", 		FLAG_UNIT / 10 ],
	[ "eleventh", 	FLAG_UNIT / 11 ],
	[ "twelfth", 	FLAG_UNIT / 12 ],
	[ "thirteenth", FLAG_UNIT / 13 ],
	[ "fourteenth", FLAG_UNIT / 14 ],
	[ "fifteenth", 	FLAG_UNIT / 15 ],
	[ "sixteenth", 	FLAG_UNIT / 16 ],
]);

const flagOrdinalNumbers = [ "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten" ];
	
/* BACKGROUNDS */

// name				the human-readable name of the shape
//					the colors used will be inserted into the description replacing {C0} (the field), {C1}, {C2}, etc.
//
// colors			the number of colors used in the shape not including a charge
//
// charges			an array of anchor points and bounding boxes for placing charges; only one of the array elements will be used per rendering
//					bg		the background color ("C0", "C1", etc.) on which the charge appears
// 					points	1 or more sets of x,y, width, height of the charge placement, separate by semicolons
//							(width and height are of full area available; charges are generally rendered at 80% of the minimum available)
//					NOTE: At this time we only support charges on one color background at a time
//
// shapes			a list of shape definitions separated by semicolons (and optional spaces)
//                  shapes can specify a color with "C1", "C2", etc. to ensure specific color choice as an index into the color palette;
//					if none is specified, the next is used. C0 is the field (background/primary flag color); if any shape in the flag specifies
//					a color, the best practice is to have all of them specify one.
//
// notes			notes; often a brief reference to an example, in Markdown syntax; typically a flag name and hyperlink, e.g. [City of Werne (Germany)](https://www.crwflags.com/fotw/flags/de-un-we.html)
// 
// Flag Definition Language
//
// variables		In the form $name, where name is alphabetic; variables can contain any unit or unit expression. Variables are set with $name=value.
//
// Field generators:
//
//   field() C0								draws a rectangular field in C0
//
//   quarterly() C0 C1						quarterly in C0 and C1
//   quarterly() C0 C1 C2 C3				quarterly with each quarter a different color
//
//   perbend() C0 C1						a field split per bend (C0 in upper right; c1 in lower left)
//   perbendsinister() C0 C1				a field split per bend sinister (C0 in upper left; c1 in lower right)
//
//   persaltire() C0 C1						a field split per saltire (C0 in top center, then clockwise for up to four colors)
//
//   perchevron() C0 C1						a field split per chevron (C0 on top, C1 in the chevron shape)
//
//   stripes(7) C0 C1						draws 7 stripes, alternating C0 and C1; an alias for barry
//
//   barry(4) C0 C1 C2 C3					4 horizontal stripes in four colors, from C0 at the top to C3 at the bottom
//   barry(4) C0 C1							draws 4 horizontal stripes, alternating C0 and C1 (same as stripes(4) C0 C1)
//
//   fesses(1-2-1) C0 C1 C0					C0 a Spanish fess of C1
//   fesses(2-1-1-2) C0 C1 C2 C0			C0 fess per fess C1 C2
//
//   pales(1-2-1) C0 C1 C0					C0 a Canadian fess of C1
//
// Common patterns:
//
// cross(width)
//   cross(1/8) C1							a centered cross of C1
//
// nordic(width) C1							a Nordic cross of C1
//
// saltire(width) C1						a saltire of C1
//
// scottish(width) C1						a Scottish saltire of C1
//
// chevron(width) C1						a chevron of C1
//
// chevrons(count,width,issue) C1			count chevrons of width each (separated by width), issue = [base|dexter|chief|sinister]
//
// Primitives:
//
// rect(x,y,width,height)
//   rect(1/3,1/3,2/3,2/3)					the bottom-right two-thirds
//   rect(L,T,1/3,whole-2/3)				0,0,32 wide,96-64=32 tall
//   rect(2/3,third*2,whole÷3,third)		fills bottom third of height and width (note use of Unicode division symbol since / is reserved for fractions!)
//
// line(x1,y1,x2,y2,strokeWidth)
//   line(L,T,R,B,eighth)					a diagaonal line from upper-left to bottom-right, with a width 1/8th of the height of the flag
//
// polyline(x1,y1,x2,y2,x3,y3,...,strokeWidth)
//
// circle(cx,cy,r)
//
// polygon(x,y,x2,y2,...)					a closed polygon -- the final line does not need to specified
// 
// path(M x,y L x,y ...)					a path using SVG path commands -- command letter must be specified for each coordinate set
//   path(M L,B C 1/8,M,R-1/8,M,R,T L R,B L L,B)



pub.flags = [
//	{ "name": "canton",         	"colors": 3, "charges": [ [24,24, 48,48, 1] ], "shapes": "rect 0,0, 48,48" },
//	{ "name": "rect-test-a",  		"colors": 3, "shapes": "rect L,T, third,whole-quarter;rect third,T+quarter third,whole-half" },
//	{ "name": "rect-test-b",  		"colors": 3, "shapes": "rect(L,T,1/3,whole-2/3) C1; rect(third,third,third,third) C2; rect(2/3,third*2,whole÷3,third) C1" },
//	{ "name": "test-square-rect",  	"colors": 3, "shapes": "rect(L,T,1/3,whole-2/3) C1; rect(third,third,H:third,third) C2; rect(2/3,third*2,whole÷3,third) C1" },
//	{ "name": "line-test-a",  		"colors": 3, "shapes": "line(L,T,R,B,eighth) C1; line(L,B,R,T,eighth) C1; rect(third,third,third,third) C2" },
//	{ "name": "test-circles",  		"colors": 3, "shapes": "circle(C,M,quarter) C1; circle(C,quarter,eighth) C2" },
/*
	{ "name": "TEST field {C0}",  				   		"colors": 1, "shapes": "field() C0" },
	{ "name": "TEST quarterly() {C0} {C1}",  			"colors": 2, "shapes": "quarterly() C0 C1" },
	{ "name": "TEST quarterly() C0 C1 C2 C3",			"colors": 4, "shapes": "quarterly() C0 C1 C2 C3" },
	{ "name": "TEST perbend() {C0} {C1}",    			"colors": 2, "shapes": "perbend() C0 C1" },
	{ "name": "TEST perbendsinister() {C0} {C1}",    	"colors": 2, "shapes": "perbendsinister() C0 C1" },
	{ "name": "TEST persaltire() {C0} {C1}",  			"colors": 2, "shapes": "persaltire() C0 C1" },
	{ "name": "TEST persaltire() C0 C1 C2 C3",			"colors": 4, "shapes": "persaltire() C0 C1 C2 C3" },
	{ "name": "TEST fesses(2-1-1-2) C0 C1 C2 C0",    	"colors": 3, "shapes": "fesses(2-1-1-2) C0 C1 C2 C0" },
	{ "name": "TEST stripes(9) C0 C1",    				"colors": 2, "shapes": "stripes(9) C0 C1" },
	{ "name": "TEST barry(4) C0 C1 C2 C3",    			"colors": 4, "shapes": "barry(4) C0 C1 C2 C3" },
	{ "name": "TEST pales(1-2-1) C0 C1 C0",    			"colors": 4, "shapes": "pales(1-2-1) C0 C1 C0" },
	{ "name": "TEST cross(eighth) C1",    				"colors": 2, "shapes": "field() C0; cross(eighth) C1" },
	{ "name": "TEST fimbriated cross(eighth)",  		"colors": 2, "shapes": "field() C0; cross(sixth) C1; cross(eighth) C2" },
	{ "name": "TEST nordic(eighth) C1",    				"colors": 2, "shapes": "field() C0; nordic(eighth) C1" },
	{ "name": "TEST nordic(quarter) C1",    			"colors": 2, "shapes": "field() C0; nordic(quarter) C1" },
	{ "name": "TEST saltire(quarter) C1",    			"colors": 2, "shapes": "field() C0; saltire(quarter) C1" },
	{ "name": "TEST scottish(quarter) C1",    			"colors": 2, "shapes": "field() C0; scottish(quarter) C1" },


	{ "name": "TEST {C0}, bend NW-SE {C1}",     		"colors": 2, "shapes": "compassLine(NW,SE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-SbW {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,SbW,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-S {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,S,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-SbE {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,SbE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-SSE {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,SSE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-SeBS {C1}",     	"colors": 2, "shapes": "compassLine(NWbN,SeBS,1/4,plain) C1" },

	{ "name": "TEST {C0}, bend NWbN-SEbE {C1}",     	"colors": 2, "shapes": "compassLine(NWbN,SEbE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-ESE {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,ESE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-EbS {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,EbS,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-E {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,E,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-EbN {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,EbN,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-ENE {C1}",     		"colors": 2, "shapes": "compassLine(NWbN,ENE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NWbN-NEbE {C1}",     	"colors": 2, "shapes": "compassLine(NWbN,NEbE,1/4,plain) C1" },

	{ "name": "TEST {C0}, bend NWbW-SEbE {C1}",     	"colors": 2, "shapes": "compassLine(NWbW,SEbE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend WNW-ESE {C1}",     		"colors": 2, "shapes": "compassLine(WNW,ESE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend WSW-ENE {C1}",     		"colors": 2, "shapes": "compassLine(WSW,ENE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend SWbW-NEbE {C1}",    		"colors": 2, "shapes": "compassLine(SWbW,NEbE,1/4,plain) C1" },

	{ "name": "TEST {C0}, bend SWbs-NEbN {C1}",     	"colors": 2, "shapes": "compassLine(SWbs,NEbN,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend SSW-NNE {C1}",     		"colors": 2, "shapes": "compassLine(SSW,NNE,1/4,plain) C1" },

	{ "name": "TEST {C0}, bend NNW-ESE {C1}",	     	"colors": 2, "shapes": "compassLine(NNW,ESE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NbW-EbS {C1}",     		"colors": 2, "shapes": "compassLine(NbW,EbS,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend N-E {C1}", 	    		"colors": 2, "shapes": "compassLine(N,E,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend NbE-EbN {C1}",     		"colors": 2, "shapes": "compassLine(NbE,EbN,1/4,plain) C1" },

	{ "name": "TEST {C0}, bend WbS-SEbS {C1}",	     	"colors": 2, "shapes": "compassLine(WbS,SEbS,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend WSW-SSE {C1}",     		"colors": 2, "shapes": "compassLine(WSW,SSE,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend W-S {C1}", 	    		"colors": 2, "shapes": "compassLine(W,S,1/4,plain) C1" },
	{ "name": "TEST {C0}, bend WbS-SbW {C1}",     		"colors": 2, "shapes": "compassLine(WbS,SbW,1/4,plain) C1" },

	{ "name": "{C0}, VARIABLE TEST canton {C1}",
	    	     	"colors": 2, "charges": [ { "bg": "C1", "points": "H:1/4,1/4, H:1/2,1/2" }, ], "shapes": "$size=2/3; rect(L,T,H:$size,$size) C1" },
*/

// minimal
	{ "name": "{C0}",  							"colors": 1, "charges": [ { "bg": "C0", "points": "C,M, 3/4,3/4" }, { "bg": "C0", "points": "C-1/6,M, 1/2,1/2; C+1/6,M, 1/2,1/2" }, { "bg": "C0", "points": "C-7/24,M, 2/3,1/2; C,M, 2/3,1/2; C+7/24,M,2/3,1/2" } ], "shapes": "field() C0", "notes": "*cf.* [Japan](https://www.fotw.info/flags/jp.html)" },
	{ "name": "{C0}, fimbriated in chief and in base {C1}",
					  							"colors": 2, "charges": [ { "bg": "C0", "points": "C,M, 3/4,3/4" }, { "bg": "C0", "points": "C-1/6,M, 1/2,1/2; C+1/6,M, 1/2,1/2" }, { "bg": "C0", "points": "C-7/24,M, 2/3,1/3; C,M, 2/3,1/3; C+7/24,M,2/3,1/3" } ], "shapes": "fesses(1-6-1) C1 C0 C1", "notes": "*cf.* [Belize](https://www.fotw.info/flags/bz.html)" },
  	{ "name": "{C0}, an orle {C1}",
					  							"colors": 2, "charges": [ { "bg": "C0", "points": "C,M, 3/4,3/4-1/8" }, { "bg": "C0", "points": "C-1/6,M, 1/2,1/2; C+1/6,M, 1/2,1/2" }, { "bg": "C0", "points": "C-6/24,M, 2/3,1/3; C,M, 2/3,1/3; C+6/24,M,2/3,1/3" } ], "shapes": "field() C0; path(M H:1/16,1/16 L R-H:1/16,1/16 L R-H:1/16,B-1/16 L H:1/16,B-1/16 L H:1/16,1/16 Z M H:2/16,2/16 L H:2/16,B-2/16 L R-H:2/16,B-2/16 L R-H:2/16,2/16 L H:2/16,2/16 Z) C1", "notes": "*cf.* [Ordinary (heraldry)](https://en.wikipedia.org/wiki/Ordinary_(heraldry))" },
	{ "name": "{C0}, a dexter tierce {C1}",  	"colors": 2, "charges": [ { "bg": "C0 C1", "points": "1/3,M, 3/4,3/4" }, { "bg": "C0", "points": "2/3,M, 3/4,3/4" } ], "shapes": "pales(1-2) C1 C0" },
	{ "name": "{C0}, a sinister tierce {C1}",  	"colors": 2, "charges": [ { "bg": "C0", "points": "1/3,M, 3/4,3/4" } ], "shapes": "pales(2-1) C0 C1" },
 
// quarters											  
	{ "name": "{C0}, quarter {C1}",    	     	"colors": 2, "charges": [ { "bg": "C1", "points": "1/4,1/4, 1/2,1/2" }, ], "shapes": "field() C0; rect(L,T,half,half) C1" },
	{ "name": "quarterly {C0} and {C1}",    	"colors": 2, "charges": [ { "bg": "C0", "points": "1/4,1/4, 1/2,1/2" }, ], "shapes": "quarterly() C0 C1" },
	{ "name": "quarterly {C0} and {C1}, a cross {C2}",
										    	"colors": 3, "charges": [ { "bg": "C0", "points": "1/4-H:1/32,1/4-1/32, 1/2-H:1/8,1/2-1/8" }, ], "shapes": "quarterly() C0 C1; cross(eighth) C2", "notes": "*cf.* [Dominican Republic](https://www.fotw.info/flags/do.html)" },

// cantons
	{ "name": "{C0}, canton {C1}",    	     	"colors": 2, "charges": [ { "bg": "C1", "points": "H:1/4,1/4, H:1/2,1/2" }, ], "shapes": "field() C0; rect(L,T,H:half,half) C1" },
											  
// fesses
	{ "name": "{C0}, a fess {C1}",  				"colors": 2, "charges": [ { "bg": "C1", "points": "C,M, whole,1/3" }, { "bg": "C1", "points": "C-1/6,M, 1/3,1/3; C+1/6,M, 1/3,1/3" }, { "bg": "C1", "points": "C-7/24,M, 1/3,1/4; C,M, 1/3,1/4; C+7/24,M,1/3,1/4" } ], "shapes": "fesses(1-1-1) C0 C1 C0", "notes": "*cf.* [City of Werne (Germany)](https://www.crwflags.com/fotw/flags/de-un-we.html)" },
	{ "name": "{C0}, a fess nowy dexter {C1}", 		"colors": 2, "charges": [ { "bg": "C1", "points": "1/3,M, 5/8,5/8" } ], "shapes": "fesses(1-1-1) C0 C1 C0; circle(1/3,M,1/3) C1", "notes": "*question* is this the right way to describe the offset nowy?" },
	{ "name": "{C0}, a Spanish fess {C1}", 			"colors": 2, "charges": [ { "bg": "C1", "points": "C,M, whole,1/2" }, { "bg": "C1", "points": "C-1/6,M, 1/3,1/2; C+1/6,M, 1/3,1/2" }, { "bg": "C1", "points": "C-7/24,M, 1/3,1/3; C,M, 1/3,1/3; C+7/24,M,1/3,1/3" } ], "shapes": "fesses(1-2-1) C0 C1 C0", "notes": "*cf.* [Spanish fess](https://en.wikipedia.org/wiki/Spanish_fess)" },
	{ "name": "Party per fess {C0} and {C1}", 		"colors": 2, "charges": [ { "bg": "C0 C1", "points": "C,M, whole,3/4" }, { "bg": "C1", "points": "C,1/4, whole,1/2" }, { "bg": "C1", "points": "C,3/4, whole,1/2" } ], "shapes": "fesses(1-1) C0 C1", "notes": "*cf.* [Poland](https://www.fotw.info/flags/pl.html)" },
		// for charges that span colors we check luminance on both colors when choosing charge color
	{ "name": "Tierced in fess {C0}, {C1} and {C2}",	"colors": 3, "charges": [ { "bg": "C1", "points": "C,M, whole,1/3" }, { "bg": "C1", "points": "C-1/6,M, 1/3,1/3; C+1/6,M, 1/3,1/3" }, { "bg": "C1", "points": "C-7/24,M, 1/3,1/4; C,M, 1/3,1/4; C+7/24,M,1/3,1/4" } ], "shapes": "fesses(1-1-1) C0 C1 C2", "notes": "*cf.* [Estonia](https://www.fotw.info/flags/ee.html" },
	{ "name": "{C0}, a fess {C1}, overall a dexter tierce triangular {C2}", 
													"colors": 3, "charges": [ { "bg": "C2", "points": "3/24,M, 1/3,1/3" } ], "shapes": "fesses(1-1-1) C0 C1 C0; polygon(L,T, 1/3,M, L,B) C2", "notes": "*cf.* [Bahamas](https://www.fotw.info/flags/bs.html)" },
	{ "name": "Party per fess {C0} and {C1}, a dexter tierce {C2}",
													"colors": 3, "charges": [ { "bg": "C2", "points": "1/6,M, 1/3-1/12,whole" } ], "shapes": "fesses(1-1) C0 C1; rect(L,T, 1/3,whole) C2", "notes": "*cf.* [Texas](https://www.fotw.info/flags/us-tx.html)" },
	{ "name": "Party per fess {C0} and {C1}, a dexter triangular {C2}",
													"colors": 3, "charges": [ { "bg": "C2", "points": "1/6,M, 1/2,1/2" } ], "shapes": "fesses(1-1) C0 C1; polygon(L,T, C,M, L,B) C2", "notes": "*cf.* [Czech Republic](https://www.fotw.info/flags/cz.html)" },
	{ "name": "Tierced in fess {C0}, {C1} and {C2}, a dexter triangular {C3}",	
													"colors": 4, "charges": [ { "bg": "C3", "points": "1/6,M, 1/2,1/2" } ], "shapes": "fesses(1-1-1) C0 C1 C2; polygon(L,T, C,M, L,B) C3", "notes": "*cf.* [Jordan](https://www.fotw.info/flags/jo.html" },
	{ "name": "Party per fess {C0} and {C1}, a dexter pile {C2}",
													"colors": 3, "charges": [ { "bg": "C2", "points": "1/5,M, 5/8,5/8" } ], "shapes": "fesses(1-1) C0 C1; polygon(L,T, R,M, L,B) C2", "notes": "*cf.* [Eritrea](https://www.fotw.info/flags/er.html)" },
	{ "name": "{C0}, a fess {C1} fimbriated {C2}", 	"colors": 3, /* "charges": [ { "bg": "C1", "points": "C,M, whole,1/3-2/20" }, { "bg": "C1", "points": "C-1/6,M, 1/3,1/3-2/20; C+1/6,M, 1/3,1/3-2/20" }, { "bg": "C1", "points": "C-7/24,M, 1/3,1/4-2/20; C,M, 1/3,1/4-2/20; C+7/24,M,1/3,1/4-2/20" } ], */ "shapes": "fesses(9-1-4-1-9) C0 C2 C1 C2 C0", "notes": "*cf.* [Botswana](https://www.fotw.info/flags/bw.html)" },
	{ "name": "Per fess {C0} and {C1}, a fess {C2} fimbriated {C3}",
													"colors": 4, /* "charges": [ { "bg": "C1", "points": "C,M, whole,1/3-2/20" }, { "bg": "C1", "points": "C-1/6,M, 1/3,1/3-2/20; C+1/6,M, 1/3,1/3-2/20" }, { "bg": "C1", "points": "C-7/24,M, 1/3,1/4-2/20; C,M, 1/3,1/4-2/20; C+7/24,M,1/3,1/4-2/20" } ], */ "shapes": "fesses(6-1-4-1-6) C0 C3 C2 C3 C1", "notes": "*cf.* [Gambia](https://www.fotw.info/flags/gm.html)" },
	{ "name": "Party per fess {C0} and {C1}, canton {C2}",
													"colors": 3, "charges": [ { "bg": "C1", "points": "H:1/4,1/4, H:1/2,1/2" } ], "shapes": "fesses(1-1) C0 C1; rect(L,T,H:half,half) C2", "notes": "*cf.* [Chile](https://www.fotw.info/flags/cl.html)" },
	{ "name": "Party per fess {C0} and per fess {C1} and {C2}",
													"colors": 3, "charges": [ { "bg": "C0", "points": "half,1/4, whole,half" }, { "bg": "C0", "points": "1/4,1/4, whole,half" } ], "shapes": "fesses(2-1-1) C0 C1 C2", "notes": "*cf.* [Columbia](https://www.fotw.info/flags/co.html)" },
	{ "name": "{C0}, a fess {C1}, between a base and chief {C2}",
													"colors": 3, "charges": [ { "bg": "C1", "points": "C,M, whole,1/3" }, { "bg": "C1", "points": "C-1/6,M, 1/3,1/3; C+1/6,M, 1/3,1/3" }, { "bg": "C1", "points": "C-7/24,M, 1/3,1/4; C,M, 1/3,1/4; C+7/24,M,1/3,1/4" } ], "shapes": "fesses(1-1-2-1-1) C2 C0 C1 C0 C2", "notes": "*cf.* [Costa Rica](https://www.fotw.info/flags/cr.html)" },

// barrys
	{ "name": "Barry of {C0}, {C1}, {C2} and {C3}",	"colors": 4, "charges": [ { "bg": "C1 C2", "points": "C,M, whole,1/2" } ], "shapes": "barry(4) C0 C1 C2 C3", "notes": "*cf.* [Mauritius](https://www.fotw.info/flags/mu.html" },

// pales
	{ "name": "{C0}, a pale {C1}",  				"colors": 2, "charges": [ { "bg": "C1", "points": "C,M, 1/3,whole" }, { "bg": "C1", "points": "C,M-1/5, 1/3,1/3; C,M+1/5, 1/3,1/3" } ], "shapes": "pales(1-1-1) C0 C1 C0" },
	{ "name": "{C0}, a Canadian pale {C1}",  		"colors": 2, "charges": [ { "bg": "C1", "points": "C,M, 1/2,whole" }, { "bg": "C1", "points": "C,M-1/5, 1/2,1/3; C,M+1/5, 1/2,1/3" } ], "shapes": "pales(1-2-1) C0 C1 C0" },
	{ "name": "Party per pale {C0} and {C1}",  		"colors": 2, "charges": [ { "bg": "C0 C1", "points": "C,M, 2/3,2/3" }, { "bg": "C1", "points": "3/4,M, 2/3,2/3" } ], "shapes": "pales(1-1) C0 C1" },
	{ "name": "Party per pale, per pale {C1} and {C2}, and {C0}",
													"colors": 3, "charges": [ { "bg": "C0", "points": "3/4,M, 2/3,2/3" } ], "shapes": "pales(1-1-2) C1 C2 C0", "notes": "*cf.* [Durham, NC](https://en.wikipedia.org/wiki/File:Flag_of_Durham,_North_Carolina.svg)" },
	{ "name": "Tierced in pale {C1}, {C0} and {C2}",	"colors": 3, "charges": [ { "bg": "C0", "points": "C,M, 1/3,whole" }, { "bg": "C0", "points": "C,M-1/6, 1/3,1/3; C,M+1/6, 1/3,1/3" }, { "bg": "C0", "points": "C,M-7/24, 1/3,1/4; C,M, 1/3,1/4; C,M+7/24,1/3,1/4" } ], "shapes": "pales(1-1-1) C1 C0 C2", "notes": "*cf.* [France](https://www.fotw.info/flags/fr.html), [Italy](https://www.fotw.info/flags/it.html), and [Cameroon](https://www.fotw.info/flags/cm.html)" },

// chevrons
	{ "name": "Party per chevron, {C0} and {C1}",				"colors": 2, "shapes": "perchevron() C0 C1" },
	{ "name": "{C0}, chevron {C1}",								"colors": 2, "shapes": "field() C0; chevron(1/4) C1" },
	{ "name": "{C0}, chevron {C1} fimbriated {C2}",				"colors": 3, "shapes": "field() C0; chevron(1/4) C1; chevron(1/8) C2" },
	{ "name": "{C0}, 3 chevrons inverted {C1}",					"colors": 2, "shapes": "field() C0; chevrons(3,1/12,chief) C1" },
	{ "name": "{C0}, 3 chevrons {C1}",							"colors": 2, "shapes": "field() C0; chevrons(3,1/16,base) C1" },
	{ "name": "{C0}, chevron couched from dexter {C1}",			"colors": 2, "shapes": "field() C0; chevrons(1,1/4,dexter) C1" },
	{ "name": "{C0}, 2 chevrons couched from sinister {C1}",	"colors": 2, "shapes": "field() C0; chevrons(2,1/6,sinister) C1" },
	{ "name": "{C0}, 2 chevrons couched from dexter {C1}, chevron couched from dexter {C2}",		"colors": 3, "shapes": "field() C0; chevrons(2,1/6,dexter) C1; chevrons(1,1/6,dexter) C2" },

// bars
	{ "name": "{C0}, two bars {C1}",			"colors": 2, "shapes": "fesses(3-2-2-2-3) C0 C1 C0 C1 C0" },
	{ "name": "{C0}, two bars gemel {C1}",		"colors": 2, "shapes": "fesses(9-2-2-2-6-2-2-2-9) C0 C1 C0 C1 C0 C1 C0 C1 C0" },
	{ "name": "{C0}, two bars {C1}, overall a dexter triangle {C2}", 
												"colors": 3, "charges": [ { "bg": "C2", "points": "7/48,M, 5/12,5/12" } ], "shapes": "stripes(5) C0 C1; polygon(L,T, 2/5,M, L,B) C2", "notes": "*cf.* [Cuba](https://www.fotw.info/flags/cu.html)" },
												// TODO: If we had an equilateral triangle shape we could use it here... that's what Cuba's flag specifies

// bends -- TODO: would like to use H: on horizontals to square corners, but doesn't work right
	{ "name": "{C0}, bend {C1}",				"colors": 2, "charges": [ { "bg": "C0", "points": "R-5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,T, L+1/8,T, R,B-1/8, R,B, R-1/8,B, L,T+1/8) C1" },
	{ "name": "{C0}, wide bend {C1}",			"colors": 2, "charges": [ { "bg": "C1", "points": "C,M, 2/3,2/3" } ], "shapes": "field() C0; polygon(L,T, L+1/3,T, R,B-1/2, R,B, R-1/3,B, L,T+1/2) C1" },
	{ "name": "{C0}, bend {C1} fimbriated {C2}","colors": 3, "charges": [ { "bg": "C0", "points": "R-5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,T, L+1/8,T, R,B-1/8, R,B, R-1/8,B, L,T+1/8) C2; polygon(L,T, L+1/12,T, R,B-1/12, R,B, R-1/12,B, L,T+1/12) C1" },
	{ "name": "{C0}, bend sinister {C1}",		"colors": 2, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, L+1/8,B, R,T+1/8, R,T, R-1/8,T, L,B-1/8) C1" },
	{ "name": "{C0}, bend sinister {C1} fimbriated {C2}",		
												"colors": 3, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, L+1/8,B, R,T+1/8, R,T, R-1/8,T, L,B-1/8) C2; polygon(L,B, L+1/12,B, R,T+1/12, R,T, R-1/12,T, L,B-1/12) C1" },
	{ "name": "{C0}, reduced bend {C1}",		"colors": 2, "charges": [ { "bg": "C0", "points": "R-4/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,T, R,B-1/4, R,B, L,T+1/4) C1" },
								
	{ "name": "{C0}, reduced bend per bend {C1} and {C2}",
												"colors": 3, "charges": [ { "bg": "C0", "points": "R-4/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,T, R,B-1/4, R,B-1/8, L,T+1/8) C1; polygon(L,T+1/8, R,B-1/8, R,B, L,T+1/4) C2", "notes": "*cf.* [Brunei](https://www.fotw.info/flags/bn.html)" },
	{ "name": "{C0}, enhanced bend sinister {C1}",
												"colors": 2, "charges": [ { "bg": "C0", "points": "L+4/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R,T+1/4, R,T, L,B-1/4) C1" },
	{ "name": "{C0}, reduced bend sinister {C1}",
												"colors": 2, "charges": [ { "bg": "C0", "points": "L+4/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R-1/4,T, R,T, L+1/4,B) C1" },

	{ "name": "Party per bend sinister, {C0} and {C1}, enhanced bend sinister {C2}",
												"colors": 2, "charges": [ { "bg": "C0", "points": "L+4/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R,T, R,B) C1; polygon(L,B, R,T+1/4, R,T, L,B-1/4) C2" },
	{ "name": "Party per bend sinister, {C0} and {C1}, reduced bend sinister {C2}",
												"colors": 2, "charges": [ { "bg": "C0", "points": "L+4/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R,T, R,B) C1; polygon(L,B, R-1/4,T, R,T, L+1/4,B) C2" },
												
	{ "name": "Party per bend, {C0} and {C1}",			"colors": 2, "charges": [ { "bg": "C0", "points": "R-5/24,1/3, 1/2,1/2" } ], "shapes": "field() C0; polygon(L,T, R,B, L,B) C1" },
	{ "name": "Party per bend, {C0} and per bend {C1} and {C2}",
												"colors": 3, "charges": [ { "bg": "C0", "points": "R-5/24,1/3, 1/2,1/2" } ], "shapes": "field() C0; polygon(L,T, R,B, L,B) C1; polygon(L,T+1/2, R-1/2,B, L,B) C2" },
	{ "name": "Party per bend, {C0} and {C1}, wide bend {C2}",
												"colors": 3, "charges": [ { "bg": "C0", "points": "C,M, 2/3,2/3" } ], "shapes": "field() C0; polygon(L,T, R,B, L,B) C1; polygon(L,T, L+1/3,T, R,B-1/2, R,B, R-1/3,B, L,T+1/2) C2" },
	{ "name": "Party per bend sinister, {C0} and {C1}",	"colors": 2, "charges": [ { "bg": "C0", "points": "L+5/24,1/3, 1/2,1/2" } ], "shapes": "field() C0; polygon(L,B, R,T, R,B) C1" },
	{ "name": "Party per bend sinister, {C0} and per bend sinister {C1} and {C2}",	
												"colors": 3, "charges": [ { "bg": "C0", "points": "L+5/24,1/3, 1/2,1/2" } ], "shapes": "field() C0; polygon(L,B, R,T, R,B) C1; polygon(L+1/2,B, R,T+1/2, R,B) C2" },
	{ "name": "Party per bend sinister, {C0} and {C1}, a bend {C2}",	
												"colors": 3, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R,T, R,B) C1; polygon(L,B, L+1/8,B, R,T+1/8, R,T, R-1/8,T, L,B-1/8) C2" },
	{ "name": "Party per bend sinister, {C0} and {C1}, a bend {C2} fimbriated {C3}",	
												"colors": 4, "charges": [ { "bg": "C0", "points": "L+4/24,1/3-2/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R,T, R,B) C1; polygon(L,B, L+1/5,B, R,T+1/5, R,T, R-1/5,T, L,B-1/5) C3; polygon(L,B, L+1/8,B, R,T+1/8, R,T, R-1/8,T, L,B-1/8) C2" },
	{ "name": "Party per bend sinister, {C0} and {C1}, a bendlet sinister {C2}",	
												"colors": 3, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R,T, R,B) C1; polygon(L,B, L+1/16,B, R,T+1/16, R,T, R-1/16,T, L,B-1/16) C2" },

// curved bends												
	{ "name": "Party per river bend sinister, {C0} and {C1}",	
												"colors": 2, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; path(M L,B C 1/8,M,R-1/8,M,R,T L R,B L L,B) C1;" },
	{ "name": "Party per bend sinister, {C0} and {C1}, a river south east {C2}",	
												"colors": 3, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; path(M L,B C 1/8,M,R-1/8,M,R,T L R,B L L,B) C2; path(M L+1/8,B C 2/8,M+1/8,R-2/8,M+1/8,R,T+5/16 L R,B L L,B) C1" },



// piles
	{ "name": "{C0}, dexter tierce trianglular {C1}",
												"colors": 2, "charges": [ { "bg": "C1", "points": "eighth,M, 1/3,1/3" }, { "bg": "C0", "points": "2/3,M, 2/3,2/3" } ], "shapes": "field() C0; polygon(L,T, 1/3,M, L,B) C1" },
	{ "name": "{C0}, dexter half trianglular {C1}, dexter tierce trianglular {C2}",
												"colors": 3, "charges": [ { "bg": "C2", "points": "eighth,M, 1/3,1/3" }, { "bg": "C0", "points": "3/4,M, half,half" } ], "shapes": "field() C0; polygon(L,T, 1/2,M, L,B) C1; polygon(L,T, 1/3,M, L,B) C2", "notes": "*cf.* [East Timor](https://www.fotw.info/flags/tl.html)" },
	{ "name": "{C0}, dexter pile {C1}, dexter half trianglular {C2}",
												"colors": 3, "charges": [ { "bg": "C2", "points": "sixth,M, 1/2,1/2" } ], "shapes": "field() C0; polygon(L,T, R,M, L,B) C1; polygon(L,T, 1/2,M, L,B) C2" },
	{ "name": "{C0}, a pile issuing from the base in bend sinister {C1}",
												"colors": 2, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, L+1/5,B, R,T, L,B-1/5) C1", "notes": "*cf.* [Pile (heraldry)](https://en.wikipedia.org/wiki/Pile_(heraldry))" },
	{ "name": "{C0}, a pile issuing from the base in bend sinister per bend {C1} and {C2}",
												"colors": 3, "charges": [ { "bg": "C0", "points": "L+5/24,1/3-1/24, 1/2-1/16,1/2-1/16" } ], "shapes": "field() C0; polygon(L,B, R,T, L,B-1/5) C1; polygon(L,B, L+1/5,B, R,T) C2", "notes": "*cf.* [Pile (heraldry)](https://en.wikipedia.org/wiki/Pile_(heraldry))" },
	{ "name": "Five piles in point base dexter {C0}, {C1}, {C2}, {C3} and {C4}",
												"colors": 5, "shapes": "field() C0; polygon(L,B, 1/3,T, 2/3,T) C1; polygon(L,B, 2/3,T, R,T, R,1/3) C2; polygon(L,B, R,1/3, R,2/3) C3; polygon(L,B, R,2/3, R,B) C4;", "notes": "*cf.* [Seychelles](https://www.fotw.info/flags/sc.html" },
	{ "name": "{C0}, a pile issuing from sinister chief per bend {C1} and {C2}",
												"colors": 3, "charges": [ { "bg": "C0", "points": "L+4/24,1/3, 1/2,1/2" } ], "shapes": "field() C0; polygon(L,B-1/50, L,B-2/50, R,T, R,1/5) C1; polygon(L,B, L,B-1/50, R,1/5, R,2/5) C2", "notes": "*cf.* [Marshall Islands](https://www.fotw.info/flags/mh.html)" },


// saltires
	{ "name": "{C0}, saltire {C1}",				"colors": 2, "shapes": "field() C0; saltire(1/8) C1", "notes": "*cf.* [Scotland](https://www.fotw.info/flags/gb-scotl.html)" },
	{ "name": "{C0}, Scottish saltire {C1}",	"colors": 2, "shapes": "field() C0; scottish(1/3) C1", "notes": "*cf.* [Scotland](https://www.fotw.info/flags/gb-scotl.html)" },
	{ "name": "{C0}, saltire {C1} fimbriated {C2}",
												"colors": 3, "shapes": "field() C0; saltire(1/4) C2; saltire(1/8) C1", "notes": "*cf.* [Scotland](https://www.fotw.info/flags/gb-scotl.html)" },
	{ "name": "{C0}, saltire nowy {C1}",		"colors": 2, "charges": [ { "bg": "C1", "points": "C,M, 1/3,1/3" } ], "shapes": "field() C0; saltire(1/8) C1; circle(C,M, quarter) C1", "notes": "*cf.* [Flag of Florida](https://en.wikipedia.org/wiki/Flag_of_Florida)" },
	{ "name": "Party per saltire, {C0} and {C1}",		"colors": 2, /* "charges": [ { "bg": "C0", "points": "R-5/24,1/3, 1/2,1/2" } ], */ "shapes": "persaltire() C0 C1" },
	{ "name": "Party per saltire, {C0} and {C1}, saltire {C2}",
												"colors": 3, "charges": [ { "bg": "C2", "points": "seventh,M, 1/3,1/3" } ], "shapes": "persaltire() C0 C1; saltire(1/8) C2", "notes": "*cf.* [Jamaica](https://www.fotw.info/flags/jm.html)" },
	{ "name": "Party per saltire, {C0} and {C1}, saltire nowy {C2}",
												"colors": 3, "charges": [ { "bg": "C2", "points": "C,M, 5/12,5/12" } ], "shapes": "persaltire() C0 C1; saltire(1/8) C2; circle(C,M, quarter) C2", "notes": "*cf.* [Burundi](https://www.fotw.info/flags/bi.html)" },

	
// lozenges
	{ "name": "{C0}, lozenge {C1}",				"colors": 2, "charges": [ { "bg": "C1", "points": "C,M, half,half" } ], "shapes": "field() C0; polygon(half,1/8, 7/8,half, half,7/8, 1/8,half) C1" },
// chiefs
	{ "name": "{C0}, a chief {C1}",  			"colors": 2, "charges": [ { "bg": "C0", "points": "C,5/8, whole,3/4" }, { "bg": "C0", "points": "C-1/6,5/8, 1/3,3/4; C+1/6,5/8, 1/3,3/4" }, { "bg": "C0", "points": "C-7/24,5/8, 1/3,1/3; C,5/8, 1/3,1/3; C+7/24,5/8,1/3,1/3" } ], "shapes": "fesses(1-3) C1 C0" },
// bases
	{ "name": "{C0}, a base {C1}",  			"colors": 2, "charges": [ { "bg": "C0", "points": "C,3/8, whole,3/4" }, { "bg": "C0", "points": "C-1/6,3/8, 1/3,3/4; C+1/6,3/8, 1/3,3/4" }, { "bg": "C0", "points": "C-7/24,3/8, 1/3,1/3; C,3/8, 1/3,1/3; C+7/24,3/8,1/3,1/3" } ], "shapes": "fesses(3-1) C0 C1" },
	{ "name": "{C0}, a base enarched {C1}",  	"colors": 2, "charges": [ { "bg": "C0", "points": "C,3/8, whole,3/4-1/8" }, { "bg": "C0", "points": "C-1/6,3/8, 1/3,3/4; C+1/6,3/8, 1/3,3/4" }, { "bg": "C0", "points": "C-7/24,3/8, 1/3,1/3; C,3/8, 1/3,1/3; C+7/24,3/8,1/3,1/3" } ], "shapes": "field() C0; path(M L,14/16 Q half,10/16 R,14/16 L R,B L L,B) C1" },
	{ "name": "{C0}, a base wavy {C1}",  		"colors": 2, "charges": [ { "bg": "C0", "points": "C,3/8, whole,3/4" }, { "bg": "C0", "points": "C-1/6,3/8, 1/3,3/4; C+1/6,3/8, 1/3,3/4" }, { "bg": "C0", "points": "C-7/24,3/8, 1/3,1/3; C,3/8, 1/3,1/3; C+7/24,3/8,1/3,1/3" } ], "shapes": "field() C0; path(M L,12/16 Q 1/18,11/16 2/18,12/16 T 4/18,12/16 T 6/18,12/16 T 8/18,12/16 T 10/18,12/16 T 12/18,12/16 T 14/18,12/16 T 16/18,12/16 T 18/18,12/16 L R,B L L,B L L,12/16 Z) C1" },
// crosses

// Nordic crosses
	{ "name": "{C0}, a Nordic cross {C1}", 		"colors": 2, "shapes": "field() C0; nordic(1/8) C1", "notes": "*cf.* [Nordic cross flag](https://en.wikipedia.org/wiki/Nordic_cross_flag)" },
	// { "name": "{C0}, a Swedish cross {C1}", 	"colors": 2, "shapes": "line(L,M,R,M,eighth) C1; line(5/16,T,5/16,B,eighth) C1", "notes": "*cf.* [Sweden](https://www.fotw.info/flags/se.html)" },
		// so close to Nordic that we aren't doing both
	{ "name": "{C0}, a Nordic cross nowy quadrate {C1}",  	
												"colors": 2, "charges": [ { "bg": "C1", "points": "H:C,M, H:1/2,1/2" } ], "shapes": "field() C0; nordic(1/8) C1; rect(H:C-H:1/4,M-1/4,H:1/2,1/2) C1", "notes": "*cf.* [Quadrate](https://en.wikipedia.org/wiki/Quadrate_(heraldry))" },
	{ "name": "{C0}, a Nordic cross {C1} fimbriated {C2}",
												"colors": 3, "shapes": "field() C0; nordic(1/4) C2; nordic(1/8) C1", "notes": "*cf.* [Nordic cross flag](https://en.wikipedia.org/wiki/Nordic_cross_flag)" },

// sashes
	{ "name": "{C0}, sash per bend {C1} and {C2}",
												"colors": 3, "charges": [ { "bg": "C0", "points": "3/4,1/3, 10/16,1/2" } ], "shapes": "field() C0; polygon(L,T, L+1/8,T, 7/16,B, 5/16,B) C1; polygon(L+1/8,T, L+2/8,T, 9/16,B, 7/16,B) C2" },


];

const flagOLDBackgrounds = [
	{ "name": "cross",  		"anchors": [ [21,21, 42,42, 0] ], "shape": "line", "colors": "same", "lines": [ [48,0, 48,96, 12], [0,48, 96,48, 12] ] },
	{ "name": "dbl-cross",  	"anchors": [ [18,16, 36,36, 0] ], "shape": "line", "colors": "vary", "lines": [ [48,0, 48,96, 24, 0,48, 96,48, 24], [48,0, 48,96, 12, 0,48, 96,48, 12] ] },
	{ "name": "thick-cross",  	"anchors": [ [18,16, 36,36, 0] ], "shape": "line", "colors": "same", "lines": [ [48,0, 48,96, 24], [0,48, 96,48, 24] ] },
	{ "name": "canton",         "anchors": [ [24,24, 48,48, 1] ], "shape": "rect", "colors": "same", "rects": [ [0,0, 48,48] ] },
	{ "name": "canton-fess-3", 	"anchors": [ [16,32, 32,64, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,32, 'L',96,32, 'L',96,64,'L',0,64,'L',0,32], ['M',0,0, 'L',32,0, 'L',32,64,'L',0,64,'L',0,0] ] },
	{ "name": "canton-fess-5", 	"anchors": [ [16,28.8, 32,57.6, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,19.2, 'L',96,19.2, 'L',96,38.4,'L',0,38.4,'L',0,19.2, 'M',0,57.6, 'L',96,57.6, 'L',96,76.8,'L',0,76.8,'L',0,57.6], ['M',0,0, 'L',32,0, 'L',32,57.6,'L',0,57.6,'L',0,0] ] },
	{ "name": "canton-fess-9", 	"anchors": [ [24,26.6667, 48,53.3333, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,10.6667, 'L',96,10.6667, 'L',96,21.3333,'L',0,21.3333,'L',0,10.6667, 'M',0,32, 'L',96,32, 'L',96,42.6667,'L',0,42.6667,'L',0,32, 'M',0,53.3333, 'L',96,53.3333, 'L',96,64,'L',0,64,'L',0,53.3333, 'M',0,74.6667, 'L',96,74.6667, 'L',96,85.3333,'L',0,85.3333,'L',0,74.6667], ['M',0,0, 'L',48,0, 'L',48,53.3333,'L',0,53.3333,'L',0,0] ] },
    { "name": "quadrisection",  "anchors": [ [24,24, 48,48, 1] ], "shape": "rect", "colors": "same", "rects": [ [0,0, 48,48], [48,48, 48,48] ] },
    { "name": "pale-1-1",       "anchors": [ [48,48, 64,96, 0], [72,48, 64,96, 1] ], "shape": "rect", "colors": "vary", "rects": [ [48,0, 48,96] ] },
    { "name": "pale-1-2",       "anchors": [ [64,48, 64,96, 1] ], "shape": "rect", "colors": "vary", "rects": [ [32,0, 64,96] ] },
    { "name": "pale-2-1",       "anchors": [ [32,48, 64,96, 1] ], "shape": "rect", "colors": "vary", "rects": [ [0,0, 64,96] ] },
    { "name": "pale-1-1-1",     "anchors": [ [48,48, 32,96, 0] ], "shape": "rect", "colors": "vary", "rects": [ [32,0, 32,96], [64,0, 32,96] ] },
    { "name": "pale-1-1-4-1-1", "anchors": [ [48,48, 48,96, 0] ], "shape": "rect", "colors": "same", "rects": [ [12,0, 12,96], [72,0, 12,96] ] },
    { "name": "pale-A1-1-A1",   "anchors": [ [48,48, 32,96, 1] ], "shape": "rect", "colors": "vary", "rects": [ [32,0, 32,96] ] },
    { "name": "pale-A2-1-A2",   "anchors": [ [48,48, 20,96, 1] ], "shape": "rect", "colors": "vary", "rects": [ [38,0, 20,96] ] },
    { "name": "fess-1-1",       "anchors": [ [48,48, 96,64], [48,24, 96,48, 0] ], "shape": "rect", "colors": "vary", "rects": [ [0,48, 96,48] ] },
    { "name": "fess-1-2",       "anchors": [ [48,64, 96,64, 1], [32,64, 96,64, 1] ], "shape": "rect", "colors": "vary", "rects": [ [0,32, 96,64] ] },
    { "name": "fess-2-1",       "anchors": [ [48,32, 96,64, 1] ], "shape": "rect", "colors": "vary", "rects": [ [0,0, 96,64] ] },
    { "name": "fess-2-1-wave", 	"anchors": [ [48,32, 96,56, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,64, 'Q',8,56,'',16,64, 'Q',24,72,'',32,64, 'Q',40,56,'',48,64, 'Q',56,72,'',64,64, 'Q',72,56,'',80,64, 'Q',88,72,'',96,64, 'L',96,96, 'L',0,96, 'L',0,64] ] },
    { "name": "fess-1-1-1",     "anchors": [ [48,48, 96,32, 1] ], "shape": "rect", "colors": "vary", "rects": [ [0,32, 96,32], [0,64, 96,32] ] },
    { "name": "pale-fess-1-1",  	"anchors": [ [16,48, 32,96, 0] ], "shape": "rect", "colors": "vary", "rects": [ [0,0, 32,96], [32,48, 64,48] ] },
    { "name": "pale-fess-1-1-1",    "anchors": [ [12,48, 24,96, 0] ], "shape": "rect", "colors": "vary", "rects": [ [0,0, 24,96], [24,32, 72,32], [24,64, 72,32] ] },
    { "name": "fess-A1-1-A1",   "anchors": [ [48,48, 96,32, 1] ], "shape": "rect", "colors": "vary", "rects": [ [0,32, 96,32] ] },
    { "name": "fess-A2-1-A2",   "anchors": [ [48,48, 96,20, 1] ], "shape": "rect", "colors": "vary", "rects": [ [0,38, 96,20] ] },
    { "name": "fess-1-1-1-1",   "anchors": [ [48,48, 96,48] ], "shape": "rect", "colors": "vary", "rects": [ [0,24, 96,24], [0,48, 96,24], [0,72, 96,24] ] },
    { "name": "fess-1-1-4-1-1", "anchors": [ [48,48, 96,48, 2] ], "shape": "rect", "colors": "same", "rects": [ [0,12, 96,12], [0,72, 96,12] ] },
    { "name": "fess-2-1-4.67-1-2",	"anchors": [ [48,48, 96,42, 2] ], "shape": "rect", "colors": "vary", "rects": [ [0,18, 96,60], [0,27, 96,42] ] },
    { "name": "bend-up",        	"anchors": [ [18,30, 45,45, 0] ], "shape": "path", "colors": "same", "paths": [ ['M',90,0, 'L',96,0, 'L',96,6, 'L',6,96, 'L',0,96, 'L',0,90, 'L',90,0] ] },
    { "name": "bend-up-tb",			"anchors": [ [18,30, 45,45, 0] ], "shape": "path", "colors": "same", "paths": [ ['M',72,0, 'L',96,0, 'L',24,96, 'L',0,96, 'L',72,0] ] },
//    { "name": "bend-up-tb-split",	"anchors": [ [18,30, 45,45, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',96,0, 'L',0,96, 'L',96,96, 'L',96,0], ['M',72,0, 'L',96,0, 'L',24,96, 'L',0,96, 'L',72,0] ] },
//    { "name": "two-bend-down", 	"anchors": [ [72,36, 60,84, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',12,0, 'L',42,96, 'L',30,96, 'L',0,0], ['M',12,0, 'L',24,0, 'L',54,96, 'L',42,96, 'L',12,0] ] },
    { "name": "dbl-bend-up",    "anchors": [ [18,30, 42,42, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',84,0, 'L',96,0, 'L',96,12, 'L',12,96, 'L',0,96, 'L',0,84, 'L',84,0], ['M',90,0, 'L',96,0, 'L',96,6, 'L',6,96, 'L',0,96, 'L',0,90, 'L',90,0] ] },
    { "name": "diag-up",        "anchors": [ [24,30, 48,48, 0] ], "shape": "path", "colors": "same", "paths": [ ['M',96,0, 'L',0,96, 'L',96,96, 'L',96,0] ] },
    { "name": "diag-up-bend",       "anchors": [ [18,30, 45,45, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',96,0, 'L',0,96, 'L',96,96, 'L',96,0], ['M',90,0, 'L',96,0, 'L',96,6, 'L',6,96, 'L',0,96, 'L',0,90, 'L',90,0] ] },
    { "name": "diag-up-dbl-bend",   "anchors": [ [18,30, 42,42, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',96,0, 'L',0,96, 'L',96,96, 'L',96,0], ['M',84,0, 'L',96,0, 'L',96,12, 'L',12,96, 'L',0,96, 'L',0,84, 'L',84,0], ['M',90,0, 'L',96,0, 'L',96,6, 'L',6,96, 'L',0,96, 'L',0,90, 'L',90,0] ] },
    { "name": "diag-down",      "anchors": [ [72,30, 48,48, 1] ], "shape": "path", "colors": "same", "paths": [ ['M',0,0, 'L',96,96, 'L',96,0, 'L',0,0] ] },
	{ "name": "diag-down-large",		"anchors": [ [48,48, 64,64, 2] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',96,96, 'L',96,0, 'L',0,0], ['M',0,0, 'L',32,0, 'L',96,48, 'L',96,96, 'L',64,96, 'L',0,48, 'L',0,0] ] },
	{ "name": "diag-down-large-same",	"anchors": [ [48,48, 64,64, 1] ], "shape": "path", "colors": "same", "paths": [ ['M',0,0, 'L',32,0, 'L',96,48, 'L',96,96, 'L',64,96, 'L',0,48, 'L',0,0] ] },
    { "name": "half-chevron",   "anchors": [ [16,48, 32,32, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',0,96, 'L',48,48, 'L',0,0] ] },
    { "name": "half-chevron-fess-1-1",	"anchors": [ [16,48, 32,32, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,48, 'L',0,96, 'L',96,96, 'L',96,48, 'L',0,48], ['M',0,0, 'L',0,96, 'L',48,48, 'L',0,0] ] },
    { "name": "third-chevron", 	"anchors": [ [14,48, 32,32, 1], [64,48, 64,64, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',0,96, 'L',32,48, 'L',0,0] ] },
    { "name": "third-chevron-fess-1-1",	"anchors": [ [14,48, 32,32, 2] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,48, 'L',0,96, 'L',96,96, 'L',96,48, 'L',0,48], ['M',0,0, 'L',0,96, 'L',32,48, 'L',0,0] ] },
    { "name": "third-half-chevron", 	"anchors": [ [14,48, 32,32, 2] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',0,96, 'L',48,48, 'L',0,0], ['M',0,0, 'L',0,96, 'L',32,48, 'L',0,0] ] },
    { "name": "half-full-chevron", 		"anchors": [ [16,48, 32,32, 2] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',0,96, 'L',96,48, 'L',0,0], ['M',0,0, 'L',0,96, 'L',48,48, 'L',0,0] ] },
    { "name": "half-circle-chevron",   	"anchors": [ [16,48, 32,32, 1], [64,48, 64,64, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'C',48,0, '',48,96, '',0,96, 'L',0,0] ] },
    { "name": "half-circle-chevron-fess-1-1", 	"anchors": [ [16,48, 32,32, 2] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,48, 'L',0,96, 'L',96,96, 'L',96,48, 'L',0,48], ['M',0,0, 'C',48,0, '',48,96, '',0,96, 'L',0,0] ] },
    { "name": "diagonal-split",	"anchors": [ [16,48, 32,32, 1], [80,48, 32,32, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',48,48, 'L',96,0, 'L',96,96, 'L',48,48, 'L',0,96, 'L',0,0] ] },
	{ "name": "saltire",		"anchors": [ [16,48, 32,32, 1] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,0, 'L',48,48, 'L',96,0, 'L',96,96, 'L',48,48, 'L',0,96, 'L',0,0], ['M',90,0, 'L',96,0, 'L',96,6, 'L',6,96, 'L',0,96, 'L',0,90, 'L',90,0, 'M',0,6, 'L',0,0, 'L',6,0, 'L',96,90, 'L',96,96, 'L',90,96, 'L',0,6] ] },
    { "name": "diag-up-curve", 		"anchors": [ [24,30, 48,48, 0] ], "shape": "path", "colors": "same", "paths": [ ['M',0,96, 'C',12,48, '',84,48, '',96,0, 'L',96,96, 'L',0,96] ] },
	{ "name": "diag-up-dbl-curve", 	"anchors": [ [24,30, 48,48, 0] ], "shape": "path", "colors": "vary", "paths": [ ['M',0,96, 'C',12,48, '',84,48, '',96,0, 'L',96,96, 'L',0,96], ['M',12,96, 'C',24,60, '',72,60, '',96,30, 'L',96,96, 'L',0,96] ] },
];

/* SYMBOLS */

// https://svgsprit.es/ converts SVG into sprites easily

const flagSymbols = [
	{ "id": "simple-symbol", "name": "disc", "pluralName": "discs", "symbol": `<symbol id="simple-symbol" width="100" height="100" viewbox="0 0 100 100"><circle cx="50" cy="50" r="50"/></symbol>` },
	{ "id": "4-point-star", "name": "four-point star", "pluralName": "four-point stars", "symbol": `<symbol id="4-point-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" id="4 point star"><path d="M37.729 58.271L4 48l33.729-10.271L48 4l10.271 33.729L92 48 58.271 58.271 48 92z" fill-rule="evenodd"></path></symbol>` },
	{ "id": "5-point-star", "name": "star", "pluralName": "stars", "symbol": `<symbol id="5-point-star" width="260" height="245" viewbox="0 0 260 245"><path d="m55,237 74-228 74,228L9,96h240"/></symbol>` },
	{ "id": "14-petal-flower", "name": "flower of 14 petals", "pluralName": "flowers of 14 petals", "symbol": `<symbol viewBox="0 0 466.903 466.903" id="14-petal-flower">
    <path d="M450.048 146.347c-6.479-15.717-19.411-26.817-34.468-31.494 1.84-16.054-3.357-32.769-15.673-45.086-11.874-11.878-27.844-17.138-43.36-15.849-4.508-15.34-15.625-28.593-31.522-35.217-15.701-6.538-32.688-5.235-46.65 2.106C268.324 8.149 252.84.005 235.415.005c-16.799 0-31.807 7.565-41.873 19.46-14.03-7.662-31.266-9.169-47.197-2.607-15.715 6.474-26.818 19.412-31.495 34.468-16.052-1.843-32.765 3.354-45.085 15.663-11.874 11.88-17.138 27.843-15.85 43.364-15.34 4.508-28.593 15.625-35.215 31.528-6.54 15.693-5.238 32.691 2.104 46.646C8.137 198.578 0 214.069 0 231.483c0 16.804 7.566 31.815 19.46 41.874-7.663 14.03-9.169 31.27-2.607 47.191 6.476 15.725 19.412 26.817 34.468 31.502-1.843 16.054 3.354 32.772 15.663 45.088 12.688 12.68 30.021 17.801 46.516 15.452 4.12 16.135 15.455 30.225 32.011 37.121 15.084 6.279 31.34 5.277 44.968-1.318 10.05 11.333 24.673 18.506 41.004 18.506 17.933 0 33.811-8.644 43.817-21.952 14.334 8.491 32.296 10.439 48.887 3.61 16.102-6.632 27.33-20.064 31.795-35.598 15.701 1.475 31.906-3.803 43.925-15.813 11.425-11.417 16.699-26.609 15.941-41.561 14.114-4.998 26.148-15.661 32.36-30.557 6.973-16.743 4.981-34.945-3.711-49.372 13.569-9.99 22.405-26.02 22.405-44.157 0-16.146-7.013-30.613-18.113-40.654 6.425-13.518 7.406-29.564 1.259-44.498zm-92.042 94.061c1.158 6.98 3.587 13.529 7.105 19.372a54.745 54.745 0 00-15.112 16.936c17.881 8.6 30.316 17.071 28.966 20.177-1.351 3.098-15.918-.16-34.3-7.298a54.985 54.985 0 00-1.831 17.112c-6.052 2.136-11.786 5.386-16.936 9.698 13.669 14.711 22.253 27.314 19.849 29.734-2.4 2.393-14.792-6.022-29.294-19.439-3.644 5.133-6.38 10.716-8.052 16.551-8.047-.758-16.358.309-24.409 3.334 6.825 19.22 9.759 34.5 6.549 35.758-3.13 1.242-11.057-11.192-18.959-29.102-4.661 3.334-8.765 7.249-12.107 11.714a54.78 54.78 0 00-20.305-7.193c-.714 20.27-3.591 35.441-7.021 35.441-3.444 0-6.328-15.248-7.025-35.61-6.209.738-12.099 2.533-17.506 5.154-4.861-5.49-10.906-10.043-17.923-13.316-8.833 18.65-17.679 31.723-20.865 30.344-3.11-1.358.194-16.038 7.402-34.552-5.815-1.022-11.658-1.198-17.334-.385a54.648 54.648 0 00-8.908-18.875c-14.875 13.878-27.684 22.618-30.114 20.177-2.449-2.452 6.398-15.384 20.408-30.364-5.53-4.483-11.71-7.766-18.21-9.773.748-6.396.329-12.973-1.274-19.46-19.199 6.809-34.459 9.737-35.724 6.531-1.264-3.209 11.917-11.513 30.639-19.64a54.657 54.657 0 00-12.712-15.617c2.703-4.929 4.568-10.355 5.655-16.054-20.001-.741-34.909-3.595-34.909-6.997 0-3.458 15.32-6.348 35.748-7.041-.541-7.811-2.623-15.19-6.083-21.76 4.921-3.893 9.177-8.712 12.591-14.263-18.095-8.666-30.71-17.25-29.354-20.381 1.369-3.138 16.336.254 35.115 7.618 2.076-6.809 2.795-13.758 2.225-20.524 5.319-1.553 10.407-4.029 15.156-7.221-13.321-14.437-21.656-26.729-19.27-29.11 2.417-2.419 15.058 6.195 29.785 19.887 5.244-5.961 9.057-12.733 11.289-19.925a54.698 54.698 0 0020.33-1.445c-6.554-18.715-9.341-33.484-6.193-34.72 3.147-1.242 11.163 11.373 19.123 29.469 5.797-3.267 10.794-7.498 14.916-12.373 5.315 2.913 11.205 4.891 17.406 5.911.801-19.47 3.61-33.867 6.952-33.867 3.379 0 6.2 14.643 6.981 34.368 7.346-.673 14.29-2.729 20.498-6.009a54.848 54.848 0 0015.869 13.604c8.528-17.641 16.892-29.872 19.974-28.531 3.073 1.339-.116 15.663-7.121 33.813a54.512 54.512 0 0018.834 1.695c1.756 6.038 4.637 11.802 8.508 17.062 14.271-13.128 26.397-21.31 28.75-18.951 2.372 2.368-5.911 14.607-19.172 28.998 5.551 4.515 11.754 7.818 18.282 9.836a54.623 54.623 0 001.435 20.261c18.49-6.436 33.029-9.161 34.255-6.037 1.234 3.116-11.173 11.033-29.025 18.929a54.773 54.773 0 0011.068 13.826c-2.737 5.723-4.492 11.978-5.105 18.581 19.732.777 34.392 3.603 34.392 6.981-.04 3.354-14.438 6.163-33.902 6.961z"></path>
    <path d="M336.065 233.359c0-2.36.244-4.661.597-6.921.697-4.488 2-8.778 3.896-12.742a45.894 45.894 0 01-9.294-11.618 44.711 44.711 0 01-2.344-4.853c-1.13-2.729-1.871-5.508-2.44-8.303-.982-4.815-1.251-9.656-.689-14.375a45.506 45.506 0 01-14.827-7.842 45.067 45.067 0 01-3.939-3.477c-2.108-2.112-3.896-4.428-5.507-6.816-2.665-3.963-4.736-8.209-6.03-12.66-4.821.405-9.746 0-14.607-1.188-2.269-.549-4.536-1.216-6.761-2.144-2.16-.9-4.176-1.986-6.115-3.162-4.741-2.875-8.824-6.478-12.131-10.66a45.517 45.517 0 01-15.44 4.879c-1.907.246-3.847.38-5.826.38-2.777 0-5.477-.331-8.117-.81-4.916-.89-9.576-2.472-13.816-4.799-2.974 3.527-6.554 6.58-10.589 9.123-2.166 1.369-4.429 2.629-6.879 3.633a46.193 46.193 0 01-5.895 1.956 45.432 45.432 0 01-16.781 1.18 45.625 45.625 0 01-7.884 14.877c-1.066 1.341-2.188 2.645-3.431 3.883-2.128 2.126-4.444 3.909-6.847 5.534-3.955 2.661-8.187 4.719-12.623 6.015.411 4.833 0 9.774-1.192 14.657-.547 2.25-1.214 4.496-2.134 6.712-.912 2.18-2.01 4.224-3.204 6.175-2.865 4.703-6.46 8.778-10.624 12.066a45.524 45.524 0 015.272 21.268c0 2.89-.356 5.679-.868 8.416-.899 4.809-2.464 9.377-4.741 13.517 3.669 3.098 6.831 6.833 9.43 11.064 1.242 2.023 2.396 4.132 3.328 6.399.888 2.152 1.549 4.341 2.088 6.532 1.318 5.391 1.665 10.841 1.048 16.138 4.795 1.479 9.379 3.823 13.573 6.913 1.805 1.335 3.552 2.77 5.186 4.396 1.759 1.763 3.282 3.646 4.688 5.595 3.422 4.752 5.857 9.99 7.244 15.464 4.218-.604 8.542-.593 12.862.013 3.745.528 7.49 1.482 11.146 2.997.832.349 1.593.786 2.395 1.166 5.532 2.701 10.331 6.356 14.21 10.736 4.236-2.056 8.846-3.45 13.681-4.128 2.036-.28 4.098-.473 6.217-.473 2.703 0 5.312.305 7.873.766 5.55.981 10.771 2.897 15.44 5.674 2.697-3.59 5.963-6.764 9.682-9.478 2.874-2.1 5.987-3.955 9.43-5.365 1.05-.429 2.108-.737 3.166-1.091 6.127-2.007 12.403-2.721 18.498-2.144 1.402-4.921 3.703-9.614 6.793-13.938 1.442-2.016 3.006-3.979 4.825-5.795 1.578-1.595 3.277-2.978 5.021-4.264 3.747-2.785 7.795-4.97 12.059-6.473a45.591 45.591 0 011.611-14.61 44.527 44.527 0 011.791-5.258c1.122-2.701 2.553-5.154 4.096-7.498 3.042-4.593 6.761-8.572 11.053-11.722-2.99-4.953-5.042-10.52-5.987-16.463a40.474 40.474 0 01-.637-7.054z"></path>
  </symbol>` },
	{ "id": "5-point-star-rounded", "name": "rounded star", "pluralName": "rounded stars", "symbol": `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.867 55.867" id="5-point-star-rounded">
    <path d="M55.818 21.578a1.002 1.002 0 00-.808-.681l-18.09-2.629-8.09-16.392a.998.998 0 00-1.792 0l-8.091 16.393-18.09 2.629a1.002 1.002 0 00-.555 1.705l13.091 12.76-3.091 18.018c-.064.375.09.754.397.978a.992.992 0 001.053.076l16.182-8.506 16.18 8.506a1 1 0 001.451-1.054l-3.09-18.017 13.091-12.761c.272-.267.37-.664.252-1.025z"></path>
  </symbol>` },
	{ "id": "sun-points", "name": "pointed sun", "pluralName": "pointed suns", "symbol": `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612.001 612.001" id="sun-points">
    <path d="M306 149.341c-86.382 0-156.661 70.278-156.661 156.661 0 86.382 70.278 156.66 156.661 156.66s156.66-70.278 156.66-156.66c0-86.384-70.278-156.661-156.66-156.661zm-31.806-32.063h63.612c5.032 0 9.356-2.101 11.863-5.763 2.508-3.662 2.9-8.453 1.079-13.146L315.749 8.257C312.96 1.073 308.444.001 306 .001s-6.96 1.073-9.749 8.255l-35 90.114c-1.821 4.692-1.427 9.482 1.079 13.145 2.507 3.663 6.832 5.763 11.864 5.763zm63.612 377.445h-63.612c-5.032 0-9.357 2.102-11.863 5.764-2.506 3.663-2.9 8.453-1.079 13.145l34.999 90.114C299.04 610.928 303.556 612 306 612c2.444 0 6.96-1.072 9.749-8.254l34.999-90.115c1.821-4.69 1.429-9.48-1.079-13.144-2.507-3.662-6.831-5.764-11.863-5.764zM127.54 190.824c2.412 5.477 7.028 8.746 12.348 8.746 3.644 0 7.257-1.608 10.174-4.526l44.981-44.98c3.558-3.558 5.13-8.102 4.312-12.466-.819-4.362-3.928-8.028-8.532-10.056l-88.467-38.973c-2.233-.983-4.336-1.482-6.25-1.482-3.201 0-5.959 1.415-7.568 3.882-1.357 2.081-2.454 5.747.031 11.389l38.971 88.466zm356.92 230.354c-2.412-5.477-7.027-8.746-12.346-8.746-3.645 0-7.259 1.609-10.177 4.527l-44.981 44.98c-3.558 3.559-5.13 8.104-4.312 12.466.818 4.362 3.929 8.028 8.532 10.055l88.466 38.974c2.233.983 4.336 1.482 6.25 1.482 3.201 0 5.959-1.417 7.568-3.882 1.358-2.083 2.455-5.748-.03-11.389l-38.97-88.467zm-22.523-226.134c2.918 2.918 6.532 4.526 10.176 4.526 5.319 0 9.934-3.269 12.348-8.746l38.972-88.465c2.486-5.643 1.389-9.308.031-11.389-1.609-2.467-4.367-3.882-7.568-3.882-1.914 0-4.017.499-6.251 1.483l-88.466 38.97c-4.604 2.029-7.715 5.694-8.532 10.057-.818 4.363.754 8.908 4.312 12.466l44.978 44.98zM150.063 416.959c-2.918-2.918-6.532-4.527-10.177-4.527-5.319 0-9.934 3.269-12.346 8.746l-38.972 88.465c-2.486 5.643-1.389 9.308-.031 11.39 1.609 2.466 4.368 3.882 7.568 3.882 1.914 0 4.017-.499 6.251-1.484l88.466-38.972c4.604-2.028 7.715-5.694 8.532-10.056.818-4.362-.753-8.907-4.312-12.466l-44.979-44.978zm453.682-120.708l-90.111-34.996c-1.942-.755-3.896-1.137-5.806-1.137-7.593 0-13.104 5.921-13.104 14.078l.001 63.613c0 8.157 5.511 14.078 13.104 14.078 1.912 0 3.866-.382 5.806-1.136l90.112-34.999c7.182-2.79 8.254-7.306 8.254-9.751 0-2.443-1.075-6.961-8.256-9.75zm-499.572 55.635c7.594 0 13.106-5.921 13.106-14.078v-63.613c0-8.157-5.511-14.078-13.106-14.078-1.912 0-3.864.382-5.805 1.136L8.255 296.251C1.073 299.04 0 303.556 0 306.001c0 2.444 1.072 6.96 8.255 9.752l90.111 34.996c1.942.754 3.895 1.137 5.807 1.137z"></path>
  </symbol>` },
	{ "id": "sun-dash", "name": "dashed sun", "pluralName": "dashed suns", "symbol": `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="sun-dash">
    <path d="M256 432.3c-11.3 0-20.4 9.1-20.4 20.4v27.9c0 11.3 9.1 20.4 20.4 20.4s20.4-9.1 20.4-20.4v-27.9c0-11.3-9.1-20.4-20.4-20.4zm0-329.8c-84.6 0-153.5 68.8-153.5 153.5 0 84.6 68.8 153.5 153.5 153.5 84.6 0 153.5-68.8 153.5-153.5 0-84.6-68.9-153.5-153.5-153.5zm0 266.1c-62.1 0-112.6-50.5-112.6-112.6 0-62.1 50.5-112.6 112.6-112.6S368.6 193.9 368.6 256c0 62.1-50.5 112.6-112.6 112.6zm0-288.9c11.3 0 20.4-9.1 20.4-20.4V31.4c0-11.3-9.1-20.4-20.4-20.4s-20.4 9.1-20.4 20.4v27.9c0 11.3 9.1 20.4 20.4 20.4zm224.6 155.9h-27.9c-11.3 0-20.4 9.1-20.4 20.4 0 11.3 9.1 20.4 20.4 20.4h27.9c11.3 0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4zm-421.3 0H31.4c-11.3 0-20.4 9.1-20.4 20.4 0 11.3 9.1 20.4 20.4 20.4h27.9c11.3 0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4zm350.2-104.2l19.7-19.7c8-8 8-20.9 0-28.9s-20.9-8-28.9 0l-19.7 19.7c-8 8-8 20.9 0 28.9s20.9 7.9 28.9 0zm-307 249.2l-19.7 19.7c-8 8-8 20.9 0 28.9s20.9 8 28.9 0l19.7-19.7c8-8 8-20.9 0-28.9s-20.9-7.9-28.9 0zm307 0c-8-8-20.9-8-28.9 0s-8 20.9 0 28.9l19.7 19.7c8 8 20.9 8 28.9 0s8-20.9 0-28.9l-19.7-19.7zm-307-249.2c8 8 20.9 8 28.9 0s8-20.9 0-28.9l-19.7-19.7c-8-8-20.9-8-28.9 0s-8 20.9 0 28.9l19.7 19.7z"></path>
  </symbol>` },
	{ "id": "8-point-star", "name": "star of eight points", "pluralName": "stars of eight points", "symbol": `<symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 567.84 567.84" id="8-point-star">
    <path d="M88.769 482.337l125.364-33.592 68.754 119.09 66.392-114.998 131.857 35.334-34.109-127.287 120.812-69.748-115.791-66.852 36.375-135.769-130.173 34.884L287.01.005l-71.012 123.002L87.306 88.525l34.368 128.252L0 287.005l122.199 70.551-33.43 124.781z"></path>
  </symbol>` },
];

/* CODE */

/* UTILITY */

function randBelow( below ) {
	return( Math.floor(Math.random() * below));
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = randBelow(i + 1);
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function luminanceFromHex( hexColor ) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
	let a = [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ];
    a = a.map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getColor( colorDef ) {
	// colorDef may be empty or in the form "C0", "C1", etc.
	// if empty we return the present color and increment it
	if ( colorDef.indexOf("C") == 0 ) {
		return( palette[parseInt( colorDef.substring(1) )] );
	}
	else
		return( palette[color++] );
}

function colorName( color ) {
	return( ntc.name( color )[1] );
}

/* COORDINATE UTILITY */

// function lookupUnit( unit )
//
// Returns the flag unit as a number in the appropriate range, or the number.
// Units can be string constants, OR fractions of the FLAG_UNIT expressed as n/d.

function lookupUnit( unit ) {
	// check to see if it's a variable (in form $name)
	if ( unit.indexOf("$") != -1 )
		unit = variables.get( unit.toLowerCase() );

	let val = flagUnits.get( unit );
	if ( typeof(val) !== "undefined" )
		return( val );
	else {
		if ( unit.indexOf("/" ) != -1 ) {
			let fraction = unit.split("/");
			if ( fraction.length != 2 )
				console.log(`ERROR: Invalid fraction: "${unit}"`);
			return( ( parseInt(fraction[0]) * FLAG_UNIT ) / parseInt(fraction[1]) );
		}
		else
			return( parseFloat(unit) );
	}
}

// function coord( expression, scale )
//
// Parses two-part expressions of simple arithmetic using our flag design units.
// e.g. L-third, C+twelth, 48/2, etc.
//
// scale 			"X" or "Y"
//
// If an expression operand is sent with "H:" as a prefix, the coordinate will be calculated with yScale, not xScale.
// (This is useful for creating true squares.)
//
// Returns values in scaled units for this flag's ratio.

function coord( expression, scale ) {
	// if we're sent a number just return it (in the case of compassLine, units will have been pre-processed to numbers)
	if ( typeof expression === "number" )
		return( expression * ( scale == "X" ? xScale : yScale ) );

	let val = -1;
	let operator = expression.match(/[\+\-\*÷]/);
	if ( ! operator )
		val = ( expression.indexOf("H:") == 0 ? ( lookupUnit( expression.substring(2) ) * yScale ) : ( lookupUnit( expression ) * ( scale == "X" ? xScale : yScale ) ) );
	else {
		let lexemes = expression.split(/[\+\-\*÷]/);
		let op1 = ( lexemes[0].indexOf("H:") == 0 ? ( lookupUnit( lexemes[0].substring(2) ) * yScale ) : ( lookupUnit( lexemes[0] ) * ( scale == "X" ? xScale : yScale ) ) );
		let op2 = ( lexemes[1].indexOf("H:") == 0 ? ( lookupUnit( lexemes[1].substring(2) ) * yScale ) : ( lookupUnit( lexemes[1] ) * ( scale == "X" ? xScale : yScale ) ) );

		switch ( operator[0] ) {
			case "+":
				val = op1 + op2;
				break;
			case "-":
				val = op1 - op2;
				break;
			case "*":
				val = op1 * op2;
				break;
			case "÷":
				val = op1 / op2;
				break;
			default: 
				console.log(`ERROR: Unkown operator "${operator[0]}"`);
		}
	}
	
	return( val );
}

// function X() and Y()
//
// Return appropriately scaled x and y coordiantes for the SVG after parsing expressions and looking up units.

function X( expression ) {
	return( coord( expression, "X" ) );
}

function Y( expression ) {
	return( coord( expression, "Y" ) );
}

/* FLAG GENERATION */

// generateFlag (option )
//
// options
//   height			// the height of the SVG in pixels
//   ratio          // "W:L" -- ratio of flag hoist (height on pole is flag width) to fly (length of flag)
//   paletteIndex   // an index into our global flag color palette
//
// Note that patterns and overlays are stored in a FLAG_UNITxFLAG_UNIT grid and then translated into flag ratio and dimensions.


pub.generateFlag = function( options ) {
    const defaultFlagHeight = 4 * FLAG_UNIT;    // flag height in pixels for rendering
	const probCharges = 0.75;					// hard-coded probability of including a symbol

    color = 0;                              	// which color we're using in the palette

    // set flag height
    let flagHeight = options?.height !== undefined ? options.height : defaultFlagHeight;

    // set flag ratio
	let ratio = options?.ratio !== undefined ? options.ratio : pub.ratios[randBelow(pub.ratios.length)];
	let [rW, rL] = ratio.split(":");
    let flagWidth = flagHeight;                 // in vexillology width is the vertical height when flying (length of hoist side)
	let flagLength = ( flagWidth * rL ) / rW; 	// in vexillology length is the width from the flagpole (length of fly side)
	
	// set global scale variables
    xScale = flagLength / FLAG_UNIT;
    yScale = flagWidth / FLAG_UNIT;

	// clear the variables map
	variables.clear();

	// set flag color palette
	let paletteIndex = options?.palette !== undefined ? options.palette : randBelow(pub.palettes.length);
	palette = pub.palettes[paletteIndex].colors.slice();

    // shuffle color palette
    shuffleArray( palette );

	// set background index
	let flagIndex = 0;

	if ( options?.flag !== undefined ) {
		// background was specified; in this case we may end up with a color palette without enough colors
		// TODO: Pick a palette with enough colors if it wasn't specified... for now we'll add a black and white to short palettes
		flagIndex = options.flag;
	}
	else {
		// choose base style, making sure it doesn't need more colors than this palette has
		//   Note that we're requiring one more color if we're using a charge, though technically a
		//   charge could re-use a color in the palette, making this extra color unnecessary
		//   TO DO: Decide if we need that extra color?
		let colorCount = 0;
		do {
			flagIndex = randBelow(pub.flags.length);
			colorCount = pub.flags[flagIndex].colors;
		} while ( colorCount > palette.length );
	}

	let flag = pub.flags[flagIndex];

	// It's possible, if flag was set and random colors are chosen, or if flag and color palette were set,
	// that we don't have enough colors. Here's we'll add black and white until we have at least seven
	while ( palette.length < 7 ) {
		palette[palette.length] = "#000000";
		palette[palette.length] = "#FFFFFF";
	}

	// choose if we're going to include charges, but only choose if this flag supports them
	let chargeIndex = -1;
	let useCharge = flag.charges !== undefined ? ( Math.random() < probCharges ? true : false ) : false;

	let svgDefs = "";
	if ( useCharge ) {
		// add defs section with charge, using first (circle) if testing
		chargeIndex = flagForceCircleSymbol ? 0 : randBelow(flagSymbols.length);
		svgDefs += "<defs>" + flagSymbols[chargeIndex].symbol + "</defs>";
	}

    // prepare the field (the primary/background color of the flag)
    // let svgField = `<rect width="${flagLength.toString()}" height="${flagWidth.toString()}" fill="${palette[color++]}" />`;
    let svgField = "";

	// add a pattern from shape definition
	let svgOrdinaries = flag.shapes.split(";").map( key => addPattern( key.trim() ) ).join("");

	// add optional charge(s)
	let svgCharges = "";
	let chargeColorBase = "";			// the color (in form "C1", "C2", etc.) on which this charge is placed
	let chargeDescription = "";		// the readable description of the charge(s)
	if ( useCharge ) {
		// we do a charge some percent of the time
		// anchor: one or more items with anchor points, which are: x, y, max-width, max-height, followed by (an optional) color index of its background
		let chargePosition = flag.charges[randBelow(flag.charges.length)];
		let chargeScale = 0.8;

		// let's make sure we're getting a contrasting color for the charge
		// refer to https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o
		let chargeColor = palette[color];
		if ( chargePosition.bg !== undefined ) {
			// the color index of the background of the charge area is specified
			chargeColorBase = chargePosition.bg;
			let bgColors = chargePosition.bg.split(" ").map(x => parseInt(x.substring(1)));

			let bgLum = bgColors.map( x => luminanceFromHex(palette[x]) );

			// we're going to build an array of RGB versions of the colors
			// TO DO: This is a hacky way to do it just to get RGB values from color names, and we're doing it everytime when it could be in the
			//        static color palette information...
			let tempPalette = [];
			for ( let i = 0; i < palette.length; ++i ) {
				console.assert(palette[i].length == 7,`ERROR: Invalid hex color "${palette[i]}"`);
				tempPalette[i] = { "index": i, "color": palette[i], "lum": luminanceFromHex(palette[i]) };
			}

			// shuffle color palette
			shuffleArray( tempPalette );

			// We want the first color in this palette with a < 1/3 luminance ratio against our set of background colors,
			// but if none meets that criteria, we're going to use the lowest ratio found.
			let lowestRatioFound = 1;
			let lowestRatioIndex = 0;
			let i = 0;
			for ( ; i < tempPalette.length; ++i ) {
				// check for a big enough difference in luminance
				let thisLum = tempPalette[i].lum;
				let minRatio = 1;
				let maxRatio = 0;
				for ( let bgIndex = 0; bgIndex < bgColors.length; ++bgIndex ) {
					let ratio = bgLum[bgIndex] > thisLum ? ((thisLum + 0.05) / (bgLum[bgIndex] + 0.05)) : ((bgLum[bgIndex] + 0.05) / (thisLum + 0.05));
					if ( ratio > maxRatio )
						maxRatio = ratio;
					if ( ratio < minRatio )
						minRatio = ratio;
				}
				if ( maxRatio < 1/3 ) {
					chargeColor = tempPalette[i].color;
					break;
				}

				if ( minRatio < lowestRatioFound ) {
					lowestRatioFound = minRatio;
					lowestRatioIndex = i;
				}
			}
			if ( i == tempPalette.length ) {
				console.log("No contrasting color found.");
				chargeColor = tempPalette[lowestRatioIndex].color;
			}
		}

		let chargeCount = 0;
		let points = chargePosition.points.split(/[, ;]+/);
		// loop through multiple charge placements, if any
		for ( let i = 0; i < points.length; /* i incremented in loop */ ) {
			let x = X(points[i++]);
			let y = Y(points[i++]);
			let w = X(points[i++]);
			let h = Y(points[i++]);
			let chargeSize = Math.min(w, h) * chargeScale;
			svgCharges += `<use href="#${flagSymbols[chargeIndex].id}" x="${x - (chargeSize/2)}" y="${y - (chargeSize/2)}" width="${chargeSize}" height="${chargeSize}" fill="${chargeColor}" />`;
			++chargeCount;
		}
		++color;

		// prepare description of charge(s)
		if ( chargeCount > 0 ) {
			chargeDescription = ( chargeCount == 1 ? ( " a " + flagSymbols[chargeIndex].name ) : ( " " + flagOrdinalNumbers[chargeCount] + " " + flagSymbols[chargeIndex].pluralName ) ) + " " + colorName(chargeColor);
		}
	}

	// prepare the flag description
	let title = flag.name;

	if ( useCharge ) {
		// if we have a charge on a colored background, we will insert the charge description right after that color specifier
		// e.g. a chargeColorBase of C0 might turn "{C0}, a fess {C1}"" --> "{C0} a mullet vert, a fess {C1}""
		if ( chargeColorBase.indexOf(" " ) > 01 ) {
			// if there's a space in the chargeColorBase ("C0 C1") that means the charge is on multiple colors, so we'll add the description at the end following a comma
			title += `, ${chargeDescription}`;
		}
		else
			title = title.replace(`{${chargeColorBase}}`,`{${chargeColorBase}}${chargeDescription}`);
	}

	for ( let i = 0; i < flag.colors; ++i ) {
		title = title.replace(`{C${i}}`,colorName(palette[i]));
	}

	// assemble the svg description of the flag
    let svg = flagSVGStart;
    svg = svg.replace(/\{width\}/g,flagLength.toString()).replace(/\{height\}/g,flagWidth.toString());

	svg += svgDefs;
	svg += `<title>${title} - ${pub.palettes[paletteIndex].name} Colors</title>`;

	svg += svgField;
	svg += svgOrdinaries;
	svg += svgCharges;

    // close svg string and return
    svg += flagSVGEnd;

    return( { "index": flagIndex, "description": title, "notes": pub.flags[flagIndex].notes, "svg": svg } );
}


// pattern helper function
//
// take parameters in unscaled units and return svg strings
// TODO: Intersect polygons against the field?

// field pattern helpers (these always use primitives to make the svg)

function field( fill ) {
	return( rect("L","T","whole","whole",fill) );
}

function quarterly( colors ) {
	let pattern = "";

	let colorIndex = 0;
	pattern += rect( "L", "T", "half", "half", colors[colorIndex] );
	if ( ++colorIndex == colors.length )
		colorIndex = 0;
	pattern += rect( "C", "T", "half", "half", colors[colorIndex] );
	if ( ++colorIndex == colors.length )
		colorIndex = 0;
	pattern += rect( "C", "M", "half", "half", colors[colorIndex] );
	if ( ++colorIndex == colors.length )
		colorIndex = 0;
	pattern += rect( "L", "M", "half", "half", colors[colorIndex] );

	return( pattern );
}

function perbend( fillA, fillB ) {
	return( polygon( ["L","T", "R","T", "R","B"], fillA) + polygon( ["L","T", "R","B", "L","B"], fillB) );
}

function perbendsinister( fillA, fillB ) {
	return( polygon( ["L","T", "R","T", "L","B"], fillA) + polygon( ["R","T", "R","B", "L","B"], fillB) );
}

function persaltire( colors ) {
	let pattern = "";

	let colorIndex = 0;
	pattern += polygon( ["L","T", "R","T", "C","M"], colors[colorIndex] );
	if ( ++colorIndex == colors.length )
		colorIndex = 0;
	pattern += polygon( ["R","T", "R","B", "C","M"], colors[colorIndex] );
	if ( ++colorIndex == colors.length )
		colorIndex = 0;
	pattern += polygon( ["C","M", "R","B", "L","B"], colors[colorIndex] );
	if ( ++colorIndex == colors.length )
		colorIndex = 0;
	pattern += polygon( ["L","T", "C","M", "L","B"], colors[colorIndex] );

	return( pattern );
}

function perchevron( fillA, fillB ) {
	return( polygon( ["L","T", "L","5/8", "C","M-1/8", "R","5/8", "R","T"], fillA) + polygon( ["L","B", "L","5/8", "C","M-1/8", "R","5/8", "R","B"], fillB) );
}

function barry( rows, colors ) {
	let pattern = "";
	let top = 0;
	rows = parseInt( rows );

	let colorIndex = 0;
	for ( let i = 0; i < rows; ++i ) {
		pattern += rect( "L", `${top}/${rows}`, "whole", `1/${rows}`, colors[colorIndex] );
		++top;
		if ( ++colorIndex == colors.length )
			colorIndex = 0;
	}

	return( pattern );
}

function fesses( fessPattern, colors ) {
	let pattern = "";
	let units = fessPattern.split("-").map( x => parseInt(x) );
	let top = 0;
	let denominator = units.reduce((a, b) => a + b, 0);		// sum

	let colorIndex = 0;
	for ( unit of units ) {
		pattern += rect( "L", `${top}/${denominator}`, "whole", `${unit}/${denominator}`, colors[colorIndex] );
		top += unit;
		if ( ++colorIndex == colors.length )
			colorIndex = 0;
	}

	return( pattern );
}

function pales( fessPattern, colors ) {
	let pattern = "";
	let units = fessPattern.split("-");
	let left = 0;
	units = units.map( x => parseInt(x) );
	let denominator = units.reduce((a, b) => a + b, 0);

	let colorIndex = 0;
	for ( let i = 0; i < units.length; ++i ) {
		pattern += rect( `${left}/${denominator}`, "T", `${units[i]}/${denominator}`, "whole", colors[colorIndex] );
		left += units[i];
		if ( ++colorIndex == colors.length )
			colorIndex = 0;
	}

	return( pattern );
}

// common pattern helpers (that use primitives to generate svg)

function cross( width, fill ) {
	let hw = lookupUnit(width) / 2;		// half width
	let points = [ `L`,`M-${hw}`, `C-H:${hw}`,`M-${hw}`, `C-H:${hw}`,`T`, `C+H:${hw}`,`T`, `C+H:${hw}`,`M-${hw}`, `R`,`M-${hw}`, `R`,`M+${hw}`, `C+H:${hw}`,`M+${hw}`, `C+H:${hw}`,`B`, `C-H:${hw}`,`B`, `C-H:${hw}`,`M+${hw}`, `L`,`M+${hw}` ];
	return( polygon(points, fill) );
}

function nordic( width, fill ) {
	let hw = lookupUnit(width) / 2;		// half width
	let points = [ `L`,`M-${hw}`, `H:C-H:${hw}`,`M-${hw}`, `H:C-H:${hw}`,`T`, `H:C+H:${hw}`,`T`, `H:C+H:${hw}`,`M-${hw}`, `R`,`M-${hw}`, `R`,`M+${hw}`, `H:C+H:${hw}`,`M+${hw}`, `H:C+H:${hw}`,`B`, `H:C-H:${hw}`,`B`, `H:C-H:${hw}`,`M+${hw}`, `L`,`M+${hw}` ];
	return( polygon(points, fill) );
}

function saltire( width, fill ) {
	let hw = lookupUnit(width) / 2;		// half width
	let bend 			= [ `L`,`T`, `L+${hw}`,`T`, `R`,`B-${hw}`, `R`,`B`, `R-${hw}`,`B`, `L`,`T+${hw}` ];
	let bendSinister 	= [ `L`,`B`, `L+${hw}`,`B`, `R`,`T+${hw}`, `R`,`T`, `R-${hw}`,`T`, `L`,`B-${hw}` ];
	return( polygon(bend, fill) + polygon(bendSinister, fill) );
}

function scottish( width, fill ) {
	let hw = lookupUnit(width) / 2;		// half width
	let bend 			= [ `L`,`T`, `L+H:${hw}`,`T`, `R`,`B-${hw}`, `R`,`B`, `R-H:${hw}`,`B`, `L`,`T+${hw}` ];
	let bendSinister 	= [ `L`,`B`, `L+H:${hw}`,`B`, `R`,`T+${hw}`, `R`,`T`, `R-H:${hw}`,`T`, `L`,`B-${hw}` ];
	return( polygon(bend, fill) + polygon(bendSinister, fill) );
}

function chevron( width, fill ) {
	let hw = lookupUnit(width) / 2;		// half width
	console.assert( lookupUnit(width) <= lookupUnit("half"), `ERROR: "${width}" is too large for a chevron.` );
	let points = [ `L`,`3/4-${hw}`, `C`,`M-${hw}`, `R`,`3/4-${hw}`, `R`,`3/4+${hw}`, `C`,`M+${hw}`, `L`,`3/4+${hw}` ];
	return( polygon(points, fill) );
}

function chevrons( count, width, issue, fill ) {
	let pattern = "";
	count = parseInt( count );
	let unitWidth = lookupUnit(width);
	let hw = unitWidth / 2;		// half width

	let fullWidth = ( count * unitWidth ) + ( (count-1) * unitWidth );		// fullWidth is width of each chevron plus a chevron width between each of them
	
	console.assert( fullWidth <= lookupUnit("half"), `ERROR: "${fullWidth}" is too large for ${count} chevrons.` );	// fix for counts!
	
	while ( fullWidth > lookupUnit("half") ) {
		// shrink unitWidth until it fits, just to reduce accidental errors (though assert will have already fired)
		unitWidth -= 2;			// because we use halfWidth
		hw = unitWidth / 2;
		fullWidth = ( count * unitWidth ) + ( (count-1) * unitWidth );
	}

	let side = lookupUnit( ( issue == "base" || issue == "sinister" ) ? "3/4" : "1/4" ) - ( fullWidth / 2 ) + hw;
	let peak = lookupUnit("1/2") - ( fullWidth / 2 ) + hw;
	for ( let x = 0; x < count; ++x ) {
		let points = ( issue == "base" || issue == "chief" ) ? 
							[ `L`,`${side-hw}`, `C`,`${peak-hw}`, `R`,`${side-hw}`, `R`,`${side+hw}`, `C`,`${peak+hw}`, `L`,`${side+hw}` ] :
							[ `${side-hw}`,`T`, `${peak-hw}`,`M`, `${side-hw}`,`B`, `${side+hw}`,`B`, `${peak+hw}`,`M`, `${side+hw}`,`T` ];
		pattern += polygon(points, fill);
		side += unitWidth * 2;
		peak += unitWidth * 2;
	}

	return( pattern );
}

// primitive pattern helpers (these generate actual svg)

function rect( x, y, width, height, fill ) {
	x = X(x);
	y = Y(y);
	width = X(width);
	height = Y(height);
	fill = getColor( fill );
	return( `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" />` );
}

function circle( cx, cy, r, fill ) {
	cx = X(cx);
	cy = Y(cy);
	r = Y(r);
	fill = getColor( fill );
	return( `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />` );
}

function line( x1, y1, x2, y2, strokeWidth, stroke ) {
	x1 = X(x1);
	y1 = Y(y1);
	x2 = X(x2);
	y2 = Y(y2);
	strokeWidth = Y(strokeWidth);		// Note that we use the Y dimension for width in all cases!
	stroke = getColor( stroke );
	return( `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${strokeWidth}" stroke="${stroke}" />` );
}

function polygon( points, fill ) {
	let pattern = `<polygon points="`;
	for ( let i = 0; i < points.length; /* incremented inside */ ) {
		x = X(points[i++]);
		y = Y(points[i++]);
		pattern += `${x},${y} `;
	}
	// if there's an odd number of data points, we have a color specified
	if ( fill != "" ) {
		fill = getColor( fill );
		pattern += `" fill="${fill}" />`;
	}
	else
		pattern += `"/>`;

	return( pattern );
}


// compass pont data for drawing compassLIne

const compassData = new Map( [
	[ "n", {"x": "C", "y": "T", "adjustX": "split", "adjustY": ""} ],
	[ "nbe", {"x": "C", "y": "T", "adjustX": "add", "adjustY": ""} ],
	[ "nne", {"x": "6/8", "y": "T", "adjustX": "split", "adjustY": ""} ],
	[ "nebn", {"x": "R", "y": "T", "adjustX": "subtract", "adjustY": ""} ],
	[ "ne", {"x": "R", "y": "T", "adjustX": "corner", "adjustY": "corner"} ],
	[ "nebe", {"x": "R", "y": "T", "adjustX": "", "adjustY": "add"} ],
	[ "ene", {"x": "R", "y": "2/8", "adjustX": "", "adjustY": "split"} ],
	[ "ebn", {"x": "R", "y": "M", "adjustX": "", "adjustY": "subtract"} ],
	[ "e", {"x": "R", "y": "M", "adjustX": "", "adjustY": "split"} ],
	[ "ebs", {"x": "R", "y": "M", "adjustX": "", "adjustY": "add"} ],
	[ "ese", {"x": "R", "y": "6/8", "adjustX": "", "adjustY": "split"} ],
	[ "sebe", {"x": "R", "y": "B", "adjustX": "", "adjustY": "subtract"} ],
	[ "se", {"x": "R", "y": "B", "adjustX": "corner", "adjustY": "corner"} ],
	[ "sebs", {"x": "R", "y": "B", "adjustX": "subtract", "adjustY": ""} ],
	[ "sse", {"x": "6/8", "y": "B", "adjustX": "split", "adjustY": ""} ],
	[ "sbe", {"x": "C", "y": "B", "adjustX": "add", "adjustY": ""} ],
	[ "s", {"x": "C", "y": "B", "adjustX": "split", "adjustY": ""} ],
	[ "sbw", {"x": "C", "y": "B", "adjustX": "subtract", "adjustY": ""} ],
	[ "ssw", {"x": "2/8", "y": "B", "adjustX": "split", "adjustY": ""} ],
	[ "swbs", {"x": "L", "y": "B", "adjustX": "add", "adjustY": ""} ],
	[ "sw", {"x": "L", "y": "B", "adjustX": "corner", "adjustY": "corner"} ],
	[ "swbw", {"x": "L", "y": "B", "adjustX": "", "adjustY": "subtract"} ],
	[ "wsw", {"x": "L", "y": "6/8", "adjustX": "", "adjustY": "split"} ],
	[ "wbs", {"x": "L", "y": "M", "adjustX": "", "adjustY": "add"} ],
	[ "w", {"x": "L", "y": "M", "adjustX": "", "adjustY": "split"} ],
	[ "wbn", {"x": "L", "y": "M", "adjustX": "", "adjustY": "subtract"} ],
	[ "wnw", {"x": "L", "y": "2/8", "adjustX": "", "adjustY": "split"} ],
	[ "nwbw", {"x": "L", "y": "T", "adjustX": "", "adjustY": "add"} ],
	[ "nw", {"x": "L", "y": "T", "adjustX": "corner", "adjustY": "corner"} ],
	[ "nwbn", {"x": "L", "y": "T", "adjustX": "add", "adjustY": ""} ],
	[ "nnw", {"x": "2/8", "y": "T", "adjustX": "split", "adjustY": ""} ],
	[ "nbw", {"x": "C", "y": "T", "adjustX": "subtract", "adjustY": ""} ],
		
] );


// function compassLine( shape )
//
// This function does its own parsing of bends and other lines.
// This function works in abstract flag units and generates polygon() shapes,
// returning one or more rendered polygons.
//
// In general it is assumed that compassLines are specified from left to right (dexter to sinister); NW and SE corners should always be origins, not destinations.
//
// compassLine(origin, dest, width, colors)
//   origin		compass point (32 point compass rose, eg. https://en.wikipedia.org/wiki/Points_of_the_compass#/media/File:Brosen_windrose_Full.svg)
//   dest		compass point
//   width		in a fraction of the flag hoist length (visual height), e.g. 1/4 or 1/6; width of primary line without fimbriation or cotise
//   style		name of the style [fimbriated|cotised]
//   colors		a space separate array of colors e.g. "C1 C2 C3"
//              if fimbriated or cotised, the last color is used; earlier colors cause the line to be split into two or three stripes
//
// TODO: This is all messed up... need some trig to get lines right... and need to know slope

function compassLine( shape ) {
	let data = shape.split(/[,;()]+/);		// not splitting on spaces because colors do
	let origin = data[1].trim();
	let dest = data[2].trim();
	let width = data[3].trim();
	let style = data[4].trim();

	// get an array of all the colors
	let colors = data[5].trim().split(" ");
	let colorCount = colors.length;

	// convert width to FLAG_UNITs
	let [ numerator, denominator ] = width.split("/").map( x => parseInt(x) );
	console.assert( FLAG_UNIT % denominator == 0, `ERROR: "${denominator} not a divisor of ${FLAG_UNIT}.` );
	numerator *= ( FLAG_UNIT / denominator );
	width = numerator;

	// check for styles and adjust clor count appropriately
	let fimWidth = 0;			// width of fimbriation (on each side!)
	let fimColor = "";
	let cotWidth = 0;			// width of each cotise
	let cotSpace = 0;			// width of space between primary line and cotise (equal to cotise width)
	let cotColor = "";
	if ( style == "fimbriated" ) {
		fimWidth = lookupUnit("sixteenth");
		console.assert( colorCount >= 2, `ERROR: Color count short for style.` );
		fimColor = color.pop();
		--colorCount;
	}
	else if ( style == "cotised" ) {
		cotWidth = lookupUnit("sixteenth");
		cotSpace = cotWidth;
		console.assert( colorCount >= 2, `ERROR: Color count short for style.` );
		cotColor = color.pop();
		--colorCount;
	}

	// set the margin that the primary line will need on each side for fimbriation and cotising
	// note that only one can happen at a time for now, but we'll allowing for both in the future
	let margin = fimWidth + cotWidth + cotSpace;

	let perLineWidth = width / colorCount;
	console.assert( perLineWidth - Math.round( perLineWidth ) == 0, `ERROR: width ${width} not evenly divisible by colorCount ${colorCount}` );

// TODO: New strategy; identify which of the ten bend types this is and assemble shapes appropriately.

	let lineEnds = [ compassData.get( origin.toLowerCase() ), compassData.get( dest.toLowerCase() ) ];

	// get the combined shape as polygon points
	let points = compassLineGetPoints( lineEnds, width );

	// prepare the multiple polygons
	let pattern = "";

	// fimbriation
	if ( fimWidth ) {
		// create fimbriation polygon first
	}

	// primary
	pattern += polygon( points, colors[0] );

	// cotises

	return( pattern );
}

function sortPointsClockwise( points ) {
	// Get the center (mean value) using reduce
	// https://stackoverflow.com/questions/54719326/sorting-points-in-a-clockwise-direction
	const center = points.reduce((acc, { x, y }) => {
		acc.x += x / points.length;
		acc.y += y / points.length;
		return acc;
	}, { x: 0, y: 0 });
	
	// Add an angle property to each point using tan(angle) = y/x
	const angles = points.map(({ x, y }) => {
		return { x, y, angle: Math.atan2(y - center.y, x - center.x) * 180 / Math.PI };
	});
	
	// Sort your points by angle
	return( angles.sort((a, b) => a.angle - b.angle) );
}

function compassLineGetPoints( lineEnds, width ) {
	let points = [];
	let ptA = { x: 0, y: 0 };
	let ptB = { x: 0, y: 0 };
	let ptC = { x: 0, y: 0 };
	let hasCorner = false;

	let ptsP = [];
	let pIndex = 0;

	for ( let i = 0; i < 2; ++i ) {
		hasCorner = false;

		switch ( lineEnds[i].adjustX ) {
			case "split":
				ptA.x = lookupUnit(lineEnds[i].x) - ( width / 2 );
				ptB.x = lookupUnit(lineEnds[i].x) + ( width / 2 );
				break;
			case "add":
				ptA.x = lookupUnit(lineEnds[i].x);
				ptB.x = lookupUnit(lineEnds[i].x) + ( width );
				break;
			case "subtract":
				ptA.x = lookupUnit(lineEnds[i].x) - ( width );
				ptB.x = lookupUnit(lineEnds[i].x);
				break;
			case "corner":
				hasCorner = true;
				if ( lookupUnit(lineEnds[i].x) == lookupUnit("L") ) {
					ptA.x = lookupUnit(lineEnds[i].x);
					ptC.x = lookupUnit(lineEnds[i].x);	// zero
					ptB.x = lookupUnit(lineEnds[i].x) + ( width / 2 );
				}
				else {
					console.assert( lookupUnit(lineEnds[i].x) == lookupUnit("R"), `ERROR: Weird corner.` );
					ptA.x = lookupUnit(lineEnds[i].x) - ( width / 2 );;
					ptC.x = lookupUnit(lineEnds[i].x);
					ptB.x = lookupUnit(lineEnds[i].x);
				}
				break;
			default:
				ptA.x = lookupUnit(lineEnds[i].x);
				ptB.x = lookupUnit(lineEnds[i].x);
				break;
		}
		switch ( lineEnds[i].adjustY ) {
			case "split":
				ptA.y = lookupUnit(lineEnds[i].y) - ( width / 2 );
				ptB.y = lookupUnit(lineEnds[i].y) + ( width / 2 );
				break;
			case "add":
				ptA.y = lookupUnit(lineEnds[i].y);
				ptB.y = lookupUnit(lineEnds[i].y) + ( width );
				break;
			case "subtract":
				ptA.y = lookupUnit(lineEnds[i].y) - ( width );
				ptB.y = lookupUnit(lineEnds[i].y);
				break;
			case "corner":
				// already set from 'x' if true -- must be set for both x and y if true
				if ( lookupUnit(lineEnds[i].y) == lookupUnit("T") ) {
					ptA.y = lookupUnit(lineEnds[i].y) + ( width / 2 );
					ptC.y = lookupUnit(lineEnds[i].y);	// zero
					ptB.y = lookupUnit(lineEnds[i].y);
				}
				else {
					console.assert( lookupUnit(lineEnds[i].y) == lookupUnit("B"), `ERROR: Weird corner.` );
					ptA.y = lookupUnit(lineEnds[i].y);
					ptC.y = lookupUnit(lineEnds[i].y);
					ptB.y = lookupUnit(lineEnds[i].y) - ( width / 2 );
				}
				break;
			default:
				ptA.y = lookupUnit(lineEnds[i].y);
				ptB.y = lookupUnit(lineEnds[i].y);
				break;
		}

		// add to points array
		points.push( {...ptA} );
		if ( hasCorner )
			points.push( {...ptC} );
		points.push( {...ptB} );
	}

	// sort the array of points clockwise
	let sortedPoints = sortPointsClockwise( points );

	for ( const point of sortedPoints ) {
		ptsP[pIndex++] = point.x;
		ptsP[pIndex++] = point.y;
	}

	return( ptsP );
}


// function addPattern( shape )
//   shape: <type> <values>[;<color>]
//
// Returns svg for the shape described in the string.

function addPattern( shape ) {
	// check to see if a variable is set
	if ( shape.indexOf("=") >= 0 ) {
		let [ variable, value ] = shape.split("=");
		console.assert( variable.indexOf("$") == 0, `ERROR: Invalid variable name "${variables}"`);
		variables.set( variable.trim().toLowerCase(), value.trim() );
		return( "" );
	}

	let pattern = "";	

	let data = shape.split(/[ ,;()]+/);

	let i = 0;
	let x, y = 0;
	let x1, y1, x2, y2, strokeWidth = 0;
	let fill, stroke = "";

	// NOTE: This code is written to handle the color being missing, but in practice no definition does that, and it hasn't been well tested.

    switch ( data[0] ) {
		// fields
		case "field":
			console.assert( data.length == 2, `Parameter count in "${shape}"` );
			pattern += field( data[1] );
			break;

		case "quarterly":
			console.assert( data.length >= 2, `Parameter count in "${shape}"` );
			pattern += quarterly( data.slice( 1 ) );
			break;

		case "perbend":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += perbend( data[1], data[2] );
			break;

		case "perbendsinister":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += perbendsinister( data[1], data[2] );
			break;

		case "persaltire":
			console.assert( data.length >= 2, `Parameter count in "${shape}"` );
			pattern += persaltire( data.slice( 1 ) );
			break;

		case "perchevron":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += perchevron( data[1], data[2] );
			break;
	
		case "stripes":
		case "barry":
			console.assert( data.length >= 3, `Parameter count in "${shape}"` );
			pattern += barry( data[1], data.slice( 2 ) );
			break;

		case "fesses":
			console.assert( data.length >= 3, `Parameter count in "${shape}"` );
			pattern += fesses( data[1], data.slice( 2 ) );
			break;

		case "pales":
			console.assert( data.length >= 3, `Parameter count in "${shape}"` );
			pattern += pales( data[1], data.slice( 2 ) );
			break;

		// common patterns
		case "cross":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += cross( data[1], data[2] );
			break;

		case "nordic":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += nordic( data[1], data[2] );
			break;

		case "saltire":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += saltire( data[1], data[2] );
			break;

		case "scottish":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += scottish( data[1], data[2] );
			break;

		case "chevron":
			console.assert( data.length == 3, `Parameter count in "${shape}"` );
			pattern += chevron( data[1], data[2] );
			break;

		case "chevrons":
			console.assert( data.length == 5, `Parameter count in "${shape}"` );
			pattern += chevrons( data[1], data[2], data[3], data[4] );
			break;

		// primitives
		case "rect":
			console.assert( data.length >= 5, `Parameter count in "${shape}"` );
			pattern += rect( data[1], data[2], data[3], data[4], data.length > 5 ? data[5] : "" );
			break;

		case "circle":
			console.assert( data.length >= 4, `Parameter count in "${shape}"` );
			pattern += circle( data[1], data[2], data[3], data.length > 4 ? data[4] : "" );
			break;

		case "line":
			console.assert( data.length >= 6, `Parameter count in "${shape}"` );
			pattern += line( data[1], data[2], data[3], data[4], data[5], data.length > 6 ? data[6] : "" );
			break;

		case "compassLine":
			console.assert( data.length == 6, `Parameter count in "${shape}"` );
			pattern += compassLine( shape );
			break;

		case "polyline":
			console.assert( data.length >= 3, `Parameter count in "${shape}"` );
			i = 1;
			pattern += `<polyline points="`;
			while ( i < data.length - 2 ) {
				x = X(data[i++]);
				y = Y(data[i++]);
				pattern += `${x},${y} `;
			}
			strokeWidth = Y(data[i++]);		// Note that we use the Y dimension for width in all cases!
			pattern += `" stroke-width="${strokeWidth}"`;
			// if there's an odd number of data points, we have a color specified
			if ( i == data.length - 1 ) {
				stroke = getColor( data[i] );
				pattern += ` stroke="${stroke}" />`;
			}
			else
				pattern += `/>`;
			break;

		case "polygon":
			console.assert( data.length >= 2, `Parameter count in "${shape}"` );
			fill = "";
			let hasFill = ( data.length % 2 ) == 0;		// if data array, including word 'polygon' in data[0], is even in length, there's a fill at the end
			if ( hasFill )
				fill = data.pop();						// get last array element and remove it from the data array so only points remain
			pattern += polygon( data.slice(1), fill );
			break;
	
		case "path":
			console.assert( data.length >= 3, `Parameter count in "${shape}"` );
			i = 1;
			pattern += `<path d="`;
			while ( i < data.length - 1 ) {
				let command = data[i++];
				switch ( command ) {
					// two parameters
					case "M":
					case "m":
					case "L":
					case "l":
					case "T":
					case "t":
						x = X(data[i++]);
						y = Y(data[i++]);
						pattern += `${command} ${x},${y} `;
						break;
					// one parameter
					case "H":
					case "h":
						x = X(data[i++]);
						pattern += `${command} ${x} `;
						break;
					case "V":
					case "v":
						y = Y(data[i++]);
						pattern += `${command} ${y} `;
						break;
					// six parameters
					case "C":
					case "c":
						x1 = X(data[i++]);
						y1 = Y(data[i++]);
						x2 = X(data[i++]);
						y2 = Y(data[i++]);
						x = X(data[i++]);
						y = Y(data[i++]);
						pattern += `${command} ${x1},${y1},${x2},${y2},${x},${y} `;
						break;
					// four parameters
					case "S":
					case "s":
					case "Q":
					case "q":
						x2 = X(data[i++]);
						y2 = Y(data[i++]);
						x = X(data[i++]);
						y = Y(data[i++]);
						pattern += `${command} ${x2},${y2},${x},${y} `;
						break;
					// seven parameters
					case "A":
					case "a":
						let rx = X(data[i++]);
						let ry = Y(data[i++]);
						let angle = lookupUnit(data[i++]);			// no scale transformation
						let largeArcFlag = parseInt(data[i++]);		// 1 or 0
						let sweepFlag = parseInt(data[i++]);		// 1 or 0
						x = X(data[i++]);
						y = Y(data[i++]);
						pattern += `${command} ${rx},${ry},${angle},${largeArcFlag},${sweepFlag},${x},${y} `;
						break;
					// no parameters
					case "Z":
					case "z":
						pattern += `${command} `;
						break;
					default:
						console.log(`ERROR: Unknown path command "${command}"`);
						break;
				}
			}
			// if there's an extra data point, we have a color specified
			if ( i == data.length - 1 ) {
				fill = getColor( data[i] );
				pattern += `" fill="${fill}" />`;
			}
			else
				pattern += `"/>`;
			break;
		default:
			if ( data[0].length )
				console.log(`ERROR: Unknown shape "${data[0]}".`);
			break;
	}

	return( pattern );
}

// return object exposing public functions and properties
return pub;

}());


