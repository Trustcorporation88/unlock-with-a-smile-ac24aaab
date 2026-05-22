import photo from "@/assets/dra-rebecca.jpg";

export function Medallion({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-3xl" />
      <div className="relative h-full w-full overflow-hidden rounded-[2rem] ring-1 ring-border shadow-2xl shadow-foreground/10">
        <img
          src={photo}
          alt="Dra. Rebecca Rossener — Cirurgiã Plástica"
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
}
