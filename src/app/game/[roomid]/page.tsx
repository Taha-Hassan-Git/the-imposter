export default async function Page({
  params,
}: {
  params: Promise<{ roomid: string }>;
}) {
  const roomId = (await params).roomid;

  return <div>game: {roomId}</div>;
}
