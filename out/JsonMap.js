"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonMap = void 0;
var lex_data_types_1 = require("lex-data-types");
var JsonMap = /** @class */ (function () {
    function JsonMap(initValue) {
        this.internalMap = new Map();
        if (initValue) {
            this.internalMap = new Map(initValue);
        }
        else {
            this.internalMap = new Map();
        }
    }
    JsonMap.prototype[Symbol.iterator] = function () {
        var _a, _b, _c, k, v, e_1_1;
        var e_1, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, 6, 7]);
                    _a = __values(this.internalMap.entries()), _b = _a.next();
                    _e.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    _c = __read(_b.value, 2), k = _c[0], v = _c[1];
                    return [4 /*yield*/, [k, v]];
                case 2:
                    _e.sent();
                    _e.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_1_1 = _e.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    Object.defineProperty(JsonMap.prototype, "size", {
        get: function () {
            return this.internalMap.size;
        },
        enumerable: false,
        configurable: true
    });
    JsonMap.prototype.clear = function () {
        return this.internalMap.clear();
    };
    JsonMap.prototype.delete = function (key) {
        var e_2, _a;
        if (lex_data_types_1.DataTypes.isPrimitive(key))
            return this.internalMap.delete(key);
        try {
            for (var _b = __values(this.internalMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var internalKey = _c.value;
                if (lex_data_types_1.DataTypes.isEqual(key, internalKey)) {
                    return this.internalMap.delete(internalKey);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    JsonMap.prototype.entiries = function () {
        return this.internalMap.entries();
    };
    JsonMap.prototype.forEach = function (action) {
        this.internalMap.forEach(function (v, k) { return action(k, v); });
    };
    JsonMap.prototype.get = function (key) {
        var e_3, _a;
        if (lex_data_types_1.DataTypes.isPrimitive(key))
            return this.internalMap.get(key);
        try {
            for (var _b = __values(this.internalMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var internalKey = _c.value;
                if (lex_data_types_1.DataTypes.isEqual(key, internalKey)) {
                    return this.internalMap.get(internalKey);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return undefined;
    };
    JsonMap.prototype.has = function (key) {
        var e_4, _a;
        if (lex_data_types_1.DataTypes.isPrimitive(key))
            return this.internalMap.has(key);
        try {
            for (var _b = __values(this.internalMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var internalKey = _c.value;
                if (lex_data_types_1.DataTypes.isEqual(key, internalKey)) {
                    return true;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    };
    JsonMap.prototype.keys = function () {
        return this.internalMap.keys();
    };
    JsonMap.prototype.set = function (key, value) {
        var e_5, _a;
        if (lex_data_types_1.DataTypes.isPrimitive(key)) {
            this.internalMap.set(key, value);
            return this;
        }
        try {
            for (var _b = __values(this.internalMap.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var internalKey = _c.value;
                if (lex_data_types_1.DataTypes.isEqual(key, internalKey)) {
                    this.internalMap.set(internalKey, value);
                    return this;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        // key not found
        this.internalMap.set(key, value);
        return this;
    };
    JsonMap.prototype.values = function () {
        return this.internalMap.values();
    };
    JsonMap.prototype.toArray = function () {
        return Array.from(this.internalMap);
    };
    JsonMap.prototype.toJsonString = function (pretty) {
        if (pretty === void 0) { pretty = false; }
        //console.log('this.internalMap=', this.internalMap)
        return JSON.stringify(Array.from(this.internalMap), null, pretty ? 4 : undefined);
    };
    JsonMap.prototype.initFromJsonString = function (jsonString) {
        this.internalMap = new Map(JSON.parse(jsonString));
    };
    JsonMap.prototype.initFromArray = function (initValue) {
        this.internalMap = new Map(initValue);
    };
    return JsonMap;
}());
exports.JsonMap = JsonMap;
