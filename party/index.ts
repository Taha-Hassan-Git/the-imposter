import type * as Party from "partykit/server";

import { Category } from "../src/app/components/NewGameForm";
import { GameInfo, Action } from "../game-logic/types";
import { initialiseGame, gameUpdater } from "../game-logic/game-logic";

export interface GameFormInfo {
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

      this.game = initialiseGame(game);
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

Server satisfies Party.Worker;
