"use client";
import { useSearchParams } from "next/navigation";
import {
  GameWaiting,
  getPlayer,
  Player,
  useGameState,
} from "../hooks/useGameState";

export default function Game({ roomId }: { roomId: string }) {
  const searchParams = useSearchParams();
  const playerName = searchParams.get("playerName");
  const category = searchParams.get("category");

  const gameState = useGameState(roomId, playerName, category);

  return (
    <div className="flex flex-col w-full items-center">
      {gameState.state === "error" ? (
        <ErrorScreen />
      ) : gameState.state === "waiting" ? (
        <WaitingScreen self={playerName as string} gameState={gameState} />
      ) : gameState.state === "playing" ? (
        <PlayingScreen />
      ) : gameState.state === "voting" ? (
        <VotingScreen />
      ) : null}
    </div>
  );
}

function ErrorScreen() {
  return <div>Error Screen</div>;
}

function WaitingScreen({
  self,
  gameState,
}: {
  self: string;
  gameState: GameWaiting;
}) {
  const player = getPlayer(gameState.info.players, self)!;
  return (
    <div className="flex flex-col gap-5 p-5 items-center">
      <div className="bg-white rounded-lg shadow-md p-8 min-w-[360px]">
        <h2 className="text-2xl font-bold mb-4 text-center">Players</h2>
        <ul className="space-y-3">
          {gameState.info.players.map((player: Player) => (
            <li key={"player" + player.name} className="flex items-center">
              <div
                className="w-6 h-6 rounded-full mr-3"
                suppressHydrationWarning
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
      <div>
        <button
          onClick={() => {
            gameState.actions.toggleReady(self);
          }}
        >
          {player.ready ? "Ready" : "Not Ready"}
        </button>
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
