"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { GameProvider, useGameState } from "../hooks/useGameState";
import { WaitingScreen } from "./WaitingScreen";
import { Category } from "./NewGameForm";
import { useEffect } from "react";

const ROUTE = "/game/";
export default function GameContainer() {
  const path = usePathname();
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");
  const category = searchParams.get("category");

  const roomId = path.slice(ROUTE.length);

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
  const { gameState, dispatch } = useGameState();

  useEffect(() => {
    if (!playerName) {
      return;
    }
    console.log("player joined", playerName);
    dispatch({ type: "player-joined", payload: { name: playerName } });
  }, [playerName, dispatch]);
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
