import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="logo-container p-4 rounded-2xl mx-auto mb-4">
            <img src="/logs/islamclick_logo.svg" alt="IslamClick Logo" className="h-16 w-auto logo-glow" />
        </div>
    )
}
