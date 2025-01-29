import type * as Party from "partykit/server";
import { Action, GameInfo } from "../src/app/hooks/useGameState";
import { Category } from "../src/app/components/NewGameForm";

interface GameFormInfo {
  playerName: string;
  roomId: string;
  category: Category;
}
export default class Server implements Party.Server {
  constructor(readonly party: Party.Room) {}

  game: GameInfo | undefined;

  async onRequest(req: Party.Request) {
    // store the game info if it's a POST request
    if (req.method === "POST") {
      const game = (await req.json()) as GameFormInfo;
      // set up the new game
      this.game = {
        state: "waiting",
        roomId: game.roomId,
        players: [
          { name: game.playerName, score: 0, ready: false, avatarColor: "red" },
        ],
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
        avatarColor: "red",
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
        newState.state = "playing";
      }
      console.log(newState.state);
      return newState;
    default:
      break;
  }
}

Server satisfies Party.Worker;
