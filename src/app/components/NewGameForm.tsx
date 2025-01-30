"use client";
import { useState } from "react";
import { generatePlayerName } from "../utils/generatePlayerName";
import { Button } from "./Button";

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
      <div className="flex gap-5">
        <Button
          variant="secondary"
          disabled={showJoinExisting}
          onClick={() => {
            setShowJoinExisting(true);
          }}
        >
          Join existing room
        </Button>
        <Button
          variant="secondary"
          disabled={!showJoinExisting}
          onClick={() => {
            setShowJoinExisting(false);
          }}
        >
          Create new room
        </Button>
      </div>
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
        <Button type="submit">
          {showJoinExisting ? "Join Room" : "Create Room"}
        </Button>
      </div>
    </div>
  );
}
