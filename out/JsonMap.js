import { DataTypes } from '@lexriver/data-types';
export class JsonMap {
    constructor(initValue) {
        this.internalMap = new Map();
        if (initValue) {
            this.internalMap = new Map(initValue);
        }
        else {
            this.internalMap = new Map();
        }
    }
    *[Symbol.iterator]() {
        for (let [k, v] of this.internalMap.entries()) {
            yield [k, v];
        }
    }
    get size() {
        return this.internalMap.size;
    }
    clear() {
        return this.internalMap.clear();
    }
    delete(key) {
        if (DataTypes.isPrimitive(key))
            return this.internalMap.delete(key);
        for (let internalKey of this.internalMap.keys()) {
            if (DataTypes.isEqual(key, internalKey)) {
                return this.internalMap.delete(internalKey);
            }
        }
    }
    entiries() {
        return this.internalMap.entries();
    }
    forEach(action) {
        this.internalMap.forEach((v, k) => action(k, v));
    }
    get(key) {
        if (DataTypes.isPrimitive(key))
            return this.internalMap.get(key);
        for (let internalKey of this.internalMap.keys()) {
            if (DataTypes.isEqual(key, internalKey)) {
                return this.internalMap.get(internalKey);
            }
        }
        return undefined;
    }
    has(key) {
        if (DataTypes.isPrimitive(key))
            return this.internalMap.has(key);
        for (let internalKey of this.internalMap.keys()) {
            if (DataTypes.isEqual(key, internalKey)) {
                return true;
            }
        }
        return false;
    }
    keys() {
        return this.internalMap.keys();
    }
    set(key, value) {
        if (DataTypes.isPrimitive(key)) {
            this.internalMap.set(key, value);
            return this;
        }
        for (let internalKey of this.internalMap.keys()) {
            if (DataTypes.isEqual(key, internalKey)) {
                this.internalMap.set(internalKey, value);
                return this;
            }
        }
        // key not found
        this.internalMap.set(key, value);
        return this;
    }
    values() {
        return this.internalMap.values();
    }
    toArray() {
        return Array.from(this.internalMap);
    }
    toJsonString(pretty = false) {
        //console.log('this.internalMap=', this.internalMap)
        return JSON.stringify(Array.from(this.internalMap), null, pretty ? 4 : undefined);
    }
    initFromJsonString(jsonString) {
        this.internalMap = new Map(JSON.parse(jsonString));
    }
    initFromArray(initValue) {
        this.internalMap = new Map(initValue);
    }
}
