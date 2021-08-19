# @maxmellon/circular-array

## Functions

### Constructor

- `constructor(max: number)`
  - `max`: number - max array size

### Original Method

- `reset(): T`
> remove all items and return empty list.

### Original Behavior

- **index access**
> access use `mod(max, idx)` if got index as out of bounds.

  - **@example**

```ts
  const carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(i)
  t.is(carray[50], 50)

  // mod(101, 100) => 1
  // carray[1] === carray[101]
  t.is(carray[101], carray[1])
  // mod(-1, 100) => 99
  // carray[1] === carray[99]
  t.is(carray[-1], carray[99])

  carray[50] = 0
  t.is(carray[50], 0)

  carray[101] = 999
  t.is(carray[1], 999)
```


- `push(item: T): number`
> push item
> extrude (delete) first item from list if over list length than max.

  - **@example**

```ts
carray.push(1)
t.deepEqual(carray.valueOf(), [1])
carray.push(2)
t.deepEqual(carray.valueOf(), [1, 2])
carray.push(3)
t.deepEqual(carray.valueOf(), [1, 2, 3])
carray.push(4)
t.deepEqual(carray.valueOf(), [2, 3, 4])
```

- `unshift(item: T): number`
> unshift item
> extrude (delete) last item from list if over list length than max.

  - **@example**

```ts
carray.unshift(1)
t.deepEqual(carray.valueOf(), [1])
carray.unshift(2)
t.deepEqual(carray.valueOf(), [2, 1])
carray.unshift(3)
t.deepEqual(carray.valueOf(), [3, 2, 1])
carray.unshift(4)
t.deepEqual(carray.valueOf(), [4, 3, 2])
```

### Compatible Behavior

- `entries()`
- `every()`
- `filter()`
- `find()`
- `findIndex()`
- `forEach()`
- `indexOf()`
- `lastIndexOf()`
- `map()`
- `pop()`
- `reduce()`
- `reduceRight()`
- `shift()`
- `slice()`
- `some()`
- `splice()`
- `values()`

### Unimplemented

- `concat()`
- `sort()`
- `reverse()`
- `copyWithin()`
