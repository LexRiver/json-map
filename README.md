# json-map

This package provides class JsonMap<K,V> which has interface similar to Map<K,V> but keys could be Objects.

## Install

`npm install @lexriver/json-map`

## Import

```typescript
import {Async} from '@lexriver/json-map'
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

## Methods

### constructor

```typescript
    let myMap = new JsonMap<K, V>()
```

K and V could be of any type including Object

### iterate

```typescript
    let myMap = new JsonMap<Object, number>()
    
    for(let [key,value] of myMap){
        // ...
    }

    // or...
    for(let [key,value] of myMap.entiries()){
        // ...
    }

    // or...
    myMap.forEach((key:Object, value:number) => {
        // ...
    })

```




### get(key:K):V|undefined

get value by key

```typescript
    myMap.get({name:'John', age:10})
```

### set(key:K, value:V):JsonMap<K,V>

create or update value for key

```typescript
    myMap.set({name:'John', age:10}, 100)
```


### has(key:K):boolean

check if map has a key

```typescript
    myMap.has({name:'John', age:10})
```

### delete(key:K):boolean

Delete one item by key

```typescript
    myMap.delete({name:'John', age:10})
```

### clear():void

Remove all items from map

```typescript
    myMap.clear()
```

### size:number

Get count of items in map

```typescript
    myMap.size
```




### keys():IterableIterator<K>

get all keys in map

```typescript
    for(let key of myMap.keys()){
        //...
    }
```

### values():IterableIterator<V>

get list of all values

```typescript
    for(let value of myMap.values()){
        // ...
    }
```

### toArray():[K,V][]

get map as array

```typescript
    myMap.toArray()
```

### initFromArray(initValue:Iterable<readonly [K,V]>|readonly [K,V][])

 fill map with keys and values from array

 ```typescript
    myMap.initFromArray(mySavedArray)
 ```


### toJsonString(pretty:boolean=false):string

get map as json string

```typescript
    myMap.toJsonString(true)
```

### initFromJsonString(jsonString:string):JsonMap<K,V>

fill map with keys and values from json string
 
 ```typescript
    myMap.initFromJsonString(mySavedJsonString)
 ```

 