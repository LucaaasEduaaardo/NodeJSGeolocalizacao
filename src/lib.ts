import axios from "axios"

class GeoLib {
    private urlNominatim = "https://nominatim.openstreetmap.org"

    public getAddressFromCoordinates(
        coordinates: [number, number] | { lat: number; lng: number }
    ): Promise<string> {
        return this.fetchAddress(coordinates)
    }

    public getCoordinatesFromAddress(
        address: string
    ): Promise<{ lat: number; lng: number }> {
        return this.fetchCoordinates(address)
    }

    private async fetchAddress(
        coordinates: [number, number] | { lat: number; lng: number }
    ): Promise<string> {
        try {
            const [latitude, longitude] =
                "lat" in coordinates
                    ? [coordinates.lat, coordinates.lng]
                    : coordinates

            const response = await axios.get(`${this.urlNominatim}/reverse`, {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: "json"
                }
            })
            if (response.data && response.data.display_name) {
                return response.data.display_name
            } else {
                throw new Error("Coordenadas não encontradas.")
            }
        } catch (error) {
            throw new Error(`Erro ao obter endereço: ${error.message}`)
        }
    }

    private async fetchCoordinates(
        address: string
    ): Promise<{ lat: number; lng: number }> {
        try {
            const response = await axios.get(`${this.urlNominatim}/search`, {
                params: {
                    q: address,
                    format: "json"
                }
            })

            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0]
                return { lat, lng: lon }
            } else {
                throw new Error("Endereço não encontrado.")
            }
        } catch (error) {
            throw new Error(`Erro ao obter coordenadas: ${error.message}`)
        }
    }
}

export default new GeoLib()
