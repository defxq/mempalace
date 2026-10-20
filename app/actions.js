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

// FIXED: Writes changes STRICTLY to local disk disk memory and stages it for local tracking loops
export async function saveVaultDatabase(updatedPayload) {
    try {
        fs.writeFileSync(coreVaultPath, JSON.stringify(updatedPayload, null, 2), 'utf-8');
        
        // Stage changes inside the local git index loop so status queries catch variations instantly
        const repoDir = path.resolve(process.cwd(), '../repo-1-viewer');
        await execAsync(`cd ${repoDir} && git add data.json`);
        
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// SECURE CENTRAL UPSTREAM SYNC GATEKEEPER:
// The single location allowed to push data modifications over the air to GitHub
export async function runGitPushRoutine() {
    try {
        const repoDir = path.resolve(process.cwd(), '../repo-1-viewer');

        const gitRoutine = `
            cd ${repoDir}
            git add data.json
            git commit -m "Production snapshot sync pushed via secure dashboard panel" || true
            git push origin main
        `;

        await execAsync(gitRoutine);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// DYNAMIC HARDWARE LEVEL REVISION SOLVER:
// Checks the repo status live to return a simple true/false to lock or unlock the cloud button
export async function checkLocalRevisionsExist() {
    try {
        const repoDir = path.resolve(process.cwd(), '../repo-1-viewer');
        
        // Stage data.json variations so status porcelain reads local changes correctly
        await execAsync(`cd ${repoDir} && git add data.json || true`);
        
        // Evaluate unstaged/staged change strings and checking if local branch sits ahead of origin
        const { stdout: statusOut } = await execAsync(`cd ${repoDir} && git status --porcelain data.json || echo ""`);
        const { stdout: cherryOut } = await execAsync(`cd ${repoDir} && git cherry origin/main || echo ""`);
        
        if (statusOut.trim() || cherryOut.trim()) {
            return true; // Unsaved modifications exist -> Unlock Save to Cloud button
        }
        return false; // Repositories match perfectly -> Lock button
    } catch (error) {
        console.error("Local revision lookup dropped: ", error.message);
        return false;
    }
}

// UPGRADED LOG ENGINE: Captures year, date, and hour:minute timestamps directly from your git terminal
export async function getGitCommitHistory() {
    try {
        const repoDir = path.resolve(process.cwd(), '../repo-1-viewer');
        
        // Using custom date format tokens to pull exact 24-hour timestamps from git log
        const { stdout } = await execAsync(`cd ${repoDir} && git log -n 15 --pretty=format:"%h||%ad||%an||%s" --date=format:"%Y-%m-%d %H:%M"`);
        
        if (!stdout.trim()) return [];
        return stdout.split('\n').map(line => {
            const [hash, date, author, message] = line.split('||');
            return { hash, date, author, message };
        });
    } catch (error) {
        return [];
    }
}
