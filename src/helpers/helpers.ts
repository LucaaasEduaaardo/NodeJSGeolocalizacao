import { faker } from "@faker-js/faker"

export function objetoToArray(objeto: { [key: string]: any }): any[] {
    return Object.values(objeto)
}

export function generateLongitude(): number {
    return Math.random() * 360 - 180
}

export function generateLatitude(): number {
    return Math.random() * 180 - 90
}

export interface Address {
    street: string
    city: string
    state: string
    country: string
}

export function generateRandomAddress(): string {
    const street = faker.address.streetAddress()
    const city = faker.address.city()
    const state = faker.address.stateAbbr()
    const country = faker.address.country()
    return `${street} ${city} ${state} ${country}`
}
