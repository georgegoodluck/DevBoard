type Props = {
  initials: string;
  gradient: string;
  size?: number;
};

export default function Avatar({ initials, gradient, size = 26 }: Props) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-mono font-semibold text-white shrink-0 uppercase"
      style={{
        width: size,
        height: size,
        background: gradient,
        fontSize: size <= 22 ? "9px" : "10px",
      }}
    >
      {initials}
    </div>
  );
}
