import Image from "next/image";
import Link from "next/link";
import { PORTFOLIO, PORTFOLIO_EN, approxUsd, formatPrice, whatsappLink } from "@/lib/portafolio";
import { SITE_CONFIG } from "@/lib/site-config";
import { getTunelPhotos } from "@/lib/tunel";
import BarsReveal from "@/components/portafolio/BarsReveal";
import Flicker from "@/components/portafolio/Flicker";
import T from "@/components/portafolio/Lang";
import LangToggle from "@/components/portafolio/LangToggle";
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
  // 523111076339 → +52 311 107 6339
  return n.length === 12 ? `+${n.slice(0, 2)} ${n.slice(2, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** A WhatsApp link per language: only the visible one is clickable. */
function WaLink({
  es,
  en,
  msgEs = whatsappLink(),
  msgEn = whatsappLink(PORTFOLIO_EN.whatsappMessage),
  className,
}: {
  es: React.ReactNode;
  en: React.ReactNode;
  msgEs?: string;
  msgEn?: string;
  className: string;
}) {
  return (
    <>
      <a data-l="es" href={msgEs} target="_blank" rel="noopener noreferrer" className={className}>{es}</a>
      <a data-l="en" href={msgEn} target="_blank" rel="noopener noreferrer" className={className}>{en}</a>
    </>
  );
}

export default function PortafolioPage() {
  const { projects, packages, currency, whatsapp, pricingNotes, payment, steps, support, supportNote, ownership } = PORTFOLIO;
  const EN = PORTFOLIO_EN;
  const feed = getTunelPhotos().filter((p) => p.src.startsWith("/")).slice(-3).reverse();

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="pf-hero">
        <div className="pf-hero-top">
          <p className="pf-mono">
            <span className="pf-sq" />{" "}
            <T es={<Flicker text="PORTAFOLIO — 2026" seed={1} />} en={<Flicker text="PORTFOLIO — 2026" seed={1} />} />
          </p>
          <div className="pf-hero-top-right pf-mono">
            <LangToggle />
            <Corner corner="tr" className="pf-dim" />
          </div>
        </div>

        <div className="pf-row pf-hero-mark">
          <div className="pf-rail" />
          <h1 className="pf-wordmark">
            <span className="sr-only">RedGhost</span>
            <span aria-hidden="true"><Flicker text="RΞD GHØST" seed={2} pick={[1, 4, 7]} /></span>
            <GhostMark className="pf-wordmark-ghost" eyes="var(--pf-ink)" />
          </h1>
        </div>

        <div className="pf-row pf-hero-info">
          <div className="pf-rail">
            <Corner corner="tl" className="pf-dim" />
            <p className="pf-mono">
              <T
                es={<><Flicker text="DESARROLLADOR WEB" seed={3} /><br /><Flicker text="INDEPENDIENTE EN MÉXICO." seed={4} /></>}
                en={<><Flicker text="INDEPENDENT WEB" seed={3} /><br /><Flicker text="DEVELOPER IN MEXICO." seed={4} /></>}
              />
            </p>
          </div>
          <div className="pf-hero-copy">
            <p className="pf-name"><Flicker text="RΞD GHØST studio" seed={5} /></p>
            <p className="pf-mono">
              <T
                es={<Flicker text="DISEÑO Y PROGRAMO PÁGINAS WEB, TIENDAS EN LÍNEA Y PANELES A LA MEDIDA PARA NEGOCIOS QUE QUIEREN VERSE EN SERIO." seed={6} every={6} />}
                en={<Flicker text="I DESIGN AND BUILD CUSTOM WEBSITES, ONLINE STORES AND ADMIN PANELS FOR BUSINESSES THAT WANT TO BE TAKEN SERIOUSLY." seed={6} every={6} />}
              />
            </p>
            <div className="pf-hairline"><PlusThin size={22} /></div>
          </div>
        </div>

        <nav className="pf-hero-nav pf-mono" aria-label="Secciones / Sections">
          <span className="pf-mini-ghost"><GhostMark /></span>
          <span className="pf-hero-links">
            <a href="#trabajos"><T es={<Flicker text="TRABAJOS" seed={7} />} en={<Flicker text="WORK" seed={7} />} /></a>,{" "}
            <a href="#paquetes"><T es={<Flicker text="PAQUETES" seed={8} />} en={<Flicker text="PACKAGES" seed={8} />} /></a>,{" "}
            <a href="#garantia"><T es={<Flicker text="GARANTÍA" seed={9} />} en={<Flicker text="GUARANTEE" seed={9} />} /></a>,{" "}
            <a href="#ethos"><Flicker text="ETHOS" seed={10} /></a>
          </span>
          <span className="pf-hero-clock"><LocalClock /> <span className="pf-dim">{"//"}</span></span>
          <a href="#contacto" className="pf-hero-contact">
            <T es={<Flicker text="CONTACTO" seed={11} />} en={<Flicker text="CONTACT" seed={11} />} />
          </a>
        </nav>
      </section>

      {/* ================= WORKS ================= */}
      <section id="trabajos" className="pf-section">
        <header className="pf-row pf-head">
          <div className="pf-rail"><span className="pf-sq" /></div>
          <div>
            <h2 className="pf-h2"><T es="trabajos" en="work" /></h2>
            <p className="pf-tags pf-mono">
              <PlusThin size={14} /> <StackIcon /> <TargetMark size={16} />{" "}
              <T es="ESTRATEGIA / DISEÑO / DESARROLLO" en="STRATEGY / DESIGN / DEVELOPMENT" />
            </p>
          </div>
        </header>

        <div className="pf-works">
          {projects.map((p, i) => {
            const en = EN.projects[p.slug];
            const live = p.status === "En línea";
            const card = (
              <div className="pf-work-img">
                <Image src={p.image} alt={p.name} fill sizes="(min-width: 900px) 33vw, 100vw" />
              </div>
            );
            return (
              <article key={p.slug} className={`pf-work pf-work-${i + 1}`}>
                <h3 className="pf-work-name">{p.name}</h3>
                <p className="pf-mono pf-dim pf-work-sum"><T es={p.summary} en={en?.summary ?? p.summary} /></p>
                <p className="pf-mono pf-work-kind">
                  <T es={p.kind.toUpperCase()} en={(en?.kind ?? p.kind).toUpperCase()} />{" "}
                  <span className={live ? "pf-live" : "pf-dim"}>
                    · <T es={p.status.toUpperCase()} en={(en?.status ?? p.status).toUpperCase()} />
                  </span>
                  {p.demo && <span className="pf-demo">DEMO</span>}
                </p>
                {live ? (
                  <a
                    href={p.url}
                    className="pf-work-link"
                    aria-label={p.name}
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
            <h2 className="pf-h2"><T es="paquetes" en="packages" /></h2>
            <p className="pf-tags pf-mono">
              <PixelStairs size={20} /> <BaselineIcon /> <CrossX size={14} />{" "}
              <T
                es={`PRECIOS DE REFERENCIA EN ${currency} / SE COTIZA A LA MEDIDA`}
                en={`REFERENCE PRICES IN ${currency} / EVERY PROJECT IS QUOTED`}
              />
            </p>
          </div>
        </header>

        <div className="pf-packages">
          {packages.map((pkg, i) => {
            const en = EN.packages[i] ?? pkg;
            return (
              <article key={pkg.name} className={`pf-pkg ${pkg.featured ? "is-featured" : ""}`}>
                <p className="pf-mono pf-pkg-top">
                  <span>P/{pad2(i + 1)}</span>
                  {pkg.featured && <span className="pf-red"><span className="pf-sq" /> <T es="RECOMENDADO" en="RECOMMENDED" /></span>}
                </p>
                <h3 className="pf-pkg-name"><T es={pkg.name} en={en.name} /></h3>
                <p className="pf-mono pf-dim pf-pkg-for"><T es={pkg.for} en={en.for} /></p>
                <p className="pf-price">
                  <span className="pf-mono"><T es="DESDE" en="FROM" /></span>
                  {formatPrice(pkg.price)}
                  <small className="pf-mono">{currency}</small>
                </p>
                <p className="pf-mono pf-usd" data-l="en">≈ {approxUsd(pkg.price)} USD</p>
                <ul className="pf-mono pf-pkg-list" data-l="es">
                  {pkg.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <ul className="pf-mono pf-pkg-list" data-l="en">
                  {en.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <p className="pf-mono pf-dim">
                  <T es={`ENTREGA: ${pkg.delivery.toUpperCase()}`} en={`DELIVERY: ${en.delivery.toUpperCase()}`} />
                </p>
                <WaLink
                  className="pf-mono pf-cta-link"
                  msgEs={whatsappLink(`Hola RedGhost, me interesa el paquete "${pkg.name}".`)}
                  msgEn={whatsappLink(`Hi RedGhost, I'm interested in the "${en.name}" package.`)}
                  es="LO QUIERO [+]"
                  en="I WANT IT [+]"
                />
              </article>
            );
          })}
        </div>

        <div className="pf-row pf-notes">
          <div className="pf-rail" />
          <div>
            <ul className="pf-mono pf-dim" data-l="es">
              {pricingNotes.map((n) => <li key={n}>{n}</li>)}
            </ul>
            <ul className="pf-mono pf-dim" data-l="en">
              {EN.pricingNotes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= GUARANTEE & SUPPORT ================= */}
      <section id="garantia" className="pf-section">
        <header className="pf-row pf-head">
          <div className="pf-rail"><span className="pf-sq" /></div>
          <div>
            <h2 className="pf-h2"><T es="garantía" en="guarantee" /></h2>
            <p className="pf-tags pf-mono">
              <TargetMark size={16} /> <PlusThin size={14} /> <SquareDot size={14} />{" "}
              <T es="PAGOS / GARANTÍA / SOPORTE" en="PAYMENTS / GUARANTEE / SUPPORT" />
            </p>
          </div>
        </header>

        <dl className="pf-model">
          <div><dt className="pf-mono pf-dim"><T es="ANTICIPO" en="DEPOSIT" /></dt><dd>{payment.deposit}%</dd></div>
          <div><dt className="pf-mono pf-dim"><T es="LIQUIDACIÓN" en="ON DELIVERY" /></dt><dd>{100 - payment.deposit}%</dd></div>
          <div><dt className="pf-mono pf-dim"><T es="DÍAS DE GARANTÍA" en="DAYS OF GUARANTEE" /></dt><dd className="pf-red">{payment.guaranteeDays}</dd></div>
          <div><dt className="pf-mono pf-dim"><T es="MANTENIMIENTO COTIZABLE" en="MAINTENANCE ON QUOTE" /></dt><dd>∞</dd></div>
        </dl>

        <div className="pf-support">
          {support.map((s, i) => {
            const en = EN.support[i] ?? s;
            return (
              <article key={s.title} className="pf-pkg">
                <p className="pf-mono pf-pkg-top">
                  <span>{pad2(i + 1)}</span>
                  <span className={i === 0 ? "pf-red" : undefined}><T es={s.tag.toUpperCase()} en={en.tag.toUpperCase()} /></span>
                </p>
                <h3 className="pf-pkg-name"><T es={s.title} en={en.title} /></h3>
                <p className="pf-mono pf-dim pf-pkg-for"><T es={s.text} en={en.text} /></p>
                <ul className="pf-mono pf-pkg-list" data-l="es">
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                <ul className="pf-mono pf-pkg-list" data-l="en">
                  {en.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </article>
            );
          })}
        </div>

        <div className="pf-row pf-notes">
          <div className="pf-rail" />
          <div>
            <p className="pf-ownership"><T es={ownership} en={EN.ownership} /></p>
            <ul className="pf-mono pf-dim">
              <li><T es={supportNote} en={EN.supportNote} /></li>
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
                <PixelStairs size={20} /> <PlusThin size={14} /> <CrossX size={14} />{" "}
                <T es="FOTOGRAFÍA / ARCHIVO / TÚNEL" en="PHOTOGRAPHY / ARCHIVE / TÚNEL" />
              </p>
              <p className="pf-mono pf-dim pf-feed-text">
                <T
                  es="FOTOS PROPIAS, REVELADAS DESDE RAW EN EL NAVEGADOR Y ORDENADAS EN UN ARCHIVO QUE SE RECORRE COMO UN TÚNEL."
                  en="MY OWN PHOTOS, DEVELOPED FROM RAW IN THE BROWSER AND SORTED INTO AN ARCHIVE YOU TRAVEL THROUGH LIKE A TUNNEL."
                />
              </p>
              <Link href="/tunel" className="pf-mono pf-cta-link"><T es="VER ARCHIVO [+]" en="VIEW ARCHIVE [+]" /></Link>
            </div>
            <Link href="/tunel" className="pf-feed-stack" aria-label="Túnel">
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
              <StackIcon /> <PlusThin size={14} /> <SquareDot size={14} />{" "}
              <T es="PROPÓSITO / PRECISIÓN / OFICIO" en="PURPOSE / PRECISION / CRAFT" />
            </p>
            <p className="pf-ethos-text">
              <T
                es="Una página web no es un folleto: es la primera conversación con tu cliente. Por eso cada sitio se programa a la medida, carga al instante y lo puedes editar tú, sin depender de nadie. Hablas directo con quien escribe el código."
                en="A website isn't a brochure: it's the first conversation with your customer. That's why every site is built to measure, loads instantly and you can edit it yourself, without depending on anyone. You talk directly to the person writing the code."
              />
            </p>
          </div>
        </header>

        <div className="pf-row">
          <div className="pf-rail" />
          <ol className="pf-steps">
            {steps.map((s, i) => {
              const en = EN.steps[i] ?? s;
              return (
                <li key={s.title}>
                  <p className="pf-mono pf-red">{pad2(i + 1)}</p>
                  <h3><T es={s.title} en={en.title} /></h3>
                  <p className="pf-mono pf-dim"><T es={s.text} en={en.text} /></p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="pf-row">
          <div className="pf-rail" />
          <div>
            <WaLink className="pf-mono pf-cta-link pf-ethos-cta" es="COTIZAR POR WHATSAPP [+]" en="GET A QUOTE ON WHATSAPP [+]" />
          </div>
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
            <p className="pf-mono pf-panel-ver"><span className="pf-sq" /> <T es="CONTACTO — MX" en="CONTACT — MX" /></p>

            <div className="pf-panel-lists pf-mono">
              <div>
                <p className="pf-faint">[ NAV ]</p>
                <p>
                  <a href="#trabajos"><T es="TRABAJOS" en="WORK" /></a>,<br />
                  <a href="#paquetes"><T es="PAQUETES" en="PACKAGES" /></a>,<br />
                  <a href="#garantia"><T es="GARANTÍA" en="GUARANTEE" /></a>,<br />
                  <a href="#ethos">ETHOS</a>,<br />
                  <Link href="/">REDGHOST.OS</Link>
                </p>
              </div>
              <div>
                <p className="pf-faint"><T es="[ REDES ]" en="[ SOCIAL ]" /></p>
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
            <h2 className="pf-contact-title"><T es="contacto;" en="contact;" /></h2>
            <a href={`mailto:${SITE_CONFIG.email}`} className="pf-email">{SITE_CONFIG.email}</a>
            <WaLink className="pf-email" es={displayPhone(whatsapp)} en={displayPhone(whatsapp)} />
            <p className="pf-contact-icons">
              <StackIcon /> <BaselineIcon /> <ArrowUpRight />
            </p>

            <div className="pf-card">
              <div className="pf-card-head pf-mono">
                <span><T es={<>PROYECTOS<br />CON PROPÓSITO</>} en={<>PROJECTS<br />WITH PURPOSE</>} /></span>
                <CrossX size={22} />
                <span><T es={<>SISTEMAS<br />A LA MEDIDA</>} en={<>CUSTOM-BUILT<br />SYSTEMS</>} /></span>
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
                <WaLink
                  className="pf-card-wa pf-mono"
                  es={<>WHATSAPP {displayPhone(whatsapp)} <ArrowRight size={16} /></>}
                  en={<>WHATSAPP {displayPhone(whatsapp)} <ArrowRight size={16} /></>}
                />
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
        <span><T es="© 2026 REDGHOST — DESARROLLO WEB FREELANCE" en="© 2026 REDGHOST — FREELANCE WEB DEVELOPMENT" /></span>
        <LangToggle />
        <Link href="/"><T es="ENTRAR A REDGHOST.OS [+]" en="ENTER REDGHOST.OS [+]" /></Link>
      </footer>
    </>
  );
}
