'use client';
import Header from '@/components/Header';
import { IConvidado } from '@/data/interfaces/convidado';
import { ConvidadosApi } from '@/data/services/convidados.api';
import useQuery, { queryKeys } from '@/hooks/useQuery';
import { HeartOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AutoComplete, Button, Col, message, Row } from 'antd';
import { AxiosResponse } from 'axios';
import React from 'react';

export default function Presenca() {

    const [inputValue, setInputValue] = React.useState<string>('');
    const [convidadoSelecionado, setConvidadoSelecionado] = React.useState<IConvidado | undefined>();
    const [tipoDeTelaDeConfirmacaoDePresenca, setTipoDeTelaDeConfirmacaoDePresenca] = React.useState<'confirmar' | 'confirmado'>('confirmar');

    const [messageApi, contextHolder] = message.useMessage();

    const queryClient = useQueryClient();
    const { data, error } = useQuery.buscaListadeConvidados();

    const confirmarPresencaMutation = useMutation({
        mutationFn: (convidadoId: string) => {
            return ConvidadosApi.confirmarPresenca(convidadoId);
        },
        onSuccess: (_, convidadoId) => {
            messageApi.open({
                type: 'success',
                content: 'Presença confirmada com sucesso!',
            });
            queryClient.setQueryData([queryKeys.listaDeConvidados], (listaAnterior: AxiosResponse<IConvidado[]>) => {
                const listaAtualizada = listaAnterior.data.map((convidado) => {
                    if (convidado.id === convidadoId) {
                        return { ...convidado, presencaconfirmada: true };
                    }
                    return convidado;
                });
                return { ...listaAnterior, data: listaAtualizada };
            })
            setTipoDeTelaDeConfirmacaoDePresenca('confirmado');
            setInputValue('');
            setConvidadoSelecionado(undefined);
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: 'Erro ao confirmar presença. Tente novamente mais tarde.',
            });
            console.log('Erro ao tentar confirmar presença:', error);

        },
    })

    const options = data?.data.filter(convidado => !convidado.presencaconfirmada).map((item) => ({
        value: item.id,
        label: item.nome,
    })) || [];

    const numeroDeConvidadosConfirmados = data?.data.filter(item => item.presencaconfirmada).length || 0;

    function confirmarPresenca() {
        if (convidadoSelecionado) {
            const convidado = data?.data.find(item => item.id == convidadoSelecionado.id);
            if (convidado) {
                confirmarPresencaMutation.mutate(convidado.id);
                return;
            }
        }
        messageApi.open({
            type: 'error',
            content: 'Selecione um convidado para confirmar presença.',
        });
    }

    function novaConfirmacao() {
        setInputValue('');
        setConvidadoSelecionado(undefined);
        setTipoDeTelaDeConfirmacaoDePresenca('confirmar');
    }

    function TelaConfirmarPresenca() {
        return (
            <div id='contentPresenca'>
                <div id='tituloDeApresentacao'>
                    <h1>Confirme a sua </h1>
                    <p className='great-vibes-regular tituloPresentes'>presença</p>
                </div>

                <AutoComplete
                    className='w-80 lg:w-1/3'
                    options={options}
                    placeholder="Escreva seu nome"
                    size='large'
                    filterOption={(inputValue, option) =>
                        option?.label.toLowerCase().includes(inputValue.toLowerCase()) || false
                    }
                    onChange={(value) => {
                        setConvidadoSelecionado(undefined);
                        setInputValue(value);
                    }}
                    value={inputValue}
                    onSelect={(value) => {
                        setInputValue(data?.data.find(convidado => convidado.id == value)?.nome || '');
                        setConvidadoSelecionado(data?.data.find(convidado => convidado.id == value));
                    }}
                />

                <Button
                    type="primary"
                    color='geekblue'
                    size={'large'}
                    className='mt-5'
                    disabled={!convidadoSelecionado}
                    onClick={confirmarPresenca}
                    loading={confirmarPresencaMutation.isPending}
                >
                    Confirmar presença
                </Button>

                <div className='flex flex-row items-center justify-center mt-10 mx-auto'>
                    <HeartOutlined style={{ fontSize: 100, color: '#40628F' }} />
                    <div className='bg-[#40628F] h-full w-[2px] mx-[15px]' />
                    <p className='max-w-48 text-white' style={{ fontSize: 15, textAlign: 'left' }}>
                        <b>{`${numeroDeConvidadosConfirmados} pessoa${numeroDeConvidadosConfirmados == 1 ? '' : 's'} já confirmaram presença`}</b> para celebrar o nosso amor neste dia inesquecível.
                    </p>
                </div>
            </div>

        );
    }

    function TelaConfirmado() {
        return (
            <div className='flex flex-col max-w-[300px] items-center'>

                <div className={`flex flex-row text-white mt-10 text-left -ml-${numeroDeConvidadosConfirmados > 9 ? '8' : '16'}`}>
                    <p className='text-[100px] font-semibold mr-2 leading-[0.9]'>{numeroDeConvidadosConfirmados}</p>
                    <div className='flex flex-col h-full justify-end font-medium text-[28px]'>
                        <p className='leading-[0.8]'>AGORA,</p>
                        <p>PESSOAS</p>
                    </div>
                </div>

                <p className='text-left text-white mt-2 text-[17px] font-medium px-7'>
                    já confirmam presença para celebrar o nosso amor neste dia inesquecível.
                </p>

                <Button
                    type="primary"
                    color='geekblue'
                    size={'large'}
                    className='mt-10'
                    onClick={novaConfirmacao}
                >
                    confirmar mais um convidado
                </Button>


                <HeartOutlined style={{ fontSize: 150, color: '#40628F', marginTop: 100 }} />
            </div>
        );
    }

    return (
        <div id='presenca'>
            {contextHolder}
            <Header />
            {
                error ? (
                    <div className='text-white text-center flex w-full h-full items-center justify-center'>No momento não é possível confirmar presença.</div>
                ) : (
                    tipoDeTelaDeConfirmacaoDePresenca == 'confirmar'
                        ? <TelaConfirmarPresenca />
                        : <TelaConfirmado />
                )
            }
        </div>
    );
}
