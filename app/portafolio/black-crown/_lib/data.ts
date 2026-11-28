// Black Crown Barber Club — fictional client for the portfolio. Prices in MXN.

export const BASE = "/portafolio/black-crown";
const IMG = "/portafolio/black-crown";

export const NEGOCIO = {
  nombre: "Black Crown Barber Club",
  eslogan: "Tu estilo. Tus reglas.",
  fundada: 2024,
  whatsapp: "521234", // demo number, not a real line
  telefono: "+52 311 000 0000",
  direccion: "Av. México 210, Centro",
  ciudad: "Tepic, Nayarit",
  cp: "63000",
  mapa: "Av. México, Centro, Tepic, Nayarit",
  instagram: "blackcrown.demo",
};

export const waLink = (texto: string) => `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`;
export const precio = (n: number) => `$${n.toLocaleString("es-MX")}`;

export interface Servicio { id: string; nombre: string; precio: number; minutos: number; desc: string; destacado?: boolean }

export const SERVICIOS: Servicio[] = [
  { id: "clasico", nombre: "Corte clásico", precio: 150, minutos: 40, desc: "Tijera y máquina, lavado y peinado con producto. El corte de siempre, bien hecho." },
  { id: "fade", nombre: "Fade / Degradado", precio: 180, minutos: 45, desc: "Bajo, medio o alto. Transición limpia y contorno marcado a navaja." },
  { id: "corte-barba", nombre: "Corte + barba", precio: 250, minutos: 60, desc: "Corte a elección y arreglo de barba con toalla caliente." },
  { id: "barba", nombre: "Perfilado de barba", precio: 100, minutos: 25, desc: "Forma, volumen y líneas definidas. Termina con aceite para barba." },
  { id: "ceja", nombre: "Diseño de ceja", precio: 50, minutos: 15, desc: "Limpieza y forma natural, o con línea si la quieres marcada." },
  { id: "infantil", nombre: "Corte infantil", precio: 120, minutos: 30, desc: "Hasta 12 años. Paciencia incluida." },
  {
    id: "experiencia",
    nombre: "Experiencia Black Crown",
    precio: 350,
    minutos: 75,
    desc: "Corte, arreglo de barba y asesoría de estilo: salimos del sillón con un plan para tu imagen.",
    destacado: true,
  },
];

export interface Barbero { id: string; nombre: string; rol: string; anios: number; foto: string }

export const BARBEROS: Barbero[] = [
  { id: "marco", nombre: "Marco Ibarra", rol: "Fundador · fades y diseño", anios: 9, foto: `${IMG}/corte-07.webp` },
  { id: "andres", nombre: "Andrés Tovar", rol: "Cortes clásicos y tijera", anios: 6, foto: `${IMG}/corte-02.webp` },
  { id: "kevin", nombre: "Kevin Solís", rol: "Barba y navaja", anios: 4, foto: `${IMG}/corte-01.webp` },
];

/** Day 0 = Sunday. Hours as minutes from midnight; null = closed. */
export const HORARIO: ({ abre: number; cierra: number } | null)[] = [
  { abre: 10 * 60, cierra: 15 * 60 }, // domingo
  null, // lunes
  { abre: 10 * 60, cierra: 20 * 60 },
  { abre: 10 * 60, cierra: 20 * 60 },
  { abre: 10 * 60, cierra: 20 * 60 },
  { abre: 10 * 60, cierra: 20 * 60 },
  { abre: 9 * 60, cierra: 20 * 60 }, // sábado
];

export const HORARIO_TEXTO = [
  { dias: "Lunes", horas: "Cerrado" },
  { dias: "Martes a viernes", horas: "10:00 – 20:00" },
  { dias: "Sábado", horas: "9:00 – 20:00" },
  { dias: "Domingo", horas: "10:00 – 15:00" },
];

export interface Foto { src: string; alt: string; autor: string; unsplash: string }

const f = (name: string, alt: string, autor: string, unsplash: string): Foto => ({ src: `${IMG}/${name}.webp`, alt, autor, unsplash });

export const FOTOS = {
  hero: f("hero", "Barbero perfilando la barba de un cliente en el sillón", "Allef Vinicius", "IvQeAVeJULw"),
  galeria: [
    f("corte-03", "Fade bajo hecho con máquina", "Tá Focando", "YDOc9F6HUFA"),
    f("corte-01", "Afeitado de barba en blanco y negro", "Arthur Humeau", "Twd3yaqA2NM"),
    f("corte-04", "Diseño con línea sobre un fade", "Amritpal Singh", "wE-GAKR9WaY"),
    f("corte-07", "Barbero con navaja marcando el contorno", "Agustin Fernandez", "1Pmp9uxK8X8"),
    f("corte-05", "Corte texturizado con barba perfilada", "Hannah Skelly", "g5A9gO59ERU"),
    f("corte-09", "Degradado alto con máquina", "David Cano Soriano", "02yJ27pwyAs"),
    f("corte-08", "Barba larga perfilada", "Lesly Juarez", "RukI4qZGlQs"),
    f("corte-02", "Corte con máquina en la nuca", "Redd Francisco", "PDDvMlScofU"),
    f("corte-10", "Corte a tijera con peine", "Peter Vimalis", "CMt1rgM5Y0I"),
    f("corte-06", "Cliente con corte corto en la silla", "José Pinto", "yG0Z9OwXWks"),
  ],
  herramientas: [
    f("herramientas-01", "Estuche negro con tijeras, máquinas y peines", "YearOne", "2y4qGxu-4Do"),
    f("herramientas-02", "Herramientas de barbería sobre piel negra", "YearOne", "1vyT0nfGK3k"),
    f("herramientas-03", "Tijeras, peine y productos sobre pizarra", "Andrea Donato", "MNu0n-3BIKs"),
  ],
  interior: [
    f("interior-01", "Silla de barbero negra y plateada", "Joshua Lawrence", "dU6eE_j2My8"),
    f("interior-02", "Silla de barbero en piso de ajedrez", "Caio Coelho", "OOKPHqAICKA"),
    f("interior-03", "Interior de la barbería con sillón capitonado", "Redd Francisco", "BBGyxhtPpC0"),
  ],
};

export const TODAS_LAS_FOTOS: Foto[] = [FOTOS.hero, ...FOTOS.galeria, ...FOTOS.herramientas, ...FOTOS.interior];
