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

export const MIN_PLAYERS = 3;

export function gameUpdater(action: Action, state: GameInfo): GameInfo {
  switch (action.type) {
    case "player-joined": {
      const playerExists = state.players.some(
        (player) => player.name === action.payload.name
      );
      const isWaiting = state.state === "waiting";

      if (playerExists || !isWaiting) {
        return state;
      }

      const newPlayer = {
        name: action.payload.name,
        score: 0,
        ready: false,
        avatarColor: assignUnusedAvatarColor(state),
        imposter: false,
      };

      return {
        ...state,
        players: [...state.players, newPlayer],
      };
    }

    case "player-left": {
      const updatedPlayers = state.players.filter(
        (player) => player.name !== action.payload.name
      );

      if (updatedPlayers.length < 3) {
        return {
          ...state,
          state: "waiting",
          players: updatedPlayers.map((player) => ({
            ...player,
            ready: false,
          })),
        };
      }

      return {
        ...state,
        players: updatedPlayers,
      };
    }

    case "toggle-ready": {
      const updatedPlayers = state.players.map((player) =>
        player.name === action.payload.name
          ? { ...player, ready: !player.ready }
          : player
      );

      const updatedState = {
        ...state,
        players: updatedPlayers,
      };

      return advanceGameState(updatedState);
    }

    default:
      return state;
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
  const moreThanMinimum = game.players.length >= MIN_PLAYERS;
  const allPlayersReady = game.players.every((player) => player.ready);
  if (moreThanMinimum && allPlayersReady) {
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
