import photo from "@/assets/dra-rebecca.jpg";

export function Medallion({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-6 rounded-[40%] bg-gradient-to-br from-primary/25 via-secondary/15 to-transparent blur-3xl" />
      <div className="relative h-full w-full overflow-hidden rounded-[36%] ring-1 ring-border shadow-2xl shadow-foreground/10">
        <img
          src={photo}
          alt="Dra. Rebecca Rossener — Cirurgiã Plástica"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
