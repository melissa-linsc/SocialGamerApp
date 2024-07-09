import { python } from "pythonia";
const rand = await python("/Users/melissa/Desktop/northcoders/Group Project/test2.py");
const recommendedGames = await rand.recommend_games(['animal-crossing-2019'])
console.log(recommendedGames)

python.exit();