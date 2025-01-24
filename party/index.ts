import type * as Party from "partykit/server";
import { GameInfo } from "../src/app/hooks/useGameState";

export default class Server implements Party.Server {
  constructor(readonly party: Party.Party) {}

  game: GameInfo | undefined;

  async onRequest(req: Party.Request) {
    // store the game info if it's a POST request
    if (req.method === "POST") {
      const game = (await req.json()) as GameInfo;
      this.game = { ...game };
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
    this.game = await this.party.storage.get<GameInfo>("poll");
  }
}

Server satisfies Party.Worker;
