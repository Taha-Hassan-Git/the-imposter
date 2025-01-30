import { initialiseGame } from "../game-logic/game-logic";
import { Answer, answersObject } from "../game-logic/types";

describe("When initialising a game...", () => {
  const playerName = "test";
  const roomId = "test";
  const category = "films";
  const game = initialiseGame({
    playerName,
    roomId,
    category,
  });
  it("returns a game in the waiting state", () => {
    expect(game.state).toEqual("waiting");
  });
  it("returns a game with the correct information", () => {
    const allAnswers = Object.values(answersObject).flat() as Answer[];
    const answerIsValid = allAnswers.find((answer) => answer == game.answer);
    expect(game.roomId).toEqual(roomId);
    expect(game.players[0].name).toEqual(playerName);
    expect(game.category).toEqual(category);
    expect(game.round).toEqual(1);
    expect(game.players.length).toBe(1);
    expect(answerIsValid).toBeTruthy();
    expect(game.prevAnswers.length).toBe(0);
  });
});
