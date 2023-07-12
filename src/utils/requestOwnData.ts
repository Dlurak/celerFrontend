/**
 * A function to get data from the data folder
 * @param fileName The name of the file to request, it must be in the data folder and it must be a json file do not include the extension or path
 * @returns A promise that resolves to the JSON data of the file in a object
 */
export async function requestOwnData(fileName: string): Promise<any> {
    return fetch(`/data/${fileName}.json`).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText)
        }
        return res.json()
    }).then((data) => {
        return data
    })
}