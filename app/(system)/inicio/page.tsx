import Link from "next/link";
import Panel from "@/components/Panel";
import ModuleWidget from "@/components/ModuleWidget";
import GlitchText from "@/components/GlitchText";
import SpecSheet from "@/components/SpecSheet";
import DidPipeline from "@/components/DidPipeline";
import BootIntro from "@/components/BootIntro";
import { PROJECTS, statusCounts, typeCounts, timeAgo } from "@/lib/projects";
import { CHANGELOG } from "@/lib/changelog";
import { SITE_CONFIG } from "@/lib/site-config";
import {
  IconProjects,
  IconRobotics,
  IconSoftware,
  IconHardware,
  IconDesign,
  IconLab,
  IconStore,
  IconGithub,
  IconInstagram,
  IconYoutube,
  IconTiktok,
  IconDiscord,
} from "@/components/neo-icons";
import Image from "next/image";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  GITHUB: <IconGithub />,
  INSTAGRAM: <IconInstagram />,
  YOUTUBE: <IconYoutube />,
  TIKTOK: <IconTiktok />,
  DISCORD: <IconDiscord />,
};

const MODULES = [
  { label: "PROJECTS", href: "/proyectos", icon: <IconProjects />, readout: "0x01 DB_LIVE", tone: "red-dim" as const },
  { label: "ROBOTICS", href: "/robotica", icon: <IconRobotics />, readout: "0x02 ARM_OK", tone: "red-dim" as const },
  { label: "SOFTWARE", href: "/software", icon: <IconSoftware />, readout: "0x03 BUILD_OK", tone: "red-dim" as const },
  { label: "HARDWARE", href: "/hardware", icon: <IconHardware />, readout: "0x04 PCB_OK", tone: "orange" as const },
  { label: "DESIGN", href: "/diseno", icon: <IconDesign />, readout: "0x05 ASSET_OK", tone: "red-dim" as const },
  { label: "LAB", href: "/laboratorio", icon: <IconLab />, readout: "0x06 UNSTABLE", tone: "red" as const },
  { label: "STORE", href: "/store", icon: <IconStore />, readout: "0x07 OPEN", tone: "green" as const },
];

const STATUS_FLAGS = [
  { label: "ONLINE", tone: "green" as const },
  { label: "PROJECT DATABASE ACTIVE", tone: "green" as const },
  { label: "DiD BRAND ACTIVE", tone: "green" as const },
  { label: "STORE AVAILABLE", tone: "green" as const },
];

