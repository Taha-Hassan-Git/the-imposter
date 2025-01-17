"use client";
import { useState } from "react";
import { createOrJoinRoom } from "../utils/createOrJoinRoom";
import Link from "next/link";

type FormData = { category: Category; roomId: RoomId };
type Category = "films" | "animals" | "countries" | "sports";
type RoomId = number;

const defaultFormData: FormData = {
  category: "films",
  roomId: Number.parseInt((Math.random() * 1000).toFixed(0)),
};
const categories: Array<Category> = ["films", "animals", "countries", "sports"];
export default function NewGameForm() {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  return (
    <form
      action={createOrJoinRoom}
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
      <div>
        <label htmlFor="roomId">Room ID:</label>
        <input
          className="w-full p-2.5 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          // value={formData.roomId}
        />
      </div>
      <div>
        <button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-950 text-white py-3 px-5 text-base font-medium rounded-md transition-colors duration-300"
          id="new-room-btn"
        >
          New Room
        </button>
      </div>
      <button className="self-center">Join existing room?</button>
    </form>
  );
}
