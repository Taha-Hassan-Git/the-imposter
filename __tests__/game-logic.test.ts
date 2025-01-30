import { GameManager } from "../game-logic/GameManager";
import { Answer, answersObject } from "../game-logic/types";

const playerName = "test";
const player2Name = "test2";
const roomId = "test";
const category = "films";
describe("When initialising a game...", () => {
  const gameManager = GameManager.createNew({
    playerName,
    roomId,
    category,
  });
  const game = gameManager.getState();

  it("returns a game in the waiting state", () => {
    expect(game.state).toEqual("waiting");
  });

  it("returns a game with the correct basic information", () => {
    expect(game.roomId).toEqual(roomId);
    expect(game.category).toEqual(category);
    expect(game.round).toEqual(1);
    expect(game.prevAnswers.length).toBe(0);
  });

  it("returns a game with a valid player", () => {
    expect(game.players.length).toBe(1);
    expect(game.players[0].name).toEqual(playerName);
    expect(game.players[0].score).toEqual(0);
    expect(game.players[0].ready).toBeFalsy();
  });

  it("returns a game with a valid answer", () => {
    const allAnswers = Object.values(answersObject).flat() as Answer[];
    const answerIsValid = allAnswers.find((answer) => answer == game.answer);
    const answerIsFromCategory = answersObject[category].find(
      (answer) => answer == game.answer
    );
    expect(game.answer).toBeTruthy();
    expect(answerIsValid).toBeTruthy();
    expect(answerIsFromCategory).toBeTruthy();
  });
});

describe("When in the waiting state...", () => {
  const playerName = "test";
  const roomId = "test";
  const category = "films";
  let gameManager: GameManager;

  beforeEach(() => {
    gameManager = GameManager.createNew({
      playerName,
      roomId,
      category,
    });
  });

  it("can add players", () => {
    gameManager.handleAction({
      type: "player-joined",
      payload: { name: player2Name },
    });

    const updatedGame = gameManager.getState();
    expect(updatedGame.players.length).toBe(2);
    expect(updatedGame.players[1].name).toEqual(player2Name);
  });

  it("toggles the ready state of players", () => {
    // Toggle ready ON
    gameManager.handleAction({
      type: "toggle-ready",
      payload: { name: playerName },
    });

    let updatedGame = gameManager.getState();
    const readyPlayer = updatedGame.players[0];
    expect(readyPlayer.ready).toBeTruthy();

    // Toggle ready OFF
    gameManager.handleAction({
      type: "toggle-ready",
      payload: { name: playerName },
    });

    updatedGame = gameManager.getState();
    const unreadyPlayer = updatedGame.players[0];
    expect(unreadyPlayer.ready).toBeFalsy();
  });

  it("does not start a game if there are not enough players", () => {
    // Add one more player (total 2)
    gameManager.handleAction({
      type: "player-joined",
      payload: { name: player2Name },
    });

    // Make both players ready
    gameManager.handleAction({
      type: "toggle-ready",
      payload: { name: playerName },
    });
    gameManager.handleAction({
      type: "toggle-ready",
      payload: { name: player2Name },
    });

    const updatedGame = gameManager.getState();
    expect(updatedGame.state).toEqual("waiting");
  });

  it("starts a game if there are enough players", () => {
    // Add players until we reach minimum (3)
    for (let i = 1; i < 3; i++) {
      gameManager.handleAction({
        type: "player-joined",
        payload: { name: `test${i + 1}` },
      });
    }

    expect(gameManager.getState().state).toEqual("waiting");

    // Toggle ready for all players
    gameManager.getState().players.forEach((player) => {
      if (!player.ready) {
        gameManager.handleAction({
          type: "toggle-ready",
          payload: { name: player.name },
        });
      }
    });

    const finalGame = gameManager.getState();
    expect(finalGame.state).toEqual("playing");

    // Check that all players are unready after game starts
    const playersReady = finalGame.players.every((player) => player.ready);
    expect(playersReady).toBeFalsy();

    // Verify exactly one imposter
    const impostersCount = finalGame.players.filter(
      (player) => player.imposter
    ).length;
    expect(impostersCount).toBe(1);
  });

  it("handles player leaving", () => {
    // Add two more players
    gameManager.handleAction({
      type: "player-joined",
      payload: { name: "test2" },
    });
    gameManager.handleAction({
      type: "player-joined",
      payload: { name: "test3" },
    });

    // Make all players ready
    gameManager.getState().players.forEach((player) => {
      gameManager.handleAction({
        type: "toggle-ready",
        payload: { name: player.name },
      });
    });

    // Game should be in playing state
    expect(gameManager.getState().state).toEqual("playing");

    // Remove a player
    gameManager.handleAction({
      type: "player-left",
      payload: { name: "test3" },
    });

    const finalGame = gameManager.getState();
    // Game should return to waiting state when below minimum players
    expect(finalGame.state).toEqual("waiting");
    expect(finalGame.players.length).toBe(2);
    // All players should be unready
    expect(finalGame.players.every((player) => !player.ready)).toBeTruthy();
  });
});
