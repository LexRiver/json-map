import { expect, test } from 'vitest'
import { JsonMap } from "./JsonMap.mjs"

test('JsonMap', () => {
    let x = new JsonMap<Object,string>()

    x.set({aa:'aa'}, 'aaaa')
    x.set({bb:'bb'}, 'bbbb')
    expect(x.get({aa:'aa'})).toEqual('aaaa')
    expect(x.has({bb:'bb'})).toBeTruthy()
    expect(x.size).toEqual(2)

    let counter = 0
    for(let [k,v] of x){
        if(counter == 0){
            expect(k).toEqual({aa:'aa'})
            expect(v).toEqual('aaaa')
        } else if(counter ==1){
            expect(k).toEqual({bb:'bb'})
            expect(v).toEqual('bbbb')
        }
        counter++
    }
    x.delete({aa:'aa'})
    expect(x.size).toEqual(1)
    expect(x.has({aa:'aa'})).toBeFalsy()
    expect(x.get({bb:'bb'})).toEqual('bbbb')

    x.set({cc:'cc'}, 'cccc')

    //keys
    counter = 0
    for(let k of x.keys()){
        if(counter == 0){
            expect(k).toEqual({bb:'bb'})
        } else if(counter ==1){
            expect(k).toEqual({cc:'cc'})
        }
        counter++
    }

    //values
    counter = 0
    for(let v of x.values()){
        if(counter ==0){
            expect(v).toEqual('bbbb')
        } else if(counter ==1){
            expect(v).toEqual('cccc')
        }
        counter++
    }

    //entries
    counter = 0
    for(let [k,v] of x.entiries()){
        if(counter == 0){
            expect(k).toEqual({bb:'bb'})
            expect(v).toEqual('bbbb')
        } else if(counter ==1){
            expect(k).toEqual({cc:'cc'})
            expect(v).toEqual('cccc')
        }
        counter++
    }

    //foreach
    counter = 0
    x.forEach((k,v) => {
        if(counter == 0){
            expect(k).toEqual({bb:'bb'})
            expect(v).toEqual('bbbb')
        } else if(counter ==1){
            expect(k).toEqual({cc:'cc'})
            expect(v).toEqual('cccc')
        }
        counter++
    })

    //clear
    x.clear()
    expect(x.size).toEqual(0)
    expect(x.get({aa:'aa'})).toEqual(undefined)
    expect(x.get({bb:'bb'})).toEqual(undefined)
    expect(x.get({cc:'cc'})).toEqual(undefined)
    expect(x.has({cc:'cc'})).toEqual(false)

    x.set({aa:'aa', bb:{bbb:'bbb'}}, 'deep')
    expect(x.get({aa:'aa', bb:{bbb:'bbb'}})).toEqual('deep')
    expect(x.get({bb:{bbb:'bbb'}, aa:'aa'})).toEqual('deep')
    expect(x.get({bb:{bbb:'bbb', wrong:'wrong'}, aa:'aa'})).toEqual(undefined)

    //to json 
    x.clear()
    x.set({aa:'aa'}, 'aaaa')
    x.set({bb:'bb'}, 'bbbb')
    expect(JSON.parse(x.toJsonString())).toMatchObject({
        format: '@lexriver/json-map',
        version: 1
    })

    //from json
    let y = new JsonMap<Object,string>()
    y.initFromJsonString(x.toJsonString())
    expect(y.get({aa:'aa'})).toEqual('aaaa')
    expect(y.get({bb:'bb'})).toEqual('bbbb')

    x.clear()
    x.initFromJsonString(y.toJsonString())
    expect(x.get({aa:'aa'})).toEqual('aaaa')
    expect(x.get({bb:'bb'})).toEqual('bbbb')

})

test('initialization deduplicates structurally equivalent keys', () => {
    const entries = [
        [{id: 1}, 'first'],
        [{id: 1}, 'updated']
    ] as const

    const fromConstructor = new JsonMap(entries)
    expect(fromConstructor.size).toEqual(1)
    expect(fromConstructor.get({id: 1})).toEqual('updated')

    const fromArray = new JsonMap<{id:number}, string>()
    fromArray.initFromArray(entries)
    expect(fromArray.size).toEqual(1)
    expect(fromArray.get({id: 1})).toEqual('updated')

    const fromJson = new JsonMap<{id:number}, string>()
    fromJson.initFromJsonString(JSON.stringify(entries))
    expect(fromJson.size).toEqual(1)
    expect(fromJson.get({id: 1})).toEqual('updated')
})

test('JSON round-trip preserves supported non-JSON values', () => {
    const sparseValue = new Array(5)
    sparseValue[1] = undefined
    sparseValue[3] = NaN
    sparseValue[4] = -Infinity
    const key = {
        createdAt: new Date('2024-01-02T03:04:05.678Z'),
        missing: undefined,
        limits: [Infinity, -Infinity]
    }
    const original = new JsonMap<typeof key, unknown>([[key, sparseValue]])

    const restored = new JsonMap<typeof key, unknown>()
    restored.initFromJsonString(original.toJsonString())

    const [[restoredKey, restoredValue]] = restored.toArray()
    expect(restoredKey).toEqual(key)
    expect(restoredKey.createdAt).toBeInstanceOf(Date)
    expect(restoredKey.createdAt.getTime()).toEqual(key.createdAt.getTime())
    expect(Object.hasOwn(restoredKey, 'missing')).toBeTruthy()
    expect(restored.get(key)).toEqual(sparseValue)
    expect(restoredValue).toEqual(sparseValue)
    expect(Object.hasOwn(restoredValue as unknown[], 0)).toBeFalsy()
    expect(Object.hasOwn(restoredValue as unknown[], 1)).toBeTruthy()
})

