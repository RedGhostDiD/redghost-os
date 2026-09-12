interface IconProps {
  className?: string;
}

const base = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconProjects({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 9h18M9 9v12" />
      <path d="M13 13h5M13 16.5h5" />
    </svg>
  );
}

export function IconRobotics({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="17" width="6" height="4" rx="1" />
      <path d="M7 17V13" />
      <path d="M7 13l6-3" />
      <path d="M13 10l4-4" />
      <circle cx="18" cy="5" r="1.6" />
    </svg>
  );
}

export function IconSoftware({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 8l-4 4 4 4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M13.5 6.5l-3 11" />
    </svg>
  );
}

export function IconHardware({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />
    </svg>
  );
}

export function IconDesign({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="9.5" cy="14.5" r="5.5" />
      <path d="M12 4l7 12H5z" />
    </svg>
  );
}

export function IconLab({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M10 3h4" />
      <path d="M11 3v6l-5.5 9.5A1.5 1.5 0 0 0 6.8 21h10.4a1.5 1.5 0 0 0 1.3-2.5L13 9V3" />
      <path d="M8 15h8" />
    </svg>
  );
}

export function IconStore({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 8l1.5-4h13L20 8" />
      <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <path d="M9 12v-4M15 12v-4" />
    </svg>
  );
}

export function IconGithub({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6a4.6 4.6 0 0 1 1.3-3.2 4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.6 3.3-1.2 3.3-1.2a4.3 4.3 0 0 1 .1 3.2 4.6 4.6 0 0 1 1.3 3.2c0 4.7-2.9 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
    </svg>
  );
}

export function IconInstagram({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconYoutube({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTiktok({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
      <path d="M14 3c.3 1.9 1.6 3.3 3.5 3.6V9c-1.3 0-2.5-.4-3.5-1.1v6.6a5 5 0 1 1-4.3-4.9v2.6a2.4 2.4 0 1 0 1.8 2.3V3h2.5z" />
    </svg>
  );
}

export function IconDiscord({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 5.5C6.5 6 5.5 6.8 5 8c-1 2.3-1.5 5-1.3 7.5.9.8 2 1.4 3.1 1.7l.6-1.2M16 5.5c1.5.5 2.5 1.3 3 2.5 1 2.3 1.5 5 1.3 7.5-.9.8-2 1.4-3.1 1.7l-.6-1.2" />
      <ellipse cx="9" cy="13" rx="1.4" ry="1.7" fill="currentColor" stroke="none" />
      <ellipse cx="15" cy="13" rx="1.4" ry="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}
