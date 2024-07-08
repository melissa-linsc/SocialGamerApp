import axios from 'axios'

const gamerly = axios.create({ baseURL: "https://us-central1-debugd1vas.cloudfunctions.net/app/api" })

export function getSearchedGames(searchQuery:string): Promise<any[]> {
    return gamerly.get('/games', 
        {
            params: {
                search: searchQuery,
                limit: 5,
            }
        }
    ).then((searchData) => {
        return searchData.data.games
    })
    .catch((err) => {
        console.log("Error Fetching Games")
        throw Error
    })
}

export function getGameById(gameid) {
     return gamerly.get(`/games/${gameid}`).then((gameData) => {
        console.log(gameData.data)
        return gameData.data.gameById
     })
}