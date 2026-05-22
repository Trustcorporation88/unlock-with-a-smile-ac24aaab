import logo from "@/assets/logo.png";

export function Medallion({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/15 blur-3xl" />
      <img
        src={logo}
        alt="Dra. Rebecca Rossener — Cirurgia Plástica"
        className="relative h-full w-full rounded-full object-contain"
      />
    </div>
  );
}
