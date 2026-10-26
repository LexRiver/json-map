import { DataTypes } from '@lexriver/data-types'

const SERIALIZATION_FORMAT = '@lexriver/json-map'
const SERIALIZATION_VERSION = 1
const VALUE_TAG = '$jsonMapValue'

type SerializedValue = null | boolean | string | number | {
    [VALUE_TAG]: 'undefined'
} | {
    [VALUE_TAG]: 'number'
    value: 'NaN' | 'Infinity' | '-Infinity' | '-0'
} | {
    [VALUE_TAG]: 'date'
    value: SerializedValue
} | {
    [VALUE_TAG]: 'array'
    length: number
    entries: [number, SerializedValue][]
} | {
    [VALUE_TAG]: 'object'
    entries: [string, SerializedValue][]
}

type SerializedJsonMap = {
    format: typeof SERIALIZATION_FORMAT
    version: typeof SERIALIZATION_VERSION
    entries: [SerializedValue, SerializedValue][]
}

function serializeValue(value:unknown, ancestors:Set<object>, path:string):SerializedValue{
    if(value === null || typeof value === 'string' || typeof value === 'boolean') return value
    if(typeof value === 'number'){
        if(Number.isNaN(value)) return {[VALUE_TAG]: 'number', value: 'NaN'}
        if(value === Infinity) return {[VALUE_TAG]: 'number', value: 'Infinity'}
        if(value === -Infinity) return {[VALUE_TAG]: 'number', value: '-Infinity'}
        if(Object.is(value, -0)) return {[VALUE_TAG]: 'number', value: '-0'}
        return value
    }
    if(value === undefined) return {[VALUE_TAG]: 'undefined'}
    if(typeof value !== 'object'){
        throw new TypeError(`Cannot serialize ${typeof value} at ${path}`)
    }
    if(ancestors.has(value)){
        throw new TypeError(`Cannot serialize circular value at ${path}`)
    }

    ancestors.add(value)
    try {
        if(value instanceof Date){
            if(Object.keys(value).length > 0 || Object.getOwnPropertySymbols(value).some(symbol => Object.prototype.propertyIsEnumerable.call(value, symbol))){
                throw new TypeError(`Cannot serialize properties attached to Date at ${path}`)
            }
            return {
                [VALUE_TAG]: 'date',
                value: serializeValue(value.getTime(), ancestors, `${path}.getTime()`)
            }
        }
        if(Array.isArray(value)){
            const entries:[number, SerializedValue][] = []
            for(let index = 0; index < value.length; index++){
                if(Object.hasOwn(value, index)){
                    entries.push([index, serializeValue(value[index], ancestors, `${path}[${index}]`)])
                }
            }
            if(
                Object.keys(value).length !== entries.length
                || Object.getOwnPropertySymbols(value).some(symbol => Object.prototype.propertyIsEnumerable.call(value, symbol))
            ){
                throw new TypeError(`Cannot serialize custom array properties at ${path}`)
            }
            return {[VALUE_TAG]: 'array', length: value.length, entries}
        }

        const prototype = Object.getPrototypeOf(value)
        if(prototype !== Object.prototype && prototype !== null){
            throw new TypeError(`Cannot serialize ${value.constructor?.name ?? 'class instance'} at ${path}`)
        }
        if(Object.getOwnPropertySymbols(value).some(symbol => Object.prototype.propertyIsEnumerable.call(value, symbol))){
            throw new TypeError(`Cannot serialize symbol-keyed property at ${path}`)
        }
        const entries = Object.entries(value).map(([key, entryValue]) => [
            key,
            serializeValue(entryValue, ancestors, `${path}.${key}`)
        ] as [string, SerializedValue])
        return {[VALUE_TAG]: 'object', entries}
    } finally {
        ancestors.delete(value)
    }
}

function deserializeValue(value:unknown, path:string):unknown{
    if(value === null || typeof value === 'string' || typeof value === 'boolean') return value
    if(typeof value === 'number' && Number.isFinite(value)) return value
    if(typeof value !== 'object' || Array.isArray(value)){
        throw new TypeError(`Invalid serialized value at ${path}`)
    }

    const serialized = value as Record<string, unknown>
    switch(serialized[VALUE_TAG]){
        case 'undefined':
            return undefined
        case 'number':
            switch(serialized.value){
                case 'NaN': return NaN
                case 'Infinity': return Infinity
                case '-Infinity': return -Infinity
                case '-0': return -0
                default: throw new TypeError(`Invalid serialized number at ${path}`)
            }
        case 'date': {
            const milliseconds = deserializeValue(serialized.value, `${path}.value`)
            if(typeof milliseconds !== 'number') throw new TypeError(`Invalid serialized date at ${path}`)
            return new Date(milliseconds)
        }
        case 'array': {
            if(!Number.isSafeInteger(serialized.length) || (serialized.length as number) < 0 || !Array.isArray(serialized.entries)){
                throw new TypeError(`Invalid serialized array at ${path}`)
            }
            const result = new Array(serialized.length as number)
            for(const entry of serialized.entries){
                if(!Array.isArray(entry) || entry.length !== 2){
                    throw new TypeError(`Invalid serialized array entry at ${path}`)
                }
                const [index, item] = entry
                if(!Number.isSafeInteger(index) || index < 0 || index >= result.length){
                    throw new TypeError(`Invalid serialized array index at ${path}`)
                }
                result[index] = deserializeValue(item, `${path}[${index}]`)
            }
            return result
        }
        case 'object': {
            if(!Array.isArray(serialized.entries)) throw new TypeError(`Invalid serialized object at ${path}`)
            const result:Record<string, unknown> = {}
            for(const entry of serialized.entries){
                if(!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== 'string'){
                    throw new TypeError(`Invalid serialized object entry at ${path}`)
                }
                Object.defineProperty(result, entry[0], {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: deserializeValue(entry[1], `${path}.${entry[0]}`)
                })
            }
            return result
        }
        default:
            throw new TypeError(`Invalid serialized value tag at ${path}`)
    }
}

