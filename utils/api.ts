import axios from "axios";
import React, { useEffect, useState } from "react";

const gamerly = axios.create({
  baseURL: "https://us-central1-debugd1vas.cloudfunctions.net/app/api",
});

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
