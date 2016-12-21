(function () {
    var root = this;
    var previousUnderscore = root._;
    var ArrayProto = Array.prototype,
        Objproto = Object.prototype,
        FuncProto = Function.prototype;
    var push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = Objproto.toString,
        hasOwnProperty = Objproto.hasOwnProperty;
    var nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = Function.bind,
        nativeCreate = Object.create;
    var Ctor = function () {};
    var _ = function (obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
        if (typeof exports !== 'undefined') {
            if (typeof module !== 'undefined' && module.exports) {
                exports = module.exports = _;
            }
            exports._ = _;
        } else {
            root._ = _;
        }
    };

    _.VERSION = '1.8.2';

    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount === null ? 3 : argCount) {
            case 1:
                return function (value) {
                    return func.call(context, value);
                };
            case 2:
                return function (value, other) {
                    return func.call(context, value, other);
                };
            case 3:
                return function (value, index, collection) {
                    return func.call(context, value, index, collection);
                };
            case 4:
                return function (accumulator, value, index, collection) {
                    return func.call(context, accumulator, value, index, collection);
                };
        }
        return function () {
            return func.apply(context, arguments);
        }
    };
    var cb = function (value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };
    _.interatee = function (value, context) {
        return cb(value, context, Infinity)
    };
    var createAssigner = function (keyFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index++) {
                var source = arguments[index],
                    keys = keyFunc(source),
                    l = keys.length;
                for (var i = 0; i < l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                }
            }
            return obj;
        }
    };
    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor();
        Ctor.prototype = null;
        return result;
    }
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var isArrayLike = function (collection) {
        var length = collection != null && collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
    var _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
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
    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
    };

    function createReduce(dir) {
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = interatee(memo, obj[currentKey], currentKey, obj);
            };
            return memo;
        }
        return function (obj, interatee, memo, , context) {
            interatee = optimizeCb(interatee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            if (arguments.length < 3) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            return interatee(obj, interatee, memo, keys, index, length);
        };
    };

    _.reduce = _.foldl = _.inject = createReduce(1);
    _.reduceRight = _.foldr = createReduce(-1);
    _.find = _.detect = function(obj,predicate,context){
        var key;
        if(isArrayLike(obj)){
            key = _.findIndex(obj,predicate,context);
        }else{
            key = _.findKey(obj,predicate,context);
        }
        if(key !==void 0 && key !== -1) return obj[key];
    };
    _.filter = _.select = function(obj,predicate,context){
      var results = [];
        predicate = cb(predicate,context);
        _.each(obj,function(value,index,list){
           if(predicate(value,index,list)) results.push(value); 
        });
        return results;
    };
    _.reject = function(obj,predicate,context){
      return _.filter(obj,_.negate(cb(predicate)),context);  
    };
    _.every = _.all = function(obj,predicate,context){
      predicate = cb(predicate,context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for(var index = 0;index<length;index++){
          var currentKey = keys ? keys[index] : index;
            if(!predicate(obj[currentKey],currentKey,obj)) return false;
        };
        return true;
    };
    _.some = _.any = function(obj,predicate,context){
      predicate = cb(predicate.context);
        var keys !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for(var index = 0;index < length;index++){
            var currentKey = keys ? keys[index] : index;
            if(predicate(obj[currentKey],currentKey,obj)) return true;
        }
        return false;
    };
    _.contains = _.includes = _.include = function(obj,target,fromIndex){
        if(!isArrayLike(obj)) obj = _.values(obj);
        return _.indexOf(obj,target,typeof fromIndex == 'number' && fromIndex) >=0;
    };
    _.invoke = function(obj,method){
      var args = slice.call(arguments,2);
        var isFunc = _.isFunction(method);
        return _.map(obj,function(value){
            var func  = isFunc ?method:value[method];
            return func == null ? func : func.apply(value,args);
        });
    };
    _.pluck = function(obj,key){
      return _.map(obj,_.property(key));  
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    






}.call(this));