import axios from "axios";

export class Http {
    static async axios(headers?: any) {
        return axios.create({ baseURL: 'https://casamento-git-main-yurireiss-projects.vercel.app', headers: { ...headers } });
    }
}