export default function InicioPage() {
  const byStatus = statusCounts();
  const byType = typeCounts();
  const activeProjects = PROJECTS.filter((p) => p.status === "ACTIVE");
  const mainAvatar = SITE_CONFIG.socials.find((s) => s.avatar)?.avatar;

  return (
    <BootIntro>
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        {activeProjects.length > 0 && (
          <Panel
            id="MOD_000"
            title="Active Projects"
            status={{ label: "ACTIVE", tone: "green" }}
            delayMs={140}
            className="[&_.rg-neo-panel]:border-[var(--rg-red)]"
          >
            <div className="flex flex-col gap-5">
              {activeProjects.map((project) => (
                <div key={project.slug} className="flex flex-col sm:flex-row sm:items-start gap-5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.15em] mb-1" style={{ color: "var(--rg-text-faint)" }}>
                      {project.id} // {project.type}
                    </p>
                    <h2 className="text-lg tracking-[0.15em] text-[var(--rg-red)] rg-glow-red mb-2">
                      {project.name}
                    </h2>
                    <p className="text-sm text-[var(--rg-text-dim)] leading-relaxed mb-3">
                      {project.summary}
                    </p>
                    <DidPipeline stage={project.pipeline} compact />
                  </div>

                  <div className="sm:w-64 shrink-0 flex flex-col gap-3">
                    {project.specs && <SpecSheet specs={project.specs} />}
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <Link
                        href={`/proyectos/${project.slug}`}
                        className="rg-action-link inline-block text-[10px] tracking-[0.15em] border px-3 py-1.5"
                      >
                        [ ACCESS ]
                      </Link>
                      <span className="text-[9px] tracking-[0.1em]" style={{ color: "var(--rg-text-faint)" }}>
                        {timeAgo(project.lastModified)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        <Panel id="MOD_001" title="System Modules" status={{ label: "ACTIVE", tone: "red-dim" }} delayMs={220}>
          <div className="flex flex-wrap gap-3">
            {MODULES.map((mod) => (
              <ModuleWidget
                key={mod.href}
                href={mod.href}
                label={mod.label}
                readout={mod.readout}
                tone={mod.tone}
                icon={mod.icon}
              />
            ))}
          </div>
        </Panel>

        <Panel id="MOD_002" title="Project Database" status={{ label: "LIVE", tone: "red-dim" }} delayMs={280}>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-[10px] tracking-[0.15em] mb-2" style={{ color: "var(--rg-text-faint)" }}>
                BY STATUS
              </p>
              <ul className="text-xs tracking-[0.1em] space-y-1">
                <li className="flex justify-between">
                  <span style={{ color: "var(--rg-text)" }}>PROJECTS</span>
                  <span style={{ color: "var(--rg-red-dim)" }}>{PROJECTS.length}</span>
                </li>
                {(
                  [
                    ["ACTIVE", "var(--rg-green)"],
                    ["WIP", "var(--rg-orange)"],
                    ["TESTING", "var(--rg-orange-dim)"],
                    ["PROTOTYPE", "var(--rg-orange)"],
                    ["EXPERIMENTAL", "var(--rg-orange)"],
                    ["ARCHIVED", "var(--rg-red-dim)"],
                    ["FAILED", "var(--rg-red)"],
                  ] as const
                ).map(([label, color]) => (
                  <li key={label} className="flex justify-between" style={{ color: "var(--rg-text-dim)" }}>
                    <span>{label}</span>
                    <span style={{ color }}>{byStatus[label]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.15em] mb-2" style={{ color: "var(--rg-text-faint)" }}>
                BY CATEGORY
              </p>
              <ul className="text-xs tracking-[0.1em] space-y-1" style={{ color: "var(--rg-text-dim)" }}>
                <li className="flex justify-between">
                  <span>ROBOT BUILDS</span>
                  <span style={{ color: "var(--rg-red-dim)" }}>{byType.ROBOTICS}</span>
                </li>
                <li className="flex justify-between">
                  <span>SOFTWARE</span>
                  <span style={{ color: "var(--rg-red-dim)" }}>{byType.SOFTWARE}</span>
                </li>
                <li className="flex justify-between">
                  <span>HARDWARE / PCB</span>
                  <span style={{ color: "var(--rg-red-dim)" }}>{byType.HARDWARE}</span>
                </li>
                <li className="flex justify-between">
                  <span>DESIGN ASSETS</span>
                  <span style={{ color: "var(--rg-red-dim)" }}>{byType.DESIGN}</span>
                </li>
              </ul>

              <div className="mt-4 pt-4 border-t space-y-1.5" style={{ borderColor: "rgba(255, 22, 61,0.18)" }}>
                {STATUS_FLAGS.map((s) => (
                  <div key={s.label} className="flex items-center gap-2 text-xs tracking-[0.1em]">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--rg-green)", boxShadow: "0 0 6px var(--rg-green)" }}
                    />
                    <span style={{ color: "var(--rg-green)", textShadow: "0 0 6px rgba(51,224,138,0.5)" }}>
                      {s.label}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs tracking-[0.1em]">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--rg-orange)", boxShadow: "0 0 6px var(--rg-orange)" }}
                  />
                  <GlitchText text="LAB EXPERIMENTAL" />
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel id="MOD_003" title="Network" status={{ label: "CONNECTED", tone: "green" }} delayMs={420}>
          <div className="flex items-center gap-5">
            {mainAvatar && (
              <span
                className="relative shrink-0 w-28 h-28 sm:w-40 sm:h-40 overflow-hidden rounded-full border"
                style={{ borderColor: "var(--rg-red-line)" }}
              >
                <Image src={mainAvatar} alt="RedGhost" fill sizes="160px" className="object-cover" />
              </span>
            )}
            <div className="flex-1 min-w-0 flex flex-col divide-y" style={{ borderColor: "var(--rg-red-line-soft)" }}>
              {SITE_CONFIG.socials.map((social) => (
                <div key={social.label} className="flex items-center justify-between gap-2 py-2 first:pt-0">
                  <span className="flex items-center gap-2 text-xs tracking-[0.12em] min-w-0" style={{ color: "var(--rg-text)" }}>
                    <span className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--rg-orange)" }}>
                      {SOCIAL_ICONS[social.label]}
                    </span>
                    <span className="truncate">
                      {social.label}
                      {social.handle && (
                        <span className="ml-1.5" style={{ color: "var(--rg-text-faint)" }}>
                          {social.handle}
                        </span>
                      )}
                    </span>
                  </span>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rg-action-link shrink-0 text-[9px] tracking-[0.15em] border px-2 py-1"
                  >
                    [ CONNECT ]
                  </a>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel id="MOD_004" title="System Log" status={{ label: "OK", tone: "green" }} delayMs={560}>
          <div className="space-y-3 text-xs">
            {CHANGELOG.slice(0, 4).map((entry) => (
              <div key={entry.date}>
                <p className="tracking-[0.1em] mb-1" style={{ color: "var(--rg-red)" }}>
                  {entry.date}
                </p>
                <ul className="space-y-0.5" style={{ color: "var(--rg-text-dim)" }}>
                  {entry.items.map((item) => (
                    <li key={item}>+ {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
    </BootIntro>
  );
}
