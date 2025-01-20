import Game from "../../components/Game";

export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  console.log(params);
  const roomId = (await params).roomId;

  return <Game roomId={roomId} />;
}
