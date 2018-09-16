/*
	Description: This script contains the objects basic functions/subroutines (e.g creation) for the perceptron
	Author: 	 Edward Stansfield
	CSID:		 U3ES
	UOLID		 200958929
	For:		 COMP390 - Personal Project
*/

/*
	Addinput, creates a new input object and adds it to the input array
	pass the graph context and weight table Id
	since it also calls the drawGraph, drawTarget, drawInput and drawWeightTable functions
*/

function addInput(graphContext,tableId,selectContext1,selectContext2,m,errorId){
	var maxInputs = m;
	if(inputs.length>=maxInputs){
		//Need to create an area for error messages.
		errorId.innerHTML = " Too many Inputs!";
		return;
	}
	else{
		errorId.innerHTML = "";
		var x = 95;
		//Find the last inputNode y cord and add 50
		var last_element = inputs[inputs.length - 1];
		var last_connection = connections[connections.length-1];
		var y = last_element.getYCord() + 110;
		var idNum = last_element.getId() + 1;
		var connId = last_connection.getId() + 1;
		//document.write("<br/>" + last_connection.getId());
		//document.write("<br/> ConnId = " + connId);
		var tempInput = new inputNode(y,idNum);		//Create new node
		
		//Create connections
		//Labels not created yet, are created during the actual perceptron algorithm since they are variable and change throughout the running.
		
		startingWeight = 10*(Math.random() * 2 - 1)
		startingWeight = startingWeight.toFixed(2);
		var tempConnection1 = new connection(startingWeight,tempInput,outputNode1,connId);
		
		tempInput.setConnection1(tempConnection1);
		startingWeight = 10*(Math.random() * 2 - 1)
		startingWeight = startingWeight.toFixed(2);
		var tempConnection2 = new connection(startingWeight,tempInput,outputNode2,connId+1);
		
		tempInput.setConnection2(tempConnection2);
		
		//Add new input to array
		connections.push(tempConnection1);
		connections.push(tempConnection2);
		inputs.push(tempInput);
		
		//draw the new input on the graph
		drawGraph(graphContext);
		drawWeightTable(tableId);
		drawInputSelection(selectContext1,inputs);
		drawInputSelection(selectContext2,inputs);
	}
	
}
/*
	remove input, deletes the inputs connections and then removes it from the array
*/
function removeInput(graphContext,tableId,selectContext1,selectContext2,errorId,targetTableId){
	if(inputs.length<=2){
		errorId.innerHTML = "To few inputs, the minimum amount of inputs is two!";
		return;
	}
	else{
		errorId.innerHTML = "";
		//TODO Modify to remove input from target patterns if removed input is in the target patterns.
		var maxNodeId = inputs.length - 1;
		//errorId.innerHTML = maxNodeId;
		if(isIn(maxNodeId,targetPattern1)){
			//errorId.innerHTML = "Found!";
			//targetPattern1.pop();
			var i = 0;
			for(i;i<targetPattern1.length;i++){
				if(maxNodeId==targetPattern1[i].getInput().getId()){
					//errors.innerHTML = "GOTIT";
					targetPattern1.splice(i,1);
				}
			}
		}
		if(isIn(maxNodeId,targetPattern2)){
			var i = 0;
			for(i;i<targetPattern2.length;i++){
				if(maxNodeId==targetPattern2[i].getInput().getId()){
					//errors.innerHTML = "GOTIT";
					targetPattern2.splice(i,1);
				}
			}
		} 
		
		inputs.pop();
		connections.pop();
		connections.pop();
		outputNode1.removeConnection();
		outputNode2.removeConnection();
		drawGraph(graphContext);
		drawWeightTable(tableId);
		drawTargetTable(targetTableId);
		drawInputSelection(selectContext1,inputs);
		drawInputSelection(selectContext2,inputs);
		
	}
}
/*
	Draw Graph, goes through all the inputs, connections and both outputs and draws them
	in/outputs represented as circles, connections as lines between them, called upon 
	initial loading of the page and whenever inputs are added/removed.
	Pass the context of the canvas to the method when called.
*/
function drawGraph(x){
	
	var canvasContext = x;		//Pass the canvas context to the method
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);		//Clear the canvas before drawing, this ensures removed nodes don't remain
	//Access the input nodes array and draw each
	canvasContext.font = "20px Calibri";
	var i = 0;
	//Draw input Nodes
	for(i;i<inputs.length;i++){
		canvasContext.beginPath();
		canvasContext.arc(inputs[i].getXCord(),inputs[i].getYCord(),inputs[i].getRadius(),0,2*Math.PI);
		canvasContext.fillText("ID: "+i,inputs[i].getXCord()-30,inputs[i].getYCord()-5);
		canvasContext.fillText("Label: "+inputs[i].getLabel(),inputs[i].getXCord()-30,inputs[i].getYCord()+10);
		if(i==0){
			canvasContext.fillStyle = "red";
			canvasContext.fillText("BIAS",inputs[i].getXCord()-30,inputs[i].getYCord()+30);
			canvasContext.fillStyle = "black";
		}
		//Draw both connections for each input
		canvasContext.moveTo(inputs[i].getXCord()+50,inputs[i].getYCord());
		canvasContext.lineTo(650,125);	//Line to output 1
		canvasContext.moveTo(inputs[i].getXCord()+50,inputs[i].getYCord());
		canvasContext.lineTo(650,375);	//Line to output 2
		canvasContext.stroke();
		canvasContext.closePath();
	}
	//Draw output nodes
		canvasContext.beginPath();
		canvasContext.arc(700,125,outputNode1.getRadius(),0,2*Math.PI);
		canvasContext.fillText("X: "+outputNode1.getXValue(),670,125);
		canvasContext.fillText("T:"+outputNode1.getThreshold(),670,145);
		canvasContext.stroke();
		canvasContext.closePath();
		//document.write("g");
		canvasContext.beginPath();
		canvasContext.arc(700,375,50,0,2*Math.PI);
		canvasContext.fillText("X: "+outputNode2.getXValue(),670,375);
		canvasContext.fillText("T:"+outputNode2.getThreshold(),670,395);
		canvasContext.stroke();
		canvasContext.closePath();
}
/*
	Draw weight table, draws the weight table and their values. For the user to keep track of them.
	Pass the Id of the table to the function.
*/
function drawWeightTable(z){
	//Loop through and add weights
	//2 Loops 1,3,5 ... and 0,2,4...
	var tableId = z;
	tableId.innerHTML = "";
	var tHeader = "<table>";
	var tBody = "";
	
	//Titles
	var i = 0;
	//Even Numbers
	for(i;i<connections.length;i=i+2){
		tHeader += "<th>W"+connections[i].getId()+"</th>"
	}
	i = 1
	//Odd Numbers
	for(i;i<connections.length;i=i+2){
		tHeader += "<th>W"+connections[i].getId()+"</th>"
	}
	//Display Weights
	i = 0;
	tBody += "<tr>";
	//Even Numbers
	for(i;i<connections.length;i=i+2){
		tBody += "<td>"+connections[i].getWeight()+"</td>";
	}
	//Odd Numbers
	i = 1
	for(i;i<connections.length;i=i+2){
		tBody += "<td>"+connections[i].getWeight()+"</td>";
	}
	tBody += "</tr></table>";
	tableId.innerHTML = tHeader + tBody;
	
}
/*
	Like the drawWeightTable Method but draws 
	the table for the input patterns
	and their target outputs.
*/
function drawTargetTable(a){
	var targetTableId = a;
	var targetHeader = "<table>";
	var targetBody = "";
	targetTableId.innerHTML = "";
	
	//Create Headers
	var j = 0;
	targetHeader += "<th>Pattern</th>";
	targetHeader += "<th>Input Vector</th>";
	targetHeader += "<th>Target Output</th>";
	//Create row for output 1
	
	targetBody = "<tr>";
	targetBody += "<td> 1 </td><td>";
	
	for(j;j<targetPattern1.length;j++){
		targetBody += "Input "+targetPattern1[j].getInput().getId()+",";
	}
	targetBody += "</td><td>1</td></tr><tr>";
	targetBody += "<td> 2 </td><td>";
	//Create row for output 2
	j = 0;
	for(j;j<targetPattern2.length;j++){
		targetBody += "Input "+targetPattern2[j].getInput().getId()+",";
	}
	targetBody += "</td><td>2</td></tr>";
	targetTableId.innerHTML = targetHeader + targetBody;
}

