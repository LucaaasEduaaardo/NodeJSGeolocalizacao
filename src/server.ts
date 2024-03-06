import * as app from "express"
import { UserModel, RegionModel } from "./models/models"
import lib from "./lib"
import { objetoToArray } from "./helpers/helpers"

const server = app()
const router = app.Router()
server.use(app.json())

const SERVER_PORT = 8080
const STATUS = {
    OK: 200,
    CREATED: 201,
    UPDATED: 202,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    DEFAULT_ERROR: 418 // i am a teapot
}

// todo: apagar dps de testar
const returnOk = (res) => {
    return res.sendStatus(STATUS.OK)
}

// eu sei que o certo seria separar essas funções em arquivos para User e Regions
// e transformar um arquivo de API apenas com as rotas e passado por controllers
// no esquema MVC, porém implementar isso nesse pequeno projeto seria perca de tempo
// não pretendo implementar uma verificação de usuário então é sem a necessidade
// de fazer um middleware
router.get("/", async (req, res) => {
    return returnOk(res)
})

router.get("/users", async (req, res) => {
    // return returnOk(res)
    const { page, limit } = req.query

    const [users, total] = await Promise.all([
        UserModel.find().lean(),
        UserModel.countDocuments()
    ])

    return res.json({
        rows: users,
        page,
        limit,
        total
    })
})

router.get("/users/:id", async (req, res) => {
    // return returnOk(res)
    const { id } = req.params
    const user = await UserModel.findOne({ _id: id }).lean()
    if (!user) {
        return res.status(STATUS.NOT_FOUND).json({
            message: "User not found"
        })
    }
    return res.status(STATUS.OK).json(user)
})

router.post("/users", async (req, res) => {
    try {
        const { name, email, address, coordinates } = req.body
        if ((address && coordinates) || (!address && !coordinates)) {
            return res
                .status(STATUS.BAD_REQUEST)
                .json({ error: "Forneça endereço ou coordenadas." })
        }
        const addressAndCoordinates = {
            address: address,
            coordinates: coordinates
        }
        if (address) {
            addressAndCoordinates.coordinates =
                await lib.getCoordinatesFromAddress(address)
        }
        if (coordinates) {
            addressAndCoordinates.address =
                await lib.getAddressFromCoordinates(coordinates)
        }
        const newUser = await UserModel.create({
            name,
            email,
            address: addressAndCoordinates.address,
            coordinates: objetoToArray(addressAndCoordinates.coordinates)
        })

        return res.status(STATUS.CREATED).json(newUser)
    } catch (error) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Erro interno do servidor", error })
    }
})

router.put("/users/:id", async (req, res) => {
    const { id } = req.params
    const { name, email, address, coordinates, regions } = req.body
    try {
        let user = await UserModel.findOne({ _id: id }).lean()
        if (!user) {
            return res
                .status(STATUS.NOT_FOUND)
                .json({ message: "User not found" })
        }
        user = {
            ...user,
            name,
            email,
            address,
            coordinates,
            regions
        }
        await UserModel.updateOne({ _id: id }, user)
        return res.status(STATUS.UPDATED).json({ message: "User updated" })
    } catch (error) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error", error })
    }
})

router.delete("/users/:id", async (req, res) => {
    const { id } = req.params
    try {
        const user = await UserModel.findOne({ _id: id }).lean()
        if (!user) {
            return res
                .status(STATUS.NOT_FOUND)
                .json({ message: "User not found" })
        }
        await UserModel.deleteOne({ _id: id })
        return res.status(STATUS.OK).json({ message: "User deleted" })
    } catch (error) {
        console.error(error)
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" })
    }
})

router.get("/regions", async (req, res) => {
    const { page, limit } = req.query

    const [region, total] = await Promise.all([
        RegionModel.find().lean(),
        RegionModel.countDocuments()
    ])

    return res.json({
        rows: region,
        page,
        limit,
        total
    })
})

router.get("/regions/:id", async (req, res) => {
    const { id } = req.params
    const region = await RegionModel.findOne({ _id: id }).lean()
    if (!region) {
        return res.status(STATUS.NOT_FOUND).json({
            message: "Region not found"
        })
    }
    return res.status(STATUS.OK).json(region)
})

router.post("/regions", async (req, res) => {
    try {
        const { name, coordinates, userId } = req.body
        const userExists = await UserModel.exists({ _id: userId })
        if (!userExists) {
            return res
                .status(STATUS.BAD_REQUEST)
                .json({ message: "User not found" })
        }
        const newRegion = await RegionModel.create({
            name: name,
            coordinates: coordinates,
            user: userId
        })
        return res.status(STATUS.CREATED).json(newRegion)
    } catch (error) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error", error })
    }
})

router.put("/regions/:id", async (req, res) => {
    const { id } = req.params
    const { name, coordinates, userId } = req.body
    try {
        let region = await RegionModel.findOne({ _id: id }).lean()
        if (!region) {
            return res
                .status(STATUS.NOT_FOUND)
                .json({ message: "Region not found" })
        }
        region = {
            ...region,
            name,
            coordinates,
            user: userId
        }
        await RegionModel.updateOne({ _id: id }, region)
        return res.status(STATUS.UPDATED).json({ message: "Region updated" })
    } catch (error) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal error", error })
    }
})

router.delete("/regions/:id", async (req, res) => {
    const { id } = req.params
    try {
        const regions = await RegionModel.findOne({ _id: id }).lean()
        if (!regions) {
            return res
                .status(STATUS.NOT_FOUND)
                .json({ message: "Region not fond" })
        }
        await RegionModel.deleteOne({ _id: id })
        return res.status(STATUS.OK).json({ message: "Region deleted" })
    } catch (error) {
        return res
            .status(STATUS.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal error", error })
    }
})

server.use(router)
export default server.listen(SERVER_PORT, () => {
    console.log(`servidor iniciado em: http://localhost:${SERVER_PORT}`)
})
