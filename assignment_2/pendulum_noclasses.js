var origin = new Array(200,0);
var point = new Array(0,0);
var mouse = new Array(0,0);
var mass = 20;
var angle = 0.5;
var stem = 300;
var gravity = -0.05;
var speed = 0;
var inertia, acceleration;
const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//var line = document.getElementById("line");

var d;

function setup() {
  svg1. setAttribute ("width", "400" );
  svg1. setAttribute ("height", "400" );
}

function pendulum() {
  //clear
  while (svg1.lastChild) {
      svg1.removeChild(svg1.lastChild);
  }


  //calculate velocity
  inertia = Math.sin(angle) * gravity;
  acceleration = inertia/mass;
  speed += acceleration;
  angle += speed;

  //update positions
  point[0] = Math.sin(angle)*stem + origin[0];
  point[1] = Math.cos(angle)*stem + origin[1];


  //draw
  const cir1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  cir1.setAttribute("cx", point[0]);
  cir1.setAttribute("cy", point[1]);
  cir1.setAttribute("r", mass);
  cir1.setAttribute("fill", "white");
  svg1.appendChild(cir1);

  const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line1.setAttribute("x1", origin[0]);
  line1.setAttribute("y2", origin[1]);
  line1.setAttribute("x2", point[0]);
  line1.setAttribute("y2", point[1]);
  line1.setAttribute("style", "stroke:white; stroke-width:2px; stroke-linecap:round");
  svg1.appendChild(line1);

  document.getElementById('pendulum').appendChild( svg1 );
}

window.onload = function() {
  setup();
  setInterval(pendulum, 10);
}

/*
Math Notes:

300 = sqrt(x^2 + y^2)
SOHCAHTOA
a = 60
sine(a) = x/stem
x = sin(a)*stem
cos(a) = adj/hyp
cos(a) = y/stem
y = cos(a)/stem


NOTE: this is supposed to be a right angle triangle

      a
stem /| y
   /  |
c ‾‾‾‾ b
  x
*/
