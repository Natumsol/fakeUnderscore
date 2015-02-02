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
    /**
     * [createCallback description]
     * @param  {[type]} func     [description]
     * @param  {[type]} context  [description]
     * @param  {[type]} argCount [description]
     * @return {[type]}          [description]
     */
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
        /**
         * [identity description]
         * @param  {[type]} value [description]
         * @return {[type]}       [description]
         */
    _.identity = function(value) {
            return value;
        }
        /**
         * [isFunction description]
         * @param  {[type]}  obj [description]
         * @return {Boolean}     [description]
         */
    _.isFunction = function(obj) {
            return typeof obj == 'function' || false;
        }
        /**
         * [isObject description]
         * @return {Boolean} [description]
         */
    _.isObject = function() {
            var type = typeof obj;
            return type == 'function' || type === 'object' && !!obj;
        }
        /**
         * [property description]
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
    _.property = function(key) {
            return function(obj) { //closure
                return obj[key];
            }
        }
        /**
         * [iteratee description]
         * @param  {[type]} value    [description]
         * @param  {[type]} context  [description]
         * @param  {[type]} argCount [description]
         * @return {[type]}          [description]
         */
    _.iteratee = function(value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return createCallback(value, context, argCount);
        if (_.isObject(value)) return _.match(value);
        return _.property(value);
    };
    /**
     * [has description]
     * @param  {[type]}  obj [description]
     * @param  {[type]}  key [description]
     * @return {Boolean}     [description]
     */
    _.has = function(obj, key) {
            return obj != null && hasOwnPropersity.call(obj, key);
        }
        /**
         * [keys description]
         * @param  {[type]} obj [description]
         * @return {[type]}     [description]
         */
    _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj)
            if (_.has(obj, key)) keys.push(key);
        return keys;
    };
    /**
     * [forEach description]
     * @param  {[type]} obj      [description]
     * @param  {[type]} iteratee [description]
     * @param  {[type]} context  [description]
     * @return {[type]}          [description]
     */
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
    /**
     * [collect description]
     * @param  {[type]} obj      [description]
     * @param  {[type]} iteratee [description]
     * @param  {[type]} context  [description]
     * @return {[type]}          [description]
     */
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
    /**
     * [inject description]
     * @param  {[type]} obj      [description]
     * @param  {[type]} iteratee [description]
     * @param  {[type]} memo     [description]
     * @param  {[type]} context  [description]
     * @return {[type]}          [description]
     */
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
        /**
         * [foldR description]
         * @param  {[type]} obj      [description]
         * @param  {[type]} iteratee [description]
         * @param  {[type]} memo     [description]
         * @param  {[type]} context  [description]
         * @return {[type]}          [description]
         */
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
        /**
         * [any description]
         * @param  {[type]} obj       [description]
         * @param  {[type]} predicate [description]
         * @param  {[type]} context   [description]
         * @return {[type]}           [description]
         */
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
        /**
         * [all description]
         * @param  {[type]} obj       [description]
         * @param  {[type]} predicate [description]
         * @param  {[type]} context   [description]
         * @return {[type]}           [description]
         */
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
        /**
         * [detect description]
         * @param  {[type]} obj       [description]
         * @param  {[type]} predicate [description]
         * @param  {[type]} context   [description]
         * @return {[type]}           [description]
         */
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
        /**
         * [select description]
         * @param  {[Object]} obj           [description]
         * @param  {[Function]} predicate   [description]
         * @param  {[Object]} context       [description]
         * @return {[Boolean]}              [description]
         */
    _.filter = _.select = function(obj, predicate, context) {
            var results = [];
            if (obj == null) return results;
            predicate = _.iteratee(predicate, context);
            _.each(obj, function(value, index, list) {
                if (predicate(value, index, list)) results.push(value);
            });
            return results;
        }
        /**
         * [negate description]
         * @param  {[type]} predicate [description]
         * @return {[type]}           [description]
         */
    _.negate = function(predicate) {
            return function() {
                return !predicate.apply(this, arguments);
            }
        }
        /**
         * [reject description]
         * @param  {[type]} obj       [description]
         * @param  {[type]} predicate [description]
         * @param  {[type]} context   [description]
         * @return {[type]}           [description]
         */
    _.reject = function(obj, predicate, context) {
        return _.filter(obj, _.negate(_.iteratee(predicate)), context);
    }

    /**
     * [_include description]
     * @param  {[type]} obj    [description]
     * @param  {[type]} target [description]
     * @return {[type]}        [description]
     */
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

    _.invoke = function(obj ,method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            
        }) 
    }


}.call(this));