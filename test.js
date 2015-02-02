var obj = [1,2,3,4,5];
var results = _.reduce(obj, function(memo, value, index, collection) {
	console.log(memo);
	return memo + value;
},100)
console.log(results);
