"use client";
import { useState } from "react";
import { createOrJoinRoom } from "../utils/createOrJoinRoom";

export type FormData = { category: Category; roomId: RoomId };
type Category = "films" | "animals" | "countries" | "sports";
type RoomId = string;

const partOne = [
  "gay",
  "lesbian",
  "bi",
  "genderqueer",
  "trans",
  "ace",
  "pan",
  "poly",
  "queer",
  "intersex",
  "nonbinary",
  "agender",
  "genderfluid",
];
const partTwo = [
  "unicorn",
  "orangutan",
  "wyvyrn",
  "dragon",
  "phoenix",
  "griffin",
  "pegasus",
  "mermaid",
  "merman",
  "siren",
  "kraken",
  "hippogriff",
  "minotaur",
  "centaur",
  "harpy",
  "sphinx",
  "chimera",
  "gryphon",
];
const partThree = [
  "adventure",
  "attack",
  "awakening",
  "battle",
  "beginning",
  "challenge",
  "clash",
  "conquest",
  "crusade",
  "discovery",
  "encounter",
  "epic",
  "expedition",
  "exploration",
  "fable",
  "fate",
  "journey",
  "legend",
  "myth",
  "odyssey",
  "quest",
  "saga",
  "search",
  "struggle",
  "tale",
  "triumph",
  "victory",
  "voyage",
  "war",
];

const defaultFormData: FormData = {
  category: "films",
  roomId: generateRoomId(),
};
function generateRoomId() {
  return `${partOne[Math.floor(Math.random() * partOne.length)]}-${
    partTwo[Math.floor(Math.random() * partTwo.length)]
  }-${partThree[Math.floor(Math.random() * partThree.length)]}`;
}
const categories: Array<Category> = ["films", "animals", "countries", "sports"];
export default function NewGameForm() {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [showJoinExisting, setShowJoinExisting] = useState(false);
  return (
    <form
      action={() => {
        createOrJoinRoom(formData);
      }}
      className="flex flex-col gap-5"
      id="game-form"
    >
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
        <button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-950 text-white py-3 px-5 text-base font-medium rounded-md transition-colors duration-300"
          id="new-room-btn"
        >
          {showJoinExisting ? "Join Room" : "Create Room"}
        </button>
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
