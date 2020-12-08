// ---------------------------------------------> Variables

const LINE_WIDTH = 1;
const ANIMATION_SPEED = 250;

var animation_timer = 0;
var point_velocity =[];
var target_curve = [];
var current_curve = [
	new p5.Vector(225, 675),
	new p5.Vector(225, 225),
	new p5.Vector(675, 225),
	new p5.Vector(675, 675)
];

// ---------------------------------------------> Functions

function transform(curve, radians, x, y, invert) { // Returns the given transformed by the given values
	var new_curve = [];
	for (let point of curve) {
		let new_point = new p5.Vector(
			Math.round(Math.cos(radians) * (point.x - 450) - Math.sin(radians) * (point.y - 450) + 450) * 0.5 + x,
			Math.round(Math.sin(radians) * (point.x - 450) + Math.cos(radians) * (point.y - 450) + 450) * 0.5 + y
		);
		if (invert) {
			new_curve.push(new_point);
		} else {
			new_curve.unshift(new_point);
		}
	}
	return new_curve;
}

// ---------------------------------------------> p5 native functions

function setup() { // Creates window
	createCanvas(900, 900);
}

function draw() { // Calculates new target curve, draws current curve, and updates point positions
	if (animation_timer == 0) { // Calculate new target curve
		target_curve = 			transform(current_curve, Math.PI/2,  0,   450, false)
						.concat(transform(current_curve, 0, 		 0,   0,   true))
						.concat(transform(current_curve, 0, 		 450, 0,   true))
						.concat(transform(current_curve, -Math.PI/2, 450, 450, false));
		let temporary_curve = []; // Multiply current curve to accomodate necissary points
		for (let point of current_curve) {
			for (let i=0; i<4; i++) {
				temporary_curve.push(point);
			}
		}
		current_curve = temporary_curve;
		point_velocity = []; // Subtract current curve from target curve to calculate the point velocity
		for (let i=0; i<current_curve.length; i++) {
			point_velocity.push( new p5.Vector(
				(target_curve[i].x - current_curve[i].x) / ANIMATION_SPEED,
				(target_curve[i].y - current_curve[i].y) / ANIMATION_SPEED
			));
		}
		animation_timer = ANIMATION_SPEED;
	}

	background(51); // Draw current curve
	strokeWeight(LINE_WIDTH);
	stroke(255);
	for (let i=1; i<current_curve.length; i++) {
		line(
			current_curve[i - 1].x,
			current_curve[i - 1].y,
			current_curve[i].x,
			current_curve[i].y
		);
	}

	for (let i=0; i<current_curve.length; i++) { // Update point positions
		current_curve[i] = new p5.Vector.add(
			current_curve[i], 
			point_velocity[i]
		);
	}
	animation_timer--; // Update animation_timer
}