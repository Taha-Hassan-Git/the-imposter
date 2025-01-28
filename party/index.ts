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
    return new Response("Not found", { status: 404 });
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
        avatarColor: "red",
      });
      return newState;
    case "player-left":
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