/*
	Perceptron Algorithms
	These are all the functions that directly implement the perceptron
	itself, they are called via buttons and the perceptron's 
	processes itself.
*/

/*
	Prediction algorithm.
	The Precpetron uses this algorithm to make it's predictions,
	the result of this is then compared against the training set.
	Returns: Nothing, sets internal values of output nodes.
	Input: Set of weights and set of input values (i.e a 
			boolean representing whether they have been picked or not).
*/

function predict(setOfInputs,targetPattern,context,output){
	var activation = 0;
	//Pass the set of connections and the set of input targets.
	//ensure not to change the setting of the bias node.
	var i = 1;	//1 so as not to overwrite the bias node.
	var currentId;
	for(i;i<setOfInputs.length;i++){
	currentId = setOfInputs[i].getId();
		
		if(isIn(currentId,targetPattern) == true){
			setOfInputs[i].setLabel(1);
		}
		else{
			setOfInputs[i].setLabel(0);
		}
	}
	//Now that all nodes have their appropriate labels
	//Sum the weights and their labels to find the 
	//current preidction and display this.
	var sum = 0;
	var roundedWeight;
	i = 0;	//Now to 0 to include bias in prediction calculation
	//Firstly sum up activation for pattern 1
	for(i;i<inputs.length;i++){
		
		sum = sum + ( Number(setOfInputs[i].getConnection1().getWeight()) * Number(setOfInputs[i].getLabel()));
		//document.getElementById("perceptronOutput").innerHTML += "<br/>S:"+inputs[i].getConnection1().getWeight()+" "+inputs[i].getLabel()+"</br>";
		//document.getElementById("perceptronOutput").innerHTML += "<br/>Sum:"+sum+"</br>";
	}
	activation = sum.toFixed(2);
	//document.getElementById("perceptronOutput").innerHTML = "";
	output.innerHTML += "<br/><br/>Current Pattern 1 S Value = "+sum+"</br>";
	

	//Set the X value of the output nodes.
	if(activation>=outputNode1.getThreshold()){
		outputNode1.setXValue(1);
		output.innerHTML += "Current OutputNode 1 X Value = 1</br>";
	}
	else{
		outputNode1.setXValue(0);
		output.innerHTML += "Current OutputNode 1 X Value = 0</br>";
	}
	sum = 0;
	i = 0;
	//Now sump up activation for the second output.
	//ensure to include bias
	for(i;i<inputs.length;i++){
		sum = sum + (Number(setOfInputs[i].getConnection2().getWeight()) * Number(setOfInputs[i].getLabel()));
	}
	activation = sum;
	output.innerHTML += "Current Pattern 2 S Value = "+sum+"</br>";
	//Set the X value of the output nodes.
	if(activation>=outputNode2.getThreshold()){
		outputNode2.setXValue(1);
		output.innerHTML += "Current OutputNode 2 X Value = 1</br>";
	}
	else{
		outputNode2.setXValue(0);
		output.innerHTML += "Current OutputNode 2 X Value = 0</br>";
	}
	drawGraph(context);
	//document.getElementById("perceptronOutput").innerHTML+="<br/>LABEL:" + inputs[2].getLabel();
}
/*
	For use in the prediction algorithm.
	Checks that a given node is in a particular pattern(array).
	Pass nodeId (Integer>=0), and pattern.
	Returns boolean truth value.
	Useful for marking the nodes.
*/
function isIn(nodeId,pattern){
	var c = 0;
	for(c;c<pattern.length;c++){
		if(pattern[c].getInput().getId() == nodeId){
			return true;
		}
		else{
			continue;
		}
	}
	return false;
}

