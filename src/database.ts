import mongoose from "mongoose"
import { User, UserModel } from "./models/models"

const env = {
    MONGO_URI: "mongodb://127.0.0.1:27017/meudb"
}

const options = {
    useUnifiedTopology: true
    // useNewUrlParser: true
} as any

const init = async function () {
    try {
        await mongoose.connect(env.MONGO_URI, options)
        console.log("Conectado ao MongoDB")

        // if (!mongoose.models.User) {
        const userSchema = UserModel.schema
        mongoose.model<User>("User", userSchema)
        console.log("Models criadas automaticamente.")
        // }
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error)
    }
}

export default init
