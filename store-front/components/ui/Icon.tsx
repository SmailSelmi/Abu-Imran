'use client';

import { Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

interface LordIconElement extends HTMLElement {
    play?: () => void;
    stop?: () => void;
}

const LordIconInner = dynamic(async () => {
    const [lottie, { defineElement }] = await Promise.all([
        import('lottie-web'),
        import('lord-icon-element'),
    ]);
    
    if (typeof window !== 'undefined') {
        defineElement(lottie.default.loadAnimation);
    }
    
    interface LordIconInnerProps extends IconProps {
        iconRef: React.RefObject<HTMLElement | null>;
    }

    return ({ src, trigger, colors, size, delay, className, iconRef, parentHover }: LordIconInnerProps) => {
        useEffect(() => {
            const element = iconRef.current as LordIconElement | null;
            if (parentHover !== undefined && element) {
                if (parentHover) {
                    element.play?.();
                } else {
                    element.stop?.();
                }
            }
        }, [parentHover, iconRef]);

        return (
            // @ts-ignore
            <lord-icon
                ref={iconRef}
                src={src}
                trigger={parentHover !== undefined ? 'manual' : trigger}
                delay={delay}
                colors={colors ? `primary:${colors.primary},secondary:${colors.secondary}` : undefined}
                style={{
                    width: size,
                    height: size,
                }}
                className={className}
            />
        );
    };
}, { ssr: false });

export type IconTrigger = 'hover' | 'click' | 'loop' | 'loop-on-hover' | 'morph' | 'boomerang';

export interface IconProps {
    src: string;
    trigger?: IconTrigger;
    colors?: {
        primary?: string;
        secondary?: string;
    };
    size?: number;
    delay?: number;
    className?: string;
    parentHover?: boolean;
}

export const Icon = (props: IconProps) => {
    const iconRef = useRef<HTMLElement>(null);

    return (
        <Suspense fallback={<div style={{ width: props.size || 24, height: props.size || 24 }} className={props.className} />}>
            <LordIconInner {...props} iconRef={iconRef} />
        </Suspense>
    );
};
