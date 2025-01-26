import React from 'react';

type ButtonPageProps = {
    name: string;
    page: string;
}

const Header = () => {

    function ButtonPage({ name, page }: ButtonPageProps) {
        return (
            <button className='hover:bg-gray-200 text-white font-bold mx-2 rounded px-2'>
                {name}
            </button>
        );
    }

    return (
        <header>
            <div className='flex justify-between items-center px-2 py-2 bg-black'>
                <ButtonPage name='Lista de presentes' page='presentes' />
                <ButtonPage name='Confirme sua presença' page='confirmacao' />
            </div>
        </header>
    );
}

export default Header;