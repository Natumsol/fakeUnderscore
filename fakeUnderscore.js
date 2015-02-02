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
    _.isObject = function() {
        var type = typeof obj;
        return type == 'function' || type === 'object' && !!obj;

    }
    _.property = function(key) {
        return function(obj) {//closure
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
        if(!_.isObject(obj)) return [];
        if(nativeKeys) return nativeKeys(obj);
        var keys = [];
        for(var key in obj) if (_.has(obj, key)) keys.push(key);
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
        if(obj == null ) return [];
        iteratee = _.iteratee(iteratee, context);
        var keys = obj.length !== + obj.length && _.keys(obj),
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
            index = 0, currentKey;
            if(arguments.length < 3) {
                if (!length) throw new TypeError(reduceError);
                memo = obj[keys ? keys[index++] : index++]; 
            }
            for(; index < length; index++) {
                currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
        return memo;
    }
    _.reduceRight = _.foldR = function(obj, iteratee, memo, context) {
        if (obj = null) obj = [];
        iteratee = createCallback(iteratee, context, 4);
        var keys = obj.length !== +obj.length && _.keys(obj),
            index = (obj || keys).length,
            currentKey;
        if (arguments < 3) {
            if(!index) throw new TypeError(reduceError);
            memo = obj[keys ? keys[--index]: --index];
        }
        while(index--) {
            currentKey = keys ? keys[index]: index;
            memo = iteratee(memo, obj[currentKey], index, obj);
        }
        return memo;
    }

}.call(this));