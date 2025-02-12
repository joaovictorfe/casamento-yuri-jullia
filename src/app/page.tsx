"use client";
import Header from "@/components/Header"
import BemVindo from "./BemVindo/page";
import { useEffect, useState } from "react";

export default function Home() {
	return (
		<>
			{/* <Header />

      <main>
        <BemVindo />
      </main>

      <footer>
      </footer> */}

			<div className="relative h-screen w-full">
				{/* imagem de fundo */}
				<img
					src="/fotos/foto4.jpg"
					alt="Foto do casal"
					className="absolute inset-0 w-full h-full object-cover"
				/>


				<div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-b from-black/100 to-transparent" />

				{/* Header */}
				<div className="relative flex justify-center z-10 w-full items-center text-white pt-9">
					<MenuButton text="Lista de presentes" action={() => console.log("Bem-vindo")} />
					<img src="aliancas.png" alt="aliancas" className="w-[51px] h-[51px]" />
					<MenuButton text="Confirme sua presença" action={() => console.log("Lista de presentes")} />
				</div>

				<div className="text-white absolute top-28 px-2 text-center">
				Estamos muito felizes em compartilhar com vocês esse momento tão especial em nossas vidas!
				</div>

				{/* Contador */}
				<div className="absolute bottom-6 left-16 bg-black rounded-lg px-8 py-4">
					<Contador />
				</div>
			</div>
		</>
	);
}

function MenuButton({ text, action }: { text: string; action: Function }) {
	return (
		<div className="w-1/3 border-b-2 mx-8 pb-1">
			<button
				onClick={() => action()}
				className="text-white py-1 rounded-lg"
			>
				<p className="text-[15px] font-bold text-center leading-none">
					{text}
				</p>
			</button>
		</div>
	);
}

function Contador() {
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
		<div className="flex flex-row justify-center items-center">
			<div className="content-center justify-center text-center pr-8 py-4 mr-6 border-r-2 border-white">
				<p className="text-white text-2xl">{Math.floor(segundosTotais / (60 * 60 * 24))}</p>
				<p className="text-white text-2xl">dias</p>
			</div>
			
			<div>
				<div className="content-center justify-center">
					<p className="text-white text-xl">{Math.floor((segundosTotais % (60 * 60 * 24)) / (60 * 60))}</p>
					<p className="text-white text-xl">horas</p>
				</div>

				<div className="flex flex-row items-center text-center pt-1">
					<p className="text-white">{Math.floor((segundosTotais % (60 * 60)) / 60)}</p>
					<p className="text-white pl-2">minutos</p>
				</div>

				<div className="flex flex-row items-center justify-center text-center text-center">
					<p className="text-white">{segundosTotais % 60}</p>
					<p className="text-white pl-2">segundos</p>
				</div>
			</div>
		</div>
	);

}