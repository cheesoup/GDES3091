class note_scale {
	constructor(scale_) {
		this.scale = scale_;
	}

	get_note(note_int, octave) {
		return this.scale[note_int] + "" + octave;
	}

	modal_shift() {
		this.scale.push(this.scale.shift());
	}
}

var step = -1;
Tone.Transport.bpm.value = 140;
Tone.Transport.start("+5", "0:0:0");

var vol = new Tone.Volume(-12);
var scale = new note_scale(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
var shifted = 0;

var bass = new Tone.MonoSynth({
 "oscillator" : {
		"type" : "square"
 },
 "envelope" : {
		"attack" : 0.005 ,
		"decay" : 1 ,
		"sustain" : 0.8 ,
		"release" : 1
	}
	,
	"filterEnvelope" : {
		"attack" : 0.06 ,
		"decay" : 0.2 ,
		"sustain" : 0.5 ,
		"release" : 5 ,
		"baseFrequency" : 200 ,
		"octaves" : 5 ,
		"exponent" : 2
	}
}).toMaster();
bass.volume.value = -10;
bass.toMaster();

var kick = new Tone.MembraneSynth( {
		"frequency" : 800 ,
		"envelope" : {
		"attack" : 0.001 ,
		"decay" : 1.4 ,
		"release" : 0.2
	},
		"harmonicity" : 5.1 ,
		"modulationIndex" : 32 ,
		"resonance" : 4000 ,
		"octaves" : 8
	}
).toMaster();

var feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toMaster();

var arp = new Tone.MonoSynth(6, Tone.Synth, {
  oscillator : {
		type : "square"
	}
}).connect(feedbackDelay);

var synth = new Tone.PolySynth().toMaster();

var hat = new Tone.MetalSynth({
	"harmonicity" : 12,
	"resonance" : 800,
	"modulationIndex" : 20,
	"envelope" : {
		"decay" : 0.4,
	},
	"volume" : -15
}).toMaster();

// clock

Tone.Transport.scheduleRepeat(function(time){
  step = (step + 1) % 16;
	/*
	if (step == 0){
		scale.modal_shift();
		shifted++;
		if (shifted > 3) {
			scale = new note_scale(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
			shifted = 0;
		}
		arp_seq.at("0", scale.get_note(0, 4));
		arp_seq.at("1", scale.get_note(3, 4));
		arp_seq.at("2", scale.get_note(4, 4));
		bass_seq.at("0", scale.get_note(0, 3));
		bass_seq.at("3", scale.get_note(0, 3));
	}
	*/
	Tone.Draw.schedule(function(){
		$('#beat_led' + step).css('background-color', '#FF0000');
		$('#beat_led' + step).css('border', '#FFF 3px solid');
	  for (var i = 0; i < 16; i++) {
	    if (i != step) {
	      $('#beat_led' + i).css('background-color', '#000');
				$('#beat_led' + i).css('border', 'none');
	    }
	  }
	}, time) //use AudioContext time of the event
}, "16n");

// notes

var arp_seq = new Tone.Sequence(function(time, note){
	arp.triggerAttackRelease(note, "32n");
//straight quater notes
}, [scale.get_note(0, 4), scale.get_note(3, 4), scale.get_note(4, 4)], "16n").start("0:0:0");

var bass_seq = new Tone.Sequence(function(time, note){
	bass.triggerAttackRelease(note, "64n");
}, [scale.get_note(0, 3), null, null, scale.get_note(0, 3), null , null, scale.get_note(0, 2), null], "8n").start("0:0:2");

//drums

Tone.Transport.scheduleRepeat(function(time){
	kick.triggerAttackRelease("C2", "4n");
}, "4n");

var hat_seq = new Tone.Sequence(function(time, freq){
	hat.frequency.setValueAtTime(freq, time, 1);
	hat.triggerAttack(time);
}, [440], "2n").start("0:0:2");
