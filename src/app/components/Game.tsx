"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Category } from "./NewGameForm";

type Player = {
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
type GameError = { name: "error" };
type GameWaiting = { name: "waiting" } & GameInfo;
type GamePlaying = { name: "playing" } & GameInfo;
type GameVoting = { name: "voting" } & GameInfo;
type GameState = GameError | GameWaiting | GamePlaying | GameVoting;

export default function Game({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");
  const category = searchParams.get("category");

  const [gameState, setGameState] = useState<GameState>(() =>
    getInitialGameState()
  );

  function getInitialGameState(): GameState {
    if (!playerName || !category) {
      return { name: "error" };
    }
    const randomColorIndex = Math.floor(Math.random() * avatarColors.length);
    return {
      name: "waiting",
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

  return (
    <div className="flex flex-col w-full justify-center align-center">
      {gameState.name === "error" ? (
        <ErrorScreen />
      ) : gameState.name === "waiting" ? (
        <WaitingScreen gameState={gameState} setGameState={setGameState} />
      ) : gameState.name === "playing" ? (
        <PlayingScreen />
      ) : gameState.name === "voting" ? (
        <VotingScreen />
      ) : null}
    </div>
  );
}

function ErrorScreen() {
  return <div>Error Screen</div>;
}
function WaitingScreen({
  gameState,
  setGameState,
}: {
  gameState: GameWaiting;
  setGameState: (gameState: GameState) => void;
}) {
  return (
    <div className="flex flex-col gap-5 max-w-md p-5 items-center">
      <div className="bg-white rounded-lg shadow-md p-6 w-72">
        <h2 className="text-2xl font-bold mb-4 text-center">Players</h2>
        <ul className="space-y-3">
          {gameState.players.map((player) => (
            <li key={"player" + player.name} className="flex items-center">
              <div
                className="w-6 h-6 rounded-full mr-3"
                style={{ backgroundColor: player.avatarColor, opacity: 0.6 }}
              />
              <span className="font-bold flex-1">{player.name}</span>
              {player.ready ? (
                <span className="text-green-500 text-sm flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  />
                  ready!
                </span>
              ) : (
                <span className="text-gray-500 text-sm">...waiting</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PlayingScreen() {
  return <div>Playing Screen</div>;
}

function VotingScreen() {
  return <div>Voting Screen</div>;
}
