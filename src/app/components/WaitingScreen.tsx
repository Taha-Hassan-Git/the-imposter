import { useEffect, useState } from "react";
import { GameInfo, Player, useGameState } from "../hooks/useGameState";

export function WaitingScreen({
  gameState,
  self,
}: {
  gameState: GameInfo;
  self: string;
}) {
  const { dispatch } = useGameState();

  useEffect(() => {
    const avatarColor = gameState.players.find(
      (p) => p.name === self
    )?.avatarColor;
    dispatch({
      type: "player-joined",
      payload: { name: self, avatarColor: avatarColor || "red" },
    });
  }, [dispatch, gameState.players, self]);
  return (
    <div className="flex flex-col gap-5 p-5 items-center">
      <div className="bg-white rounded-lg shadow-md p-8 min-w-[360px]">
        <h2 className="text-2xl font-bold mb-4 text-center">Players</h2>
        <ul className="space-y-3">
          {gameState.players.map((player: Player) => (
            <PlayerListItem key={player.name} player={player} />
          ))}
        </ul>
      </div>
      <div>
        <ReadyButton self={self} />
      </div>
    </div>
  );
}

function PlayerListItem({ player }: { player: Player }) {
  return (
    <li className="flex items-center">
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
  );
}

function ReadyButton({ self }: { self: string }) {
  const [ready, setReady] = useState(false);
  const { dispatch } = useGameState();
  const handleClick = () => {
    setReady(!ready);
    dispatch({ type: "toggle-ready", payload: { name: self } });
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <button
        className="w-32 bg-gray-800 hover:bg-gray-950 text-white py-3 px-5 text-base font-medium rounded-md transition-colors duration-300 text-nowrap"
        onClick={handleClick}
      >
        {ready ? "..." : "Ready?"}
      </button>
      {ready && <p>Game begins when all players are ready...</p>}
    </div>
  );
}
