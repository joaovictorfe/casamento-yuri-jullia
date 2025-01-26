"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function BemVindo() {
    return (
        <div className="relative">
            <img
                src="/fotos/foto4.jpg"
                alt="Foto do casal"
                className="w-full h-auto"
            />

            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black/100 to-transparent">
                <div className="flex flex-row justify-center items-center mt-10">
                    <Image src='/logo-white.png' alt='Logo' width={100} height={100} className="m-3" />
                    <div className="ml-2">
                        <Contador />
                        {/* <h3 className="text-white mb-3">Para o nosso grande dia!</h3> */}
                        <h3 className="text-white">Estamos muito felizes em compartilhar com vocês esse momento tão especial em nossas vidas!</h3>
                    </div>
                </div>
            </div>
        </div>

    );
}

function Contador() {
    function diferenca() {
        const agora = new Date();
        const destino = new Date(2025, 5, 21, 10, 0, 0);
        
         return (destino - agora) / 1000;
    }
    
    const [segundosTotais, setSegundosTotais] = useState(Math.floor(diferenca()));

    useEffect(() => {
        const intervalo = setInterval(() => {
          setSegundosTotais(Math.floor(diferenca()));
        }, 1000);
    
        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="flex flex-row justify-center items-center mb-5">
            <div className="content-center justify-center text-center">
                <p className="text-white">{Math.floor(segundosTotais / (60 * 60 * 24))}</p>
                <p className="text-white">dias</p>
            </div>

            <div className="content-center justify-center ml-2 text-center">
                <p className="text-white">{Math.floor((segundosTotais % (60 * 60 * 24)) / (60 * 60))}</p>
                <p className="text-white">horas</p>
            </div>

            <div className="content-center justify-center mx-2 text-center">
                <p className="text-white">{Math.floor((segundosTotais % (60 * 60)) / 60)}</p>
                <p className="text-white">minutos</p>
            </div>

            <div className="mx-2 items-center justify-center text-center">
                <p className="text-white">{segundosTotais % 60}</p>
                <p className="text-white">segundos</p>
            </div>
        </div>
    );

}