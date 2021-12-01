import * as fs from 'fs';
import settings from './settings.js';
import * as path from 'path';
import { Package } from './package.js';

const packages = settings.paths.map(p => new Package(p, settings.command, path.resolve(`${settings.project}/${p}`)));

(async function () {
	try {
		const timestamp = replaceAll(replaceAll(new Date().toLocaleString('nl-NL'), ':', '-'), ' ', '_');
		const dir = `${settings.runName}_${timestamp}`;
		const summaryFile = `output/${dir}/${settings.summaryFile}`;
		const outputFile = `output/${dir}/${settings.outputFile}`;

		fs.mkdirSync(`output/${dir}`);
		fs.appendFileSync(outputFile, JSON.stringify(settings) + '\n\n');
		fs.appendFileSync(summaryFile, `Running: ${packages.map(p => p.packageName).join(',')} with command ${settings.command}\n`);

		for (let i = 0; i < settings.iterations; i++) {
			for (const packageRun of packages) {
				let output = '';
				const result = await packageRun.run();

				// await copyFile(`${packageRun.cwd}/reports/mutation/mutation.json`, `output/${dir}/${packageRun.packageName}_${i}.json`);
				await copyFile(`${packageRun.cwd}/reports/mutation/html/index.html`, `output/${dir}/${packageRun.packageName}_${i}.html`);


				output += `============= Iteration ${i} =============\n`;
				output += `Run took ${(result.end_time.getTime() - result.start_time.getTime()) / 1000} seconds\n\n`;
				fs.appendFileSync(outputFile, output + result.output);

				fs.appendFileSync(summaryFile, `${packageRun.packageName} run ${i} took ${(result.end_time.getTime() - result.start_time.getTime()) / 1000} seconds\n`)

				// Wait to cool down
				await new Promise(resolve => setTimeout(resolve, settings.timeBetweenInS * 1000));
			}
		}

		fs.appendFileSync(summaryFile, `\n\nAveraged time\n`);

		packages.forEach(p => {
			fs.appendFileSync(`output/${dir}/times.json`, `${p.packageName} averaged ${average(p.run_duration)} seconds in ${p.run_duration.length} runs\n`)
		});

		fs.writeFileSync('times.json', JSON.stringify(packages.map(p => ({
			package: p.packageName,
			durations: p.run_duration
		}))));


	} catch (e) {
		console.error(e);
	}
})();

function copyFile(source: string, destination: string): Promise<void> {
	return new Promise((res, rej) => {
		fs.copyFile(source, destination, (err) => {
			if (err) rej(err);
			res();
		});
	});
}

function replaceAll(string: string, search: string, replace: string) {
	return string.split(search).join(replace);
}

function average(times: number[]) {
	const sum = times.reduce((a, b) => a + b, 0);
	return (sum / times.length) || 0;
}