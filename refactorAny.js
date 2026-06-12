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
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix catch (err: any) -> catch (error: unknown)
    content = content.replace(/catch \((err|error): any\)/g, 'catch ($1: unknown)');
    
    // Fix error: (err: any) => -> error: (err: Error | unknown) =>
    content = content.replace(/error: \((err|error): any\) =>/g, 'error: ($1: Error | unknown) =>');

    // Fix router.push('/login' as any) -> router.push('/login')
    content = content.replace(/href=\{"([^"]+)" as any\}/g, 'href={"$1"}');
    content = content.replace(/router\.push\('([^']+)' as any\)/g, "router.push('$1')");
    content = content.replace(/router\.push\(`([^`]+)` as any\)/g, "router.push(`$1`)");

    // Fix newlyUnlocked?: any[] -> newlyUnlocked?: unknown[]
    content = content.replace(/newlyUnlocked\?: any\[\]/g, 'newlyUnlocked?: unknown[]');
    content = content.replace(/newlyCompletedChallenges\?: any\[\]/g, 'newlyCompletedChallenges?: unknown[]');

    // Fix data: any -> data: unknown
    content = content.replace(/data\?: any/g, 'data?: unknown');
    content = content.replace(/data: any/g, 'data: unknown');

    // Fix { stats: any; chartData: any[] } -> { stats: Record<string, unknown>; chartData: unknown[] }
    content = content.replace(/\{ stats: any; chartData: any\[\] \}/g, '{ stats: Record<string, unknown>; chartData: unknown[] }');

    // Fix (user: any) -> (user: unknown)
    content = content.replace(/\(user: any\)/g, '(user: unknown)');
    content = content.replace(/user\?: any;/g, 'user?: unknown;');

    // apiClient body?: any -> body?: unknown
    content = content.replace(/body\?: any/g, 'body?: unknown');

    // (err: any) => err.message -> (err: any) => (err as Error).message (Wait, better to just let unknown and then (err as Error))
    content = content.replace(/\((err|error): unknown\) => \{([^}]*)setError\(\1\.message \|\|/g, '($1: unknown) => {$2setError(($1 as Error).message ||');
    content = content.replace(/\((err|error): unknown\) => \1\.message \|\|/g, '($1: unknown) => ($1 as Error).message ||');
    
    content = content.replace(/catch \((err|error): unknown\) \{\s*setError\(\1\.message\)/g, 'catch ($1: unknown) { setError(($1 as Error).message)');
    content = content.replace(/catch \((err|error): unknown\) \{\s*setErrorMsg\(\1\.message\)/g, 'catch ($1: unknown) { setErrorMsg(($1 as Error).message)');

    // For map((cat: any) -> map((cat: unknown)
    content = content.replace(/\(cat: any\)/g, '(cat: Record<string, unknown>)');
    content = content.replace(/\(p: any,/g, '(p: Record<string, unknown>,');
    content = content.replace(/\(item: any/g, '(item: Record<string, unknown>');
    content = content.replace(/\(action: any,/g, '(action: Record<string, unknown>,');

    // For lastActual: any = null -> lastActual: unknown = null
    content = content.replace(/lastActual: any = null/g, 'lastActual: unknown = null');

    // For openPurchaseModal = (project: any)
    content = content.replace(/\(project: any\)/g, '(project: Record<string, unknown>)');

    // specific fix for analytics page tooltips
    content = content.replace(/({ active, payload, label }: any)/g, '({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string })');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Done. Changed ${changedCount} files.`);
