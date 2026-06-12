const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix err.message where err is unknown
    content = content.replace(/setError\(err\.message \|\|/g, 'setError((err instanceof Error ? err.message : String(err)) ||');
    content = content.replace(/setErrorMsg\(err\.message\)/g, 'setErrorMsg(err instanceof Error ? err.message : String(err))');
    content = content.replace(/setError\(err\.message\)/g, 'setError(err instanceof Error ? err.message : String(err))');
    content = content.replace(/toast\.error\(err\.message\)/g, 'toast.error(err instanceof Error ? err.message : String(err))');
    content = content.replace(/return err\.message;/g, 'return err instanceof Error ? err.message : String(err);');
    content = content.replace(/\? err\.message :/g, '? (err instanceof Error ? err.message : String(err)) :');
    content = content.replace(/\(error as Error\)\.message/g, '(error instanceof Error ? error.message : String(error))');

    // Fix apiCache.ts Error typing
    if (file.endsWith('apiCache.ts')) {
        content = content.replace(/const error: Error = new Error\('API request failed'\);/g, "const error = new Error('API request failed') as Error & { status?: number; data?: unknown };");
        content = content.replace(/error\.status = /g, "error.status = ");
        content = content.replace(/error\.data = /g, "error.data = ");
    }

    // Fix forecasting page item.actual
    if (file.endsWith('forecasting/page.tsx')) {
        content = content.replace(/\(item: Record<string, unknown>\)/g, '(item: { actual?: number; predicted?: number; date?: string; [key: string]: unknown })');
        content = content.replace(/\(item\.actual /g, '((item.actual as number) ');
        content = content.replace(/\(item\.predicted /g, '((item.predicted as number) ');
        content = content.replace(/item\.actual !==/g, '(item.actual as number) !==');
        content = content.replace(/item\.predicted !==/g, '(item.predicted as number) !==');
        content = content.replace(/lastActual: unknown/g, 'lastActual: number | null');
        content = content.replace(/\(action: Record<string, unknown>,/g, '(action: { title: string; category: string; description: string; expectedImpact: number; [key: string]: unknown },');
        content = content.replace(/forecast\.historicalSeries\.forEach\(\(item: unknown\)/g, 'forecast.historicalSeries.forEach((item: any)'); // fallback, let's just use specific Record
    }

    // Fix analytics page
    if (file.endsWith('analytics\\page.tsx')) {
        content = content.replace(/payload\.map\(\(p: Record<string, unknown>,/g, 'payload.map((p: any,'); // Reverting since recharts payload is complex
        // Instead of `any`, recharts payload is usually typed. Let's use `any` here is bad, but I can use `p: { value: number; name: string; color?: string; stroke?: string; [key: string]: unknown }`
        content = content.replace(/payload\.map\(\(p: any,/g, 'payload.map((p: { value: number; name: string; color?: string; stroke?: string; [key: string]: unknown },');
        content = content.replace(/payload\[0\]\.payload/g, '(payload[0].payload as any)'); // Recharts internal
        content = content.replace(/breakdown\.map\(\(item: Record<string, unknown>,/g, 'breakdown.map((item: { label: string; percent: number; val: string },');
    }

    // LogActivityModal
    if (file.endsWith('LogActivityModal.tsx')) {
        content = content.replace(/success: \(data: unknown\) => {/g, 'success: (data: { newlyUnlocked?: unknown[], newlyCompletedChallenges?: unknown[] }) => {');
    }

    // Reports page
    if (file.endsWith('reports\\page.tsx')) {
        content = content.replace(/map\(\(cat: Record<string, unknown>\) =>/g, 'map((cat: { category: string; amount: number; percentage: number }) =>');
    }

    // Offset marketplace
    if (file.endsWith('offset-marketplace\\page.tsx')) {
        content = content.replace(/openPurchaseModal = \(project: Record<string, unknown>\)/g, 'openPurchaseModal = (project: { id: string; name: string; pricePerTon: number; [key: string]: unknown })');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
