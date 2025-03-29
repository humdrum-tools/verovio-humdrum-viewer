

let VEROVIOOPTIONS = {% include vhv-scripts/options/verovio-options.json %};
let opts = VEROVIOOPTIONS.OPTION;
for (let i=0; i<opts.length; i++) {
	let name = opts[i].NAME;
	VEROVIOOPTIONS[name] = opts[i];
}
