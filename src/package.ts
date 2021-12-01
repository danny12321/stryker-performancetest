import { spawn } from 'child_process';

interface RunResult {
	start_time: Date;
	end_time: Date;
	output: string;
}

export class Package {
    public readonly packageName: string;
    public readonly run_duration: number[] = [];

    constructor(
        packageName: string,
        private readonly command: string,
        public readonly cwd: string
    ) {
        this.packageName = packageName.split('/').pop()!;
    }

    private getSpawnedProcess() {
        let split_command = this.command.split(' ');
        let run_command = split_command.splice(0, 1)[0];

        return spawn(run_command, split_command, {
            cwd: this.cwd
        });
    }

    public run(): Promise<RunResult> {
        return new Promise((res, rej) => {
            let output = '';
            const run_exec = this.getSpawnedProcess();
            const start_time = new Date();
    
            run_exec.stdout.on('data', (data) => {
                console.log(data.toString());
                output += data.toString();
            });
    
            run_exec.stderr.on('data', (data) => {
                console.error(`stderr: ${data.toString()}`);
                output += data.toString();
            });

            
            run_exec.on('close', (code) => {
                const end_time = new Date();
                this.run_duration.push((end_time.getTime() - start_time.getTime()) / 1000);

                res({
                    start_time: start_time,
                    end_time: end_time,
                    output: output
                })
            });
    
        })
    }
}