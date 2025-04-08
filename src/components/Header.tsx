'use client';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

function Header() {

	const pathName = usePathname();
    const router = useRouter();

	function MenuButton({ text, action, path }: { text: string; action: Function; path: 'presentes' | 'presenca' }) {
		function getPathTitleColor() {
			if (path == 'presentes' && pathName == '/presentes' || path == 'presenca' && pathName == '/presenca') {
				return '#40628F';				
			}
			return '#FFFFFF';
		}
		
		return (
			<div className="">
				<button
					onClick={() => action()}
					className={`py-1 rounded-lg`}
				>
					<p className={`text-[15px] font-bold text-center leading-none`} style={{ color: getPathTitleColor() }}>
						{text}
					</p>
				</button>
			</div>
		);
	}

	return (
		<div className="header">
			<MenuButton text="Lista de presentes" action={() => router.push('/presentes')} path='presentes' />
			<img src="./svgs/aliancas.svg" alt="aliancas" className="w-[51px] h-[51px]" onClick={() => router.push('/')} />
			<MenuButton text="Confirme presença" action={() => router.push('/presenca')} path='presenca' />
		</div>
	);
}


export default Header;