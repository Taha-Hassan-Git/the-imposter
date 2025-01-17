"use server";
import { redirect } from "next/navigation";

export async function createOrJoinRoom(formData: any) {
  console.log(formData);
  redirect("/game/1234");
}
