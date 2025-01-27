import { createContext, useContext, useState } from "react";
import { Category } from "../components/NewGameForm";
import usePartySocket from "partysocket/react";
import { PARTYKIT_HOST } from "../env";

export type Action =
  | { type: "toggle-ready"; payload: { name: string } }
  | { type: "player-joined"; payload: { name: string } }
  | { type: "player-left"; payload: { name: string } };

interface GameContext {
  gameState: GameState;
  dispatch: (action: Action) => void;
}
const gameContext = createContext<GameContext>({
  gameState: { state: "error" },
  dispatch: () => {},
});

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
export interface GameInfo {
  state: "waiting" | "playing" | "voting";
  roomId: string;
  players: Player[];
  category: Category;
}

export type GameError = { state: "error" };

export type GameState = GameInfo | GameError;

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
    };
  }
  console.log("game provider host and room", {
    host: PARTYKIT_HOST,
    room: roomId,
  });
  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: roomId,
    onMessage(event) {
      const message = JSON.parse(event.data) as GameInfo;
      if (message) {
        console.log("message", message);
        setGameState(message);
      }
    },
  });

  const dispatch = (action: Action) => {
    console.log("dispatch", action);
    socket.send(JSON.stringify(action));
  };

  return (
    <gameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </gameContext.Provider>
  );
}

export function getPlayer(players: Player[], name: string) {
  return players.find((player) => player.name === name);
}
export function useGameState(): GameContext {
  const context = useContext(gameContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within the GameProvider");
  }
  return context;
}
