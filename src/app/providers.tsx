'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#0F1434',
                    borderRadius: 8,
                    colorErrorText: '#000000',
                    colorError: '#000000',
                },
                components: {
                    Skeleton: {
                        gradientFromColor: 'rgba(255, 255, 255, 0.3)',
                        gradientToColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    Button: {
                        colorPrimary: '#40628F',
                        colorPrimaryHover: 'rgba(64, 98, 143, 0.8)',
                        colorTextDisabled: '#a0a0a0',
                        colorBgContainerDisabled: 'rgba(64, 98, 143, 0.1)',
                    }
                }
            }}
        >
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ConfigProvider>
    );
}