/*
	The perceptron algorithm itself.
	Parameters: Learning Rate, Threshold 1 and 2, Delta Value, pattern1, pattern2, inputs, connections, perceptron output, error ouput.
	Returns: Nothing.
*/
function perceptronTraining(learnRate,Thres1,Thres2,deltaVal,pattern1,pattern2,input,connection,perOut,error,weightTableId,targetButton1,targetButton2,
							deltaButton,thres1Button,thres2Button,addIButton,removeIButton,learnRateButton,graphContext,nextButton,startButtton){
	//Disable all the buttons that affect the perceptron in some way.
	//Run the prediction algorithm for both patterns
	//and then adjust the weights acording to the weight adjustment 
	//rule, after each prediction.
	//Run the algorithm in stages so as to allow the user to view each prediction
	//and weight adjustment as it unfolds.
	//perOut.innerHTML += "<br/>" + learnRate;
	if(pattern1.length == 1 || pattern2.length == 1){
		if(pattern1.length==1){
			error.innerHTML += "Only bias node in pattern 1, add more inputs!";
		}
		if(pattern2.length==1){
			error.innerHTML += "<br/>Only bias node in pattern 2, add more inputs!";
		}
		return;
	}
	
	
	//Firstly diable all buttons that can affect the perceptron.
	targetButton1.disabled = true;
	//document.getElementById("addTarget1").disabled = true;
	targetButton2.disabled = true;
	deltaButton.disabled = true;
	thres1Button.disabled = true;
	thres2Button.disabled = true;
	addIButton.disabled = true;
	removeIButton.disabled = true;
	learnRateButton.disabled = true;
	nextButton.disabled = false;
	startButton.disabled = true;
	var delta = deltaVal;
	
	//Create a loop and end when RMS<delta
	
	
	
	
	
	/*predict(input,pattern1,graphContext,perOut);
	weightAdjustment(pattern1,pattern2,learnRate,weightTableId,connection,perOut);
	*/
}
function exampleTraining(startButton,nextButton){
	nextButton.disabled = false;
	startButton.disabled = true;
}
function runPerceptron(input,graphContext,perOut,pattern1,pattern2,weightTableId,connection,miscVal,iterationsSpan,errorSpan){
		//perOut.innerHTML += "<br/> delta = " + miscVal.getDelta();
		/*if(typeof compareRMS == "undefined"){
			compareRMS = 1000;
		}*/
		
		if(miscVal.getRMS()<miscVal.getDelta()){
			errorSpan.innerHTML = "<br/>Perceptron Training has ended!";
			return;
		}
		outputNode1.setTarget(1);
		outputNode2.setTarget(0);
		perOut.innerHTML += "<br/> Pass 1:";
		predict(input,pattern1,graphContext,perOut);
		weightAdjustment(pattern1,pattern2,miscVal,weightTableId,connection,perOut,input);
		outputNode1.setTarget(0);
		outputNode2.setTarget(1);
		perOut.innerHTML += "<br/><br/> Pass 2:";
		predict(input,pattern2,graphContext,perOut);
		weightAdjustment(pattern1,pattern2,miscVal,weightTableId,connection,perOut,input);
		miscVal.setRMS(calculateRMS(pattern1,pattern2));
		perOut.innerHTML += "<br/> RMS = " + miscVal.getRMS()+"<br/>";
		miscVal.setIterations(miscVal.getIterations()+1);
		iterationsSpan.innerHTML = " "+ miscVal.getIterations();
}
/*
	Used for calculating the RMS value.
	Use this value to determine when to end 
	the percptron training algorithm.
*/
function calculateRMS(pattern1,pattern2){
	var RMS = 0;
	var i = 1;				//one to avoid calculating the bias node.
	var temp = 0;
	var temp2 = 0;
	
	
	//Sum up the squared error values for both patterns
	//then add them together
	//and divide by the lengths of both added.
	
	for(i;i<pattern1.length;i++){
		temp = Math.pow(Number(outputNode1.getInstantError()),2) + temp;
		//document.getElementById("perceptronOutput").innerHTML += "<br/>IE:" + outputNode1.getInstantError();
		//document.getElementById("perceptronOutput").innerHTML += "<br/>IE^2:" + Math.pow(outputNode1.getInstantError(),2);

		//document.getElementById("perceptronOutput").innerHTML += "<br/>temp:" + temp;
	}
	i = 1;
	for(i;i<pattern2.length;i++){
		temp = Math.pow(Number(outputNode2.getInstantError()),2) + temp;
	}
	
	temp2 = (pattern1.length-1) * (pattern2.length-1);
	//document.getElementById("perceptronOutput").innerHTML += "<br/> tsqr:" + Math.sqrt(temp);
	//document.getElementById("perceptronOutput").innerHTML += "<br/> temp2:" + temp2;
	temp = Math.sqrt(temp)/Math.sqrt(temp2);
	//document.getElementById("perceptronOutput").innerHTML += "<br/>temp:" + temp;
	RMS = temp;
	//document.getElementById("perceptronOutput").innerHTML += "<br/>RMS:" + RMS + "<br/>";
	return RMS;
}
/*
	Used for adjusting the weights of connections after 
	running the training algorithm.
	Compute the instant error of the output units
	This is the target (current output node) minus the instant output (X)
	Then compute the instant corrections to the weights.
	And finally update the weights.
	Parameters: Both training patterns. The learningRate, connections table, perceptron Output
*/
function weightAdjustment(tPattern1,tPattern2,miscVal,tableId,connections,output,inputs){
	outputNode1.setInstantError(outputNode1.getTarget() - outputNode1.getXValue());
	outputNode2.setInstantError(outputNode2.getTarget() - outputNode2.getXValue());
	var i = 0;
	var instantCorrection = 0;
	var tempWeight;
	
	//testing
	//output.innerHTML += "<br/> 1:" + instantError1;
	//output.innerHTML += "<br/> 2:" + instantError2;
	
	//Calculate instant corrections for each weight of connection
	
	for(i;i<inputs.length;i++){
		instantCorrection = miscVal.getLearningRate() * inputs[i].getLabel() * outputNode1.getInstantError();
		inputs[i].getConnection1().setInstantCorrection(instantCorrection);
		
		//***Bug Fixing
		//output.innerHTML+="<br/>IC1:" + instantCorrection;
		
		instantCorrection = miscVal.getLearningRate() * inputs[i].getLabel() * outputNode2.getInstantError();
		inputs[i].getConnection2().setInstantCorrection(instantCorrection);
		
		//***Bug Fixing
		//output.innerHTML+="<br/>IC2:" + instantCorrection;
	}
	//Now apply the change to the weights
	i = 0;
	for(i;i<connections.length;i++){
		
		tempWeight = Number(connections[i].getWeight()) + Number(connections[i].getInstantCorrection());
		output.innerHTML+="<br/>Weight"+connections[i].getId()+" new value = "+connections[i].getWeight();
		connections[i].setWeight(tempWeight);
		output.innerHTML += " + "+connections[i].getInstantCorrection()+" = "+connections[i].getWeight();
	}
	drawWeightTable(tableId);
}

