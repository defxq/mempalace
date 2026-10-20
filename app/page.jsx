import { Suspense } from 'react';
import { headers } from 'next/headers';
import LaunchpadCockpitClient from './LaunchpadCockpitClient';

// Server-side prefetch reads request origin headers to calculate network IPs
async function ServerHeaderIpPrefetcher() {
    const requestHeaders = await headers();
    const hostHeader = requestHeaders.get('host') || '192.168.1.5:3000';
    
    // Isolate your laptop's current network IP address pointer profile
    const activeHostString = hostHeader.split(':')[0];
    const computedViewerUrl = `http://${activeHostString}:8080`;

    return <LaunchpadCockpitClient viewerUrl={computedViewerUrl} />;
}

// Master Entry Route: Enforces a suspense border boundary to completely kill prerendering build warnings
export default function HomeGateHub() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#070b12] text-[#00f0ff] font-mono flex items-center justify-center text-xs tracking-widest animate-pulse">
                ⚡ LINKING TO NerveGear NETWORKS...
            </div>
        }>
            <ServerHeaderIpPrefetcher />
        </Suspense>
    );
}
