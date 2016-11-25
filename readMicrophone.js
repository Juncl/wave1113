navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

var nowTime = new Date();
var audioctx = new (window.AudioContext || window.webkitAudioContext)();
var drawVisual;

var buffer = null;
var startTime;
var time = [];
for(var i = 0; i < 3; i++){
	time[i] = [];
}

var mode = 0;
var fileMode = 0;

var fftSizeMode = 1;
var src = null;
var stream;
var analyser = audioctx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.fftSize = 1024;

var distortion = audioctx.createWaveShaper();
var gainNode = audioctx.createGain();
var biquadFilter = audioctx.createBiquadFilter();
biquadFilter.type = "highpass"; 
biquadFilter.frequency.value = 10000;


var convolver = audioctx.createConvolver();

document.getElementById("min").value = analyser.minDecibels;
document.getElementById("max").value = analyser.maxDecibels;

var ctx = document.getElementById("graph").getContext("2d");
var peakValue = document.getElementById("peakValue");
var gradbase = ctx.createLinearGradient(0, 0, 0, 256);
gradbase.addColorStop(0, "rgb(20,22,20)");
gradbase.addColorStop(1, "rgb(20,20,200)");
var gradline = [];
for(var i = 0; i < 256; ++i) {
	gradline[i] = ctx.createLinearGradient(0, 256 - i, 0, 256);
	var n = (i & 64) * 2;
	gradline[i].addColorStop(0, "rgb(255,0,0)");
	gradline[i].addColorStop(1, "rgb(255," + i + ",0)");
}

