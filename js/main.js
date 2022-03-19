//
// UX Code for Random Flag Generator
//
// Copyright 2021 Bob Pritchett.
//
// 06/16/21 RDP Starting on UX.
// 06/26/21 RDP Added dynamic sizing, modal, and saving.
//

const FLAG_COUNT = 300;

function loadOptionsUI( flags, ratios, palettes ) {
	var sel = document.getElementById("flag");
	var index = 0;
	for ( item in flags ) {
		var opt = document.createElement("option");
		opt.value = index;
		opt.innerHTML = flags[index].name;
		sel.appendChild(opt);
		index++;
	}

	var sel = document.getElementById("aspect");
	var index = 0;
	for ( item in ratios ) {
		var opt = document.createElement("option");
		opt.value = ratios[index];
		opt.innerHTML = ratios[index];
		sel.appendChild(opt);
		index++;
	}

	var sel = document.getElementById("palette");
	var index = 0;
	for ( item in palettes ) {
		var opt = document.createElement("option");
		opt.value = index;
		opt.innerHTML = palettes[index].name;
		sel.appendChild(opt);
		index++;
	}
}

function changeDisplayHeight() {
	let height = document.getElementById("displayHeight").value;
	document.getElementById("currentDH").innerHTML = height.toString();

	let aspect = document.getElementById("aspect");
	let ratio = 2;
	if ( aspect?.value != "random" ) {
		let [rW, rL] = aspect.value.split(":");
		ratio = rL / rW;
	}

	document.documentElement.style.setProperty("--flagDisplayHeight", height.toString() + "px");
	document.documentElement.style.setProperty("--flagDisplayWidth", ( height * ratio ).toString() + "px" );

}

function generateFlags( fg, dest ) {
	let flagCount = FLAG_COUNT;
	let allFlags = false;

	changeDisplayHeight();

	dest.innerHTML = "";
		
	// Generate flags
	var options = {};
	
	let flag = document.getElementById("flag");
	if ( flag?.value == "all" ) {
		allFlags = true;
		flagCount = fg.flags.length;
	}
	else if ( flag?.value != "random" )
		options.flag = flag.value;

	let aspect = document.getElementById("aspect");
	if ( aspect?.value != "random" )
		options.ratio = aspect.value;

	let palette = document.getElementById("palette");
	if ( palette?.value > 0 )
		options.palette = palette.value;

	// displayHeight will be the height of the presentation div; the flag SVG will be generated with height
	let height = parseInt( document.getElementById("height").value );
	if ( height > 0 )
		options.height = height;

	let displayHeight = parseInt( document.getElementById("displayHeight").value );
	
	for ( let x = 0; x < flagCount; ++x ) {
		// if we're generating all the flags, use this index
		if ( allFlags )
			options.flag = x;

		let flag = fg.generateFlag(options);
		let newElement = document.createElement("div");
		newElement.className = "flag";
		newElement.flagIndex = flag.index;
		newElement.flagDescription = flag.description;
		newElement.flagNotes = flag.notes;
		newElement.innerHTML = flag.svg;
		newElement.onclick = flagClicked;
		dest.insertAdjacentElement("beforeend", newElement);
	}
}

function regenerateFlags() {
	let fg = flagGenerator;

	generateFlags( fg, document.getElementById("flagOutput") );
}

function flagClicked( event ) {
	// NOTE: We are assuming the SVG is the entire content of this flag div.
	showModal( event.currentTarget.flagDescription, event.currentTarget.innerHTML, event.currentTarget.flagNotes );
}

function showModal( description, svg, notes ) {
	var modal = document.getElementById("modalFrame");

	document.getElementById("modalFlagLarge").innerHTML = svg;
	document.getElementById("modalFlagDescription").innerHTML = ( typeof(description) !== "undefined" ? description : "" ) + ( typeof(notes) !== "undefined" ? "<br/>" + parse(notes) : "");

	modal.style.visibility = "visible";
}

function hideModal() {
	document.getElementById("modalFrame").style.visibility = "hidden";
}

function downloadFlag() {
	let svgElem = document.getElementById("modalFlagLarge");

	var blob = new Blob([svgElem.innerHTML], {type: "image/svg+xml;charset=utf-8"});

	// remove invalid filename characters, though we shouldn't be generating them
	let filename = ("Flag " + svgElem.getElementsByTagName("title")[0].textContent + ".svg").replace(/[\<\>\:\"\/\\\|\?\*]/g,"BINGO");
    saveAs( blob, filename );
}

function waveFlag() {
	// NOTE: Waving often fails with SVG in the dataurl, though the same SVG loads from a file correctly.
	// TODO: Integrate directly.
	window.open("https://krikienoid.github.io/flagwaver/#?src=data%3Aimage%2Fsvg%2Bxml%3Butf8%2C" + encodeURIComponent(document.getElementById("modalFlagLarge").innerHTML), "_blank");
}