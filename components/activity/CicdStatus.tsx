const status = [
  {
    name: "TickrPay",
    status: "Passing",
    statusColor: "green",
  },

  {
    // gradient:
    name: "Pulse",
    status: "Failed",
    statusCOlor: "danger",
  },

  {
    // gradient:
    name: "Fin·Snap",
    status: "Passing",
    statusColor: "green",
  },

  {
    // gradient:
    name: "SubTrack",
    status: "Deploying",
    statusColor: "amber",
  },
];

export default function CicdStatus() {
    return (
        <>
        <h1>CI / CD Status</h1>
        </>
    )
}
