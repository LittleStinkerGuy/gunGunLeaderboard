const leaderboardTile = document.getElementById("leaderboardTile").cloneNode(true);
leaderboardTile.classList.replace("hidden", "grid");

const main = document.querySelector("main");
main.append(leaderboardTile);

let lead = getText("https://gunguncatleaderboard.danielkharis.com");

async function getText(file) {
    let myObject = await fetch(file);
    let myText = await myObject.text();
    myDisplay(myText);
}
console.log(lead);
