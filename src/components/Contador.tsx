'use client';
import { useEffect, useState } from "react";

export function Contador() {
    
	function diferenca() {
		const agora: any = new Date();
		const destino: any = new Date(2025, 5, 21, 10, 0, 0);

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
		<div id="contador">
			<div className="tempoParaCasamento">
				<p className="text-white">{Math.floor(segundosTotais / (60 * 60 * 24))}</p>
				<p className="text-white">dias</p>
			</div>

			<div className="tempoParaCasamento">
				<p className="text-white">{Math.floor((segundosTotais % (60 * 60 * 24)) / (60 * 60))}</p>
				<p className="text-white">horas</p>
			</div>

			<div className="tempoParaCasamento">
				<p className="text-white">{Math.floor((segundosTotais % (60 * 60)) / 60)}</p>
				<p className="text-white">minutos</p>
			</div>

			<div className="ultimoTempoParaCasamento">
				<p className="text-white">{segundosTotais % 60}</p>
				<p className="text-white">segundos</p>
			</div>
		</div>
	);

}