if (navigator.getUserMedia) {
   console.log('getUserMedia supported.');
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {
         audio: true
      },

      // Success callback
      function(stream) {
         src = audioctx.createMediaStreamSource(stream);
         src.connect(analyser);
         analyser.connect(distortion);
         distortion.connect(biquadFilter);
         biquadFilter.connect(convolver);
         convolver.connect(gainNode);
         gainNode.connect(audioctx.destination);

      	 DrawGraph();

      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
}

function Stop() {
	if(src) src.stop(0);
	src = null;
}

function Play() {
	if(src === null) {
		src = audioctx.createBufferSource();
		src.buffer = buffer;
		src.loop = false;
		src.connect(audioctx.destination);
		src.connect(analyser);
		src.start(0);
	}
}

function Setup() {
	console.log("setup");
	mode = document.getElementById("mode").selectedIndex;
	fileMode = document.getElementById("fileMode").selectedIndex;
	fftSizeMode = document.getElementById("fftSizeMode").selectedIndex;
	
	if(fftSizeMode == 0){
		analyser.fftSize = 512;
	}else if(fftSizeMode == 1){
		analyser.fftSize = 1024;
	}else analyser.fftSize = 4096;
	analyser.minDecibels = parseFloat(document.getElementById("min").value);
	analyser.maxDecibels = parseFloat(document.getElementById("max").value);
	analyser.smoothingTimeConstant = parseFloat(document.getElementById("smoothing").value);
}

var freqValue1 = 3;
var freqValue2 = 12;
var freqValue3 = 14;
var freq1 = document.getElementById("freq1");
var freq2 = document.getElementById("freq2");
var freq3 = document.getElementById("freq3");

var freqDetail1 = document.getElementById("freqDetail1");
var freqDetail2 = document.getElementById("freqDetail2");
var freqDetail3 = document.getElementById("freqDetail3");

var five1 = [];
var five2 = [];
var five3 = [];
five1Time = [];
five2Time = [];
five3Time = [];
var five1Element = document.getElementById("five1");
var five2Element = document.getElementById("five2");
var five3Element = document.getElementById("five3");
var five1TimeElement = document.getElementById("fiveTime1");
var five2TimeElement = document.getElementById("fiveTime2");
var five3TimeElement = document.getElementById("fiveTime3");

freq1.value = freqValue1;
freq2.value = freqValue2;
freq3.value = freqValue3;

var flag1  = 0; //  对应频率起落标志
var flag2  = 0;
var flag3  = 0;

// var pos1Value = document.getElementById('pos1Value');
// var pos2Value = document.getElementById('pos2Value');
// var pos3Value = document.getElementById('pos3Value');

var btnPlay = document.getElementById("btnPlay");

function DrawGraph() {
	drawVisual = requestAnimationFrame(DrawGraph);

	ctx.fillStyle = gradbase;
	ctx.fillRect(0, 0, 256, 256);
	
	var data = new Uint8Array(256);
	
	
	if(mode == 0) analyser.getByteFrequencyData(data); //Spectrum Data
	else analyser.getByteTimeDomainData(data); //Waveform Data

	freqDetail1.innerHTML = getPosValue(freq1.value, data);
	freqDetail2.innerHTML = getPosValue(freq2.value, data);
	freqDetail3.innerHTML = getPosValue(freq3.value, data);

	// ********************* 信号1 *******************//
	if(five1.length == 1){
		five1Time.push(new Date() - nowTime);
	}else if(five1.length == 5){
		if(arrEqualZero(five1)){
			flag1 = 1;
		}
	}

	if(flag1){
		// five3Element.innerHTML = five3Element.innerHTML+"ABC";
		if(freqDetail1.innerHTML != five1[4]){
			flag1 = 0;
			// five3Element.innerHTML = five3Element.innerHTML+"DEF";
			five1Time.push(new Date() - nowTime);
			// pos1Value.innerHTML = new Date().getTime();
		}
	}

	// ********************* 信号2 *******************//
	if(five2.length == 1){
		five2Time.push(new Date() - nowTime);
	}else if(five2.length == 5){
		if(arrEqualZero(five2)){
			flag2 = 1;
		}
	}

	if(flag2){
		// five3Element.innerHTML = five3Element.innerHTML+"ABC";
		if(freqDetail2.innerHTML != five2[4]){
			flag2 = 0;
			// five3Element.innerHTML = five3Element.innerHTML+"DEF";
			five2Time.push(new Date() - nowTime);
			pos2Value.innerHTML = new Date().getTime();

		}
	}

	// ********************* 信号3 *******************//
	if(five3.length == 1){
		five3Time.push(new Date() - nowTime);
	}else if(five3.length == 5){
		if(arrEqualZero(five3)){
			flag3 = 1;
		}
	}

	if(flag3){
		// five3Element.innerHTML = five3Element.innerHTML+"ABC";
		if(freqDetail3.innerHTML != five3[4]){
			flag3 = 0;
			// five3Element.innerHTML = five3Element.innerHTML+"DEF";
			five3Time.push(new Date() - nowTime);
			pos3Value.innerHTML = new Date().getTime();
		}
	}

	

	five1 = pushValue(freqDetail1.innerHTML, five1);
	five2 = pushValue(freqDetail2.innerHTML, five2);
	five3 = pushValue(freqDetail3.innerHTML, five3);
	five1Element.innerHTML = "";
	five2Element.innerHTML = "";
	five3Element.innerHTML = "";
	five1TimeElement.innerHTML = "";
	five2TimeElement.innerHTML = "";
	five3TimeElement.innerHTML = "";

	displayArray(five1Element, five1);
	displayArray(five2Element, five2);
	displayArray(five3Element, five3);
	displayArray(five1TimeElement, five1Time);
	displayArray(five2TimeElement, five2Time);
	displayArray(five3TimeElement, five3Time);
	// console.log(five3Time); 


	
	for(var i = 0; i < 256; ++i) {
		if(i<6){
			data[i] = 0;
		}
		
		ctx.fillStyle = gradline[data[i]];
		ctx.fillRect(i, 256 - data[i], 1, data[i]);
	}
}


// 找出峰值的具体位置
function getPeakPos(arr){
	var pos = [];
	var n = [];

	for(var i = 1; i < arr.length; i++){
		if(arr[i] >= arr[i-1] && arr[i] >= arr[i+1] && arr[i] != 0
			&& arr[i] >= arr[i-2] && arr[i] >= arr[i+2] ){			
			pos.push(i); 
		}
	}

	for(var i = 0; i < pos.length; i++){
		var count = 0;

		while((pos[i]+1) == pos[i+1]){
			i++;
			count++;
		}
		if(count != 0){
			n.push(Math.floor((2*pos[i]-count)/2));
		}
		else n.push(pos[i]);
	}
	if(n.length > 0 && n[0] == 2){
		n.shift();
	}
	return n;
}

//添加li标签
function addElementLi(id,number,posValue,fValue){
	var li = document.createElement("li");
	var ul = document.getElementById("ul");
	li.setAttribute("id", id);
	li.innerHTML = "信号" + number + " " + posValue + " " + fValue;
	ul.appendChild();
}

//找到对应点的值
function getPosValue(pos, arr){
	var n = Math.floor(pos * 10.667);
	if(n > arr.length - 2 || n < 2){
		return 0;
	}else return ((arr[n-2]+arr[n-1]+arr[n]+arr[n+1]+arr[n+2])/5);
}

//不同size下的不同频率
function getFrequencyValue(size, value){
	var frequency = 0;
	switch(size){
		case 0: 
			frequency = Math.floor(value/10);
			break;
		case 1:
			frequency = Math.floor(value/20);
			break;
		case 2:
			frequency = Math.floor(value/80);
			break;
	}

	return frequency;
}

// 将非0元素添加进数组 并保持数组长度为5
function pushValue(n, arr){
	var b = [];
	
	if(n){
		if(arr.length >= 5){
			b = arr.slice(1, 5);
			arr = b;
		}
		arr.push(n);
	}
		
	return arr;
}

function keepArrayLength(length, arr){
	var b = [];
	if(arr.length >= length){}
}

// 将数组各个元素显示在元素上
function displayArray(element, arr){
	for(var i = 0; i < arr.length; i++){
		element.innerHTML = element.innerHTML +" "+ arr[i];
	}
}

function getFreqTime(arr){
	var startTime;
	var endTime;
}

function arrEqualZero(arr){
	var flag = 0;
	if(arr.length == 5){
		if(arr[0] == 0 && arr[1] == 0 && arr[2] == 0
			&& arr[3] == 0 && arr[4] == 0){
			flag = 1;
		}
	}

	return flag;
}




Setup();
// setInterval(DrawGraph, 50);

//*********信号1频率改变时清零***********//
freq1.onchange = function(){
	flag1  = 0;
	five1 = [];
	five1Time = [];
}

//*********信号2频率改变时清零***********//
freq2.onchange = function(){
	flag2  = 0;
	five2 = [];
	five2Time = [];
}

//*********信号3频率改变时清零***********//
freq3.onchange =  function(){
	flag3  = 0;
	five3 = [];
	five3Time = [];
}

function BtnClick(){
	flag1  = 0;
	five1 = [];
	five1Time = [];

	flag2  = 0;
	five2 = [];
	five2Time = [];

	flag3  = 0;
	five3 = [];
	five3Time = [];

	nowTime = new Date();
	
}

// setTimeout(init, 2000);

function init(){
	alert("系统初始化完成！");
}

var hhhh = 123;


// *****************  Display

