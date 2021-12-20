import React from 'react'

export function toCamelCase(array: string[]) {
  return array.map((action, index) => {
    if (!index) return action
    else return action.replace(/^\w/, (firstLetter) => firstLetter.toUpperCase())
  })
}

export function createSomeComponents(length: number, component: JSX.Element) {
  return Array(length)
    .fill(undefined)
    .map((a, index) => React.cloneElement(component, { key: index }))
}

export function selectUniqueValues(array: number[]) {
  return Array.from(new Set(array))
}

export function transformArraysToMap(firstArray: any[], secondArray: any[]) {
  return new Map(firstArray.map((item, index) => [item, secondArray[index]]))
}

export function nextElem<T>(array: T[], lastIndex: number) {
  return array[lastIndex + 1] ?? array[0]
}
