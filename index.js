"use strict";

const express = require("express");
const { sortLeaderboard, leaderboardPosition } = require("./leaderboardPut.js");
const { generateTiles } = require("./htmlgenerator.js");
const { readFileSync } = require("fs");
const cors = require("cors");

const app = express();

app.use(express.static("./src"));
app.use(cors());

app.get("/", (req, res) => {
    res.send(generateTiles("./leaderboard.json"));
});
// get specific item
app.get("/item/:name", (req, res, next) => {
    // load name
    const name = decodeURIComponent(req.params.name);

    // parse leaderboard
    let leaderboard = JSON.parse(readFileSync("./leaderboard.json", { encoding: "utf8", flag: "r" }));

    let nameLowerCase = name.toLowerCase();
    let properlyCapitalizedKey = Object.keys(leaderboard).find((key) => key.toLowerCase() === nameLowerCase);

    // check if name is valid
    if (!leaderboard[properlyCapitalizedKey]) {
        res.status(404).send("Name not found");
        return next();
    }

    // set output to correct person
    let output = leaderboard[properlyCapitalizedKey];

    // delete irrelevant values
    delete output.hash;
    delete output.time;

    res.send(`{ ${properlyCapitalizedKey}: ${JSON.stringify(output)} }`);
});

// list output, input is amount of names to list
app.get("/list/:input", (req, res, next) => {
    // declare input, output
    const input = decodeURIComponent(req.params.input);
    let output = {};

    if (isNaN(input) && input != "all") {
        res.status(400).send("Invalid Query");
        return next();
    }

    // parse leaderboard and get list of keys
    let leaderboard = JSON.parse(readFileSync("./leaderboard.json", { encoding: "utf8", flag: "r" }));
    let leaderboardKeys = Object.keys(leaderboard);

    // sort leaderboard
    let sortedLeaderboardKeys = sortLeaderboard(leaderboard, leaderboardKeys);

    // get amount of requests
    let amount = input == "all" ? sortedLeaderboardKeys.length : Number(input);

    // loop through every request
    for (let i = 0; i < amount; i++) {
        // optimize searching lists
        let key = sortedLeaderboardKeys[i];
        let leaderboardValue = leaderboard[key];

        // check if list has a value at this index
        if (leaderboardValue) {
            // delete irrelevant values
            delete leaderboardValue.hash;
            delete leaderboardValue.time;

            // add value to output
            output[key] = leaderboardValue;
        }
        // handle if list doesn't have value and output empty value and output remaining list items to score
        else {
            output[""] = {
                score: amount - i,
                date: null,
                hash: null,
                time: null,
            };
            break;
        }
    }

    // process output and send
    output = JSON.stringify(output, null, 4);
    res.send(output);
});

app.get("/place/:input", (req, res, next) => {
    // declare input, output
    const input = decodeURIComponent(req.params.input);

    if (isNaN(input)) {
        res.status(400).send("Invalid Query");
        return next();
    }

    // parse leaderboard and get list of keys
    let leaderboard = JSON.parse(readFileSync("./leaderboard.json", { encoding: "utf8", flag: "r" }));
    let leaderboardKeys = Object.keys(leaderboard);

    // sort leaderboard
    let sortedLeaderboardKeys = sortLeaderboard(leaderboard, leaderboardKeys);

    let output = leaderboard[sortedLeaderboardKeys[input - 1]];

    if (!output) {
        res.status(400).send("Empty Place");
    }

    output = JSON.stringify(output, null, 4);
    res.send(`{ ${sortedLeaderboardKeys[input - 1]}: ${output} }`);
});

app.put("/upload", (req, res, next) => {
    let leaderboard = JSON.parse(readFileSync("./leaderboard.json", { encoding: "utf8", flag: "r" }));

    const originalName = decodeURIComponent(req.query.name);
    const score = decodeURIComponent(req.query.score);
    const time = decodeURIComponent(req.query.time);
    const hash = decodeURIComponent(req.query.hash);

    if (!originalName || !score || !time || !hash) {
        res.status(400).send("Incomplete Query");
        return next();
    }

    let nameLowerCase = originalName.toLowerCase();
    let name = Object.keys(leaderboard).find((key) => key.toLowerCase() === nameLowerCase) || originalName;

    if (leaderboard[name] && leaderboard[name].score >= score) {
        res.status(412).send("Score is lower than previous");
        return next();
    }

    try {
        let newPos = new leaderboardPosition(name, score, time, hash, "./leaderboard.json");
        res.send(newPos.addToJson());
    } catch (err) {
        res.status(422).send(err);
        return next();
    }
});

app.get(["/list", "/item", "/place"], (req, res, next) => {
    res.status(400).send("Incomplete Query");
    return next();
});

// serve to browser
app.listen(port, () => console.log(`app available on http://localhost:${port}`));
