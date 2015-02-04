/*var obj = [1,2,3,4,5,6,7,8,9,0];
var amplify2 = function(args) {
	return 2 * this;
}
console.log("%c" + _.invoke(obj, amplify2),"color: red");
var a = {
	name: 1,
	age: 23
}
_.contains(a, 1);

var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];

console.log("%c" + _.pluck(stooges, "name"), "color:green");*/


/*var a = {
	name: 'liujia',
	age: 1,
	education: "master"
}
var b = _.pairs(a);

var ready = _.matches({
	name: "liujia",
	age: 23
})

var list = [
	{
		name: "liujia",
		age: 23
	},
	{
		name: "liujia",
		age: 23,
		education : "master"
	},
	{
		name: "liujia",
		age: 1
	}
];
var result = _.filter(list, ready);*/


var list = [-5,-2,-1,1,2];
var max1 = _.max(list);
var max2 = _.max(list, function(value, index, list) {
	return value * value;
})