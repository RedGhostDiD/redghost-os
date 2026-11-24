import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import MonsterLoader from "./MonsterLoader";
import ScrollReveal from "./ScrollReveal";
import Link from "next/link";
import { whatsappLink } from "@/lib/portafolio";
import { SITE_CONFIG } from "@/lib/site-config";

// Demo data — generic on purpose.
const BRAND = "Monster Burger";
const WHATSAPP = "541234"; // +54 1234
const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const ORDER_LINK = waLink("¡Hola Monster Burger! Quiero hacer un pedido 🍔");

// Staggered pop: each element gets its own delay.
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// Block 3 · featured burgers. Demo names and prices.
const MENU = [
  {
    name: "La Clásica",
    desc: "Carne smash, cheddar, lechuga, tomate y cebolla morada en pan con sésamo.",
    price: "8.500",
    img: { src: "/portafolio/hamburguesas/menu-clasica.webp", w: 352, h: 285 },
    alt: "Hamburguesa clásica con queso, lechuga, tomate y cebolla morada",
  },
  {
    name: "La Doble Bestia",
    desc: "Doble carne, doble cheddar, tocino crocante, tomate y lechuga. Para hambre de monstruo.",
    price: "12.900",
    img: { src: "/portafolio/hamburguesas/menu-doble-bestia.webp", w: 780, h: 771 },
    alt: "Hamburguesa doble con cheddar, tocino, tomate y lechuga",
  },
  {
    name: "La Picante del Infierno",
    desc: "Carne smash, tocino ahumado, cheddar y salsa picante de la casa.",
    price: "10.900",
    img: { src: "/portafolio/hamburguesas/menu-picante.webp", w: 316, h: 274 },
    alt: "Hamburguesa con tocino, cheddar, tomate y lechuga",
  },
];

// Block 4 · full menu + combos. Demo data.
const CARTA = [
  {
    title: "Hamburguesas",
    items: [
      { name: "La Clásica", desc: "Smash, cheddar, lechuga, tomate y cebolla morada", price: "8.500" },
      { name: "La Doble Bestia", desc: "Doble carne, doble cheddar, tocino, tomate y lechuga", price: "12.900" },
      { name: "La Picante del Infierno", desc: "Tocino ahumado, cheddar y salsa picante", price: "10.900" },
      { name: "La Cheddar Monstruo", desc: "Triple cheddar fundido y cebolla caramelizada", price: "9.900" },
      { name: "La Veggie Peluda", desc: "Medallón de garbanzos, queso, rúcula y tomate", price: "9.200" },
      { name: "La Monstruito", desc: "Smash simple con queso, ideal para los peques", price: "6.500" },
    ],
  },
  {
    title: "Extras",
    items: [
      { name: "Papas monstruo", desc: "Con cheddar y tocino", price: "4.900" },
      { name: "Papas clásicas", desc: "Crocantes, con sal de la casa", price: "3.200" },
      { name: "Aros de cebolla", desc: "8 aros rebozados", price: "3.800" },
      { name: "Gaseosa", desc: "Lata 354 ml", price: "1.800" },
      { name: "Batido monstruoso", desc: "Chocolate, frutilla o vainilla", price: "4.500" },
    ],
  },
];

const COMBOS = [
  { name: "Combo Solo", includes: ["1 hamburguesa a elección", "Papas clásicas", "Gaseosa"], price: "12.900", note: "Para un monstruo" },
  { name: "Combo Dúo", includes: ["2 hamburguesas a elección", "Papas monstruo", "2 gaseosas"], price: "24.500", note: "El más pedido", hot: true },
  { name: "Combo Familia", includes: ["4 hamburguesas a elección", "2 papas grandes", "Aros de cebolla", "4 gaseosas"], price: "46.900", note: "Para la manada" },
];

