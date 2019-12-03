
var the_scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B']; // scale to be played
var bpm = 130; // beats per minute
var volume = -30;

// start button
$("#start").click(function(){
	tone_setup(); // resume audio context & setup ToneJS stuff
	instrument_setup(); // setup audio nodes
	sequence_setup(); // setup sequences for playback
	$("#flow").css("visibility", "visible"); // show animation
	$("#start").css("visibility", "hidden"); // hide splash
	$("#info").css("visibility", "hidden"); // hide splash
});

$("#restart").click(function(){
	// reset to previous sequences
	bass_seq.at(0).at(0, notes.get_note(0, 2));
	bass_seq.at(0).at(1, 0);
	bass_seq.at(0).at(2, 0);
	bass_seq.at(0).at(3, 0);

	bass_seq.at(1).at(0, 0);
	bass_seq.at(1).at(1, notes.get_note(0, 2));
	bass_seq.at(1).at(2, 0);
	bass_seq.at(1).at(3, 0);

	bass_seq.at(2).at(0, 0);
	bass_seq.at(2).at(1, 0);
	bass_seq.at(2).at(2, 0);
	bass_seq.at(2).at(3, 0);

	bass_seq.at(3).at(0, notes.get_note(0, 3));
	bass_seq.at(3).at(1, 0);
	bass_seq.at(3).at(2, notes.get_note(3, 3));
	bass_seq.at(3).at(3, 0);

	arp_seq.at(0).at(0, notes.get_note(0, 4));
	arp_seq.at(0).at(1, notes.get_note(3, 4));
	arp_seq.at(0).at(2, notes.get_note(4, 4));

	Tone.Transport.position = "0:0:0"
	Tone.Transport.start();

	$("#flow").css("visibility", "visible"); // show animation
	$("#restart").css("visibility", "hidden"); // hide splash
});

// animation setup-up
function setup() {
	var cnv = createCanvas(800, 800, P2D);
	cnv.parent('flow'); // bind canvas to #flow
  stroke(255);
  frameRate(30);

	// setup for each visiualizer square and other elements related to them
	which_pad_vis[0] = 7;
	which_pad_vis[1] = 8;

	//constructor(x_, y_, c_, sc_, sw_, f_)
	note_visuals[0] = new note_visual(width/2, height/2, color('#2b2c28'), color('#7de2d1'), 3, 5); // cowbell
	note_visuals[1] = new note_visual(width/2, height/2, color('#7de2d1'), color('#2b2c28'), 0, 20); // snare
	note_visuals[2] = new note_visual(width/2, height/2, color('#2b2c28'), color('#7de2d1'), 1, 8); // kick
	note_visuals[3] = new note_visual(width/2, height/2, color('#7de2d1'), color('#2b2c28'), 0, 10); // hihat

	note_visuals[4] = new note_visual(width/4, height/2, color('#2b2c28'), color('#7de2d1'), 1, 5); // bass 1
	note_visuals[5] = new note_visual(width*3/4, height/2, color('#2b2c28'), color('#7de2d1'), 1, 5); // bass 2
	note_visuals[6] = new note_visual(width/2, height/4, color('#2b2c28'), color('#7de2d1'), 1, 5); // bass 3

	note_visuals[7] = new note_visual(width/4, height/4, color('#7de2d1'), color('#2b2c28'), 1, 2); // pad 1 1
	note_visuals[8] = new note_visual(width*3/4, height/4, color('#7de2d1'), color('#2b2c28'), 1, 2); // pad 2 1
	note_visuals[9] = new note_visual(width/4, height/4, color('#2b2c28'), color('#7de2d1'), 1, 1); // pad 1 2
	note_visuals[10] = new note_visual(width*3/4, height/4, color('#2b2c28'), color('#7de2d1'), 1, 1); // pad 2 2

	note_visuals[11] = new note_visual(width/4, height*3/4, color('#2b2c28'), color('#7de2d1'), 1, 20); // arp 1
	note_visuals[12] = new note_visual(width/2, height*3/4, color('#2b2c28'), color('#7de2d1'), 1, 20); // arp 2
	note_visuals[13] = new note_visual(width*3/4, height*3/4, color('#2b2c28'), color('#7de2d1'), 1, 20); // arp 3
}

// p5js animation loop
function draw() {
	clear();
	for (var i = 0; i < note_visuals.length; i++) note_visuals[i].update();
}