/*
	Used for setting the learning rate, from the counter.
	Parameters: Element Id of input, element id of perceptron output.
	Returns: Nothing
*/
function setLearningRate(x,o){
	miscVal.setLearningRate(x.value);
	o.innerHTML += "<br/>New Learning Rate :" + miscVal.getLearningRate();
}
/*
	Used for setting the threshold value of the first output node, from the counter.
	Parameters: Element Id of input, element id of perceptron output.
	Returns: Nothing
*/
function setThreshold1(x,o){
	outputNode1.setThreshold(x.value);
	o.innerHTML += "<br/>New Threshold1: " + outputNode1.getThreshold();
}
/*
	Used for setting the learning rate, from the counter.
	Parameters: Element Id of input, element id of perceptron output.
	Returns: Nothing
*/
function setThreshold2(x,o){
	outputNode2.setThreshold(x.value);
	o.innerHTML += "<br/>New Threshold2: " + outputNode2.getThreshold();
}
/*
	Used for setting the learning rate, from the counter.
	Parameters: Element Id of input, element id of perceptron output.
	Returns: Nothing
*/
function setDelta(x,o){
	miscVal.setDelta(x.value);
	o.innerHTML = "<br/>New Delta: " + miscVal.getDelta();
}
/*
	Used for drawing the weight selection options.
	Given the inputs avalible.
	Parameters: Element Id of select, input array.
	Return: Nothing.
*/
function drawInputSelection(selectElement,input){
	
	var selectList = selectElement;
	var length = selectList.options.length;
	var i;
	 for(i=selectList.options.length-1;i>=0;i--)
    {
        selectList.remove(i);
    }
	
	//Fill in all the nodes (except the bias node) into the menu
	var i = 1;
	for(i;i<input.length;i++){
		var option = document.createElement("option");
		option.value = input[i].getId();
		option.text = "Input "+input[i].getId();
		selectList.appendChild(option);
	}
	
	//Originally drew two nodes, now just one and is called twice for the sepearte select elements.
	/*
	var selectList = document.createElement("select");
		selectList.id = "selectTraining2";
		menu.appendChild(selectList);
	
	//Fill in all the nodes (except the bias node) into the menu
	var i = 1;
	for(i;i<inputs.length;i++){
		var option = document.createElement("option");
		option.value = inputs[i].getId();
		option.text = "Input "+inputs[i].getId();
		selectList.appendChild(option);
	}
	*/
}
/*
	Functions used to add targets, used by the buttons.
	Parameters: Element Id of the select, element id of error output.
	Return: Nothing
*/
addTarget1 = function(selection,errors){
	tss = selection.value;
	//document.write(tss);
	if(isIn(tss,targetPattern1)==false){
		errors.innerHTML = "";
		addNewInputTargetOutput1(inputs[tss]);
		drawTargetTable(tarT);
	}
	else{
		errors.innerHTML = "Input "+ tss+ " is already in Pattern 1!";
	}
}
addTarget2 = function(selection,errors){
	tss = selection.value;
	//document.write(tss);
	if(isIn(tss,targetPattern2)==false){
		errors.innerHTML = "";
		addNewInputTargetOutput2(inputs[tss]);
		drawTargetTable(tarT);
	}
	else{
		errors.innerHTML = "Input "+ tss+ " is already in Pattern 2!";
	}
}
/*
	Functions used to remove target inputs from the buttons
	Parameters: The current selection, the errors span
	Returns: Nothing
	
*/
removeTarget1 = function(selection,errors){
	tss = selection.value;
	if(isIn(tss,targetPattern1)){
		var i = 0;
		for(i;i<targetPattern1.length;i++){
			if(tss==targetPattern1[i].getInput().getId()){
				//errors.innerHTML = "GOTIT";
				targetPattern1.splice(i,1);
			}
		}
		drawTargetTable(tarT);
	}
	else{
		errors.innerHTML = "Input "+ tss + " is not in Pattern 1!";
	}
}
removeTarget2 = function(selection,errors){
	tss = selection.value;
	if(isIn(tss,targetPattern2)){
		var i = 0;
		for(i;i<targetPattern2.length;i++){
			if(tss==targetPattern2[i].getInput().getId()){
				errors.innerHTML = "GOTIT";
				targetPattern2.splice(i,1);
			}
		}
		drawTargetTable(tarT);
	}
	else{
		errors.innerHTML = "Input " + tss + " is not in Pattern2 !";
	}
}
