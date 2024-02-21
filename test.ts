// import { faker } from '@faker-js/faker';
// import { readFileSync, writeFileSync } from "fs";

// var leaderboard;

// leaderboard = JSON.parse(readFileSync('./leaderboard.json', { encoding: 'utf8', flag: 'r' }))

// class leaderboardPosition{
//    public name: string;
//    public score: number;
//    private time: number;
//    public date: string;
//    private hash: number;

//   public constructor(name: string, score: number, time: number) {
//     this.name = name;
//     this.score = score;
//     // this.time = Date.now();
//     this.time = time
//     this.date = new Date(this.time).toUTCString();
//     this.hash = this.time * (this.score + 1);
//   }

//   public turnIntoJson(){
//     leaderboard[this.name] = {
//       "score": this.score,
//       "date": this.date,
//       "hash": this.hash,
//       "time": this.time
//     }
//   }
// }

// for (let i = 0; i<50; i++){
//   let person = new leaderboardPosition(faker.internet.userName(), faker.number.int({ min: 0, max: 150 }), faker.date.future().getTime());
//   person.turnIntoJson()
// }


// console.log(leaderboard);

// writeFileSync('leaderboard.json', JSON.stringify(leaderboard, null, "\t"))