// Block 5 · hours + delivery area. Demo data.
const HORARIOS = [
  { days: "Lunes", hours: "Cerrado", closed: true },
  { days: "Martes a jueves", hours: "19:00 – 23:30" },
  { days: "Viernes y sábado", hours: "19:00 – 01:00" },
  { days: "Domingo", hours: "12:00 – 16:00 · 19:00 – 23:30" },
];
const ZONAS = [
  { name: "Zona 1", range: "hasta 2 km", price: "Gratis", time: "20–30 min" },
  { name: "Zona 2", range: "de 2 a 4 km", price: "$1.500", time: "30–40 min" },
  { name: "Zona 3", range: "de 4 a 6 km", price: "$2.500", time: "40–50 min" },
];
const ADDRESS = "Av. Monstruo 1234, Ciudad Demo";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: BRAND,
  servesCuisine: "Hamburguesas",
  telephone: `+${WHATSAPP}`,
  priceRange: "$$",
  acceptsReservations: false,
  address: { "@type": "PostalAddress", streetAddress: "Av. Monstruo 1234", addressLocality: "Ciudad Demo", addressCountry: "AR" },
  openingHours: ["Tu-Th 19:00-23:30", "Fr-Sa 19:00-01:00", "Su 12:00-16:00", "Su 19:00-23:30"],
};

