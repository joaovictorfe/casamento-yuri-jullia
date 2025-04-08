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