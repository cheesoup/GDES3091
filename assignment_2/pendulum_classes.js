'use strict';

// array of pendulum class
var pause = false;
var pendulum = new Array();

// audio functions
var reverb; // reverb cuz reverb is nice
var beep; // synth for sound generation

// note values to be played
var note = new Array();
var octave = new Array();

 // default value of downward force
const gravity = 0.05;
const stem = 300;

// splash
$(document).ready(function(){
  $("#start").click(function(){
      setup();
      setInterval(loop, 10);
  });
});

// re-randomize positions
$('#reset').click(function() {
  for (var i = 0; i < pendulum.length; i++) {
    pendulum[i].mass = randInt(25, 25);
    pendulum[i].angle = posneg()*randInt(1.5, 0.05);
    pendulum[i].speed = 0;
  }
});

// pause script
$('#pause').click(function() {
  if (pause == false) {
    pause = true;
  } else if (pause == true) {
    pause = false;
  }
});

function setup() {
  $("#pendulums").css("visibility", "visible") // hide splash
  $("#start").css("visibility", "hidden") // show pendulums

  // initialize audio functions
  reverb = new Tone.Freeverb ( { // https://tonejs.github.io/docs/13.8.25/Freeverb
    roomSize: 0.5,
    dampening: 500
  }).toMaster();
  beep = new Tone.PolySynth(8, Tone.Synth, { // https://tonejs.github.io/docs/13.8.25/PolySynth
    oscillator : {
      type : "square"
    }
  }).connect(reverb);

  // initialize pendulum
  pendulum[0] = new Pendulum(randInt(25, 25), posneg()*randInt(1.5, 0.05), stem, gravity, "pendulum0", "B5");
  pendulum[1] = new Pendulum(randInt(25, 25), posneg()*randInt(1.5, 0.05), stem, gravity, "pendulum1", "C6");
  pendulum[2] = new Pendulum(randInt(25, 25), posneg()*randInt(1.5, 0.05), stem, gravity, "pendulum2", "E6");
  pendulum[3] = new Pendulum(randInt(25, 25), posneg()*randInt(1.5, 0.05), stem, gravity, "pendulum3", "G6");
}

// function for retriggering class functions in order
function loop() {
  if (pause == false) {
    for (var i = 0; i < pendulum.length; i++) {
      note[i] = document.getElementById("note" + i);
      octave[i] = document.getElementById("octave" + i);
      pendulum[i].update();
      pendulum[i].draw();
      pendulum[i].note = note[i].options[note[i].selectedIndex].value + octave[i].options[octave[i].selectedIndex].value;
    }
  }
}

// randomizes negative and positive
function posneg() {
  var randAr = new Array(-1, 1);
  return randAr[Math.round(Math.random())];
}

//random integer
function randInt(i, o) {
  return Math.floor(Math.random()*i) + o;
}

// pendulum class!!!!!!!!!
class Pendulum {
  constructor(m, a, s, g, i, n) {
    // initialize pendulum vars
    this.origin = new Array(200,0);
    this.point = new Array(0,0);
    this.speed = 0;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //svg container to draw pendulum
    this.svg.setAttribute ("width", "400");
    this.svg.setAttribute ("height", "400");

    // construct math vars
    this.mass = m;
    this.angle = a;
    this.stem = s;
    this.grav = g;
    this.id = i;
    this.note = n;
    if (this.angle > 0) this.middlepass = true;
    else if (this.angle <= 0) this.middlepass = false;
  }

  /*
  Math based on: https://www.youtube.com/watch?v=9iaEqGOh5WM

  Math Notes:
  stem = 300
  stem = sqrt(x^2 + y^2)
  sqrt(x^2 + y^2) = 300

  SOHCAHTOA

  sine(a) = x/stem
  x = sin(a)*stem
  cos(a) = adj/hyp
  cos(a) = y/stem
  y = cos(a)/stem


  NOTE: this is supposed to be a right angle triangle

        a
  stem  /| y
       / |
     c ‾‾ b
      x

  c = pendulum position
  */

  update() {
    // triangle/circle math
    var inertia = Math.sin(this.angle) * (gravity * -1);
    var acceleration = inertia/this.mass;
    this.speed += acceleration;
    this.angle += this.speed;

    // pendulum point update
    this.point[0] = Math.sin(this.angle) * this.stem + this.origin[0];
    this.point[1] = Math.cos(this.angle) * this.stem + this.origin[1];

    // check if pendulum point has crossed the 0 degrees (pendulum in center position)
    var lastpass = this.middlepass;
    if (this.angle > 0) this.middlepass = true;
    else if (this.angle <= 0) this.middlepass = false;

    // play sound if so
    if (lastpass != this.middlepass) {
      beep.triggerAttackRelease(this.note, "32n");
    }
  }

  // draw pendulum to svg
  // code based on the following example:
  // http://xahlee.info/js/js_scritping_svg_basics.html
  draw() {
    //clear last drawing if it exists
    while (this.svg.lastChild) {
        this.svg.removeChild(this.svg.lastChild);
    }

    //circle draw
    const cir = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    cir.setAttribute("cx", this.point[0]);
    cir.setAttribute("cy", this.point[1]);
    cir.setAttribute("r", this.mass);
    cir.setAttribute("fill", "white");
    this.svg.appendChild(cir);

    //line draw
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", this.origin[0]);
    line.setAttribute("y2", this.origin[1]);
    line.setAttribute("x2", this.point[0]);
    line.setAttribute("y2", this.point[1]);
    line.setAttribute("style", "stroke:white; stroke-width:2px; stroke-linecap:round");
    this.svg.appendChild(line);

    //append drawing to svg
    document.getElementById(this.id).appendChild(this.svg);
  }
}
