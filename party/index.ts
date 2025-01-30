import type * as Party from "partykit/server";
import { GameManager } from "../game-logic/GameManager";
import { Action, GameInfo } from "../game-logic/types";
import { Category } from "../src/app/components/NewGameForm";

export interface GameFormInfo {
  playerName: string;
  roomId: string;
  category: Category;
}

export default class Server implements Party.Server {
  constructor(readonly party: Party.Room) {}

  gameManager: GameManager | undefined;

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const formInfo = (await req.json()) as GameFormInfo;
      this.gameManager = GameManager.createNew(formInfo);
      await this.saveGame();
    }

    if (this.gameManager) {
      return new Response(JSON.stringify(this.gameManager.getState()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  async onConnect(connection: Party.Connection) {
    console.log("player joined", connection.id);
    if (!this.gameManager) return;

    this.gameManager.handleAction({
      type: "player-joined",
      payload: { name: connection.id },
    });

    this.party.broadcast(JSON.stringify(this.gameManager.getState()));
  }

  async onClose(connection: Party.Connection) {
    console.log("player left", connection.id);
    if (!this.gameManager) return;
    // wait for 20 seconds then check if player rejoined
    setTimeout(() => {
      const connectionsArray = [];
      for (const c of this.party.getConnections()) {
        connectionsArray.push(c.id);
      }
      const leftGame = !connectionsArray.includes(connection.id);
      if (leftGame) {
        this.gameManager?.handleAction({
          type: "player-left",
          payload: { name: connection.id },
        });
        this.party.broadcast(JSON.stringify(this.gameManager?.getState()));
      }
    }, 20000);
  }

  async onMessage(message: string) {
    if (!this.gameManager) return;

    const action = JSON.parse(message) as Action;
    this.gameManager.handleAction(action);
    this.party.broadcast(JSON.stringify(this.gameManager.getState()));
  }

  async saveGame() {
    if (this.gameManager) {
      await this.party.storage.put<GameInfo>(
        "game",
        this.gameManager.getState()
      );
    }
  }

  async onStart() {
    const savedGame = await this.party.storage.get<GameInfo>("game");
    if (savedGame) {
      this.gameManager = new GameManager(savedGame);
    }
  }
}

Server satisfies Party.Worker;
