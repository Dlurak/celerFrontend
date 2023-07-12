/**
 * A function to reverse an array functionally
 * @param array The array to reverse
 * @returns The reversed array
 */
export function reverseArray<T>(array: T[]): T[] {
    return array.slice().reverse()
}