export default function MonsterBurgerPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* without JS there is no loader: show the hero right away */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>.mb-loader{display:none}.mb .mb-pop,.mb .mb-burger{animation-play-state:running!important}.mb .mb-reveal{opacity:1}.mb .mb-wave{translate:0 0}</style>",
        }}
      />
      <MonsterLoader />

      {/* ================= 1 · HERO ================= */}
      <section className="mb-hero" aria-labelledby="mb-title">
        <header className="mb-nav">
          <a href="#" className="mb-logo mb-pop" style={d(0.05)} aria-label={`${BRAND} — inicio`}>
            MONSTER<span>BURGER</span>
          </a>
          <nav className="mb-nav-actions" aria-label="Principal">
            <a href={ORDER_LINK} className="mb-btn mb-btn-solid mb-pop" style={d(0.15)} target="_blank" rel="noopener">
              Pedir
            </a>
            <a href="#menu" className="mb-btn mb-btn-ghost mb-pop" style={d(0.22)}>
              Menú <span className="mb-burger-icon" aria-hidden="true" />
            </a>
          </nav>
        </header>

        <div className="mb-stage">
          <h1 id="mb-title" className="mb-title">
            <span className="mb-word mb-word-1 mb-pop" style={d(0.35)}>Monster</span>{" "}
            <span className="mb-word mb-word-2 mb-pop" style={d(1.05)}>Burger</span>
          </h1>

          <figure className="mb-burger">
            <Image
              src="/portafolio/hamburguesas/hamburguesa.webp"
              alt="Hamburguesa doble con queso cheddar, tocino, tomate y lechuga"
              width={782}
              height={772}
              priority
              sizes="(max-width: 720px) 80vw, 40vw"
              className="mb-burger-img"
            />
            <span className="mb-monster mb-pop" style={d(1.35)}>
              <Image
                src="/portafolio/hamburguesas/monstruo.webp"
                alt=""
                width={1273}
                height={1223}
                sizes="(max-width: 720px) 60vw, 28vw"
                className="mb-monster-img"
              />
            </span>
          </figure>

          <p className="mb-sticker mb-sticker-1 mb-pop" style={d(0.75)} aria-hidden="true">
            Smash<br />al rojo
          </p>
          <p className="mb-sticker mb-sticker-2 mb-pop" style={d(0.9)} aria-hidden="true">
            Sabor<br />monstruoso
          </p>

          <p className="mb-copy mb-copy-l mb-pop" style={d(1.5)}>
            Aplastada al rojo vivo en la plancha: carne 100% de res que guarda todo su jugo bajo una costra caramelizada.
          </p>
          <p className="mb-copy mb-copy-r mb-pop" style={d(1.6)}>
            Con cheddar fundido y nuestra salsa secreta de la casa. Tan buena que hasta los monstruos hacen fila.
          </p>
        </div>
      </section>

      {/* Blocks 2 and 3 share a wrapper: block 2 sticks in place while the red
          block 3 (with its waves) scrolls up over it. */}
      <div className="mb-cover">
      {/* ================= 2 · LA FAVORITA ================= */}
      <section className="mb-fav" aria-labelledby="mb-fav-title">
        <p className="mb-fav-tag mb-reveal" style={d(0)}>La favorita</p>
        <h2 id="mb-fav-title" className="mb-fav-title">
          {["Jugosa", "quesosa", "bien", "cargada"].map((w, i) => (
            <Fragment key={w}>
              {i === 2 && <span className="mb-fav-break" aria-hidden="true" />}
              <span className="mb-fav-word mb-reveal" style={d(0.15 + i * 0.14)}>
                {w}
              </span>{" "}
            </Fragment>
          ))}
        </h2>
        <p className="mb-fav-copy mb-reveal" style={d(0.8)}>
          Monster Burger vuelve más monstruosa que nunca. Fiel a la receta de la casa, te traemos la smash
          definitiva: bien cargada, calientita y hecha al momento.
        </p>
        <a href={ORDER_LINK} className="mb-blob-btn mb-reveal" style={d(0.95)} target="_blank" rel="noopener">
          Pedir ahora
        </a>
      </section>

      {/* ================= 3 · DESTACADAS ================= */}
      <section id="destacadas" className="mb-menu" aria-labelledby="mb-menu-title">
        {/* waves rise and paint the page red from here on */}
        <div className="mb-waves" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <svg key={n} className={`mb-wave mb-wave-${n}`} viewBox="0 0 2880 160" preserveAspectRatio="none">
              <path d="M0 60 C240 10 480 10 720 60 S1200 110 1440 60 S1920 10 2160 60 S2640 110 2880 60 V160 H0 Z" />
            </svg>
          ))}
        </div>
        <p className="mb-fav-tag mb-reveal" style={d(0)}>Destacadas</p>
        <h2 id="mb-menu-title" className="mb-menu-title mb-reveal" style={d(0.12)}>
          Las más pedidas
        </h2>
        <ul className="mb-menu-list">
          {MENU.map((b, i) => (
            <li key={b.name} className="mb-card mb-reveal" style={d(0.2 + i * 0.15)}>
              <figure className="mb-card-photo mb-reveal" style={d(0.45 + i * 0.15)}>
                <Image
                  src={b.img.src}
                  alt={b.alt}
                  width={b.img.w}
                  height={b.img.h}
                  sizes="(max-width: 720px) 80vw, 28vw"
                  className="mb-card-img"
                />
              </figure>
              <p className="mb-card-price" aria-label={`Precio: $${b.price}`}>
                <small>$</small>
                {b.price}
              </p>
              <h3 className="mb-card-name">{b.name}</h3>
              <p className="mb-card-desc">{b.desc}</p>
              <a
                href={waLink(`¡Hola Monster Burger! Quiero una ${b.name.replace(/^La /, "")} 🍔`)}
                className="mb-card-btn"
                target="_blank"
                rel="noopener"
                aria-label={`Pedir ${b.name} por WhatsApp`}
              >
                Pedir esta
              </a>
            </li>
          ))}
        </ul>
      </section>
      </div>

      {/* ================= 4 · MENÚ + COMBOS ================= */}
      <section id="menu" className="mb-carta" aria-labelledby="mb-carta-title">
        <svg className="mb-carta-edge" viewBox="0 0 2880 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 H2880 V60 C2640 110 2400 110 2160 60 S1680 10 1440 60 S960 110 720 60 S240 10 0 60 Z" />
        </svg>
        <p className="mb-fav-tag mb-reveal" style={d(0)}>La carta</p>
        <h2 id="mb-carta-title" className="mb-carta-title mb-reveal" style={d(0.12)}>
          Menú
        </h2>

        <div className="mb-carta-cols">
          {CARTA.map((group, g) => (
            <div key={group.title} className="mb-carta-group mb-reveal" style={d(0.2 + g * 0.15)}>
              <h3 className="mb-carta-group-title">{group.title}</h3>
              <ul className="mb-carta-list">
                {group.items.map((it) => (
                  <li key={it.name} className="mb-carta-item">
                    <span className="mb-carta-name">{it.name}</span>
                    <span className="mb-carta-dots" aria-hidden="true" />
                    <span className="mb-carta-price">${it.price}</span>
                    <span className="mb-carta-desc">{it.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mb-combos-title mb-reveal" style={d(0)}>Combos</h3>
        <ul className="mb-combos">
          {COMBOS.map((c, i) => (
            <li key={c.name} className={`mb-combo mb-reveal${c.hot ? " is-hot" : ""}`} style={d(0.1 + i * 0.15)}>
              <p className="mb-combo-note">{c.note}</p>
              <h4 className="mb-combo-name">{c.name}</h4>
              <ul className="mb-combo-includes">
                {c.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="mb-combo-price">${c.price}</p>
              <a
                href={waLink(`¡Hola Monster Burger! Quiero un ${c.name} 🍔🍟`)}
                className="mb-card-btn"
                target="_blank"
                rel="noopener"
                aria-label={`Pedir ${c.name} por WhatsApp`}
              >
                Pedir combo
              </a>
            </li>
          ))}
        </ul>
        <p className="mb-carta-foot">Precios de ejemplo en pesos argentinos. Consultá por envío a tu zona.</p>
      </section>

      {/* ================= 5 · HORARIOS + ENVÍOS ================= */}
      <section id="horarios" className="mb-info" aria-labelledby="mb-info-title">
        <svg className="mb-info-edge" viewBox="0 0 2880 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 H2880 V60 C2640 110 2400 110 2160 60 S1680 10 1440 60 S960 110 720 60 S240 10 0 60 Z" />
        </svg>
        <p className="mb-info-tag mb-reveal" style={d(0)}>Pedí sin salir</p>
        <h2 id="mb-info-title" className="mb-info-title mb-reveal" style={d(0.12)}>
          Horarios y envíos
        </h2>

        <div className="mb-info-cols">
          <div className="mb-info-card mb-reveal" style={d(0.2)}>
            <h3 className="mb-info-card-title">Horarios</h3>
            <dl className="mb-hours">
              {HORARIOS.map((h) => (
                <div key={h.days} className={`mb-hours-row${h.closed ? " is-closed" : ""}`}>
                  <dt>{h.days}</dt>
                  <dd>{h.hours}</dd>
                </div>
              ))}
            </dl>
            <p className="mb-info-address">
              <span aria-hidden="true">📍</span> {ADDRESS}
              <br />
              También podés retirar en el local.
            </p>
          </div>

          <div className="mb-info-card mb-reveal" style={d(0.35)}>
            <h3 className="mb-info-card-title">Zona de envío</h3>
            {/* the monster chomping a folded paper map of the delivery zones */}
            <div className="mb-map" aria-hidden="true">
              <svg viewBox="0 0 240 200" className="mb-map-svg">
                <defs>
                  <clipPath id="mb-map-paper">
                    <path d="M0 12 L80 0 L160 12 L240 0 V188 L160 200 L80 188 L0 200 Z" />
                  </clipPath>
                </defs>
                <g clipPath="url(#mb-map-paper)">
                  <path d="M0 12 L80 0 V188 L0 200 Z" className="mb-map-panel" />
                  <path d="M80 0 L160 12 V200 L80 188 Z" className="mb-map-panel is-dark" />
                  <path d="M160 12 L240 0 V188 L160 200 Z" className="mb-map-panel" />
                  <g className="mb-map-streets">
                    <path d="M0 60 H240 M0 130 H240 M50 0 V200 M120 0 V200 M190 0 V200" />
                    <path d="M0 175 L240 30" className="mb-map-avenue" />
                  </g>
                  <circle cx="120" cy="110" r="88" className="mb-zone mb-zone-3" />
                  <circle cx="120" cy="110" r="58" className="mb-zone mb-zone-2" />
                  <circle cx="120" cy="110" r="28" className="mb-zone mb-zone-1" />
                  <path d="M120 112 c-9 -12 -11 -16 -11 -21 a11 11 0 0 1 22 0 c0 5 -2 9 -11 21z" className="mb-map-pin" />
                  <circle cx="120" cy="91" r="4" fill="#fff" />
                </g>
                <path d="M0 12 L80 0 L160 12 L240 0 V188 L160 200 L80 188 L0 200 Z" className="mb-map-outline" />
              </svg>
              <span className="mb-map-monster">
                <Image src="/portafolio/hamburguesas/monstruo.webp" alt="" width={1273} height={1223} sizes="220px" />
              </span>
            </div>
            <ul className="mb-zones">
              {ZONAS.map((z, i) => (
                <li key={z.name} className="mb-zones-row">
                  <span className={`mb-zones-dot mb-zones-dot-${i + 1}`} aria-hidden="true" />
                  <span className="mb-zones-name">
                    {z.name} <small>{z.range} · {z.time}</small>
                  </span>
                  <span className="mb-zones-price">{z.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href={waLink("¡Hola Monster Burger! ¿Llegan a mi zona? Mi dirección es: ")}
          className="mb-blob-btn mb-reveal"
          style={d(0.5)}
          target="_blank"
          rel="noopener"
        >
          ¿Llegamos a tu casa?
        </a>
      </section>

      {/* ================= 6 · CRÉDITOS: QUIÉN HIZO ESTA PÁGINA ================= */}
      <footer className="mb-credits" aria-labelledby="mb-credits-title">
        <svg className="mb-credits-edge" viewBox="0 0 2880 160" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 H2880 V60 C2640 110 2400 110 2160 60 S1680 10 1440 60 S960 110 720 60 S240 10 0 60 Z" />
        </svg>
        <p className="mb-credits-tag mb-reveal" style={d(0)}>Esta página es una demo</p>
        <h2 id="mb-credits-title" className="mb-credits-title">
          <span className="mb-reveal" style={d(0.12)}>¿Quieres una</span>{" "}
          <span className="mb-reveal" style={d(0.26)}>página así?</span>
        </h2>
        <p className="mb-credits-copy mb-reveal" style={d(0.4)}>
          Monster Burger es una marca inventada. Diseñé y programé esta página yo, <strong>RedGhost</strong>, para mostrar
          lo que puedo hacer por tu negocio. Te hago una igual con tu marca o una totalmente diferente.
        </p>
        <div className="mb-credits-actions mb-reveal" style={d(0.55)}>
          <a
            href={whatsappLink("Hola RedGhost, vi la demo de Monster Burger y quiero una página para mi negocio.")}
            className="mb-blob-btn mb-credits-wa"
            target="_blank"
            rel="noopener noreferrer"
          >
            Escríbeme por WhatsApp
          </a>
          <a href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent("Quiero una página web")}`} className="mb-credits-link">
            {SITE_CONFIG.email}
          </a>
          <Link href="/portafolio" className="mb-credits-link">
            Ver mi portafolio →
          </Link>
        </div>
        <p className="mb-credits-foot">
          <span className="mb-logo">
            MONSTER<span>BURGER</span>
          </span>
          <span>Marca ficticia · Página hecha por RedGhost · {new Date().getFullYear()}</span>
        </p>
      </footer>

      <ScrollReveal />
    </main>
  );
}
