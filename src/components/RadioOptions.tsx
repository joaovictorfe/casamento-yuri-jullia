import { Flex, Radio, RadioChangeEvent } from 'antd';
import React from 'react';

type Props = {
    options: {
        value: string;
        text: string;
    }[];
    onChange: (valor: string) => void;
    checked?: any;
}

const RadioOptions = ({ options, onChange, checked }: Props) => {

    return (
        <div>
            {
                options.map((option) => (
                    <div
                        key={option.value}
                        style={{
                            marginBottom: 10,
                            backgroundColor: checked == option.value ? '#0F1434' : '#D9D9D9',
                            color: checked != option.value ? '#0F1434' : '#FFFFFF',
                            borderRadius: 8,
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingTop: 15,
                            paddingBottom: 15,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                        onClick={() => onChange(option.value)}
                    >
                        <input type='radio'
                            value={option.value}
                            checked={checked == option.value}
                            style={{ marginRight: '5px' }}
                            onChange={() => { }}
                        />
                            {option.text}
                    </div>
                ))
            }
        </div>
    );
}

export default RadioOptions;