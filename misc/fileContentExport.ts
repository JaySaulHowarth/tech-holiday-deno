// Takes a path to a file as an input and outputs the files content
// Requires disk access to run using --allow-read

import { copy } from "https://deno.land/std@0.106.0/io/util.ts";

const filenames = Deno.args;
for (const filename of filenames) {
  const file = await Deno.open(filename);
  // The copy command uses no more memory that necessary,
  // the same memory from which the data is read is written to stdout
  await copy(file, Deno.stdout);
  file.close();
}
