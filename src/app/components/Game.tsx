"use client";
import { useSearchParams } from "next/navigation";
import { GameProvider, useGameState } from "../hooks/useGameState";
import { WaitingScreen } from "./WaitingScreen";
import { Category } from "./NewGameForm";

export default function GameContainer({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");
  const category = searchParams.get("category");

  return (
    <div className="flex flex-col w-full items-center">
      <GameProvider
        playerName={playerName}
        category={category as Category}
        roomId={roomId}
      >
        <Game playerName={playerName} />
      </GameProvider>
    </div>
  );
}

function Game({ playerName }: { playerName: string | null }) {
  const { gameState } = useGameState();
  return (
    <>
      {gameState.state === "error" ? (
        <ErrorScreen />
      ) : gameState.state === "waiting" ? (
        <WaitingScreen self={playerName as string} gameState={gameState} />
      ) : gameState.state === "playing" ? (
        <PlayingScreen />
      ) : gameState.state === "voting" ? (
        <VotingScreen />
      ) : null}
    </>
  );
}

function ErrorScreen() {
  return <div>Error Screen</div>;
}

function PlayingScreen() {
  return <div>Playing Screen</div>;
}

function VotingScreen() {
  return <div>Voting Screen</div>;
}
