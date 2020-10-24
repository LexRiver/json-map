import {DataTypes} from '@lexriver/data-types'
export class JsonMap<K,V> implements Iterable<[K,V]>{

    constructor(initValue?:Iterable<readonly [K,V]>|readonly [K,V][]){
        if(initValue){
            this.internalMap = new Map<K,V>(initValue)
        } else {
            this.internalMap = new Map<K,V>()
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
            if(DataTypes.isEqual(key, internalKey)){
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
            if(DataTypes.isEqual(key, internalKey)){
                return this.internalMap.get(internalKey)
            }
        }
        return undefined
    }

    public has(key:K){
        if(DataTypes.isPrimitive(key)) return this.internalMap.has(key)

        for(let internalKey of this.internalMap.keys()){
            if(DataTypes.isEqual(key, internalKey)){
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
            if(DataTypes.isEqual(key, internalKey)){
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
        //console.log('this.internalMap=', this.internalMap)
        return JSON.stringify(Array.from(this.internalMap), null, pretty ? 4 : undefined)
    }

    public initFromJsonString(jsonString:string){
        this.internalMap = new Map<K,V>(JSON.parse(jsonString))
    }

    public initFromArray(initValue:Iterable<readonly [K,V]>|readonly [K,V][]){
        this.internalMap = new Map<K,V>(initValue)
    }





}