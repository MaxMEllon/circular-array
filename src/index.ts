const hasKey = <T extends object>(obj: T, k: keyof any): k is keyof T => k in obj
const mod = (n: number, m: number) => ((n % m) + m) % m;

type ArrayLike<T> = {
  [idx: number]: T
}

const sym = Symbol('CircularArray')

export class CircularArray<T = any> {
  private list: Array<T>
  private max: number
  [idx: number]: T
  [sym] = true

  static from<T>(arr: Array<T>): CircularArray {
    const max = arr.length
    const instance = new CircularArray(max)
    arr.forEach(i => instance.push(i))
    return instance
  }

  static of<T>(...items: Array<T>): CircularArray {
    const max = items.length
    const instance = new CircularArray(max)
    items.forEach(i => instance.push(i))
    return instance
  }

  static isCircularArray(maybeCircularArray: any): maybeCircularArray is CircularArray {
    if (typeof maybeCircularArray === 'object' && maybeCircularArray !== null && typeof maybeCircularArray[sym] === 'boolean') {
      return maybeCircularArray[sym]
    }
    return false
  }

  constructor(max: number = 100) {
    this.list = []
    this.max = max

    return (new Proxy(this, {
      get(target, name) {
        if (hasKey(target, name)) return target[name]
        if (typeof name === 'symbol') return void 0
        const maybeIndex = parseInt(name, 10)
        if (isNaN(maybeIndex)) return void 0
        return target.list[mod(maybeIndex, target.max)]
      },

      set(target, name, value) {
        if (typeof name === 'symbol') {
          // @ts-ignore
          target[name] = value
          return true
        }
        const maybeIndex = parseInt(name, 10)
        if (isNaN(maybeIndex)) {
          // @ts-ignore
          target[name] = value
          return true
        }
        target.list[mod(maybeIndex, target.max)] = value
        return true
      }
    })) as this & ArrayLike<T>
  }

  reset() {
    let _
    while ((_ = this.list.shift()) !== undefined) {}
    return this.list
  }

  toLocalString() {
    return this.list.toLocaleString()
  }

  toString() {
    return this.list.toString()
  }

  valueOf() {
    return this.list
  }

  toJSON() {
    return this.list
  }

  push(item: T): number {
    if (this.list.length >= this.max) {
      const next = []
      for (let i = this.list.length - 1; i >= this.list.length - this.max + 1; i--) {
        next.unshift(this.list[i])
      }
      this.list = next
    }
    return this.list.push(item)
  }

  unshift(item: T): number {
    if (this.list.length >= this.max) {
      const next = []
      for (let i = 0; i < Math.min(this.list.length, this.max - 1); i++) {
        next.push(this.list[i])
      }
      this.list = next
    }
    return this.list.unshift(item)
  }

  fill(value: T, start?: number, end?: number): T[] {
    const s = start ? Math.min(start, this.max) : 0
    const e = end ? Math.min(end, this.max) : this.max
    return this.list.fill(value, s, e)
  }

  pop(): T | undefined {
    return this.list.pop()
  }

  shift(): T | undefined {
    return this.list.shift()
  }

  get length(): number {
    return this.list.length
  }


  forEach(callback: (value: T, index: number, array: T[]) => void, thisArg?: any) {
    return this.list.forEach(callback, thisArg)
  }

  map<U>(callback: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    return this.list.map(callback, thisArg)
  }

  reduce<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U) {
    return this.list.reduce<U>(callback, initialValue)
  }

  reduceRight<U>(callback: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U) {
    return this.list.reduceRight<U>(callback, initialValue)
  }

  every<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[] {
    return this.list.every(predicate, thisArg)
  }

  some<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[] {
    return this.list.some(predicate, thisArg)
  }

  indexOf(searchElement: T, fromIndex?: number): number {
    return this.list.indexOf(searchElement, fromIndex)
  }

  lastIndexOf(searchElement: T, fromIndex?: number): number {
    return this.list.lastIndexOf(searchElement, fromIndex)
  }

  splice(start: number, deleteCount?: number): T[] {
    return this.list.splice(start, deleteCount)
  }

  filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[] {
    return this.list.filter(predicate, thisArg)
  }

  find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined {
    return this.list.find(predicate, thisArg)
  }

  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number {
    return this.list.findIndex(predicate, thisArg)
  }

  slice(start?: number, end?: number): T[] {
    return this.list.slice(start, end)
  }

  entries() {
    return this.list.entries()
  }

  values(): IterableIterator<T> {
    return this.list.values()
  }

  [Symbol.toPrimitive](_hint: string) {
    return this.list.join(',')
  }

  *[Symbol.iterator]() {
    for (let i = 0; i < this.list.length; i++) {
      yield this.list[i]
    }
  }
}

