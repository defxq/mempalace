'use server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');

// Reads data directly from your hard drive with zero network calls
export async function getVaultDatabase() {
    try {
        if (!fs.existsSync(coreVaultPath)) return [];
        const content = fs.readFileSync(coreVaultPath, 'utf-8');
        return JSON.parse(content || '[]');
    } catch (e) {
        return [];
    }
}

// Writes data directly to disk and automates background Git pushing
export async function saveVaultDatabase(updatedPayload) {
    try {
        fs.writeFileSync(coreVaultPath, JSON.stringify(updatedPayload, null, 2), 'utf-8');
        
        const gitRoutine = `
            cd ../repo-1-viewer
            git add data.json
            git commit -m "Ledger updated via mobile server management deck"
            git push origin main
        `;
        
        execAsync(gitRoutine).catch(err => {
            console.error("Background Git sync went offline: ", err.message);
        });
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