test('JSON round-trip preserves special primitive keys and invalid dates', () => {
    const original = new JsonMap<unknown, string>([
        [NaN, 'nan'],
        [Infinity, 'infinity'],
        [-Infinity, 'negative infinity'],
        [undefined, 'undefined'],
        [new Date(NaN), 'invalid date']
    ])
    const restored = new JsonMap<unknown, string>()

    restored.initFromJsonString(original.toJsonString())

    expect(restored.get(NaN)).toEqual('nan')
    expect(restored.get(Infinity)).toEqual('infinity')
    expect(restored.get(-Infinity)).toEqual('negative infinity')
    expect(restored.get(undefined)).toEqual('undefined')
    expect(restored.get(new Date(NaN))).toEqual('invalid date')
    const invalidDate = restored.toArray().find(([key]) => key instanceof Date)?.[0] as Date
    expect(invalidDate).toBeInstanceOf(Date)
    expect(Number.isNaN(invalidDate.getTime())).toBeTruthy()
})

test('JSON serialization rejects values that cannot round-trip', () => {
    const withFunction = new JsonMap<string, unknown>([['key', () => undefined]])
    expect(() => withFunction.toJsonString()).toThrow(/Cannot serialize function/)

    const withClassInstance = new JsonMap<string, unknown>([['key', new MyClass('value')]])
    expect(() => withClassInstance.toJsonString()).toThrow(/Cannot serialize MyClass/)

    const circular:Record<string, unknown> = {}
    circular.self = circular
    const withCircularValue = new JsonMap<string, unknown>([['key', circular]])
    expect(() => withCircularValue.toJsonString()).toThrow(/Cannot serialize circular value/)
})

test('legacy JSON array serialization remains readable', () => {
    const map = new JsonMap<{id:number}, string>()
    map.initFromJsonString('[[{"id":1},"value"]]')
    expect(map.get({id: 1})).toEqual('value')
})

test('typed object as key', () => {
    let x = new JsonMap<{name:string, age:number},number>()
    x.set({name:'John', age: 10}, 100)
    x.set({name:'Smith', age: 20}, 200)
    expect(x.get({name:'John', age: 10})).toEqual(100)
    expect(x.get({name:'John', age: 20})).toBeUndefined()
    expect(x.get({name:'smith', age: 20})).toBeUndefined()
    expect(x.get({name:'Smith', age: 20})).toEqual(200)
})

test('string keys', () => {
    let x = new JsonMap<string, number>()
    x.set('aa', 11)
    expect(x.get('aa')).toEqual(11)
})

test('number keys', () => {
    let x = new JsonMap<number, string>()
    x.set(11,'aa')    
    expect(x.get(11)).toEqual('aa')
})

test('structurally equivalent keys containing NaN support all key operations', () => {
    const map = new JsonMap<{score:number, nested:{values:number[]}}, string>()
    map.set({score: NaN, nested: {values: [1, NaN]}}, 'first')

    const equivalentKey = {score: NaN, nested: {values: [1, NaN]}}
    expect(map.get(equivalentKey)).toEqual('first')
    expect(map.has(equivalentKey)).toBeTruthy()
    expect(map.get({score: NaN, nested: {values: [1, 2]}})).toBeUndefined()

    map.set(equivalentKey, 'updated')
    expect(map.size).toEqual(1)
    expect(map.get({score: NaN, nested: {values: [1, NaN]}})).toEqual('updated')

    expect(map.delete({score: NaN, nested: {values: [1, NaN]}})).toBeTruthy()
    expect(map.size).toEqual(0)
})

test('invalid Date keys are structurally retrievable', () => {
    const map = new JsonMap<{date:Date}, string>()
    map.set({date: new Date(NaN)}, 'invalid')
    expect(map.get({date: new Date(NaN)})).toEqual('invalid')
})

test('boolean keys', () => {
    let x = new JsonMap<boolean, number>()
    x.set(true, 1)
    x.set(false, 1)
    x.set(false, 0)
    expect(x.get(true)).toEqual(1)
    expect(x.get(false)).toEqual(0)
})

test('iterable', () => {
    let x = new JsonMap<number, number>()
    x.set(1,2)
    x.set(3,4)
    let sum = 0
    for(let [k,v] of x){
        sum += k
        sum += v
    }
    expect(sum).toEqual(1+2+3+4)
    for(let [k,v] of x.entiries()){
        sum += k
        sum += v
    }
    expect(sum).toEqual(2*(1+2+3+4))
})

class MyClass{
    constructor(public text:string){

    }
}
test('class', () => {
    let x = new JsonMap<MyClass,number>()
    let firstInstance = new MyClass('first')
    let secondInstance = new MyClass('second')
    x.set(firstInstance, 10)
    x.set(secondInstance, 20)
    expect(x.get(firstInstance)).toEqual(10)
    expect(x.get(secondInstance)).toEqual(20)
    expect(x.get(new MyClass('first'))).toEqual(10) //! 
})

test('object with undefined value', () => {
    type K = {a:string, b:string, c?:string}
    const x = new JsonMap<K,string>()
    x.set({a:'a', b:'b', c:'c'}, 'first')
    x.set({a:'a', b:'b'}, 'second')
    x.set({a:'a', b:'b', c:undefined}, 'third')
    expect(x.get({a:'a', b:'b'})).toEqual('third')
    x.delete({a:'a', b:'b'})
    expect(x.has({a:'a', b:'b'})).toBeFalsy()
    expect(x.get({a:'a', b:'b'})).toBeUndefined()
    expect(x.size).toEqual(1)

})