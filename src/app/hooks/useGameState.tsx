import { createContext, useContext, useState } from "react";
import { Category } from "../components/NewGameForm";

const gameContext = createContext<GameState>({ state: "error" });

export type Player = {
  name: string;
  score: number;
  ready: boolean;
  avatarColor: AvatarColor;
};
type AvatarColor = "red" | "blue" | "green" | "yellow" | "purple" | "pink";
export const avatarColors: AvatarColor[] = [
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

export function GameProvider({
  children,
  playerName,
  category,
  roomId,
}: {
  children: React.ReactNode;
  playerName: string | null;
  category: Category | null;
  roomId: string;
}) {
  const [gameState, setGameState] = useState<GameState>(() =>
    getInitialGameState({ playerName, category, roomId })
  );
  function getInitialGameState({
    roomId,
    playerName,
    category,
  }: {
    roomId: string;
    playerName: string | null;
    category: Category | null;
  }): GameState {
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
            const oldPlayer = prev.info.players[0].ready;
            // copy the old state
            const newState = { ...prev };

            // find the player
            newState.info.players = newState.info.players.map((player) => {
              if (player.name === playerName) {
                return { ...player, ready: !player.ready };
              }
              return player;
            });

            console.log({
              newPlayer: newState.info.players[0].ready,
              oldPlayer,
            });
            return newState;
          });
        },
      },
    };
  }
  return (
    <gameContext.Provider value={gameState}>{children}</gameContext.Provider>
  );
}

export function getPlayer(players: Player[], name: string) {
  return players.find((player) => player.name === name);
}
export function useGameState(): GameState {
  const context = useContext(gameContext);
  if (context === undefined) {
    throw new Error("useCountState must be used within a CountProvider");
  }
  return context;
}