//////////////////////////
/// CLASS DECLORATIONS ///
//////////////////////////

// class for each p5js square within the animation
class note_visual {
	constructor(x_, y_, c_, sc_, sw_, f_) {
		this.x = x_;
		this.y = y_;
		this.c = c_;
		this.sc = sc_;
		this.sw = sw_;
		this.f = f_;
		this.size = 0;
		this.stroke_weight = 0;
	}
	update() { // to be called for visuals
		if (this.size > 0) this.size = this.size - this.f; // if size is larger than 0, reduce the size
		if (this.size < 0) this.size = 0; // if size is less than 0, reset value to 0
		if (this.stroke_weight > 0 && this.size <= 0) this.stroke_weight--; // if the square has a stroke but it's size is 0, reduce the stroke weight
		fill(this.c);
		strokeWeight(this.sw);
		stroke(this.sc);
		rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
	}
	bang(s) { // bang the square into a new size
		this.size = s;
		this.strokeWeight = this.sw_; // reset to original stroke weight
	}
}

// class to hold notes being used
class note_scale {
	constructor(scale_) {
		this.scale = scale_;
	}
	get_note(note_int, octave) {
		return this.scale[note_int] + "" + octave;
	}
}

/////////////////////////////
/// VARIABLE DECLORATIONS ///
/////////////////////////////

var notes = new note_scale(the_scale); // place scale within a new instance of the note_scale class
var note_visuals = new Array(); // array of square animations

// instruments & effects
var hp;
var comp;
var bass;
var pad;
var synth;
var sampler;

// synth loops
var bass_seq;
var which_pad_vis = new Array();
var pad_seq;
var arp_seq;

// drums loops
var cow_loop;
var snare_loop;
var kick_loop;
var hat_loop;

///////////////////////
/// SETUP FUNCTIONS ///
///////////////////////

// function for setting up ToneJS stuff
function tone_setup() {
	Tone.context.resume(); // resume audio context
	Tone.context.latencyHint = 0.08; // peak forward to reduce lag
	var vol = new Tone.Volume(volume); // set vol
	Tone.Transport.bpm.value = bpm; // set bpm
	Tone.Transport.start("+1", "0:0:0"); // start in 1 second
}

// Function for initializing instruments & audio processes
// Audio processing functions used are pre-made intrument/effect functions available
// with the toneJS library
function instrument_setup() {
	bass = new Tone.DuoSynth().toMaster();
	pad = new Tone.DuoSynth().toMaster();

	synth = new Tone.PolySynth(6, Tone.Synth, {
		"oscillator" : {
			"type" : "square"
		}
	}).toMaster();

  // Samples were purchased from Samples from Mars
	// https://samplesfrommars.com/
	sampler = new Tone.Sampler({
		"C3" : "Kick.wav",
		"E3" : "Snare.wav",
		"F#3": "CH.wav",
		"G3" : "Cowbell.wav",
	}).toMaster();

	// instrument volume control
	pad.volume.value = -10;
	synth.volume.value = -20;
	bass.volume.value = -5;
	sampler.volume.value = -5;
}

