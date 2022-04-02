const model_url =
  'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let freq = 0;
let threshold = 1;
let i = 0;

let notes = [
  {
    note: 'A4',
    freq: 440
  },
  {
    note: 'G#4',
    freq: 415.30
  },
  {
    note: 'G4',
    freq: 392.00
  },
  {
    note: 'F#4',
    freq: 369.99
  },
  {
    note: 'F4',
    freq: 349.23
  },
  {
    note: 'E4',
    freq: 329.6276
  },
  {
    note: 'D#4',
    freq: 311.13
  },
  {
    note: 'D4',
    freq: 293.66
  },
  {
    note: 'C#4',
    freq: 277.18
  },
  {
    note: 'C4',
    freq: 261.6256
  },
  {
    note: 'B3',
    freq: 246.94
  },
  {
    note: 'A#3',
    freq: 233.08
  },
  {
    note: 'Out of Range',
    freq: 0
  }
];

const { Factory, EasyScore, System } = Vex.Flow;
const vf = new Factory({
  renderer: { elementId: "output", width: 500, height: 200 },
});
const score = vf.EasyScore();
const system = vf.System();
const n1 = notes[getRandomInt(0, notes.length)];
const n2 = notes[getRandomInt(0, notes.length)];
const n3 = notes[getRandomInt(0, notes.length)];
const n4 = notes[getRandomInt(0, notes.length)];
const genNotes = [n1, n2, n3, n4];

function setup() {
  createCanvas(400, 400);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  mic.start(listening);
}

function listening() {
  console.log('listening');
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text(freq.toFixed(2), width / 2, height - 150);

  let closestNote = -1;
  let recordDiff = Infinity;
  for (let i = 0; i < notes.length; i++) {
    if (freq < 220) {
      closestNote = notes[notes.length - 1];
    }
    let diff = freq - notes[i].freq;
    if (abs(diff) < abs(recordDiff)) {
      closestNote = notes[i];
      recordDiff = diff;
    }
  }
  
  if (closestNote == genNotes[i]) {
    alert("Correct");
    i++;
  }
  
  /*if (i == 3) {
    alert("You did it!");
  }*/

  textSize(64);
  text(closestNote.note, width / 2, height - 50);

  let diff = recordDiff;

  let alpha = map(abs(diff), 0, 100, 255, 0);
  rectMode(CENTER);
  fill(255, alpha);
  stroke(255);
  strokeWeight(1);
  rect(200, 100, 200, 50);

  stroke(255);
  strokeWeight(4);
  line(200, 0, 200, 200);

  noStroke();
  fill(255, 0, 0);
  if (abs(diff) < threshold) {
    fill(0, 255, 0);
  }
  rect(200 + diff / 2, 100, 10, 75);
}

function modelLoaded() {
  console.log('model loaded');
  pitch.getPitch(gotPitch);
}

function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  } else {
    //console.log(frequency);
    if (frequency) {
      freq = frequency;
    }
    pitch.getPitch(gotPitch);
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


system.addStave({
    voices: [
    // Top voice has 4 quarter notes with stems up.
      score.voice(score.notes(n1.note + '/q,' + n2.note + ',' + n3.note + ',' + n4.note, { stem: 'up' }))

    ]
    })
    .addClef('treble')
    .addTimeSignature('4/4');

vf.draw();
