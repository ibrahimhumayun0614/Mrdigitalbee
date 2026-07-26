import {
  Code2,
  LayoutDashboard,
  PenTool,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PixelCard from "@/components/PixelCard";

const SERVICES: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Website Development",
    description:
      "Custom sites built for clarity, speed, and conversion — from marketing pages to full product experiences.",
    icon: Code2,
  },
  {
    title: "Website Maintenance",
    description:
      "Ongoing updates, performance checks, and reliable support so your site stays secure and current.",
    icon: Wrench,
  },
  {
    title: "CRM / Dashboard",
    description:
      "Internal tools and dashboards that organize your data and help your team move faster.",
    icon: LayoutDashboard,
  },
  {
    title: "Logo Design",
    description:
      "Brand marks and identity systems that feel consistent across web, print, and social.",
    icon: PenTool,
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="bg-[var(--color-secondary)] px-4 py-12 md:py-[3rem]"
      aria-label="Our Services"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-10 max-w-[36rem]">
          <Badge
            variant="secondary"
            className="rounded-full bg-[#e4e4e4] px-[0.9rem] py-[0.35rem] text-[0.78rem] font-medium text-[#5c5c5c]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Our Services
          </Badge>
          <h2
            className="mt-[0.95rem] text-left text-[clamp(1.55rem,3vw,2.35rem)] font-bold leading-[1.15] tracking-[-0.03em] text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What we build
          </h2>
          <p
            className="mt-[0.65rem] max-w-[32rem] text-left leading-[1.65] text-[#6b6b6b]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--font-size-description)",
            }}
          >
            Strategy, design, and development for brands that need a clear
            digital presence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <PixelCard
                key={service.title}
                variant="default"
                colors="#f8fafc,#d4d4d4,#a3a3a3"
                gap={5}
                speed={35}
                className="!h-auto !w-full !aspect-[4/5] border-[#222] bg-[#111]"
              >
                <div className="absolute inset-0 z-[2] flex flex-col justify-between p-7 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="inline-flex size-10 items-center justify-center rounded-xl bg-white text-black"
                      aria-hidden
                    >
                      <Icon className="size-[1.1rem]" strokeWidth={2} />
                    </span>
                    <span
                      className="text-[0.8rem] font-bold tracking-[0.06em] text-white/45"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <h3
                      className="m-0 text-[1.35rem] font-bold tracking-[-0.02em] text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className="m-0 max-w-[16rem] leading-[1.65] text-white/65"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--font-size-description)",
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>
              </PixelCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
