/* 
	Description: This script contains the objects and their functions (classes) for the perceptron
	Author: 	 Edward Stansfield
	CSID:		 U3ES
	UOLID		 200958929
	For:		 COMP390 - Personal Project
*/

/*
	Pre-defined objects
	These are objects that are initially created
	e.g. the outputs, also the default inputs, 
	connections etc.

	Object arrays, these hold the various objects
	no need for output array since there are only
	two of them, they can be accessed direclty.
*/

var inputs = [];		//Holds all the input nodes
var connections = [];	//Holds all the connections
var targetPattern1 = [];
var targetPattern2 = [];
var noOfIterations = 0;		//Used for keeping track of the iterations.

//The two outputs, 

var outputNode1 = new outputNode(1);
var outputNode2 = new outputNode(0);

var miscVal = new miscValues();
//The initial y Co-ordinate for drawing the input nodes.

var inputYCord = 55;


function miscValues(){
	var learningRate = 0.25;		//The rate by which each weight is adjusted, initially set to 0.25.
	var delta = 0.0001;						//The criterion used for stopping the perceptron.
	var compareRMS = 1000;					//Compared against data, stopped when smaller than, starts off as absurd value to ensure at least one run.
	var iterations = 0;
	
	this.getLearningRate = function(){
		return learningRate;
	}
	this.getDelta = function(){
		return delta;
	}
	this.getRMS = function(){
		return compareRMS;
	}
	this.getIterations = function(){
		return iterations;
	}
	
	this.setLearningRate = function(newRate){
		learningRate = newRate;
	}
	this.setDelta = function(newDelta){
		delta = newDelta;
	}
	this.setRMS = function(newRMS){
		compareRMS = newRMS;
	}
	this.setIterations = function(newIter){
		iterations = newIter;
	}
}

/*
	inputNode object - used to represent the input nodes 
	of the perceptron and access there values, there weights
	and assign new ones.
	Variables to pass during creation:  y co-ordinate
*/
function inputNode(y,z){
	
	var label = 1;		//The input label either 0 or 1, 1 by default, must ensure that bias label does not get overwritten
	var connection1;	//Pointer the the first connection
	var connection2;
	var radius = 50;		//Used in drawing the connection, same for all nodes
	var xCord = 95;
	var yCord = y;
	var inputId = z;
	
	//return methods, simply return the current assigned value
	
	this.getLabel = function(){
		return label;
	}
	
	this.getConnection1 = function(){
		return connection1;
	}	
	
	this.getConnection2 = function(){
		return connection2;
	}
	
	this.getRadius = function(){
		return radius;
	}
	
	this.getXCord = function(){
		return xCord;
	}
	
	this.getYCord = function(){
		return yCord;
	}
	this.getId = function(){
		return inputId;
	}
	
	//set methods, change current values
	//No set method for radius as it is a constant
	
	this.setLabel = function(newLabel){
		label = newLabel;
	}
	
	this.setConnection1 = function(newConnection){
		connection1 = newConnection;
	}
	
	this.setConnection2 = function(newConnection){
		connection2 = newConnection;
	}
}
/*
	Connection object, used to model weights
	Need to pass it's inputNode,outputNode and initial 
	weight on creation.
	
*/
function connection(x,y,z,a){
	
	var weight = x;			//a postive or negative double value
	var inputNode = y;		// the input Node of this connection
	var outputNode = z;		//the output node this connection is targeted to
	var instantCorrection = 0;
	var id = a;
	
	//get functions
	
	this.getWeight = function(){
		return weight;
	}
	
	this.getInstantCorrection = function(){
		return instantCorrection;
	}
	this.getId = function(){
		return id;
	}
	//set functions
	
	this.setWeight = function(newWeight){
		weight = parseFloat(newWeight).toFixed(2);
	}
	
	this.setInstantCorrection = function(newCorrection){
		instantCorrection = Number(newCorrection);
	}
	
}

/*
	Output Nodes, models the output nodes.
*/

function outputNode(t){
	
	var radius = 50;
	var incomingConnections = [];	//Array used to hold all the incoming connections
	var X = 0;						//Default = 0;
	var threshold = 0;
	var target = t;
	var instantError;
	
	//return methods
	this.getRadius = function(){
		return radius;
	}
	this.getXValue = function(){
		return X;
	}
	this.getThreshold = function(){
		return threshold;
	}
	this.getTarget = function(){
		return target;
	}
	this.getInstantError = function(){
		return instantError;
	}
	//set methods
	
	this.setConnection = function(newConnection){
		incomingConnections.push(newConnection);
	}
	this.setThreshold = function(newThreshold){
		threshold = newThreshold;
	}
	this.setTarget = function(newTarget){
		target = newTarget;
	}
	this.setInstantError = function(newError){
		instantError = newError;
	}
	//This is used as part of the remove input method, don't have to find exact one as weights have not been assigned yet.
	
	this.removeConnection = function(){
		incomingConnections.pop();
	}
	
	this.setXValue = function(newXValue){
		X = newXValue;
	}
}
/*
	A member of the targetPattern1 array, this holds the individual 
	input node and it's target output (1).
*/
function inputTargetOutput1(){
	
	var input;				//Contains the input pattern
	var targetOutput = outputNode1;	//the outputNode target for this pattern
	
	this.setInput = function(newInputNode){
		input = newInputNode;
	}
	
	this.getInput = function(){
		return input;
	}
	
	this.getTargetOutput = function(){
		return targetOutput;
	}
}
/*
	A member of the targetPattern2 array, this holds the individual 
	input node and it's target output (2).
*/
function inputTargetOutput2(){
	
	var input;						//Contains the input 
	var targetOutput = outputNode2;	//the outputNode target for this input
	
	this.setInput = function(newInputNode){
		input = newInputNode;
	}
	
	this.getInput = function(){
		return input;
	}
	
	this.getTargetOutput = function(){
		return targetOutput;
	}
}
/*
	Adds a new node that has it's training set value as output 
	node 1.
	Need to ensure that Node 1 is never added as this is always 
	the bias.
*/
function addNewInputTargetOutput1(newInputNode){
	var newInputTarget = new inputTargetOutput1();
	newInputTarget.setInput(newInputNode);
	targetPattern1.push(newInputTarget);
}
/*
	Adds a new node that has it's training set value as output 
	node 2.
*/
function addNewInputTargetOutput2(newInputNode){
	var newInputTarget = new inputTargetOutput2();
	newInputTarget.setInput(newInputNode);
	targetPattern2.push(newInputTarget);
}

