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
  return gamerly
    .get(`/games/genres/${genre}?sortField=rating&sortOrder=desc`)
    .then((gameData) => {
      return gameData.data.games;
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

//get all users
export const fetchUsers = () => {
  return gamerly
    .get("/users")
    .then((response) => {
      return response.data.users;
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
};

// app.post("/api/users/:userId/wishlist/add", postToWishlist);
// app.delete("/api/users/:userId/wishlist/delete/:toDel", deleteFromWishlist);

// app.post("/api/users/:userId/preferences/add", postPreference);
// app.delete("/api/users/:userId/preferences/delete/:toDel", deletePreference);

//get user by id
export const fetchUserById = (userId) => {
  return gamerly
    .get(`/users/${userId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });
};
