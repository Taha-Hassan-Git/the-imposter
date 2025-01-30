import { useGameState, GameInfo, Player } from "../hooks/useGameState";

const PlayingScreen = ({ self }: { self: string }) => {
  const { gameState } = useGameState() as { gameState: GameInfo };
  const player = gameState.players.find((player) => player.name === self)!;
  return (
    <div className="flex flex-col gap-5 p-5 items-center">
      <div className="flex gap-5 justify-between">
        <GameInfoPanel />
        <ScorePanel />
      </div>
      <div className="flex flex-col gap-5">
        <AnswerBox player={player} />
        <ReadyToVoteBox player={player} />
      </div>
    </div>
  );
};
function ReadyToVoteBox({ player }: { player: Player }) {
  const { dispatch } = useGameState();

  function toggleReady() {
    dispatch({ type: "toggle-ready", payload: { name: player.name } });
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-8 min-w-[360px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Ready to Vote?</h2>
      <p className="text-gray-500 text-xl">Click the button below to vote</p>
      <button
        onClick={toggleReady}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg mt-4"
      >
        Vote
      </button>
    </div>
  );
}
function AnswerBox({ player }: { player: Player }) {
  const { gameState } = useGameState() as { gameState: GameInfo };
  return (
    <div className="bg-white rounded-lg shadow-md p-8 min-w-[360px]">
      {player.imposter ? "You are the imposter" : gameState.answer}
    </div>
  );
}
function GameInfoPanel() {
  // contains round and category info
  const { gameState } = useGameState() as { gameState: GameInfo };
  return (
    <div
      className="bg-white rounded-lg shadow
        -md p-8 min-w-[360px]"
    >
      <div className="flex flex-col gap-3">
        <p className="text-gray-500 text-xl">Round: {gameState.round}</p>
        <p className="text-gray-500 text-xl">Category: {gameState.category}</p>
      </div>
    </div>
  );
}
function ScorePanel() {
  const { gameState } = useGameState() as { gameState: GameInfo };
  return (
    <div className="bg-white rounded-lg shadow-md p-8 man-w-[160px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Scores</h2>
      <ul className="space-y-3">
        {gameState.players.map((player) => (
          <PlayerScoreItem key={player.name} player={player} />
        ))}
      </ul>
    </div>
  );
}

export function PlayerScoreItem({ player }: { player: Player }) {
  return (
    <>
      {/* Players initial inside the colored div with the score beside them */}
      <li className="flex items-center">
        <div
          className="w-6 h-6 rounded-full mr-3 text-center flex items-center justify-center"
          style={{ backgroundColor: player.avatarColor, opacity: 0.6 }}
        >
          <p className="font-bold text-gray-50">
            {player.name[0].toUpperCase()}
          </p>
        </div>
        <span className="text-gray-500 text-xl font-extrabold">
          {player.score}
        </span>
      </li>
    </>
  );
}
export default PlayingScreen;
