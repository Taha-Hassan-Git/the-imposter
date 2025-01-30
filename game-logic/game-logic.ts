import { GameFormInfo } from "../party";
import { Category } from "../src/app/components/NewGameForm";
import {
  Action,
  GameInfo,
  gameStatesInSequence,
  Player,
  answersObject,
  avatarColors,
} from "./types";

export function gameUpdater(action: Action, state: GameInfo) {
  const newState = { ...state };
  switch (action.type) {
    case "player-joined":
      const playerExists = newState.players.some(
        (player) => player.name === action.payload.name
      );
      const isWaiting = newState.state === "waiting";
      if (playerExists || !isWaiting) {
        // do nothing if the player already exists or the game is not in the waiting state
        return newState;
      }

      newState.players.push({
        name: action.payload.name,
        score: 0,
        ready: false,
        avatarColor: assignUnusedAvatarColor(newState),
        imposter: false,
      });
      return newState;
    case "player-left":
      newState.players = newState.players.filter(
        (player) => player.name !== action.payload.name
      );
      // if there are less than 3 players, go back to the waiting state
      if (newState.players.length < 3) {
        newState.state = "waiting";
        newState.players.forEach((player) => {
          player.ready = false;
        });
      }
      return newState;
    case "toggle-ready":
      newState.players = newState.players.map((player) => {
        if (player.name === action.payload.name) {
          player.ready = !player.ready;
        }
        return player;
      });
      const maybeAdvancedState = advanceGameState(newState);
      console.log(maybeAdvancedState);
      return maybeAdvancedState;
    default:
      break;
  }
}

export function initialiseGame(formInfo: GameFormInfo) {
  const avatarColor = assignUnusedAvatarColor();
  const answer = getUnusedAnswer(formInfo.category);
  return {
    state: "waiting" as GameInfo["state"],
    roomId: formInfo.roomId,
    round: 1,
    answer,
    players: [
      {
        name: formInfo.playerName,
        score: 0,
        ready: false,
        avatarColor,
        imposter: false,
      },
    ],
    prevAnswers: [],
    category: formInfo.category,
  };
}

export function advanceGameState(game: GameInfo) {
  const moreThanthreePlayers = game.players.length >= 3;
  const allPlayersReady = game.players.every((player) => player.ready);
  if (moreThanthreePlayers && allPlayersReady) {
    const playersWithImposter = assignImposter(game);
    const newPlayers = setAllPlayersUnready(playersWithImposter);
    game.players = newPlayers;
    game.state = gameStatesInSequence[
      gameStatesInSequence.indexOf(game.state) + 1
    ] as GameInfo["state"];
    return game;
  }
  return game;
}

export function assignImposter(game: GameInfo) {
  const newPlayers = [...game.players];
  const randomIndex = Math.floor(Math.random() * newPlayers.length);
  newPlayers[randomIndex].imposter = true;
  return newPlayers;
}

export function setAllPlayersUnready(players: Player[]) {
  return players.map((player) => {
    player.ready = false;
    return player;
  });
}

export function getUnusedAnswer(category: Category, game?: GameInfo) {
  const array = answersObject[category];
  if (!game) {
    return array[Math.floor(Math.random() * array.length)];
  }
  const usedAnswers = game.prevAnswers;
  const availableAnswers = array.filter(
    (answer) => !usedAnswers.includes(answer)
  );
  return availableAnswers[Math.floor(Math.random() * availableAnswers.length)];
}

export function assignUnusedAvatarColor(game?: GameInfo) {
  if (!game) {
    const randomColor =
      avatarColors[Math.floor(Math.random() * avatarColors.length)];
    return randomColor;
  }
  const usedColors = game.players.map((player) => player.avatarColor);
  // remove used colors from the list of available colors
  const availableColors = avatarColors.filter(
    (color) => !usedColors.includes(color)
  );
  const randomColor =
    availableColors[Math.floor(Math.random() * availableColors.length)];
  return randomColor;
}
