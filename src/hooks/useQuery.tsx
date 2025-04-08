'use client';
import { ConvidadosApi } from "@/data/services/convidados.api";
import { PresentesApi } from "@/data/services/presentes.api";
import { QueryClient, useQuery as UseQuery } from "@tanstack/react-query";

export const queryKeys = {
    listaDePresentes: 'LISTA_DE_PRESENTES',
    listaDeConvidados: 'LISTA_DE_CONVIDADOS',
    contribuirComPix: 'CONTRIBUIR_COM_PIX',
}

const useQuery = {
    preFetchDados: (queryClient: QueryClient) => {
        queryClient.prefetchQuery({
            queryKey: [queryKeys.listaDePresentes],
            queryFn: PresentesApi.buscaListaDePresentes,
        });
        queryClient.prefetchQuery({
            queryKey: [queryKeys.listaDeConvidados],
            queryFn: ConvidadosApi.buscaconvidados,
        });
    },

    buscaListaDePresentes: () => UseQuery({
        queryKey: [queryKeys.listaDePresentes],
        queryFn: PresentesApi.buscaListaDePresentes,
    }),

    buscaListadeConvidados: () => UseQuery({
        queryKey: [queryKeys.listaDeConvidados],
        queryFn: ConvidadosApi.buscaconvidados,
    }),

    contribuirComPix: (valor: number) => UseQuery({
        queryKey: [queryKeys.contribuirComPix],
        queryFn: () => PresentesApi.contribuirComPix(valor),
    }),
}

export default useQuery;