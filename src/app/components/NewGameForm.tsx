"use client";
import { useState } from "react";
import { generatePlayerName } from "../utils/generatePlayerName";

export type GameFormData = { category: Category; roomId: RoomId; name: string };
export type Category = "films" | "animals" | "countries" | "sports";
type RoomId = string | null;

const defaultGameFormData: GameFormData = {
  category: "films",
  name: generatePlayerName(),
  roomId: null,
};

const categories: Array<Category> = ["films", "animals", "countries", "sports"];
export default function NewGameForm() {
  const [gameFormData, setGameFormData] =
    useState<GameFormData>(defaultGameFormData);
  const [showJoinExisting, setShowJoinExisting] = useState(false);

  return (
    <div className="flex flex-col gap-5 min-w-[350px]" id="game-form">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setShowJoinExisting((prev) => !prev);
        }}
        className="self-center"
      >
        {showJoinExisting ? "Create new room?" : "Join existing room?"}
      </button>
      <div className="flex-col">
        <label htmlFor="category" className="block mb-1 font-medium">
          Category:
        </label>
        <select
          value={gameFormData.category}
          onChange={(e) => {
            setGameFormData((prev) => {
              return { ...prev, category: e.target.value as Category };
            });
          }}
          id="category"
          name="category"
          className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category) => {
            return (
              <option key={category + "option"} value={category}>
                {category.slice(0, 1).toUpperCase() + category.slice(1)}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Your Name:
        </label>
        <input
          value={gameFormData.name}
          onChange={(e) => {
            setGameFormData((prev) => {
              return { ...prev, name: e.target.value };
            });
          }}
          type="text"
          id="name"
          name="name"
          className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {showJoinExisting && (
        <div>
          <label htmlFor="roomId">Room ID:</label>
          <input
            name="roomId"
            id="roomId"
            type="text"
            value={gameFormData.roomId || ""}
            onChange={(e) => {
              setGameFormData((prev) => {
                return { ...prev, roomId: e.target.value };
              });
            }}
            className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      <div className="self-center">
        <button
          suppressHydrationWarning
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-950 text-white py-3 px-5 text-base font-medium rounded-md transition-colors duration-300 text-nowrap"
          id="new-room-btn"
        >
          {showJoinExisting ? "Join Room" : "Create Room"}
        </button>
      </div>
    </div>
  );
}
