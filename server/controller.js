const getIndex = async (ctx) => {
  const body = await Deno.readTextFile(
    Deno.cwd() + "\\server\\views\\index.html",
  );
  ctx.response.body = Deno.cwd() + "\\views\\index.html";
};

const getRightmoveData = async (ctx) => {
  console.log("GET rightmovedata");
  let pythonScriptPath = new URL(".", import.meta.url).pathname;
  pythonScriptPath = pythonScriptPath.substring(1) +
    "python/rightmove_scraper.py";

  const cmd = Deno.run({
    cmd: ["python", pythonScriptPath],
    stdout: "piped",
    stderr: "piped",
  });

  const output = await cmd.output();
  const outStr = new TextDecoder().decode(output);

  const error = await cmd.stderrOutput();
  const errorStr = new TextDecoder().decode(error);

  cmd.close();

  const housingData = JSON.parse(outStr);
  //console.log(housingData);
  var prices = [];

  housingData.forEach(function (obj) {
    prices.push(Math.ceil(obj.price / 100) * 100);
  });

  const maxPrice = Math.max.apply(Math, prices);
  const minPrice = Math.min.apply(Math, prices);
  var labels = [];
  const countOccurrences = (arr, val) =>
    arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
  const priceCounts = [];
  for (let range = minPrice; range <= maxPrice; range += 100) {
    const label = `${range - 100} - ${range}`;
    labels.push(label);
    const occ = countOccurrences(prices, range);
    priceCounts.push(occ);
  }
  // prices = prices.sort(function (a, b) {
  //   return a - b;
  // });
  const priceUniq = [...new Set(prices)];

  var count = 0;

  console.log(prices);
  // priceUniq.forEach(function (price) {
  //   const occ = countOccurrences(prices, price);
  //   priceCounts.push(occ);
  // });
  labels = JSON.stringify(labels);
  console.log(priceCounts);
  ctx.response.body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" rel="stylesheet">
      <title>Rightmove Data</title>
  </head>
  <body >
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <div style="width: 700px; height: 600px;">
        <canvas id="myChart"></canvas>
      </div>
      <script>
    
      const data = {
        labels: ${labels},
        datasets: [{
          label: "No. of Properties in Rent Ranges",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: ${JSON.stringify(priceCounts)},
        }],
      };
    
      const config = {
        type: "line",
        data: data,
        options: {},
      };
    
      const myChart = new Chart(
        document.getElementById('myChart'),
        config
      );
      </script>
  </body>
  </html>`;
};

export { getIndex, getRightmoveData };
