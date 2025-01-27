"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { GameProvider, useGameState } from "../hooks/useGameState";
import { WaitingScreen } from "./WaitingScreen";
import { Category } from "./NewGameForm";

const ROUTE = "/game/";
export default function GameContainer() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");
  const category = searchParams.get("category");

  const roomId = path.slice(ROUTE.length);
  console.log("room id from path", roomId);
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
