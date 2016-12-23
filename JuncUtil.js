var Point = function(x, y){
    this.x = x;
    this.y = y;
    this.z = 0;
    var that = this;

	return {
		getX: function(){
			return that.x;
		},

		getY: function(){
			return that.y;
		},

		getZ: function(){
			return that.z;
		},

		setX: function(n){
			that.x = n;
		},

		setY: function(n){
			that.y = n;
		},

		setZ: function(n){
			that.z = n;
		},

		setXYZ: function(nx, ny, nz){
			that.x = nx;
			that.y = ny;
			that.z = nz;
		}
	};
}

var JuncUtil = function(){
	var temperature = 25; // 温度预设为25摄氏度
	var c = 331 + 0.6*temperature;

}

JuncUtil.getDistance = function(t){
	return (340/1000*t);
}

JuncUtil.getPosition = function(t1, t2, t3){
	var point = new Point(0, 0);

	var d1 = this.getDistance(t1),
	    d2 = this.getDistance(t2),
	    d3 = this.getDistance(t3);

	point.x = ((d1*d1 - d2*d2 + 4)/4*100).toFixed(2);
	point.y = ((d1*d1 - d3*d3 + 4)/4*100).toFixed(2);

	return point;
}

JuncUtil.getNewTimeData = function(arr1, arr2, arr3){
	var arr = [];
	if(arr1){
		arr[0] = arr1[arr1.length - 1];
	}

	if(arr2){
		arr[1] = arr2[arr2.length - 1];
	}

	if(arr3){
		arr[2] = arr3[arr3.length - 1];
	}

	if(!arr1 || !arr2 || !arr3){
		
	}
}

JuncUtil.timeToShortTime = function(n){
	return parseFloat(n.toString().slice(6));
}


console.log(JuncUtil.getPosition(7, 6, 7));