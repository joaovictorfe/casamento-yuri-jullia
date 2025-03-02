'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

function Header() {

    const router = useRouter();

	function MenuButton({ text, action }: { text: string; action: Function }) {
		return (
			<div className="">
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

	return (
		<div className="header">
			<MenuButton text="Lista de presentes" action={() => {}} />
			<img src="./svgs/aliancas.svg" alt="aliancas" className="w-[51px] h-[51px]" onClick={() => router.push('/')} />
			<MenuButton text="Confirme presença" action={() => {}} />
		</div>
	);
}


export default Header;