'use server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const coreVaultPath = path.resolve(process.cwd(), '../repo-1-viewer/data.json');

export async function getVaultDatabase() {
    try {
        if (!fs.existsSync(coreVaultPath)) return [];
        const content = fs.readFileSync(coreVaultPath, 'utf-8');
        return JSON.parse(content || '[]');
    } catch (e) {
        return [];
    }
}

export async function saveVaultDatabase(updatedPayload) {
    try {
        fs.writeFileSync(coreVaultPath, JSON.stringify(updatedPayload, null, 2), 'utf-8');
        
        const gitRoutine = `
            cd ../repo-1-viewer
            git add data.json
            git commit -m "Ledger updated via mobile server management deck" || true
            git push origin main
        `;
        execAsync(gitRoutine).catch(err => console.error("Background Git sync failure: ", err.message));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// BULLETPROOF WORKSPACE REVISION TUNNEL: 
// Explicitly checks porcelain status across the shared data target path to ensure empty commits return pristine codes
export async function runGitPushRoutine() {
    try {
        const repoDir = path.resolve(process.cwd(), '../repo-1-viewer');
        
        // 1. Force fetch to verify if local branch is actually sync-aligned with remote origin tracking refs
        try {
            await execAsync(`cd ${repoDir} && git fetch origin main`);
        } catch (fetchErr) {
            console.warn("Remote origin untrackable. Computing local changes only.");
        }
        
        // 2. Read true unstaged or untracked changes specifically on your data ledger json module
        const { stdout: statusOut } = await execAsync(`cd ${repoDir} && git status --porcelain data.json || echo ""`);
        
        // 3. Evaluate if local tree commits are sitting ahead of upstream repositories
        const { stdout: cherryOut } = await execAsync(`cd ${repoDir} && git cherry origin/main || echo ""`);
        
        if (!statusOut.trim() && !cherryOut.trim()) {
            return { success: true, changesDetected: false };
        }

        const gitRoutine = `
            cd ${repoDir}
            git add data.json
            git commit -m "System ledger backup triggered via twilight cockpit control deck" || true
            git push origin main
        `;

        await execAsync(gitRoutine);
        return { success: true, changesDetected: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getGitCommitHistory() {
    try {
        const repoDir = path.resolve(process.cwd(), '../repo-1-viewer');
        const { stdout } = await execAsync(`cd ${repoDir} && git log -n 15 --pretty=format:"%h||%ad||%an||%s" --date=short`);
        
        if (!stdout.trim()) return [];
        
        return stdout.split('\n').map(line => {
            const [hash, date, author, message] = line.split('||');
            return { hash, date, author, message };
        });
    } catch (error) {
        console.error("Failed to parse log terminal output:", error.message);
        return [];
    }
}
