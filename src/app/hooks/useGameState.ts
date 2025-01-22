import { useState } from "react";
import { Category } from "../components/NewGameForm";

export type Player = {
  name: string;
  score: number;
  ready: boolean;
  avatarColor: AvatarColor;
};
type AvatarColor = "red" | "blue" | "green" | "yellow" | "purple" | "pink";
const avatarColors: AvatarColor[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
];
type GameInfo = { roomId: string; players: Player[]; category: Category };
type GameError = { state: "error" };
export type GameWaiting = {
  state: "waiting";
  info: GameInfo;
  actions: { toggleReady: (playerName: string) => void };
};
type GamePlaying = { state: "playing"; info: GameInfo };
type GameVoting = { state: "voting"; info: GameInfo };
export type GameState = GameError | GameWaiting | GamePlaying | GameVoting;

export function getPlayer(players: Player[], name: string) {
  return players.find((player) => player.name === name);
}
export function useGameState(
  roomId: string,
  playerName: string | null,
  category: string | null
): GameState {
  const [gameState, setGameState] = useState<GameState>(() =>
    getInitialGameState()
  );

  function getInitialGameState(): GameState {
    if (!playerName || !category) {
      return { state: "error" };
    }
    const randomColorIndex = Math.floor(Math.random() * avatarColors.length);
    return {
      state: "waiting",
      info: {
        roomId,
        players: [
          {
            name: playerName,
            score: 0,
            ready: false,
            avatarColor: avatarColors[randomColorIndex],
          },
        ],
        category: category as Category,
      },
      actions: {
        toggleReady: (playerName: string) => {
          setGameState((prev) => {
            if (prev.state !== "waiting") return prev;
            const player = getPlayer(prev.info.players, playerName);
            if (player) {
              player.ready = !player.ready;
            }
            return { ...prev };
          });
        },
      },
    };
  }

  return gameState;
}
