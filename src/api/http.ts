import fetch from 'cross-fetch'

export default class Http {
    static async get<T>(path: string): Promise<T> {
        const response = await fetch(path)
        return response.json()
    }
}
