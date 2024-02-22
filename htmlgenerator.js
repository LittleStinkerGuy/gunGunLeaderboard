const { sortLeaderboard } = require("./leaderboardPut.js");
const { readFileSync } = require("fs");

function generateTiles(leaderboardPath) {
    let leaderboard = JSON.parse(readFileSync(leaderboardPath, { encoding: "utf8", flag: "r" }));
    let leaderboardKeys = sortLeaderboard(leaderboard, Object.keys(leaderboard));

    let output = "";

    for (let i = 0; i < leaderboardKeys.length; i++) {
        output += `<div id="leaderboardTile" class="m-3 w-8/12 grid grid-cols-3 items-center rounded-lg bg-gradient-to-br from-indigo-700 to-indigo-500 md:grid-cols-4">
            <h1 class="hidden p-10 text-center text-6xl md:block">${i + 1}</h1>
            <div class="col-span-2 pl-10">
                <h2 class="text-5xl">${leaderboardKeys[i]}</h2>
                <p class="text-xl">${leaderboard[leaderboardKeys[i]].date}</p>
            </div>
            <h3 class="p-10 text-right text-6xl">${leaderboard[leaderboardKeys[i]].score}</h3>
        </div>`;
    }
    return `<!doctype html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="./build.css" rel="stylesheet" />
            <title>GUI</title>
        </head>
    
        <body class="bg-indigo-50">
            <h1 class="py-20 text-center text-8xl font-semibold tracking-wide text-indigo-950">Leaderboard</h1>
    
            <main class="grid h-full w-screen grid-cols-1 place-items-center py-5 text-indigo-50">
                ${output}
            </main>
        </body>
    </html>`;
}

module.exports = { generateTiles };
