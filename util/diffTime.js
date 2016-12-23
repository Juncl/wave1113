var a = ['226338', '228240','230343','232256'];
var b = ['226348','230451','250451'];

function diffTime(arr1, arr2){
	var arr = [];
	var l1 = arr1.length;
	var l2 = arr2.length;

	var count = 0, s2 = 0;

	for(var i = 0; i < l2; i++){
		var find = arr2[i].slice(0, 3);
		for(var j = s2; j < l1; j++){
			if(arr1[j].indexOf(find) != -1){
				arr.push(parseFloat(arr2[i])-parseFloat(arr1[j]));
				s2 = j + 1;
				break;
			}
			count++;
		}
		
	}
	console.log("find times: "+count*l1);

	return arr;
}

console.log(diffTime(a, b));