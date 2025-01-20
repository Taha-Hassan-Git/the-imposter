"use server";
import { redirect } from "next/navigation";
import { FormData } from "../components/NewGameForm";

export async function createOrJoinRoom(formData: FormData) {
  console.log(formData);
  redirect(`/game/${formData.roomId}`);
}
