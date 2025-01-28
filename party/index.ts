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
    // Set up a new game if one doesn't exist
    console.log("Request method:", req.method);
    if (req.method === "POST") {
      const game = (await req.json()) as GameFormInfo;
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
    return new Response("Not found", { status: 404 });
  }

  async onConnect(connection: Party.Connection) {
    console.log("Player joined:", connection);
    if (!this.game) return;
    const action: Action = {
      type: "player-joined",
      payload: {
        name: connection.id,
        avatarColor: "red",
      },
    };
    this.game = gameUpdater(action, this.game);
    this.party.broadcast(JSON.stringify(this.game));
  }

  async onMessage(message: string) {
    if (!this.game) return;
    console.log("Received message:", message);
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

  async onClose(connection: Party.Connection) {
    console.log("Player left:", connection);
    if (!this.game) return;
    const action: Action = {
      type: "player-left",
      payload: { name: connection.id },
    };
    this.game = gameUpdater(action, this.game);
    this.party.broadcast(JSON.stringify(this.game));
  }
}

function gameUpdater(action: Action, state: GameInfo) {
  const newState = { ...state };

  switch (action.type) {
    case "player-joined":
      // check if the player is already in the game
      if (
        newState.players.some((player) => player.name === action.payload.name)
      ) {
        return newState;
      }
      newState.players.push({
        name: action.payload.name,
        score: 0,
        ready: false,
        avatarColor: action.payload.avatarColor,
      });
      return newState;
    case "player-left":
      console.log("Player left:", action.payload.name);
      newState.players = newState.players.filter(
        (player) => player.name !== action.payload.name
      );
      return newState;
    case "toggle-ready":
      newState.players = newState.players.map((player) => {
        if (player.name === action.payload.name) {
          player.ready = !player.ready;
        }
        return player;
      });
      return newState;
    default:
      break;
  }
}

Server satisfies Party.Worker;
