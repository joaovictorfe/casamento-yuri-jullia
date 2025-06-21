'use client';
import { Contador } from "@/components/Contador";
import Header from "@/components/Header";
import useQuery from "@/hooks/useQuery";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Home() {

	const queryClient = useQueryClient();
	
	const estamosCasados = new Date().valueOf() > new Date(2025, 5, 21, 10, 30, 0).valueOf();

	useEffect(() => {
		queryClient && useQuery.preFetchDados(queryClient);
	}, [queryClient]);

	return (
		<div id="bgImage">
			<Header />

			<div id="cumprimentos">
				Estamos muito felizes em compartilhar com vocês esse momento tão especial em nossas vidas:
			</div>

			<h1 id="vamosCasar" className="great-vibes-regular">{!estamosCasados ? 'vamos casar!' : 'Casamos!!!'}</h1>

			<Contador />

			<div id="localizacaoContainer">
				<a href="https://maps.app.goo.gl/Eqgi4DupaCa4MmJ26" target="_blank" rel="noopener noreferrer">
					<div id='cardLocalizacaoCerimonia'>
						<img src="./svgs/localizacao.svg" alt="localizacao" />
						<p>Localização da cerimônia</p>
					</div>
				</a>

				<a href="https://maps.app.goo.gl/A1pnvQy1E2fmhLMMA" target="_blank" rel="noopener noreferrer">
					<div id='cardLocalizacaoRecepcao'>
						<img src="./svgs/localizacao.svg" alt="localizacao" />
						<p>Localização da recepção</p>
					</div>
				</a>
			</div>

		</div>
	);
}
