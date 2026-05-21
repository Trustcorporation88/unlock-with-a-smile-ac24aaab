import medallion from "@/assets/medallion.png";

export function Medallion({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-primary/10 blur-3xl" />
      <img
        src={medallion}
        alt="Selo Dra. Rebecca Rossener — Cirurgia Plástica"
        width={1024}
        height={1024}
        className="relative h-full w-full rounded-full object-contain opacity-95"
      />
    </div>
  );
}
