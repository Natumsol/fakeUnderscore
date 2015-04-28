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

/*
var list = [-5,-2,-1,1,2];
var max1 = _.max(list);
var max2 = _.max(list, function(value, index, list) {
	return value * value;
})
var list_ = _.shuffle(list);*/

/*var list = [
	{
		name: "liujia1",
		age: -22,
	},
	{
		name: "liujia2",
		age: 21,
		education : "master"
	},
	{
		name: "liujia3",
		age: 20
	}
];

var iteratee = function(value, index, list) {
	return value.age *  value.age;
}

var result = _.sortBy(list, iteratee);
*/


var mykeys = function(obj) {
	var keys = [];
	if (obj == null) return keys;
	if (Object.keys) keys = Object.keys(obj);
	else
		for (var key in obj) {
			if (Object.prototype.hasOwnProperty(key)) {
				keys.push(key);
			}
		}

	return keys;
}

var myReduce = function(obj, iteratee, memo, context) {
	if(obj == null) obj = [];
	iteratee = _.iteratee(iteratee);
	var keys = obj.length !== +obj.length && mykeys(obj),
		length = (keys || obj).length,
		currentKey,index = 0;
	if(arguments.length < 3) {
		if(!length) throw new TypeError("Reduce of empty array with no initial value");
		memo = obj[keys ? keys[index ++] : index ++];
	}

	for(; index < length ; index ++) {
		currentKey = keys ? keys[index] : index;
		memo = iteratee(memo, obj[currentKey], currentKey, obj);
	}
	return memo;
}

var myReduceRight = function(obj, iteratee, memo, context) {
	if(obj == null) obj = [];
	iteratee = _.iteratee(iteratee);
	var keys = obj.length !== +obj.length && mykeys(obj),
		length = (keys || obj).length,
		currentKey,index = length -1;
	if(arguments.length < 3) {
		if(!length) throw new TypeError("Reduce of empty array with no initial value");
		memo = obj[keys ? keys[index --] : index --];
	}

	for(; index >= 0 ; index --) {
		currentKey = keys ? keys[index] : index;
		memo = iteratee(memo, obj[currentKey], currentKey, obj);
	}
	return memo;
}

function shuffle1(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * array.length);

    // If not already shuffled, move it to the new array.
    if (i in array) {
      copy.push(array[i]);
      delete array[i];
      n--;
    }
  }

  return copy;
}

function shuffle2(array) {
  var copy = [], n = array.length, i;

  // While there remain elements to shuffle…
  while (n) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * n--);

    // And move it to the new array.
    copy.push(array.splice(i, 1)[0]);
  }

  return copy;
}

function shuffle(array) {
	var temp;
	for(var i = array.length, rand; i >= 0 ; i --) {
		rand = _.random(i);
		console.time("swap");
		temp = array[i];
		array[i] = array[rand];
		array[rand] = temp;
		console.timeEnd("swap");
	}
	return array;
}


function shuffle_inside_out(obj){
	var result = [];
	if(obj == null) return result;
	for(var index = 0, rand; index < obj.length; index ++) {
		rand = _.random(index);
		if(index !== rand) result[index] = result[rand];
		result[rand] = obj[index];
	}
	return result;
}

for(var i = 0, target1 = [],target2 = []; i < 1000000; i ++){
	target1.push(i);
	target2.push(i);
}
var result = [];

/*console.time("shuffle")
result.push(shuffle1(target1));
console.timeEnd("shuffle");*/

console.time("shuffle_inside_out")
result.push(shuffle_inside_out(target2));
console.timeEnd("shuffle_inside_out");

console.time("_.shuffle")
result.push(_.shuffle(target2));
console.timeEnd("_.shuffle");