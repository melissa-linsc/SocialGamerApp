import axios from "axios";
import React, { useEffect, useState } from "react";

const gamerly = axios.create({
  baseURL: "https://us-central1-debugd1vas.cloudfunctions.net/app/api",
});

export function getSearchedGames(searchQuery: string): Promise<any[]> {
  return gamerly
    .get("/games", {
      params: {
        search: searchQuery,
        limit: 5,
      },
    })
    .then((searchData) => {
      return searchData.data.games;
    })
    .catch((err) => {
      console.log("Error Fetching Games");
      throw Error;
    });
}

export function getGameById(gameid) {
  return gamerly.get(`/games/${gameid}`).then((gameData) => {
    console.log(gameData.data);
    return gameData.data.gameById;
  });
}

export function getGamesByGenre(genre) {
  return gamerly.get(`/games/genres/${genre}`).then((gameData) => {
    return gameData.data.games
  });
}

//Get all games sorted by rating
export const fetchGames = () => {
  return gamerly
    .get("/games?sortField=rating&sortOrder=desc")
    .then((response) => {
      return response.data.games;
    })
    .catch((error) => {
      console.error("Error fetching games:", error);
    });
};

//Get all genres
export const fetchGenres = () => {
  return gamerly
    .get("/genres")
    .then((response) => {
      return response.data.genres;
    })
    .catch((error) => {
      console.error("Error fetching genres:", error);
    });
};
