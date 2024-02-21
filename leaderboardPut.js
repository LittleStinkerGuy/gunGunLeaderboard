"use strict";

const { readFileSync, writeFileSync } = require("fs");

const { RegExpMatcher, englishDataset, englishRecommendedTransformers } = require("obscenity");

const { faker } = require("@faker-js/faker");

const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
});

class leaderboardPosition {
    constructor(name, score, time, hash, jsonPath) {
        this.json = jsonPath;
        if (matcher.hasMatch(name)) {
            throw "Profanity Detected";
        }
        if (Number(hash) != Number(time) * (Number(score) + 1)) {
            throw "Invalid Hash";
        }
        if (isNaN(score)) {
            throw "Score is not a number";
        }
        this.name = name;
        this.score = Number(score);
        this.time = Number(time);
        this.date = new Date(this.time * 1000).toUTCString();
        this.hash = hash;
    }

    addToJson() {
        let lead = JSON.parse(readFileSync(this.json, { encoding: "utf8", flag: "r" }));
        lead[this.name] = {
            score: this.score,
            date: this.date,
            hash: this.hash,
            time: this.time,
        };
        writeFileSync(this.json, JSON.stringify(lead, null, "\t"));
        lead = JSON.parse(readFileSync(this.json, { encoding: "utf8", flag: "r" }));
        return lead[this.name];
    }
}

// output leaderboard names by scores; descending
// lead: whole leaderboard arr: array of object keys (Object.keys(leaderboard))
const sortLeaderboard = (lead, arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];

    for (let i = 1; i < arr.length; i++) {
        if (lead[arr[i]].score < lead[pivot].score) {
            rightArr.push(arr[i]);
        } else {
            leftArr.push(arr[i]);
        }
    }
    return [...sortLeaderboard(lead, leftArr), pivot, ...sortLeaderboard(lead, rightArr)];
};

module.exports = { sortLeaderboard, leaderboardPosition };
