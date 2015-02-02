var obj = [1,2,3,4,5,6,7,8,9,0];
var results = _.filter(obj, function(value, index, list) {
	return value % 2 == 0;
})
console.log(results);
var a = {
	name: 1,
	age: 23
}
_.contains(a, 1);