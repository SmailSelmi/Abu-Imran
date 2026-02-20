declare module 'react-algeria-map' {
    import React from 'react';
    export interface AlgeriaMapProps {
        onWilayaClick?: (wilayaName: string, data?: any) => void;
        color?: string;
        hoverColor?: string;
        width?: string | number;
        height?: string | number;
        data?: Record<string, any>;
    }
    export const Map: React.FC<AlgeriaMapProps>;
}
