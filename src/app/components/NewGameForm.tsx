"use client";
import { useState } from "react";
import { generateRoomId } from "../utils/generateRoomId";
import { generatePlayerName } from "../utils/generatePlayerName";
import Link from "next/link";

export type FormData = { category: Category; roomId: RoomId; name: string };
export type Category = "films" | "animals" | "countries" | "sports";
type RoomId = string;

const defaultFormData: FormData = {
  category: "films",
  name: generatePlayerName(),
  roomId: generateRoomId(),
};

const categories: Array<Category> = ["films", "animals", "countries", "sports"];
export default function NewGameForm() {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [showJoinExisting, setShowJoinExisting] = useState(false);
  return (
    <form className="flex flex-col gap-5" id="game-form">
      <div className="flex-col">
        <label htmlFor="category" className="block mb-1 font-medium">
          Category:
        </label>
        <select
          value={formData.category}
          onChange={(e) => {
            setFormData((prev) => {
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
          value={formData.name}
          onChange={(e) => {
            setFormData((prev) => {
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
            className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            // value={formData.roomId}
          />
        </div>
      )}
      <div>
        <Link
          suppressHydrationWarning
          href={{
            pathname: `/game/${formData.roomId}`,
            query: { playerName: formData.name, category: formData.category },
          }}
          className="w-full bg-gray-800 hover:bg-gray-950 text-white py-3 px-5 text-base font-medium rounded-md transition-colors duration-300"
          id="new-room-btn"
        >
          {showJoinExisting ? "Join Room" : "Create Room"}
        </Link>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setShowJoinExisting((prev) => !prev);
        }}
        className="self-center"
      >
        {showJoinExisting ? "Join existing room?" : "Create new room?"}
      </button>
    </form>
  );
}
