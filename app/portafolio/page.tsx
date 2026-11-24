import Image from "next/image";
import Link from "next/link";
import { PORTFOLIO, formatPrice, whatsappLink } from "@/lib/portafolio";
import { SITE_CONFIG } from "@/lib/site-config";
import { getTunelPhotos } from "@/lib/tunel";
import BarsReveal from "@/components/portafolio/BarsReveal";
import LocalClock from "@/components/portafolio/LocalClock";
import {
  ArrowRight,
  ArrowUpRight,
  BaselineIcon,
  Barcode,
  Chevrons,
  Corner,
  CrossX,
  Crosshair,
  GhostMark,
  PixelStairs,
  PlusThin,
  SquareDot,
  StackIcon,
  TargetMark,
} from "@/components/portafolio/Marks";

function displayPhone(n: string) {
  // 523112547359 → +52 311 254 7359
  return n.length === 12 ? `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`;
}

export default function PortafolioPage() {
  const { projects, packages, currency, whatsapp, pricingNotes, payment, steps, support, supportNote, ownership } = PORTFOLIO;
  const wa = whatsappLink();
  const feed = getTunelPhotos().filter((p) => p.src.startsWith("/")).slice(-3).reverse();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="pf-hero">
        <div className="pf-hero-top">
          <p className="pf-mono"><span className="pf-sq" /> PORTAFOLIO — 2026</p>
          <Corner corner="tr" className="pf-dim" />
        </div>

        <div className="pf-row pf-hero-mark">
          <div className="pf-rail" />
          <h1 className="pf-wordmark">
            <span className="sr-only">RedGhost</span>
            <span aria-hidden="true">RΞD GHØST</span>
            <GhostMark className="pf-wordmark-ghost" eyes="var(--pf-ink)" />
          </h1>
        </div>

        <div className="pf-row pf-hero-info">
          <div className="pf-rail">
            <Corner corner="tl" className="pf-dim" />
            <p className="pf-mono">DESARROLLADOR WEB<br />INDEPENDIENTE EN MÉXICO.</p>
          </div>
          <div className="pf-hero-copy">
            <p className="pf-name">RΞD GHØST studio</p>
            <p className="pf-mono">
              DISEÑO Y PROGRAMO PÁGINAS WEB, TIENDAS EN LÍNEA Y PANELES A LA MEDIDA
              PARA NEGOCIOS QUE QUIEREN VERSE EN SERIO.
            </p>
            <div className="pf-hairline"><PlusThin size={22} /></div>
          </div>
        </div>

        <nav className="pf-hero-nav pf-mono" aria-label="Secciones">
          <span className="pf-mini-ghost"><GhostMark /></span>
          <span className="pf-hero-links">
            <a href="#trabajos">TRABAJOS</a>, <a href="#paquetes">PAQUETES</a>, <a href="#garantia">GARANTÍA</a>, <a href="#ethos">ETHOS</a>
          </span>
          <span className="pf-hero-clock"><LocalClock /> <span className="pf-dim">{"//"}</span></span>
          <a href="#contacto" className="pf-hero-contact">CONTACTO</a>
        </nav>
      </section>

      {/* ================= WORKS ================= */}
      <section id="trabajos" className="pf-section">
        <header className="pf-row pf-head">
          <div className="pf-rail"><span className="pf-sq" /></div>
          <div>
            <h2 className="pf-h2">trabajos</h2>
            <p className="pf-tags pf-mono">
              <PlusThin size={14} /> <StackIcon /> <TargetMark size={16} /> ESTRATEGIA / DISEÑO / DESARROLLO
            </p>
          </div>
        </header>

        <div className="pf-works">
          {projects.map((p, i) => {
            const live = p.status === "En línea";
            const card = (
              <div className="pf-work-img">
                <Image src={p.image} alt={`Captura de ${p.name}`} fill sizes="(min-width: 900px) 33vw, 100vw" />
              </div>
            );
            return (
              <article key={p.slug} className={`pf-work pf-work-${i + 1}`}>
                <h3 className="pf-work-name">{p.name}</h3>
                <p className="pf-mono pf-dim pf-work-sum">{p.summary}</p>
                <p className="pf-mono pf-work-kind">
                  {p.kind.toUpperCase()} <span className={live ? "pf-live" : "pf-dim"}>· {p.status.toUpperCase()}</span>
                </p>
                {live ? (
                  <a
                    href={p.url}
                    className="pf-work-link"
                    aria-label={`Abrir ${p.name}`}
                    {...(p.url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {card}
                  </a>
                ) : (
                  card
                )}
                <p className="pf-mono pf-dim pf-work-stack">{p.stack.join(" / ")}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================= PACKAGES ================= */}
      <section id="paquetes" className="pf-section">
        <header className="pf-row pf-head">
          <div className="pf-rail"><span className="pf-sq" /></div>
          <div>
            <h2 className="pf-h2">paquetes</h2>
            <p className="pf-tags pf-mono">
              <PixelStairs size={20} /> <BaselineIcon /> <CrossX size={14} /> PRECIOS DE REFERENCIA EN {currency} / SE COTIZA A LA MEDIDA
            </p>
          </div>
        </header>

        <div className="pf-packages">
          {packages.map((pkg, i) => (
            <article key={pkg.name} className={`pf-pkg ${pkg.featured ? "is-featured" : ""}`}>
              <p className="pf-mono pf-pkg-top">
                <span>P/{String(i + 1).padStart(2, "0")}</span>
                {pkg.featured && <span className="pf-red"><span className="pf-sq" /> RECOMENDADO</span>}
              </p>
              <h3 className="pf-pkg-name">{pkg.name}</h3>
              <p className="pf-mono pf-dim pf-pkg-for">{pkg.for}</p>
              <p className="pf-price">
                <span className="pf-mono">DESDE</span>
                {formatPrice(pkg.price)}
                <small className="pf-mono">{currency}</small>
              </p>
              <ul className="pf-mono pf-pkg-list">
                {pkg.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <p className="pf-mono pf-dim">ENTREGA: {pkg.delivery.toUpperCase()}</p>
              <a
                className="pf-mono pf-cta-link"
                href={whatsappLink(`Hola RedGhost, me interesa el paquete "${pkg.name}".`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                LO QUIERO [+]
              </a>
            </article>
          ))}
        </div>

        <div className="pf-row pf-notes">
          <div className="pf-rail" />
          <ul className="pf-mono pf-dim">
            {pricingNotes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
      </section>

      {/* ================= GUARANTEE & SUPPORT ================= */}
      <section id="garantia" className="pf-section">
        <header className="pf-row pf-head">
          <div className="pf-rail"><span className="pf-sq" /></div>
          <div>
            <h2 className="pf-h2">garantía</h2>
            <p className="pf-tags pf-mono">
              <TargetMark size={16} /> <PlusThin size={14} /> <SquareDot size={14} /> PAGOS / GARANTÍA / SOPORTE
            </p>
          </div>
        </header>

        <dl className="pf-model">
          <div><dt className="pf-mono pf-dim">ANTICIPO</dt><dd>{payment.deposit}%</dd></div>
          <div><dt className="pf-mono pf-dim">LIQUIDACIÓN</dt><dd>{100 - payment.deposit}%</dd></div>
          <div><dt className="pf-mono pf-dim">DÍAS DE GARANTÍA</dt><dd className="pf-red">{payment.guaranteeDays}</dd></div>
          <div><dt className="pf-mono pf-dim">MANTENIMIENTO COTIZABLE</dt><dd>∞</dd></div>
        </dl>

        <div className="pf-support">
          {support.map((s, i) => (
            <article key={s.title} className="pf-pkg">
              <p className="pf-mono pf-pkg-top">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className={i === 0 ? "pf-red" : undefined}>{s.tag.toUpperCase()}</span>
              </p>
              <h3 className="pf-pkg-name">{s.title}</h3>
              <p className="pf-mono pf-dim pf-pkg-for">{s.text}</p>
              <ul className="pf-mono pf-pkg-list">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="pf-row pf-notes">
          <div className="pf-rail" />
          <div>
            <p className="pf-ownership">{ownership}</p>
            <ul className="pf-mono pf-dim">
              <li>{supportNote}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= VISUAL FEED ================= */}
      <section className="pf-section pf-feed">
        <div className="pf-row">
          <div className="pf-rail"><span className="pf-sq" /></div>
          <div className="pf-feed-body">
            <div>
              <h2 className="pf-h2">visual feed</h2>
              <p className="pf-tags pf-mono">
                <PixelStairs size={20} /> <PlusThin size={14} /> <CrossX size={14} /> FOTOGRAFÍA / ARCHIVO / TÚNEL
              </p>
              <p className="pf-mono pf-dim pf-feed-text">
                FOTOS PROPIAS, REVELADAS DESDE RAW EN EL NAVEGADOR Y ORDENADAS EN UN ARCHIVO QUE SE RECORRE COMO UN TÚNEL.
              </p>
              <Link href="/tunel" className="pf-mono pf-cta-link">VER ARCHIVO [+]</Link>
            </div>
            <Link href="/tunel" className="pf-feed-stack" aria-label="Abrir el archivo Túnel">
              {feed.map((photo, i) => (
                <span key={photo.id} className={`pf-feed-photo pf-feed-photo-${i + 1}`}>
                  <Image src={photo.src} alt="" fill sizes="280px" />
                </span>
              ))}
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ETHOS ================= */}
      <section id="ethos" className="pf-section pf-ethos">
        <header className="pf-row pf-head">
          <div className="pf-rail"><span className="pf-sq" /></div>
          <div>
            <h2 className="pf-h2">ethos</h2>
            <p className="pf-tags pf-mono">
              <StackIcon /> <PlusThin size={14} /> <SquareDot size={14} /> PROPÓSITO / PRECISIÓN / OFICIO
            </p>
            <p className="pf-ethos-text">
              Una página web no es un folleto: es la primera conversación con tu cliente. Por eso
              cada sitio se programa a la medida, carga al instante y lo puedes editar tú, sin
              depender de nadie. Hablas directo con quien escribe el código.
            </p>
          </div>
        </header>

        <div className="pf-row">
          <div className="pf-rail" />
          <ol className="pf-steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <p className="pf-mono pf-red">{String(i + 1).padStart(2, "0")}</p>
                <h3>{s.title}</h3>
                <p className="pf-mono pf-dim">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="pf-row">
          <div className="pf-rail" />
          <a href={wa} target="_blank" rel="noopener noreferrer" className="pf-mono pf-cta-link pf-ethos-cta">
            COTIZAR POR WHATSAPP [+]
          </a>
        </div>
      </section>

      {/* ================= CONTACT (bars reveal) ================= */}
      <BarsReveal>
        <div className="pf-contact">
          <aside className="pf-panel">
            <svg className="pf-panel-outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 0H100V70L66 92H40L34 100H0" vectorEffect="non-scaling-stroke" />
            </svg>
            <Crosshair className="pf-panel-cross pf-panel-cross-top" />
            <Crosshair className="pf-panel-cross pf-panel-cross-bottom" />
            <p className="pf-mono pf-panel-ver"><span className="pf-sq" /> CONTACTO — MX</p>

            <div className="pf-panel-lists pf-mono">
              <div>
                <p className="pf-faint">[ NAV ]</p>
                <p>
                  <a href="#trabajos">TRABAJOS</a>,<br />
                  <a href="#paquetes">PAQUETES</a>,<br />
                  <a href="#garantia">GARANTÍA</a>,<br />
                  <a href="#ethos">ETHOS</a>,<br />
                  <Link href="/">REDGHOST.OS</Link>
                </p>
              </div>
              <div>
                <p className="pf-faint">[ REDES ]</p>
                <p>
                  {SITE_CONFIG.socials.map((s, i) => (
                    <span key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
                      {i < SITE_CONFIG.socials.length - 1 ? "," : ""}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </aside>

          <div className="pf-contact-main">
            <h2 className="pf-contact-title">contacto;</h2>
            <a href={`mailto:${SITE_CONFIG.email}`} className="pf-email">{SITE_CONFIG.email}</a>
            <p className="pf-contact-icons">
              <StackIcon /> <BaselineIcon /> <ArrowUpRight />
            </p>

            <div className="pf-card">
              <div className="pf-card-head pf-mono">
                <span>PROYECTOS<br />CON PROPÓSITO</span>
                <CrossX size={22} />
                <span>SISTEMAS<br />A LA MEDIDA</span>
              </div>

              <Barcode code={`RG-${whatsapp.slice(-4)}.MX26`} className="pf-card-barcode" />
              <TargetMark className="pf-card-target" />
              <Chevrons className="pf-card-chev" />
              <PlusThin className="pf-card-plus" />
              <Corner corner="bl" className="pf-card-corner-bl" />
              <Corner corner="tr" className="pf-card-corner-tr" />

              <figure className="pf-card-photo">
                <Image src="/portafolio/perfil.jpg" alt="RedGhost" fill sizes="240px" />
                <figcaption className="pf-mono">ID // REDGHOST</figcaption>
              </figure>

              <div className="pf-card-id">
                <p className="pf-card-year">MX/26</p>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="pf-card-wa pf-mono">
                  WHATSAPP {displayPhone(whatsapp)} <ArrowRight size={16} />
                </a>
              </div>

              <div className="pf-card-foot">
                <GhostMark className="pf-card-ghost" />
                <p className="pf-card-icons">
                  <ArrowRight /> <SquareDot /> <span className="pf-dot" /> <PixelStairs /> <BaselineIcon /> <CrossX />
                </p>
              </div>
            </div>
          </div>
        </div>
      </BarsReveal>

      <footer className="pf-footer pf-mono">
        <span>© 2026 REDGHOST — DESARROLLO WEB FREELANCE</span>
        <Link href="/">ENTRAR A REDGHOST.OS [+]</Link>
      </footer>
    </>
  );
}