/*
	This creates the Initial set of nodes and weights
	the weights are random and the default amount of nodes 
	is four.
	This is for use with the interactive perceptron.
	The Demo's have their own inital creation functions.
*/

function createInitial(graphContext){
	var i = 0
	for(var j = 0;j<=3;j++){
		var newInput = new inputNode(inputYCord,j);
		
		//set connections
		var randWeight = 10*(Math.random() * 2 - 1);
		randWeight = randWeight.toFixed(2);
		var newConnection1 = new connection(randWeight,newInput,outputNode1,i);
		i++;
		randWeight = 10*(Math.random() * 2 - 1);
		randWeight = randWeight.toFixed(2);	//new values so weighs are different
		var newConnection2 = new connection(randWeight,newInput,outputNode2,i);
		i++;
		newInput.setConnection1(newConnection1);
		newInput.setConnection2(newConnection2);
		//add connections to array
		connections.push(newConnection1);
		connections.push(newConnection2);
		//set output node connections
		outputNode1.setConnection(newConnection1);
		outputNode2.setConnection(newConnection2);
		//add input to array
		//add Bias Node to both patterns
		
		inputs.push(newInput);
		
		inputYCord = inputYCord + 110;
		drawGraph(graphContext);
	}
	addNewInputTargetOutput1(inputs[0]);
	addNewInputTargetOutput2(inputs[0]);
}

/*
	The inital creation function for the correct example.
	The weights are pre-determined for correctness.
	Based off of the example in the Bio-Computation Notes.
*/

function createCorrectInitial(graphContext){
	
	var weight = 0.5;
	
	//Create five nodes and 10 weights
	var j = 0;
	for(var i=0;i<=4;i++){
		var correctInput = new inputNode(inputYCord,i);
		inputYCord = inputYCord + 110;
		
		if(i == 2 || i == 4){
			weight = -0.5;
		}
		
		var correctConnection1 = new connection(weight,correctInput,outputNode1,j);
		j = j + 1;
		var correctConnection2 = new connection(weight,correctInput,outputNode2,j);
		j = j + 1;
		weight = 0.5;			//Set back in case it changed.
		correctInput.setConnection1(correctConnection1);
		correctInput.setConnection2(correctConnection2);
		
		connections.push(correctConnection1);
		connections.push(correctConnection2);
		
		outputNode1.setConnection(correctConnection1);
		outputNode2.setConnection(correctConnection2);
		
		inputs.push(correctInput);
		drawGraph(graphContext);
	}
	
	//Create the input vectors
	//Nodes 0,1,2 in pattrern 1
	//Nodes 0,3,4 in pattern2 
	for(i=0;i<3;i++){
		addNewInputTargetOutput1(inputs[i]);
	}
	
	addNewInputTargetOutput2(inputs[0]);
	
	for(i=3;i<inputs.length;i++){
		addNewInputTargetOutput2(inputs[i]);
	}
}

/*
	The Initial creation function for the incorrect example.
	Designed for failure.
*/

function createIncorrectInitial(graphContext){
	var i = 0;
	var j = 0;
	for(j;j<4;j++){
		var newInput = new inputNode(inputYCord,j);
		
		//set connections
		var randWeight = 10*(Math.random() * 2 - 1);
		randWeight = randWeight.toFixed(2);
		var newConnection1 = new connection(randWeight,newInput,outputNode1,i);
		i++;
		randWeight = 10*(Math.random() * 2 - 1);
		randWeight = randWeight.toFixed(2);	//new values so weighs are different
		var newConnection2 = new connection(randWeight,newInput,outputNode2,i);
		i++;
		newInput.setConnection1(newConnection1);
		newInput.setConnection2(newConnection2);
		//add connections to array
		connections.push(newConnection1);
		connections.push(newConnection2);
		//set output node connections
		outputNode1.setConnection(newConnection1);
		outputNode2.setConnection(newConnection2);
		//add input to array
		//add Bias Node to both patterns
		
		inputs.push(newInput);
		
		inputYCord = inputYCord + 110;
		drawGraph(graphContext);
	}
	addNewInputTargetOutput1(inputs[0]);
	addNewInputTargetOutput2(inputs[0]);
	addNewInputTargetOutput1(inputs[1]);
	addNewInputTargetOutput2(inputs[1]);
}