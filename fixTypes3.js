const fs = require('fs');

const analyticsPath = 'd:\\Het\\CarbonSphere-AI\\src\\app\\(dashboard)\\analytics\\page.tsx';
let analyticsContent = fs.readFileSync(analyticsPath, 'utf8');
analyticsContent = analyticsContent.replace(/const data = payload\[0\]\.payload/g, 'const data = (payload[0] as { payload: any }).payload');
fs.writeFileSync(analyticsPath, analyticsContent, 'utf8');

const forecastPath = 'd:\\Het\\CarbonSphere-AI\\src\\app\\(dashboard)\\forecasting\\page.tsx';
let forecastContent = fs.readFileSync(forecastPath, 'utf8');
forecastContent = forecastContent.replace(/err\.response\?\.data\?\.message \|\| \(err as Error\)\.message/g, '(err as { response?: { data?: { message?: string } } })?.response?.data?.message || (err as Error).message');
forecastContent = forecastContent.replace(/\(item as any\)\.month/g, '(item as { month: string; [key: string]: unknown }).month');
forecastContent = forecastContent.replace(/\(item as any\)\.val/g, '(item as { val: number; [key: string]: unknown }).val');
forecastContent = forecastContent.replace(/<span className="font-medium">\{action\.difficulty\}<\/span>/g, '<span className="font-medium">{(action as { difficulty: string; [key: string]: unknown }).difficulty}</span>');
forecastContent = forecastContent.replace(/<span className="font-medium">\{action\.impact\}<\/span>/g, '<span className="font-medium">{(action as { impact: string; [key: string]: unknown }).impact}</span>');
forecastContent = forecastContent.replace(/<span className="font-medium text-emerald-600 dark:text-emerald-400">\{action\.reduction\}<\/span>/g, '<span className="font-medium text-emerald-600 dark:text-emerald-400">{(action as { reduction: string; [key: string]: unknown }).reduction}</span>');
fs.writeFileSync(forecastPath, forecastContent, 'utf8');

console.log('Fixed types pass 3');
