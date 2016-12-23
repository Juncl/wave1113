navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

var nowTime = new Date();
var audioctx = new (window.AudioContext || window.webkitAudioContext)();
var drawVisual;

var buffer = null;

var mode = 0;
var fileMode = 0;

var fftSizeMode = 1;
var src = null;
var stream;
var analyser = audioctx.createAnalyser();
analyser.minDecibels = -70;
analyser.maxDecibels = -30;
analyser.fftSize = 512;

var distortion = audioctx.createWaveShaper();
var gainNode = audioctx.createGain();


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
	// fileMode = document.getElementById("fileMode").selectedIndex;
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


var freq1 = document.getElementById("freq1");
var freq2 = document.getElementById("freq2");
var freq3 = document.getElementById("freq3");

freq1.value = 15;
freq2.value = 17;
freq3.value = 18;


var btnPlay = document.getElementById("btnPlay");

function DrawGraph() {
	// drawVisual = requestAnimationFrame(DrawGraph);

	var ss = new Date().getTime();

	ctx.fillStyle = gradbase;
	ctx.fillRect(0, 0, 256, 256);
	
	var data = new Uint8Array(256);
	
	
	analyser.getByteFrequencyData(data); //Spectrum Data

	for(var i = 0; i < 256; ++i) {
		if(i<6){
			data[i] = 0;
		}
		if(i>100 && data[i] > 0){
			console.log(i+" "+data[i]);
		}
		
		ctx.fillStyle = gradline[data[i]];
		ctx.fillRect(i, 256 - data[i], 1, data[i]);
	}

}



//找到对应点的值
function getPosValue(pos, arr){
	// pos = pos * 2;
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
setInterval(DrawGraph, 5);
// setInterval(loadJSON(0,Math.random()), 2000);

//*********信号1频率改变时清零***********//
freq1.onchange = function(){
	flag1  = 0;
	five1 = [];
	five1Time = [];
	console.log("Freq1 change.");
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

// *****************  Display


function loadJSON(id, time){
    // var data_file = "http://www.tutorialspoint.com/json/data.json";
    var data_file = "http://172.18.216.144:3000/api2?id="+id+"&time="+time;
            
    var http_request = new XMLHttpRequest();
    try{
        // Opera 8.0+, Firefox, Chrome, Safari
        http_request = new XMLHttpRequest();
        }catch (e){
            // Internet Explorer Browsers
            try{
                http_request = new ActiveXObject("Msxml2.XMLHTTP");
					
            }catch (e) {
				
                try{
                    http_request = new ActiveXObject("Microsoft.XMLHTTP");
                }catch (e){
                    // Something went wrong
                    alert("Your browser broke!");
                    return false;
               	}
					
            }
        }
			
        http_request.onreadystatechange = function(){
			
            if (http_request.readyState == 4  ){
                // Javascript function JSON.parse to parse JSON data
                var jsonObj = JSON.parse(http_request.responseText);

                console.log(jsonObj[0]);
				// console.log(jsonArr[1]);
				var api2data = document.getElementById("api2data");
				api2data.innerHTML = jsonObj[0][0].stime;

            }
        }
		http_request.open("GET", data_file, true);
        http_request.send();
}





