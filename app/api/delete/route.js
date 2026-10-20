import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');

// POST: Removes entries strictly from local hard drive vectors without touching GitHub
export async function POST(request) {
    try {
        let targetId = null;
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            targetId = formData.get('id')?.toString();
        } else {
            const jsonBody = await request.json();
            targetId = jsonBody?.id;
        }
        
        if (!targetId) {
            return NextResponse.json({ success: false, error: "Missing Target ID Parameter" }, { status: 400 });
        }

        const fileContent = fs.readFileSync(coreVaultPath, 'utf-8');
        const currentLibrary = JSON.parse(fileContent || '[]');
        const updatedLibrary = currentLibrary.filter(item => item.id !== String(targetId));
        
        fs.writeFileSync(coreVaultPath, JSON.stringify(updatedLibrary, null, 2), 'utf-8');

        if (contentType.includes('form')) {
            return new Response(null, { status: 302, headers: { 'Location': '/' } });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
