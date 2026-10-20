import { Suspense } from 'react';
import { headers } from 'next/headers';
import { checkLocalRevisionsExist } from './actions';
import LaunchpadCockpitClient from './LaunchpadCockpitClient';

async function ServerHeaderIpPrefetcher() {
    // Keep headers buster intact to safely handle dynamic runtime rendering
    await headers();
    
    // Direct, absolute production reference link to your live Vercel deployment site
    const liveVercelUrl = 'https://mempalace-v.vercel.app';
    
    // Live hardware check on your laptop's repository status
    const revisionsExist = await checkLocalRevisionsExist();

    return <LaunchpadCockpitClient viewerUrl={liveVercelUrl} initialHasChanges={revisionsExist} />;
}

export default function HomeGateHub() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#090b14] text-[#ff8800] font-mono flex items-center justify-center text-xs tracking-widest animate-pulse">
                ⚡ SECURING MEMPALACE TIMELINE LINK INDEX...
            </div>
        }>
            <ServerHeaderIpPrefetcher />
        </Suspense>
    );
}
