'use client';
import { Contador } from "@/components/Contador";
import Header from "@/components/Header";

export default function Home() {

	return (
		<div id="bgImage">
			<Header />

			<div id="cumprimentos">
				Estamos muito felizes em compartilhar com vocês esse momento tão especial em nossas vidas:
			</div>

			<h1 id="vamosCasar" className="great-vibes-regular">vamos casar!</h1>

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
