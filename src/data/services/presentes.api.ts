import { Http } from "@/utils/http";
import { AxiosResponse } from "axios";
import { IPresente } from "../interfaces/presente";
import { IConvidadoPresentear } from "../interfaces/convidado";

export class PresentesApi {
    static async buscaListaDePresentes(): Promise<AxiosResponse<IPresente[]>> {
        const axios = await Http.axios();
        return axios.get('/presentes');
    }

    static async convidadoPresentearPresente(payload: IConvidadoPresentear): Promise<AxiosResponse<any>> {
        const axios = await Http.axios({ 'Content-Type': 'application/json' });
        return axios.post('/convidado-presente', payload);
    }

    static async contribuirComPix(valor: number): Promise<AxiosResponse<{copiaECola: string}>> {
        const axios = await Http.axios({ 'Content-Type': 'application/json' });
        return axios.get(`/pix?valor=${valor}`);
    }
}