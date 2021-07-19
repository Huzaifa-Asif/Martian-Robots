
// Global variables
var x = 0, y = 0, orientation = 0, width = 0, height = 0; scents = [];

// function to receive user entered robot instructions
function submitForm() {
	console.log("Submit Form")
	console.log(document.getElementById("instructions").value)
	let chunk = document.getElementById("instructions").value;

	// split data by lines
	var lines = chunk.split('\n');
	// line: store first line - lines: first line is removed from lines data
	var line = lines.shift();
	// split data by space
	var params = line.split(' ');

	// create grid for robots
	Grid(parseInt(params[0]), parseInt(params[1]))

	var result = '';

	while (lines.length > 0) {

		line = lines.shift();
		if (line.length > 1) //skip blank lines
		{
			// to reset x, y and orientation of old robot 
			this.x = 0; this.y = 0; this.orientation = 0;

			// split robot position by space - example 1 1 E
			params = line.split(' ');

			console.log("parseInt(params[0]) ", parseInt(params[0]), " parseInt(params[1]) ", parseInt(params[1]),)

			// call robot function to initialize the robot
			Robot(parseInt(params[0]), parseInt(params[1]), params[2].charAt(0));

			line = lines.shift();

			// to process robot commands
			if (processCommands(line)) {
				// print if robot is not lost
				console.log(this.x, this.y, 'NESW'.charAt(this.orientation) + '\n')
				let data = this.x + ' ' + this.y + ' ' + 'NESW'.charAt(this.orientation) + '\n'
				result = result + data;

			}
			else {
				// print if robot is lost
				console.log(this.x, this.y, 'NESW'.charAt(this.orientation) + ' LOST\n')
				let data = this.x + ' ' + this.y + ' ' + 'NESW'.charAt(this.orientation) + ' LOST\n'
				result = result + data;

			}

		}
	}

	console.log("result: ", result)
	document.getElementById("resultDisplay").value = result;

}

// To create Grid for the Robots
function Grid(inputWidth, inputHeight) {
	if (inputWidth > 50) {
		inputWidth = 50;
	}
	if (inputHeight > 50) {
		inputHeight = 50;
	}
	this.width = inputWidth;
	this.height = inputHeight;
	this.scents = [];
	console.log("width ", this.width, " height ", this.height)
}

// function to add scent - if the robot is lost
function addScent(x, y) {
	this.scents.push((y * this.width) + x);
};

// function to check this next point is scented or not
function checkIsScented(x, y) {
	console.log("y ", y, " this.width ", width, " x ", x)
	return (
		this.scents.indexOf((y * width) + x)
		>= 0
	);
};

// function to check the x and y is greater then zero and less then grid max value
function isInbound(x, y) {
	return (
		x < 0
		|| y < 0
		|| x > this.width
		|| y > this.height
	)
};

// function to initialize robot 
function Robot(x, y, orientation) {
	this.x = x;
	this.y = y;
	this.orientation = 'NESW'.indexOf(orientation) % 4;
}

// function to turn the robot to left by 90 degree
function turnLeft() {
	// 						 [ W | S | E | N ]
	// orientation move from [ 3 | 2 | 1 | 0 ] then after 0 we take it back to 3 
	if (this.orientation == 0) {
		this.orientation = 3;
	}
	else {
		this.orientation -= 1
	}
};

// function to turn the robot to right by 90 degree
function turnRight() {
	// 						 [ N | E | S | W ]
	// orientation move from [ 0 | 1 | 2 | 3 ] then after 3 we take it back to 0 
	if (this.orientation == 3) {
		this.orientation = 0;
	}
	else {
		this.orientation += 1
	}
};

//returns 'false' if the robot is lost
function moveForward() {
	var velocityX = 0;
	var velocityY = 0;

	switch (this.orientation) {
		// Case sequence is North=0, East=1, South=2, West=3 
		case 0:
			velocityY = 1; // move upwords - North
			break
		case 1:
			velocityX = 1; // move on right side - East
			break;
		case 2:
			velocityY = -1; // move downwords - South
			break;
		case 3:
			velocityX = -1; // move on left side - West
			break;
	}


	if (isInbound(this.x + velocityX, this.y + velocityY)) {
		if (!checkIsScented(this.x, this.y)) {
			addScent(this.x, this.y);
			return false;
			// returns 'false' to indicate that the robot is lost
		}
	}
	else {
		this.x += velocityX;
		this.y += velocityY;
	}

	return true;
};

// function to process all the commands and to run the robot
// Robot.prototype.processCommands = function (commands) {
function processCommands(commands) {
	for (var i = 0; i < commands.length; i++) {
		if (!this.doCommand(commands.charAt(i)))
			return false;
	}

	return true;
};

// function to send signal to robot to turnRight, turnLeft, moveForward
// Robot.prototype.doCommand = function (command) {
function doCommand(command) {
	switch (command) {
		case 'R':
			turnRight();
			break
		case 'L':
			turnLeft();
			break;
		case 'F':
			return moveForward();
	}

	return true;
};



