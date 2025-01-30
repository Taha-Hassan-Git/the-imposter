import {
  gameUpdater,
  initialiseGame,
  MIN_PLAYERS,
} from "../game-logic/game-logic";
import { Action, Answer, answersObject, GameInfo } from "../game-logic/types";

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
  const game = initialiseGame({
    playerName,
    roomId,
    category,
  });
  it("can add players", () => {
    const action: Action = {
      type: "player-joined",
      payload: { name: "test2" },
    };
    const newGame = gameUpdater(action, game);
    expect(newGame.players.length).toBe(2);
    expect(newGame.players[1].name).toEqual("test2");
  });
  it("toggles the ready state of players", () => {
    const action: Action = {
      type: "toggle-ready",
      payload: { name: "test" },
    };
    const gameWithReadyPlayer = gameUpdater(action, game);
    const readyPlayer = gameWithReadyPlayer.players[0];
    expect(readyPlayer.ready).toBeTruthy();
    const gameWithUnreadyPlayer = gameUpdater(action, gameWithReadyPlayer);
    const unreadyPlayer = gameWithUnreadyPlayer.players[0];
    expect(unreadyPlayer.ready).toBeFalsy();
  });
  it("does not start a game if there are not enough players", () => {
    const player1Action: Action = {
      type: "toggle-ready",
      payload: { name: "test" },
    };
    const player2Action: Action = {
      type: "toggle-ready",
      payload: { name: "test2" },
    };
    const gameWithOneReadyPlayer = gameUpdater(player1Action, game);
    const gameWithTwoReadyPlayers = gameUpdater(
      player2Action,
      gameWithOneReadyPlayer
    );
    expect(gameWithTwoReadyPlayers.state).toEqual("waiting");
  });
  it("starts a game if there are enough players", () => {
    let newGame: GameInfo = game;
    // add new players until we reach min
    for (let i = 1; i < MIN_PLAYERS; i++) {
      const action: Action = {
        type: "player-joined",
        payload: { name: `test${i + 1}` },
      };
      newGame = gameUpdater(action, newGame);
    }
    expect(newGame.state).toEqual("waiting");
    // toggle ready for all players
    newGame.players.forEach((player) => {
      if (!player.ready) {
        const action: Action = {
          type: "toggle-ready",
          payload: { name: player.name },
        };
        newGame = gameUpdater(action, newGame);
      }
    });
    expect(newGame.state).toEqual("playing");
    const playersReady = newGame.players.every((player) => player.ready);
    expect(playersReady).toBeFalsy();
    const impostersArr = newGame.players.filter(
      (player) => player.imposter
    ).length;
    expect(impostersArr).toBe(1);
  });
});
