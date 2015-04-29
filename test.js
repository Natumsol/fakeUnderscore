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

var _keys = function(obj) {
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

var sortBy = function(obj, iteratee, context) {
	iteratee = _.iteratee(iteratee, context);
	return pluck(map(obj, function(value, index, obj){
		return {
			value: value,
			index: index,
			criterion: iteratee(value, index, obj)
		}
	}).sort(function(left, right){
		var a = left.criterion,
			b = right.criterion;
		if(a !== b) {
			return a - b;
		}
		return a.index - b.index
	}), "value")
}

var pluck = function(obj, key){
	return map(obj, property(key));
}

var property = function(key){
	return function(obj) {
		return obj[key];
	}
}

var map = function(obj, iteratee, context) {
	var results = [];
	if(obj == null) return results;
	iteratee = _.iteratee(iteratee, context);
	var keys = obj.length !== +obj.length && _keys(obj),
		length = (keys || obj).length,
		currentKey, index;
	for(index = 0; index < length; index ++) {
		currentKey = keys ? keys[index] : index;
		results.push(iteratee(obj[currentKey], currentKey, obj));
	}

	return results;
}

var group = function(behavior) {
	var result = {};
	return function(obj, iteratee, context) {
		iteratee = _.iteratee(iteratee, context);
		each(obj, function(value, index, obj){
			var key = iteratee(value, index, obj);
			behavior(result, value, key)
		})
		return result;
	}
}

var groupBy = group(function(result, value, key) {
	if(has(result, key)) result[key].push(value);
	else result[key] = [value];
})

var has = function(obj, key) {
	return obj !== null && Object.prototype,hasOwnProperty.call(obj, key);
}

var each = function(obj, iteratee, context) {
	if(obj == null) return obj;
	iteratee = _.iteratee(iteratee, context);
	var keys = obj.length !== +obj.length && _keys(obj),
		length = (keys || obj).length,
		currentKey, index;
	for(index = 0; index < length; index ++) {
		currentKey = keys ? key[index] : index;
		iteratee(obj[currentKey], currentKey, obj);
	}

	return obj;
}

var flatten = function(array) {
	var result = [];
	for(var i = 0; i < array.length; i ++) {
		if(_.isArray(array[i])){
			result = result.concat(flatten(array[i]))
		} else {
			result.push(array[i])
		}
	}
	return result;
}