// Sequences for playback
// Code is more or less based on examples provided
// from the toneJS API documentation
// https://tonejs.github.io/docs/
function sequence_setup() {
	// Tone.Sequence allows for an array of values to passed into a function one at time
	// depending on the current beat. Once initialized, it automatically syncs to the master tranport
	// you
	bass_seq = new Tone.Sequence(function(time, note){ // bass loop
		bass.triggerAttackRelease(note, "8n");
		synth.triggerAttackRelease(note, "4n");
		if (note == "C2") {
			Tone.Draw.schedule(function(){
				note_visuals[4].bang(100);
			}, time)
		} else if (note == "C3") {
			Tone.Draw.schedule(function(){
				note_visuals[5].bang(100);
			}, time)
		} else if (note == "F3") {
			Tone.Draw.schedule(function(){
				note_visuals[6].bang(100);
			}, time)
		}
	},[
	[notes.get_note(0, 2), 	null, 								null, 								null],
	[null, 									notes.get_note(0, 2), null, 								null],
	[null, 									null, 								null, 								null],
	[notes.get_note(0, 3),	null,									notes.get_note(3, 3), null],
	],"4n").start("0:0:2").stop("64:0:0");

	pad_seq = new Tone.Sequence(function(time, note){ // pad loop
		pad.triggerAttackRelease(note, "1n");
		if (note == notes.get_note(0, 4)) {
			Tone.Draw.schedule(function(){
				if (which_pad_vis[0] == 9) {
					 which_pad_vis[0] = 7;
					 note_visuals[which_pad_vis[0]].bang(90);
				}
				else {
					which_pad_vis[0] = 9;
					note_visuals[which_pad_vis[0]].bang(120);
				}
			}, time)
		} else if (note == notes.get_note(3, 4)) {
			Tone.Draw.schedule(function(){
				if (which_pad_vis[1] == 10) {
					which_pad_vis[1] = 8;
					note_visuals[which_pad_vis[1]].bang(90);
				}
				else {
					which_pad_vis[1] = 10;
					note_visuals[which_pad_vis[1]].bang(120);
				}
			}, time)
		}
	},[
	[notes.get_note(0, 4)],
	[notes.get_note(0, 4)],
	[notes.get_note(3, 4)],
	[notes.get_note(3, 4)],
	],"1n").start("16:0:0").stop("48:0:0");

	arp_seq = new Tone.Sequence(function(time, note){ // arp loop
		synth.triggerAttackRelease(note, "16n");
		if (note == notes.get_note(0, 4)) note_visuals[11].bang(150);
		else if (note == notes.get_note(3, 4)) note_visuals[12].bang(150);
		else if (note == notes.get_note(4, 4)) note_visuals[13].bang(150);
	},[
	[notes.get_note(0, 4), notes.get_note(3, 4), notes.get_note(4, 4), null]
	],"4n").start("32:0:0").stop("56:0:0");

	// Tone.Loop is kind of like a lesser version of Tone.Sequence. It doesn't require a setup
	// a set of values to pass through a function.
	cow_loop = new Tone.Loop(function(time){ // cowbell loop
		sampler.triggerAttack("G3");
		Tone.Draw.schedule(function(){
			note_visuals[0].bang(250);
		}, time)
	}, "1n").start("20:0:3").stop("52:0:0");

	snare_loop = new Tone.Loop(function(time){ // snare loop
		sampler.triggerAttack("E3");
		Tone.Draw.schedule(function(){
			note_visuals[1].bang(200);
		}, time)
	}, "2n").start("12:1:0").stop("52:0:0");

	kick_loop = new Tone.Loop(function(time){	// kick loop
		sampler.triggerAttack("C3");
		Tone.Draw.schedule(function(){
			note_visuals[2].bang(150);
		}, time)
	}, "4n").start(0).stop("56:0:0");

	hat_loop = new Tone.Loop(function(time){	// hat loop
		sampler.triggerAttack("F#3");
		Tone.Draw.schedule(function(){
			note_visuals[3].bang(100);
		}, time)
	}, "4n").start("8:0:2").stop("64:0:0");

	// schedule a change in the sequences 48 bars in
	Tone.Transport.scheduleRepeat(function(time){
		bass_seq.at(0).at(0, 0);
		bass_seq.at(0).at(1, 0);
		bass_seq.at(0).at(2, 0);
		bass_seq.at(0).at(3, 0);

		bass_seq.at(1).at(0, 0);
		bass_seq.at(1).at(1, notes.get_note(0, 2));
		bass_seq.at(1).at(2, 0);
		bass_seq.at(1).at(3, 0);

		bass_seq.at(2).at(0, 0);
		bass_seq.at(2).at(1, 0);
		bass_seq.at(2).at(2, 0);
		bass_seq.at(2).at(3, 0);

		bass_seq.at(3).at(0, 0);
		bass_seq.at(3).at(1, 0);
		bass_seq.at(3).at(2, notes.get_note(3, 3));
		bass_seq.at(3).at(3, 0);

		arp_seq.at(0).at(0, 0);
		arp_seq.at(0).at(1, notes.get_note(3, 4));
		arp_seq.at(0).at(2, notes.get_note(4, 4));
	}, "16m", "48m");

	//trigger the callback when the Transport reaches the desired time
	Tone.Transport.schedule(function(time){
		Tone.Draw.schedule(function(){
			$("#flow").css("visibility", "hidden"); // hide splash
			$("#restart").css("visibility", "visible"); // hide splash
		}, time)
		Tone.Transport.stop();
	}, "65m");
}
