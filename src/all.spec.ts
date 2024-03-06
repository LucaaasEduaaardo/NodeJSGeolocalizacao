import "reflect-metadata"
import "./database"
import initDB from "./database"
import { faker } from "@faker-js/faker"
import { expect } from "chai"
import { RegionModel, UserModel } from "./models/models"
import { generateLatitude, generateLongitude } from "./helpers/helpers"

describe("Models", () => {
    // o faker não tem uma base de dados para endereço valido
    // então precisamos adicionar valores reais aqui
    // https://github.com/faker-js/faker/issues/1206#issuecomment-1397269627
    let userFake = {
        id: "",
        name: "",
        email: "",
        address: "Rua São João, 123 São Paulo, Brasil",
        coordinates: [-22.66335, -50.43566]
    }
    let regionFake = {
        id: "",
        name: "",
        coordinates: [],
        user: ""
    }

    before(async () => {
        await initDB()
        userFake.name = faker.person.firstName()
        userFake.email = faker.internet.email()

        regionFake.name = faker.person.firstName()
        regionFake.coordinates = [
            [generateLatitude(), generateLongitude()],
            [generateLatitude(), generateLongitude()],
            [generateLatitude(), generateLongitude()]
        ]
    })

    // after(() => {
    //     // sinon.restore()
    //     // session.endSession()
    // })

    // beforeEach(() => {
    //     // session.startTransaction()
    // })

    // afterEach(() => {
    //     // session.commitTransaction()
    // })

    describe("UserModel", () => {
        it("Should create a user with no coordinates", async () => {
            const user = await UserModel.create({
                name: userFake.name,
                email: userFake.email,
                address: userFake.address
            })
            userFake.id = user.id
            expect(user).to.have.property("_id")
            expect(user).to.have.property("createdAt")
            expect(user).to.have.property("updatedAt")
            expect(user.createdAt).to.be.a("Date")
            expect(user.updatedAt).to.be.a("Date")
            expect(user.name).to.be.equal(userFake.name)
            expect(user.email).to.be.equal(userFake.email)
            expect(user.address).to.be.equal(userFake.address)
        })

        it("Should delete a user", async () => {
            const deletionResult = await UserModel.deleteOne({
                _id: userFake.id
            })
            expect(deletionResult.deletedCount).to.be.equal(1)
        })

        it("Should create a user with no address", async () => {
            const user = await UserModel.create({
                name: userFake.name,
                email: userFake.email,
                coordinates: userFake.coordinates
            })
            userFake.id = user.id
            expect(user).to.have.property("_id")
            expect(user).to.have.property("createdAt")
            expect(user).to.have.property("updatedAt")
            expect(user.createdAt).to.be.a("Date")
            expect(user.updatedAt).to.be.a("Date")
            expect(user.name).to.be.equal(userFake.name)
            expect(user.email).to.be.equal(userFake.email)
            expect(user.coordinates).to.deep.equal(userFake.coordinates)
        })
    })

    describe("RegionModel", () => {
        it("Should create region", async () => {
            const region = await RegionModel.create({
                name: faker.person.firstName(),
                coordinates: regionFake.coordinates,
                user: userFake.id
                // type: "Polygon"
            })
            regionFake.id = region.id
            expect(region).to.have.property("_id")
            expect(region).to.have.property("createdAt")
            expect(region).to.have.property("updatedAt")
            expect(region.createdAt).to.be.a("Date")
            expect(region.updatedAt).to.be.a("Date")
            expect(region.name).to.equal(region.name)
            expect(region.coordinates).to.deep.equal(regionFake.coordinates)
            expect(region.user).to.equal(userFake.id)
            expect(region.type).to.equal("Polygon")
        })

        it("Should verify if user have a region", async () => {
            const userVerify = await UserModel.findById(userFake.id)
            expect(userVerify).to.exist
            const regionIndex = userVerify.regions.indexOf(regionFake.id)
            expect(regionIndex).to.not.equal(-1)
        })

        it("Should delete a region", async () => {
            const deletionResult = await RegionModel.deleteOne({
                _id: regionFake.id
            })
            expect(deletionResult.deletedCount).to.be.equal(1)
        })
    })
})
