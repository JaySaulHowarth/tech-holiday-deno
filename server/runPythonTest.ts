let pythonScriptPath: string = new URL('.', import.meta.url).pathname;
pythonScriptPath = pythonScriptPath.substring(1) + 'python/rightmove_scraper.py';

const cmd = Deno.run({
    cmd: ["python", pythonScriptPath],
    stdout: "piped",
    stderr: "piped"
});

const output = await cmd.output();
const outStr = new TextDecoder().decode(output);

const error = await cmd.stderrOutput();
const errorStr = new TextDecoder().decode(error);

cmd.close();

console.log(outStr, errorStr);
