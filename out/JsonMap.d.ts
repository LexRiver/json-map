export declare class JsonMap<K, V> implements Iterable<[K, V]> {
    constructor(initValue?: Iterable<readonly [K, V]> | readonly [K, V][]);
    [Symbol.iterator](): IterableIterator<[K, V]>;
    protected internalMap: Map<K, V>;
    get size(): number;
    clear(): void;
    delete(key: K): boolean | undefined;
    entiries(): IterableIterator<[K, V]>;
    forEach(action: (key: K, value: V) => void): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value: V): this;
    values(): IterableIterator<V>;
    toArray(): [K, V][];
    toJsonString(pretty?: boolean): string;
    initFromJsonString(jsonString: string): void;
    initFromArray(initValue: Iterable<readonly [K, V]> | readonly [K, V][]): void;
}
