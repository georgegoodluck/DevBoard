const pipelines = [
  { name: "TickrPay", status: "Passing" as const },
  { name: "Pulse", status: "Failed" as const },
  { name: "fin·snap", status: "Passing" as const },
  { name: "SubTrack", status: "Deploying" as const },
];

export default function CicdStatus() {
  return (
    <>
      <h1>CI / CD Status</h1>
    </>
  );
}
