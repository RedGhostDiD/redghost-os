import Image from "next/image";

export default function SocialCard({
  label,
  handle,
  href,
  avatar,
  icon,
}: {
  label: string;
  handle?: string;
  href: string;
  avatar: string;
  icon?: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rg-neo-widget group flex items-center gap-3 px-3 py-3 min-w-[210px] flex-1 sm:flex-none"
    >
      <span
        className="relative shrink-0 w-14 h-14 overflow-hidden rounded-full border"
        style={{ borderColor: "var(--rg-red-line)" }}
      >
        <Image src={avatar} alt={`${label} avatar`} fill sizes="56px" className="object-cover" />
      </span>
      <span className="flex flex-col gap-0.5 min-w-0">
        <span
          className="flex items-center gap-1.5 text-xs tracking-[0.18em]"
          style={{ color: "var(--rg-text)" }}
        >
          {icon && (
            <span className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--rg-orange)" }}>
              {icon}
            </span>
          )}
          [ {label} ]
        </span>
        {handle && (
          <span className="text-[10px] tracking-[0.05em] truncate" style={{ color: "var(--rg-orange)" }}>
            {handle}
          </span>
        )}
      </span>
    </a>
  );
}
