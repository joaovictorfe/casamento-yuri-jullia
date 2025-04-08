'use client';
import * as React from 'react';
import { Button, Divider, Flex, InputNumber, message, Modal, Progress } from 'antd';
import { IPresente } from '@/data/interfaces/presente';
import { CloseCircleFilled } from '@ant-design/icons';
import useQuery, { queryKeys } from '@/hooks/useQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PresentesApi } from '@/data/services/presentes.api';
import { IConvidado, IConvidadoPresentear } from '@/data/interfaces/convidado';
import { AxiosResponse } from 'axios';
import Select from 'react-select';

export function PresenteColaborativo({ id, nome, urlfoto: imgUrl, valor: valorTotal, valorobtido: valorObtido }: IPresente) {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [valorContribuido, setValorContribuido] = React.useState<number | null | undefined>();
    const [convidadoSelecionado, setConvidadoSelecionado] = React.useState<IConvidado | undefined>();

    const [pixCopiaeCola, setPixCopiaeCola] = React.useState<string | undefined>();

    const [messageApi, contextHolder] = message.useMessage();

    const porcentagemContribuida = Math.floor((parseFloat(valorObtido) / parseFloat(valorTotal)) * 100);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const { data } = useQuery.buscaListadeConvidados();

    const queryClient = useQueryClient();

    const presentearMutation = useMutation({
        mutationFn: (payload: IConvidadoPresentear) => {
            return PresentesApi.convidadoPresentearPresente(payload);
        },
        onSuccess: (_, payload) => {
            const convidado = data?.data.find(convidado => convidado.id == payload.ConvidadoId);

            queryClient.setQueryData([queryKeys.listaDePresentes], (listaAnterior: AxiosResponse<IPresente[]>) => {
                const listaAtualizada = listaAnterior.data.map((presente) => {
                    if (presente.id === payload.PresenteId) {
                        return { ...presente, valorobtido: parseFloat(presente.valorobtido) + payload.ValorConcedido };
                    }
                    return presente;
                });
                return { ...listaAnterior, data: listaAtualizada };
            })

            messageApi.open({
                type: 'success',
                content: `Obrigado ${convidado?.nome} por contribuir🥰!`,
                duration: 3,
            });

            setTimeout(() => {
                contribuirComPixMutation.mutate(payload.ValorConcedido);
            }, 1000);
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Erro ao registrar presente. Tente novamente mais tarde, por favor!',
            });
        },
    })

    const contribuirComPixMutation = useMutation({
        mutationFn: (valor: number) => {
            return PresentesApi.contribuirComPix(valor);
        },
        onSuccess: (resultado) => {
            messageApi.open({
                type: 'success',
                content: `Sua contribuição foi registrada e seu código pix copia e cola está pronto!`,
                duration: 6,
            });

            setConvidadoSelecionado(undefined);
            setIsModalOpen(false);
            setPixCopiaeCola(resultado.data.copiaECola);
        },
        onError: () => {
            messageApi.open({
                type: 'error',
                content: 'Erro ao registrar contribuição. Tente novamente mais tarde!',
            });
        },
    })

    const options = data?.data.map((item) => ({
        value: item.id,
        label: item.nome,
    })) || [];

    function handleClick() {
        if (!convidadoSelecionado) {
            messageApi.open({
                type: 'error',
                content: 'Selecione um convidado para continuar.',
            });
            return;
        }
        if (!valorContribuido) {
            messageApi.open({
                type: 'error',
                content: 'Selecione um valor para continuar.',
            });
            return;
        }
        presentearMutation.mutate({
            ConvidadoId: convidadoSelecionado.id,
            PresenteId: id,
            ValorConcedido: valorContribuido,
        });
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
            <div className='relative'>
                <div className='presenteColaborativo' onClick={() => showModal()}>
                    <img src={imgUrl} alt='imagem do presente' className="presenteImagem" />

                    <div className="informacoesPresenteColaborativo">
                        <div>
                            <h2>{nome}</h2>
                            <Progress percent={porcentagemContribuida} showInfo={false} strokeColor='#050a30' />
                        </div>
                        <img src='./svgs/seta.svg' alt='seta de redirecionamento' className="setaRedirect" />
                    </div>
                </div>

                {parseFloat(valorObtido) >= parseFloat(valorTotal) && (
                    <div className="absolute inset-0 bg-black/60 z-10 cursor-not-allowed rounded-[15px]" />
                )}
            </div>

            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                destroyOnClose
                footer={null}
                closable={false}
                styles={{
                    content: {
                        borderRadius: 25,
                    },
                }}
            >
                <div className='modalPresenteTitulo'>
                    <h3>CONTRIBUIR COM</h3>
                    <h1 style={{ color: '#0F1434' }}>{nome}</h1>

                    <CloseCircleFilled style={{ position: 'absolute', top: 10, right: 10, fontSize: 24 }} onClick={handleCancel} />

                    <Divider style={{ backgroundColor: '#0F1434', paddingBottom: 2, borderRadius: 105, marginTop: 15, marginBottom: 16 }} />

                    <Flex
                        gap="middle"
                        align="center"
                        justify="center"
                        style={{ width: '100%', marginTop: 35, marginBottom: 35 }}
                    >
                        <div className="image-container">
                            <img
                                src={imgUrl}
                                alt='imagem do presente'
                                className="presenteImagemModal"
                            />
                        </div>

                        <Progress
                            type="circle"
                            percent={porcentagemContribuida}
                            format={(percent) => (
                                <span style={{
                                    color: '#0F1434',
                                    fontWeight: 600,
                                    fontSize: '1em'
                                }}>
                                    {percent}%
                                </span>
                            )}
                            size={100}
                            strokeColor='#0F1434'
                        />
                    </Flex>

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
                                fontSize: '16px',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#aaa',
                                },
                            }),
                        }}
                    />

                    <br />

                    <InputNumber
                        className='w-[280px] text-base'
                        placeholder='Com quanto quer contribuir?'
                        keyboard
                        size="middle"
                        max={parseFloat(valorTotal) - parseFloat(valorObtido)}
                        min={0}
                        onChange={setValorContribuido}
                        style={{ paddingBlock: 4.5, borderRadius: 8 }}
                    />

                    <br />

                    <Button
                        type='primary'
                        style={{ marginTop: 20 }}
                        onClick={handleClick}
                        loading={contribuirComPixMutation.isPending || presentearMutation.isPending}
                    >
                        contribuir com pix
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
