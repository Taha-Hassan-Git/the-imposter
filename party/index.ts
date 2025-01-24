import type * as Party from "partykit/server";
import { GameInfo } from "../src/app/hooks/useGameState";
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
    // const event = JSON.parse(message);

    // const handleEvent = (event: any) => {
    //   switch (event.type) { et.
    // };
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
