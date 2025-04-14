export interface IConvidado {
    id: string
    nome: string
    presencaconfirmada: boolean
}

export interface IConvidadoPresentear {
    ConvidadoId: string;
    PresenteId: string;
    ValorConcedido: number;
}

export interface IConvidadoPresente {
    id: string;
    convidadoid: string;
    presenteid: string;
    nomeconvidado: string;
    valorconcedido: number;
}
