//1. Функция, возвращающая 1-й элемент массива

function getFirstElem<T>(arr: T[]) {
  return arr[0]
}

const getNumber = getFirstElem<number>([1, 2, 3])
const getString = getFirstElem<string>(["alex", "nata", "nika"])

console.log("exercise loaded")

console.log(getNumber)
console.log(getString)

// 2. Универсальная функция фильтра массива
function filteredResult(el) {
  return el >= 0
}

function filterArray<T>(arr: T[], func: (el: T) => boolean) {
  let newArr: T[] = [] as T[]
  for (let i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      newArr.push(arr[i])
    }
  }
  return newArr
}

const callFilterArray = filterArray([-1, -3, 5, 6, 0], filteredResult)

console.log(callFilterArray)

// 3. Универсальная функция преобразования элементов массива

function incOne(el: number) {
  return el + 1
}

function mapArray<T, U>(arr: T[], func: (el: T) => U) {
  let startTransform: U = func(arr[0])
  let newArr: U[] = [startTransform]
  for (let i = 1; i < arr.length; i++) {
    newArr.push(func(arr[i]))
  }
  return newArr
}

const numbers = [1, 2, 3, 4]
const transformNumberToString = (num: number) => `Number: ${num}`

console.log(mapArray(numbers, transformNumberToString)) // ["Number: 1", "Number: 2", "Number: 3", "Number: 4"]

const words = ["hello", "world", "typescript"]
const getLength = (word: string) => word.length

console.log(mapArray(words, getLength)) // [5, 5, 10]

type Person = { name: string; age: number }
const people: Person[] = [
  { name: "Agnes", age: 25 },
  { name: "Robert", age: 30 },
]
const toDescription = (person: Person) => `${person.name} is ${person.age} years old`

console.log(mapArray(people, toDescription)) // ["Agnes is 25 years old", "Robert is 30 years old"]
