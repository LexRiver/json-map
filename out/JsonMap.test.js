"use strict";
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
var JsonMap_1 = require("./JsonMap");
test('JsonMap', function () {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    var x = new JsonMap_1.JsonMap();
    x.set({ aa: 'aa' }, 'aaaa');
    x.set({ bb: 'bb' }, 'bbbb');
    expect(x.get({ aa: 'aa' })).toEqual('aaaa');
    expect(x.has({ bb: 'bb' })).toBeTruthy();
    expect(x.size).toEqual(2);
    var counter = 0;
    try {
        for (var x_1 = __values(x), x_1_1 = x_1.next(); !x_1_1.done; x_1_1 = x_1.next()) {
            var _e = __read(x_1_1.value, 2), k = _e[0], v = _e[1];
            if (counter == 0) {
                expect(k).toEqual({ aa: 'aa' });
                expect(v).toEqual('aaaa');
            }
            else if (counter == 1) {
                expect(k).toEqual({ bb: 'bb' });
                expect(v).toEqual('bbbb');
            }
            counter++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (x_1_1 && !x_1_1.done && (_a = x_1.return)) _a.call(x_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    x.delete({ aa: 'aa' });
    expect(x.size).toEqual(1);
    expect(x.has({ aa: 'aa' })).toBeFalsy();
    expect(x.get({ bb: 'bb' })).toEqual('bbbb');
    x.set({ cc: 'cc' }, 'cccc');
    //keys
    counter = 0;
    try {
        for (var _f = __values(x.keys()), _g = _f.next(); !_g.done; _g = _f.next()) {
            var k = _g.value;
            if (counter == 0) {
                expect(k).toEqual({ bb: 'bb' });
            }
            else if (counter == 1) {
                expect(k).toEqual({ cc: 'cc' });
            }
            counter++;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
        }
        finally { if (e_2) throw e_2.error; }
    }
    //values
    counter = 0;
    try {
        for (var _h = __values(x.values()), _j = _h.next(); !_j.done; _j = _h.next()) {
            var v = _j.value;
            if (counter == 0) {
                expect(v).toEqual('bbbb');
            }
            else if (counter == 1) {
                expect(v).toEqual('cccc');
            }
            counter++;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
        }
        finally { if (e_3) throw e_3.error; }
    }
    //entries
    counter = 0;
    try {
        for (var _k = __values(x.entiries()), _l = _k.next(); !_l.done; _l = _k.next()) {
            var _m = __read(_l.value, 2), k = _m[0], v = _m[1];
            if (counter == 0) {
                expect(k).toEqual({ bb: 'bb' });
                expect(v).toEqual('bbbb');
            }
            else if (counter == 1) {
                expect(k).toEqual({ cc: 'cc' });
                expect(v).toEqual('cccc');
            }
            counter++;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_l && !_l.done && (_d = _k.return)) _d.call(_k);
        }
        finally { if (e_4) throw e_4.error; }
    }
    //foreach
    counter = 0;
    x.forEach(function (k, v) {
        if (counter == 0) {
            expect(k).toEqual({ bb: 'bb' });
            expect(v).toEqual('bbbb');
        }
        else if (counter == 1) {
            expect(k).toEqual({ cc: 'cc' });
            expect(v).toEqual('cccc');
        }
        counter++;
    });
    //clear
    x.clear();
    expect(x.size).toEqual(0);
    expect(x.get({ aa: 'aa' })).toEqual(undefined);
    expect(x.get({ bb: 'bb' })).toEqual(undefined);
    expect(x.get({ cc: 'cc' })).toEqual(undefined);
    expect(x.has({ cc: 'cc' })).toEqual(false);
    x.set({ aa: 'aa', bb: { bbb: 'bbb' } }, 'deep');
    expect(x.get({ aa: 'aa', bb: { bbb: 'bbb' } })).toEqual('deep');
    expect(x.get({ bb: { bbb: 'bbb' }, aa: 'aa' })).toEqual('deep');
    expect(x.get({ bb: { bbb: 'bbb', wrong: 'wrong' }, aa: 'aa' })).toEqual(undefined);
    //to json 
    x.clear();
    x.set({ aa: 'aa' }, 'aaaa');
    x.set({ bb: 'bb' }, 'bbbb');
    expect(x.toJsonString()).toEqual("[[{\"aa\":\"aa\"},\"aaaa\"],[{\"bb\":\"bb\"},\"bbbb\"]]");
    //from json
    var y = new JsonMap_1.JsonMap(JSON.parse(x.toJsonString()));
    expect(y.get({ aa: 'aa' })).toEqual('aaaa');
    expect(y.get({ bb: 'bb' })).toEqual('bbbb');
    x.clear();
    x.initFromJsonString(y.toJsonString());
    expect(x.get({ aa: 'aa' })).toEqual('aaaa');
    expect(x.get({ bb: 'bb' })).toEqual('bbbb');
});
test('typed object as key', function () {
    var x = new JsonMap_1.JsonMap();
    x.set({ name: 'John', age: 10 }, 100);
    x.set({ name: 'Smith', age: 20 }, 200);
    expect(x.get({ name: 'John', age: 10 })).toEqual(100);
    expect(x.get({ name: 'John', age: 20 })).toBeUndefined();
    expect(x.get({ name: 'smith', age: 20 })).toBeUndefined();
    expect(x.get({ name: 'Smith', age: 20 })).toEqual(200);
});
test('string keys', function () {
    var x = new JsonMap_1.JsonMap();
    x.set('aa', 11);
    expect(x.get('aa')).toEqual(11);
});
test('number keys', function () {
    var x = new JsonMap_1.JsonMap();
    x.set(11, 'aa');
    expect(x.get(11)).toEqual('aa');
});
test('boolean keys', function () {
    var x = new JsonMap_1.JsonMap();
    x.set(true, 1);
    x.set(false, 1);
    x.set(false, 0);
    expect(x.get(true)).toEqual(1);
    expect(x.get(false)).toEqual(0);
});
test('iterable', function () {
    var e_5, _a;
    var x = new JsonMap_1.JsonMap();
    x.set(1, 2);
    x.set(3, 4);
    var sum = 0;
    try {
        for (var x_2 = __values(x), x_2_1 = x_2.next(); !x_2_1.done; x_2_1 = x_2.next()) {
            var _b = __read(x_2_1.value, 2), k = _b[0], v = _b[1];
            sum += k;
            sum += v;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (x_2_1 && !x_2_1.done && (_a = x_2.return)) _a.call(x_2);
        }
        finally { if (e_5) throw e_5.error; }
    }
    expect(sum).toEqual(1 + 2 + 3 + 4);
});