export class JsonMap<K,V> implements Iterable<[K,V]>{

    constructor(initValue?:Iterable<readonly [K,V]>|readonly [K,V][]){
        if(initValue){
            this.initFromArray(initValue)
        }
    }

    *[Symbol.iterator](): IterableIterator<[K, V]> {
        for(let [k,v] of this.internalMap.entries()){
            yield [k,v]
        }
    }
    protected internalMap = new Map<K,V>()

    public get size():number{
        return this.internalMap.size
    }
    public clear(){
        return this.internalMap.clear()
    }

    public delete(key:K){
        if(DataTypes.isPrimitive(key)) return this.internalMap.delete(key)

        for(let internalKey of this.internalMap.keys()){
            if(this.keysAreEqual(key, internalKey)){
                return this.internalMap.delete(internalKey)
            }
        }
    }

    public entiries(){
        return this.internalMap.entries()
    }

    public forEach(action:(key:K,value:V)=>void){
        this.internalMap.forEach((v,k) => action(k,v))
    }

    public get(key:K):V|undefined{
        if(DataTypes.isPrimitive(key)) return this.internalMap.get(key)

        for(let internalKey of this.internalMap.keys()){
            if(this.keysAreEqual(key, internalKey)){
                return this.internalMap.get(internalKey)
            }
        }
        return undefined
    }

    protected keysAreEqual(key1:K, key2:K){
        return DataTypes.isEqual(key1, key2, {ignoreNullAndUndefinedValuesInObject: true})
    }

    public has(key:K){
        if(DataTypes.isPrimitive(key)) return this.internalMap.has(key)

        for(const internalKey of this.internalMap.keys()){
            if(this.keysAreEqual(key, internalKey)){
                return true
            }
        }
        return false
    }

    public keys(){
        return this.internalMap.keys()
    }

    public set(key:K, value:V){
        if(DataTypes.isPrimitive(key)) {
            this.internalMap.set(key, value)
            return this
        }
        for(let internalKey of this.internalMap.keys()){
            if(this.keysAreEqual(key, internalKey)){
                this.internalMap.set(internalKey, value)
                return this
            }
        }
        // key not found
        this.internalMap.set(key, value)
        return this
    }

    public values(){
        return this.internalMap.values()
    }

    public toArray(){
        return Array.from(this.internalMap)
    }

    public toJsonString(pretty:boolean=false){
        const serialized:SerializedJsonMap = {
            format: SERIALIZATION_FORMAT,
            version: SERIALIZATION_VERSION,
            entries: Array.from(this.internalMap, ([key, value], index) => [
                serializeValue(key, new Set(), `entries[${index}].key`),
                serializeValue(value, new Set(), `entries[${index}].value`)
            ])
        }
        return JSON.stringify(serialized, null, pretty ? 4 : undefined)
    }

    public initFromJsonString(jsonString:string){
        const serialized:unknown = JSON.parse(jsonString)
        if(Array.isArray(serialized)){
            this.initFromArray(serialized)
            return
        }
        if(
            serialized === null
            || typeof serialized !== 'object'
            || (serialized as Record<string, unknown>).format !== SERIALIZATION_FORMAT
            || (serialized as Record<string, unknown>).version !== SERIALIZATION_VERSION
            || !Array.isArray((serialized as Record<string, unknown>).entries)
        ){
            throw new TypeError('Invalid JsonMap serialization format')
        }
        const entries = (serialized as SerializedJsonMap).entries.map((entry, index) => {
            if(!Array.isArray(entry) || entry.length !== 2){
                throw new TypeError(`Invalid serialized map entry at entries[${index}]`)
            }
            return [
                deserializeValue(entry[0], `entries[${index}].key`) as K,
                deserializeValue(entry[1], `entries[${index}].value`) as V
            ] as const
        })
        this.initFromArray(entries)
    }

    public initFromArray(initValue:Iterable<readonly [K,V]>|readonly [K,V][]){
        this.internalMap.clear()
        for(const [key, value] of initValue){
            this.set(key, value)
        }
    }





}