'use client';
import * as React from 'react';
import { Button, Divider, message, Modal } from 'antd';
import { IPresente } from '@/data/interfaces/presente';
import RadioOptions from './RadioOptions';
import { CloseCircleFilled } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useQuery, { queryKeys } from '@/hooks/useQuery';
import { IConvidado, IConvidadoPresentear } from '@/data/interfaces/convidado';
import { PresentesApi } from '@/data/services/presentes.api';
import { AxiosResponse } from 'axios';
import Select from 'react-select';

export function PresenteIndividual({ id, nome, urlfoto: imgUrl, valor: valorTotal, valorobtido: valorObtido, urlloja }: IPresente) {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [presenteOpcaoDoacao, setPresenteOpcaoDoacao] = React.useState<'loja' | 'pix' | undefined>();
    const [convidadoSelecionado, setConvidadoSelecionado] = React.useState<IConvidado | undefined>();

    const [pixCopiaeCola, setPixCopiaeCola] = React.useState<string | undefined>();

    const [messageApi, contextHolder] = message.useMessage();

    const queryClient = useQueryClient();
    const { data } = useQuery.buscaListadeConvidados();

    const contribuirComPixMutation = useMutation({
        mutationFn: (valor: number) => {
            return PresentesApi.contribuirComPix(valor);
        },
        onSuccess: (resultado, valor) => {
            setTimeout(() => {
                messageApi.open({
                    type: 'success',
                    content: `Seu código pix copia e cola está pronto!`,
                });
                setPixCopiaeCola(resultado.data.copiaECola);
            }, 1000);
        },
        onError: (error) => {
            messageApi.open({
                type: 'error',
                content: 'Erro ao registrar contribuição. Tente novamente mais tarde!',
            });
        },
    })

    const presentearMutation = useMutation({
        mutationFn: (payload: IConvidadoPresentear) => {
            return PresentesApi.convidadoPresentearPresente(payload);
        },
        onSuccess: (_, payload) => {
            const convidado = data?.data.find(convidado => convidado.id == payload.ConvidadoId);

            queryClient.setQueryData([queryKeys.listaDePresentes], (listaAnterior: AxiosResponse<IPresente[]>) => {
                const listaAtualizada = listaAnterior.data.map((presente) => {
                    if (presente.id === payload.PresenteId) {
                        return { ...presente, valorobtido: valorTotal };
                    }
                    return presente;
                });
                return { ...listaAnterior, data: listaAtualizada };
            })

            messageApi.open({
                type: 'success',
                content: `Presente concedido por ${convidado?.nome}, Obrigado🥰!`,
                duration: 3,
            });

            if (presenteOpcaoDoacao === 'loja' && urlloja) {
                setTimeout(() => {
                    window.open(urlloja, '_blank', 'noopener,noreferrer');
                }, 1500);
            }

            if (presenteOpcaoDoacao === 'pix') {
                contribuirComPixMutation.mutate(parseFloat(valorTotal));
            }

            setConvidadoSelecionado(undefined);
            setPresenteOpcaoDoacao(undefined);
            setIsModalOpen(false);
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Erro ao registrar presente. Tente novamente mais tarde, por favor!',
            });
        },
    })

    const options = data?.data.map((item) => ({
        value: item.id,
        label: item.nome,
    })) || [];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setConvidadoSelecionado(undefined);
        setPixCopiaeCola(undefined);
        setPresenteOpcaoDoacao(undefined);
    };

    function handleClick() {
        if (!convidadoSelecionado) {
            messageApi.open({
                type: 'error',
                content: 'Selecione um convidado para continuar.',
            });
            return;
        }
        if (!presenteOpcaoDoacao) {
            messageApi.open({
                type: 'error',
                content: 'Selecione uma forma de presentear.',
            });
            return;
        }

        presentearMutation.mutate({
            ConvidadoId: convidadoSelecionado.id,
            PresenteId: id,
            ValorConcedido: parseFloat(valorTotal),
        })
    }

    function copiarParaAreaDeTransferencia() {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(pixCopiaeCola || '')
                .then(() => messageApi.open({
                    type: 'success',
                    content: 'Pix copiado com sucesso!',
                }))
                .catch(() => messageApi.open({
                    type: 'error',
                    content: 'Erro ao copiar o pix. Tente selecionar o texto manualmente, por favor!',
                }));
        }

        const textarea = document.createElement('textarea');
        textarea.value = pixCopiaeCola || '';
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        try {
            const sucesso = document.execCommand('copy');
            sucesso && messageApi.open({
                type: 'success',
                content: 'Pix copiado com sucesso!',
            });
        } catch (err) {
            messageApi.open({
                type: 'error',
                content: 'Erro ao copiar o pix. Tente selecionar o texto manualmente, por favor!',
            });
        }

        document.body.removeChild(textarea);
    }

    return (
        <>
            {contextHolder}
            <div className='relative h-full'>
                <div className='presenteColaborativo' onClick={() => showModal()}>
                    <img src={imgUrl} alt='imagem do presente' className="presenteImagem" />

                    <div className="informacoesPresenteColaborativo">
                        <div>
                            <h2>{nome}</h2>
                        </div>
                        <img src='./svgs/seta.svg' alt='seta de redirecionamento' className="setaRedirect" />
                    </div>
                </div>

                {parseFloat(valorObtido) >= parseFloat(valorTotal) && (
                    <div className="absolute inset-0 bg-black/60 z-10 cursor-not-allowed rounded-[15px]"></div>
                )}
            </div>

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                closable={false}
                styles={{
                    content: {
                        borderRadius: 25,
                    },
                }}
            >
                <div className='modalPresenteTitulo'>
                    <h3>PRESENTEAR COM</h3>
                    <h1 style={{ color: '#0F1434' }}>{nome}</h1>

                    <CloseCircleFilled style={{ position: 'absolute', top: 10, right: 10, fontSize: 24 }} onClick={handleCancel} />

                    <Divider style={{ backgroundColor: '#0F1434', paddingBottom: 2, borderRadius: 105, marginTop: 15, marginBottom: 16 }} />

                    <h3 className='RequisicaoNomePresenteador'>Quem está tornando esse presente possível</h3>

                    <Select
                        options={options}
                        isClearable
                        onChange={(selectedOption) => {
                            setConvidadoSelecionado(data?.data.find(convidado => convidado.id == selectedOption?.value));
                        }}
                        isSearchable
                        placeholder="Escreva seu nome"
                        noOptionsMessage={() => 'Nenhum convidado encontrado'}
                        value={convidadoSelecionado ? { value: convidadoSelecionado.id, label: convidadoSelecionado.nome } : null}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                width: '280px',
                                marginInline: 'auto',
                                borderRadius: '8px',
                                paddingTop: '-1px',
                                paddingBottom: '-1px',
                                borderColor: '#ccc',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#aaa',
                                },
                            }),
                        }}
                    />

                    <h3>escolha a forma de presentar:</h3>

                    <div className='modalPresenteFormasDePresentear'>
                        <img src={imgUrl} alt='imagem do presente' style={{ maxWidth: '40%', maxHeight: '40%', objectFit: 'contain' }} />

                        <RadioOptions
                            options={[
                                { value: 'loja', text: 'Ir à loja' },
                                { value: 'pix', text: 'Contribuir com PIX' }
                            ]}
                            onChange={(valor: string) => {
                                if (valor === 'loja') {
                                    setPresenteOpcaoDoacao('loja');
                                } else if (valor === 'pix') {
                                    setPresenteOpcaoDoacao('pix');
                                }
                            }}
                            checked={presenteOpcaoDoacao}
                        />
                    </div>

                    <Button
                        type='primary'
                        style={{ marginTop: 20 }}
                        onClick={handleClick}
                        loading={presentearMutation.isPending || contribuirComPixMutation.isPending}
                    >
                        Continuar
                    </Button>
                </div>

            </Modal>

            <Modal
                open={!!pixCopiaeCola}
                onCancel={() => setPixCopiaeCola(undefined)}
                footer={null}
                closable={false}
                styles={{
                    content: {
                        borderRadius: 25,
                    },
                }}
            >
                <div className='modalPresenteTitulo'>
                    <h3>PRESENTEAR COM</h3>
                    <h1 style={{ color: '#0F1434' }}>{nome}</h1>

                    <CloseCircleFilled style={{ position: 'absolute', top: 10, right: 10, fontSize: 24 }} onClick={() => setPixCopiaeCola(undefined)} />

                    <Divider style={{ backgroundColor: '#0F1434', paddingBottom: 2, borderRadius: 105, marginTop: 15, marginBottom: 16 }} />

                    <div className='flex flex-col items-center justify-center justify-self-center'>
                        <div className='flex flex-col items-center justify-center bg-[#D9D9D9] justify-self-center rounded-[30px] p-12'>
                            <p className='break-all w-64'>{pixCopiaeCola}</p>
                        </div>
                        <Button
                            type='primary'
                            style={{ marginTop: 20 }}
                            onClick={copiarParaAreaDeTransferencia}
                        >
                            Copiar código
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
