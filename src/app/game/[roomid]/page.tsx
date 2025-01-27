import GameContainer from "../../components/Game";

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;
  console.log("page, roomid: ", roomId);
  return <GameContainer roomId={roomId} />;
}
