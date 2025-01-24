import { redirect } from "next/navigation";
import NewGameForm from "./components/NewGameForm";
import { PARTYKIT_URL } from "./env";
import { generateRoomId } from "./utils/generateRoomId";

export default function Home() {
  async function createOrJoinRoom(formData: FormData) {
    "use server";
    const playerName = formData.get("name");
    let roomId = formData.get("roomId");
    const category = formData.get("category");

    if (!roomId) {
      roomId = generateRoomId();
      await fetch(`${PARTYKIT_URL}/party/${roomId}`, {
        method: "POST",
        body: JSON.stringify({ playerName, category, roomId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      await fetch(`${PARTYKIT_URL}/party/${roomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    redirect(`/game/${roomId}`);
  }
  return (
    <div className="max-w-md bg-white rounded-lg shadow-md p-8 mt-5">
      <form action={createOrJoinRoom}>
        <NewGameForm />
      </form>
    </div>
  );
}
