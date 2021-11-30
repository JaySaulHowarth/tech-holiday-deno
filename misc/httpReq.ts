// Takes a URL as an argument and outputs the returned content
// Requires network access to run using --allow-net

const url = Deno.args[0];
const res = await fetch(url);

const body = new Uint8Array(await res.arrayBuffer());
await Deno.stdout.write(body);
