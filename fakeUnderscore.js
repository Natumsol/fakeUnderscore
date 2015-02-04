(function() {

    var root = this;
    var previousUnderscore = root._;

    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        concat = ArrayProto.concat,
        toString = ArrayProto.toString,
        hasOwnPropersity = ArrayProto.hasOwnPropersity;
    var
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = Function.bind;

    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    var createCallback = function(func, context, argCount) {
        if (context = void 0) return func;
        switch (argCount == null ? 3 : argCount) {
            case 1:
                return function(value) {
                    return func.call(context, value);
                };
            case 2:
                return function(value, other) {
                    return func.call(context, value, other);
                };
            case 3:
                return function(value, index, collection) {
                    return func.call(context, value, index, collection);
                }; // most widely used!
            case 4:
                return function(accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function() {
            return func.call(context, arguments); // 5 arguments or more 
        }
    }

    _.identity = function(value) {
        return value;
    }

    _.isFunction = function(obj) {
        return typeof obj == 'function' || false;
    }

    _.isObject = function(obj) {
        var type = typeof obj;
        return type == 'function' || type === 'object' && !!obj;
    }

    _.property = function(key) {
        return function(obj) { //closure
            return obj[key];
        }
    }

    _.iteratee = function(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return createCallback(value, context, argCount);
        if (_.isObject(value)) return _.match(value);
        return _.property(value);
    };

    _.has = function(obj, key) {
        return obj != null && hasOwnPropersity.call(obj, key);
    }

    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj)
            if (_.has(obj, key)) keys.push(key);
        return keys;
    };

    _.each = _.forEach = function(obj, iteratee, context) {
        if (obj == null) return obj;
        iteratee = createCallback(iteratee, context);
        var i, length = obj.length;
        if (length === +length) {
            for (i = 0; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }
        return obj;
    };

    _.map = _.collect = function(obj, iteratee, context) {
        if (obj == null) return [];
        iteratee = _.iteratee(iteratee, context);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length),
            currentKey;
        for (var index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };
    var reduceError = 'Reduce of empty array with no initial value';

    _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
        if (obj == null) obj = [];
        iteratee = createCallback(iteratee, context, 4);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            index = 0,
            currentKey;
        if (arguments.length < 3) {
            if (!length) throw new TypeError(reduceError);
            memo = obj[keys ? keys[index++] : index++];
        }
        for (; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    }

    _.reduceRight = _.foldR = function(obj, iteratee, memo, context) {
        if (obj == null) obj = [];
        iteratee = createCallback(iteratee, context, 4);
        var keys = obj.length !== +obj.length && _.keys(obj),
            index = (obj || keys).length,
            currentKey;
        if (arguments < 3) {
            if (!index) throw new TypeError(reduceError);
            memo = obj[keys ? keys[--index] : --index];
        }
        while (index--) {
            currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], index, obj);
        }
        return memo;
    }

    _.some = _.any = function(obj, predicate, context) {
        if (obj == null) return false;
        predicate = _.iteratee(predicate, context);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            index, currentKey;
        for (index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    }

    _.every = _.all = function(obj, predicate, context) {
        if (obj == null) obj = [];
        predicate = _.iteratee(predicate, context);
        var keys = obj.length !== +obj.length && _.keys(obj),
            length = (keys || obj).length,
            index, currentKey;
        for (index = 0; index < length; index++) {
            currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    }

    _.find = _.detect = function(obj, predicate, context) {
        var result;
        predicate = _.iteratee(predicate, context);
        _.some(obj, function(value, index, list) {
            if (predicate(value, index, list)) {
                result = value;
                return true;
            }
        });
        return result;
    }

    _.filter = _.select = function(obj, predicate, context) {
        var results = [];
        if (obj == null) return results;
        predicate = _.iteratee(predicate, context);
        _.each(obj, function(value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    }

    _.negate = function(predicate) {
        return function() {
            return !predicate.apply(this, arguments);
        }
    }

    _.reject = function(obj, predicate, context) {
        return _.filter(obj, _.negate(_.iteratee(predicate)), context);
    }


    _.contains = _.include = function(obj, target) {
        if (obj == null) return false;
        if (obj.length !== +obj.length) obj = _.values(obj);
        return _.indexOf(obj, target) >= 0;
    }

    _.values = function(obj) {
        var keys = _.keys(obj),
            length = keys.length,
            index, results = Array(length);
        for (index = 0; index < length; index++) {
            results[index] = (obj[keys[index]]);
        }
        return results;
    }


    _.indexOf = function(array, item, isSorted) {
        if (array == null) return -1;
        var i = 0,
            length = array.length;
        if (isSorted) {
            if (typeof isSorted == 'number') {
                i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        for (; i < length; i++)
            if (array[i] === item) return i;
        return -1;
    }

    _.sortedIndex = function(array, obj, iteratee, context) {
        iteratee = _.iteratee(iteratee, context, 1);
        var value = iteratee(obj),
            low = 0,
            high = array.length;
        while (low < high) {
            var mid = low + high >>> 1; //equal to  mid = (low + high) / 2 
            if (iteratee(array[mid]) < value) low = mid + 1;
            else high = mid;
        }
        return low;
    }

    _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    };

    _.pluck = function(obj, key) {
        return _.map(obj, _.property(key));
    }

    _.where = function(obj, attrs) {
        return _.find(obj, _.mathes(attrs));
    }
    _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
    }
    _.matches = function(attrs) {
        var pairs = _.pairs(attrs),
            length = pairs.length;
        return function(obj) { // 返回一个断言函数 function(value, index, list){};
            if (obj == null) return !length;
            obj = new Object(obj); // 防止改变原来的对象
            for (var i = 0; i < length; i++) {
                var pair = pairs[i],
                    key = pair[0];
                if (pair[1] !== obj[key] || !(key in obj)) return false;
            }
            return true;
        }
    }

    _.where = function(obj, attrs) {
        return _.filter(obj, _.matches(attrs));
    }// 返回只包含attrs键值对的对象

    _.findWhere= function(obj, attrs) {
        return _.find(obj, _.matches(attrs));
    }

    _.max = function(obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if(iteratee == null && obj != null) {//没有遍历函数
            obj = obj.length === +obj.length ? obj : _.values(obj);
            for(var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value > result) {
                    result = value;
                }
            }
        } else {//存在遍历函数,返回使遍历函数最大的obj里面的值，也就是说返回是iteratee函数最大的变量obj[index]
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function(value, index, list) {
                computed = iteratee(value, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            });
        }
       
        return result;
    }

    _.min = function(obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if(iteratee == null && obj != null) {
            obj = obj.length === +obj.length ? obj : _.values(obj);
            for(var i = 0, i < obj.length; i ++) {
                value = obj[i];
                if(value < result) {
                    result = value;
                }
            }
        } else {
            iteratee = _.iteratee(iteratee, context);
            _.each(obj, function(value, index, list) {
                computed = iteratee(value, index, list);
                if(computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            })
        }
        return result;
    };

    _.sample = function(obj, n, guard) {
        if (n == null || guard) {
            obj = obj.length == +obj.length ? obj : _.values(obj);
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    }//随机返回一个集合里面的n个值

    _.random = function(min, max) {
        if(max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    _.shuffle = function(obj) {
        
    }







}.call(this));