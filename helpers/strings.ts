import { toCamelCase } from "./arrays"

export function sentenceToCamelCase(sentence: string) {
    const sentenceArray = sentence.split(' ')
    return toCamelCase(sentenceArray).join('')
}

export function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}