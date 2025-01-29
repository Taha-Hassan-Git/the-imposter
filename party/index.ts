import type * as Party from "partykit/server";
import {
  Action,
  answersObject,
  AvatarColor,
  GameInfo,
} from "../src/app/hooks/useGameState";
import { Category } from "../src/app/components/NewGameForm";

interface GameFormInfo {
  playerName: string;
  roomId: string;
  category: Category;
}
export const avatarColors: AvatarColor[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
];
export default class Server implements Party.Server {
  constructor(readonly party: Party.Room) {}

  game: GameInfo | undefined;

  async onRequest(req: Party.Request) {
    // store the game info if it's a POST request
    if (req.method === "POST") {
      const game = (await req.json()) as GameFormInfo;
      // set up the new game
      const avatarColor = assignUnusedAvatarColor();
      const answer = getUnusedAnswer(game.category);
      this.game = {
        state: "waiting",
        roomId: game.roomId,
        round: 1,
        answer,
        players: [
          {
            name: game.playerName,
            score: 0,
            ready: false,
            avatarColor,
            imposter: false,
          },
        ],
        prevAnswers: [],
        category: game.category,
      };
      this.saveGame();
    }

    // return the game info
    if (this.game) {
      return new Response(JSON.stringify(this.game), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // return 404 if the game info is not found
    return new Response("Not found", {
      status: 404,
    });
  }

  async onConnect(connection: Party.Connection) {
    console.log("player joined", connection.id);
    if (!this.game) return;
    this.game = gameUpdater(
      { type: "player-joined", payload: { name: connection.id } },
      this.game
    );
    this.party.broadcast(JSON.stringify(this.game));
  }
  async onClose(connection: Party.Connection) {
    console.log("player left", connection.id);
    if (!this.game) return;
    this.game = gameUpdater(
      { type: "player-left", payload: { name: connection.id } },
      this.game
    );
    this.party.broadcast(JSON.stringify(this.game));
  }
  async onMessage(message: string) {
    if (!this.game) return;
    const action = JSON.parse(message) as Action;
    this.game = gameUpdater(action, this.game);
    this.party.broadcast(JSON.stringify(this.game));
  }

  async saveGame() {
    if (this.game) {
      await this.party.storage.put<GameInfo>("game", this.game);
    }
  }

  async onStart() {
    this.game = await this.party.storage.get<GameInfo>("game");
  }
}

function gameUpdater(action: Action, state: GameInfo) {
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
      // check if more than 3 players are in the game and all players are ready, if so, start the game
      if (
        newState.players.length >= 3 &&
        newState.players.every((player) => player.ready)
      ) {
        const newPlayers = assignImposter(newState);
        newState.players = newPlayers;
        newState.state = "playing";
      }
      return newState;
    default:
      break;
  }
}

function assignImposter(game: GameInfo) {
  const newPlayers = [...game.players];
  const randomIndex = Math.floor(Math.random() * newPlayers.length);
  newPlayers[randomIndex].imposter = true;
  return newPlayers;
}

function getUnusedAnswer(category: Category, game?: GameInfo) {
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

function assignUnusedAvatarColor(game?: GameInfo) {
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

Server satisfies Party.Worker;
