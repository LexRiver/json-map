# json-map

This package provides class JsonMap<K,V> which has interface similar to Map<K,V> but keys could be Objects.

## Install

`npm install @lexriver/json-map`

## Import

```typescript
import { JsonMap } from '@lexriver/json-map'
```

## Usage

```typescript
    // create new map with key type {name:string, age:number} and number as a value
    let valueByPerson = new JsonMap<{name:string, age:number}, number>()
    valueByPerson.set({name:'John', age: 10}, 100)
    valueByPerson.set({name:'Smith', age: 20}, 200)

    valueByPerson.get({name:'John', age: 10}) // 100
    valueByPerson.get({name:'John', age: 20}) // undefined
    valueByPerson.get({name:'Smith', age: 20}) // 200
    valueByPerson.get({name:'smith', age: 20}) // undefined

```
<br/>

## Methods

### constructor

```typescript
    let myMap = new JsonMap<K, V>()
```

K and V could be of any type including Object

<br/>

### iterate

```typescript
    const myMap = new JsonMap<Object, number>()
    
    for(const [key,value] of myMap){
        // ...
    }

    // or...
    for(const [key,value] of myMap.entiries()){
        // ...
    }

    // or...
    myMap.forEach((key:Object, value:number) => {
        // ...
    })

```


<br/>


### get(key:K):V|undefined

Get value by key. Returns `undefined` if key not found.

```typescript
    myMap.get({name:'John', age:10})
```

<br/>


### set(key:K, value:V):JsonMap<K,V>

Create or update value for key.

```typescript
    myMap.set({name:'John', age:10}, 100)
```

<br/>


### has(key:K):boolean

Check if map has a key.

```typescript
    myMap.has({name:'John', age:10})
```

<br/>


### delete(key:K):boolean

Delete one item by key.

```typescript
    myMap.delete({name:'John', age:10})
```

<br/>


### clear():void

Remove all items from map.

```typescript
    myMap.clear()
```

<br/>


### size:number

Get count of items in map.

```typescript
    myMap.size
```

<br/>



### keys():IterableIterator<K>

Get all keys in map.

```typescript
    for(const key of myMap.keys()){
        //...
    }
```

<br/>


### values():IterableIterator<V>

Get all values in map.

```typescript
    for(const value of myMap.values()){
        // ...
    }
```

<br/>


### toArray():[K,V][]

Get map as array.

```typescript
    myMap.toArray()
```

<br/>


### initFromArray(initValue:Iterable<readonly [K,V]>|readonly [K,V][])

 Fill map with keys and values from array.

 ```typescript
    myMap.initFromArray(mySavedArray)
 ```

<br/>



### toJsonString(pretty:boolean=false):string

Get map as json string.

```typescript
    myMap.toJsonString(true)
```

<br/>


### initFromJsonString(jsonString:string):JsonMap<K,V>

Fill map with keys and values from json string.
 
 ```typescript
    myMap.initFromJsonString(mySavedJsonString)
 ```

 