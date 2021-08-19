import test from 'ava';
import { CircularArray } from '..'

test('push()', t => {
  const carray = new CircularArray<number>(3)
  carray.push(1)
  t.deepEqual(carray.valueOf(), [1])
  carray.push(2)
  t.deepEqual(carray.valueOf(), [1, 2])
  carray.push(3)
  t.deepEqual(carray.valueOf(), [1, 2, 3])
  carray.push(4)
  t.deepEqual(carray.valueOf(), [2, 3, 4])
});

test('unshift()', t => {
  const carray = new CircularArray<number>(3)
  carray.unshift(1)
  t.deepEqual(carray.valueOf(), [1])
  carray.unshift(2)
  t.deepEqual(carray.valueOf(), [2, 1])
  carray.unshift(3)
  t.deepEqual(carray.valueOf(), [3, 2, 1])
  carray.unshift(4)
  t.deepEqual(carray.valueOf(), [4, 3, 2])
})

test('nth', t => {
  const max = 100
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
})

test('fill()', t => {
  const max = 5
  let carray = new CircularArray<number>(max)
  for (let i = 0; i < max + 3; i++) carray.push(3)
  carray.fill(0)
  t.deepEqual(carray.valueOf(), [0, 0, 0, 0, 0])

  carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(0)
  carray.fill(5, 2)
  t.deepEqual(carray.valueOf(), [0, 0, 5, 5, 5])

  carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(0)
  carray.fill(9, 1, 4)
  t.deepEqual(carray.valueOf(), [0, 9, 9, 9, 0])

  carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(0)
  carray.fill(9, 9)
  t.deepEqual(carray.valueOf(), [0, 0, 0, 0, 0])

  carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(0)
  carray.fill(9, 0, 10)
  t.deepEqual(carray.valueOf(), [9, 9, 9, 9, 9])
});

test('reset()', t => {
  const max = 20
  let carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(0)
  const expected = []
  for (let j = 0; j < max; j++) expected.push(0)
  t.deepEqual(carray.valueOf(), expected)
  carray.reset()
  t.deepEqual(carray.valueOf(), [])
});

test('CircularArray.from()', t => {
  const carray = CircularArray.from([1, 2, 3])
  t.deepEqual(carray.valueOf(), [1, 2, 3])
  t.assert(carray instanceof CircularArray)
  carray.push(4)
  t.deepEqual(carray.valueOf(), [2, 3, 4])
});

test('CircularArray.of()', t => {
  const carray = CircularArray.of(4, 5, 6)
  t.deepEqual(carray.valueOf(), [4, 5, 6])
  t.assert(carray instanceof CircularArray)
  carray.unshift(7)
  t.deepEqual(carray.valueOf(), [7, 4, 5])
});

test('CircularArray.isCircularArray', t => {
  t.assert(CircularArray.isCircularArray([1, 2, 3]) === false)
  t.assert(CircularArray.isCircularArray(null) === false)
  t.assert(CircularArray.isCircularArray(NaN) === false)
  t.assert(CircularArray.isCircularArray(void 0) === false)
  t.assert(CircularArray.isCircularArray({}) === false)
  t.assert(CircularArray.isCircularArray(class CircularArray {}) === false)
  t.assert(CircularArray.isCircularArray(Symbol('CircularArray')) === false)
  t.assert(CircularArray.isCircularArray(1) === false)
  t.assert(CircularArray.isCircularArray('1') === false)
  t.assert(CircularArray.isCircularArray(BigInt('5000000000000')) === false)
  const carray = CircularArray.of(4, 5, 6, 7, 8, 9)
  t.assert(CircularArray.isCircularArray(carray) === true)
})

test('[Symbol.iterator]()', t => {
  const max = 20
  let carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(i)
  let idx = 0
  for (const k of carray) {
    t.is(k, idx)
    idx++;
  }
});

test('JSON.stringify', t => {
  const max = 20
  let carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(i)
  let array = []
  for (let i = 0; i < max; i++) array.push(i)
  t.is(JSON.stringify(carray), JSON.stringify(array))
});

test('Symbol.toPrimitive', t => {
  const max = 2
  let carray = new CircularArray<number>(max)
  for (let i = 0; i < max; i++) carray.push(i)
  // refs: https://github.com/microsoft/TypeScript/issues/4538
  // @ts-expect-error
  t.is(carray + 1, [0, 1] + 1)
  t.is('1' + carray, '1' + [0, 1])
});
