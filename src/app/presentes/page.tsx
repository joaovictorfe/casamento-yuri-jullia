'use client';
import React from 'react';
import Header from '@/components/Header';
import { Col, Row, Skeleton } from 'antd';
import { PresenteColaborativo } from '@/components/PresenteColaborativo';
import { PresenteIndividual } from '@/components/PresenteIndividual';
import useQuery from '@/hooks/useQuery';

export default function Presentes() {

    const [categoriaSelecionada, setCategoriaSelecionada] = React.useState<'colaborativos' | 'individuais'>('colaborativos');

    const { data, isLoading, error } = useQuery.buscaListaDePresentes();

    return (
        <div id='presentes'>
            <Header />

            <div className='scrollable-section'>
                <div id='tituloDeApresentacao'>
                    <h1>Lista de</h1>
                    <p className='great-vibes-regular tituloPresentes'>presentes</p>
                </div>

                <button id='ajudaLuaDeMel'>
                    <img src='./svgs/coracao.svg' alt='imagem de coração' />
                    <div>
                        <h1>Ajude com nossa lua de mel</h1>
                        <p>clique aqui</p>
                    </div>
                </button>

                <div id='categoriasPresentes'>
                    <div id='categoriaSelecionada'>
                        <h2>{categoriaSelecionada == 'colaborativos' ? 'Colaborativo' : 'Individual'}</h2>
                    </div>

                    <button id='outraCategoria' onClick={() => setCategoriaSelecionada(categoriaAtual => categoriaAtual == 'colaborativos' ? 'individuais' : 'colaborativos')}>
                        <h3>{categoriaSelecionada != 'colaborativos' ? 'Colaborativo' : 'Individual'}</h3>
                    </button>
                </div>

                <div id='listaDePresentes' style={{ paddingBottom: 150 }}>
                    <Row gutter={[15, 15]} className='row-container'> {/* Adds spacing between columns and rows */}
                        {
                            isLoading ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                    <Skeleton.Node active style={{ width: 170, marginRight: 10, marginTop: 10 }} />
                                </div>
                            ) : error ? (
                                <div className='text-white text-center flex w-full h-full items-center justify-center'>Sem presentes no momento</div>
                            ) : (
                                data?.data
                                .sort((a, b) => {
                                    const aCompleto = parseFloat(a.valorobtido) >= parseFloat(a.valor);
                                    const bCompleto = parseFloat(b.valorobtido) >= parseFloat(b.valor);
                                    return Number(aCompleto) - Number(bCompleto);
                                })
                                .filter(item => !item.destino && (categoriaSelecionada == 'individuais' && item.presenteunico || categoriaSelecionada == 'colaborativos' && !item.presenteunico)).map((item) => (
                                    <Col className='col-container' key={item.id} span={12}>
                                        {
                                            categoriaSelecionada == 'colaborativos'
                                                ? <PresenteColaborativo {...item} />
                                                : <PresenteIndividual {...item} />
                                        }
                                    </Col>
                                ))
                            )
                        }
                    </Row>
                </div>

            </div>
        </div>
    );
}
