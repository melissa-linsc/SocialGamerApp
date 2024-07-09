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
    // console.log(gameData.data);
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
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
    });
};

//get user by id
export const fetchUserById = (userId) => {
  return gamerly
    .get(`/users/${userId}`)
    .then((response) => {
      return response.data.userById;
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
    });
};

// post to wishlist
export const postToWishlist = (userId, gameId) => {
  return gamerly
    .post(`/users/${userId}/wishlist/add`, {
      gameId: gameId,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding game to wishlist:", error);
    });
};

// delete from wishlist
export const deleteFromWishlist = (userId, toDel) => {
  return gamerly.delete(`/users/${userId}/wishlist/delete/${toDel}`);
};

// post to preferences
export const postToPreferences = (userId, gameId) => {
  return gamerly
    .post(`/users/${userId}/preferences/add`, {
      gameId: gameId,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding game to wishlist:", error);
    });
};

// delete from preferences
export const deleteFromPreferences = (userId, toDel) => {
  return gamerly.delete(`/users/${userId}/preferences/delete/${toDel}`);
};

// post to library
export const postToLibrary = (userId, gameId) => {
  return gamerly
    .post(`/users/${userId}/library/add`, {
      gameId: gameId,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error adding game to wishlist:", error);
    });
};

// delete from libraryr
export const deleteFromLibrary = (userId, toDel) => {
  return gamerly.delete(`/users/${userId}/library/delete/${toDel}`);
};

// deleteFromLibrary("FIAj5aqlpdZLS95k6TZE5RcmR482", 421698);

// deleteFromLibrary("FIAj5aqlpdZLS95k6TZE5RcmR482", 13627);
