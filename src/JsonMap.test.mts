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
    expect(x.toJsonString()).toEqual(`[[{"aa":"aa"},"aaaa"],[{"bb":"bb"},"bbbb"]]`)

    //from json
    let y = new JsonMap<Object,string>(JSON.parse(x.toJsonString()))
    expect(y.get({aa:'aa'})).toEqual('aaaa')
    expect(y.get({bb:'bb'})).toEqual('bbbb')

    x.clear()
    x.initFromJsonString(y.toJsonString())
    expect(x.get({aa:'aa'})).toEqual('aaaa')
    expect(x.get({bb:'bb'})).toEqual('bbbb')

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