import { Http } from "@/utils/http";
import { AxiosResponse } from "axios";
import { IConvidado } from "../interfaces/convidado";

export class ConvidadosApi {
    static async buscaconvidados(): Promise<AxiosResponse<IConvidado[]>> {
        const axios = await Http.axios();
        return axios.get('/convidados');
    }

    static async confirmarPresenca(id: string): Promise<AxiosResponse<any>> {
        const axios = await Http.axios({'Content-Type': 'application/json'});
        return axios.put(`/convidados/${id}/confirmar-presenca`, { presenca: true });
    }
}