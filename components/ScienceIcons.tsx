// Hand-drawn SVG objects for the science activities. The stage data still labels
// each item with an emoji (so the data stays readable), but on screen we draw the
// real thing — a watering can is a watering can, not a bucket. `ObjIcon` resolves
// the emoji+label to one of these drawings, falling back to the emoji only for
// anything not yet drawn.
import type { ReactNode } from 'react'

const P = {
  green: '#5FB85F',
  greenD: '#3c8b3c',
  greenL: '#8fd08f',
  brown: '#a56a34',
  brownD: '#7b4f26',
  blue: '#4E8FC5',
  blueD: '#2f6fa3',
  water: '#7ec8e3',
  red: '#e2596b',
  redD: '#c0384a',
  yellow: '#f7c94b',
  yellowD: '#d9a72c',
  orange: '#ff9040',
  grey: '#9aa4b0',
  greyD: '#5f6b78',
  pink: '#ef9ab4',
  pinkD: '#d1567f',
  purple: '#9b72cf',
  white: '#fff',
  skin: '#f2b48c',
  night: '#3a4a7a',
} as const

// Every icon draws into a 0 0 48 48 box, centred on (24,24).
const ICONS: Record<string, ReactNode> = {
  // ---- tools & stuff ----
  wateringCan: (
    <>
      <path d="M15 22 h16 a2 2 0 0 1 2 2 l-1.5 11 a3 3 0 0 1 -3 2.6 h-11 a3 3 0 0 1 -3 -2.6 l-1.5 -11 a2 2 0 0 1 2 -2 z" fill={P.blue} stroke={P.blueD} strokeWidth="2" />
      <path d="M17 22 q7 -9 14 -2" fill="none" stroke={P.blueD} strokeWidth="3" strokeLinecap="round" />
      <path d="M31 26 q7 -1 6 7" fill="none" stroke={P.blueD} strokeWidth="3" strokeLinecap="round" />
      <path d="M15 27 L5 20" stroke={P.blueD} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="5" cy="18.5" rx="4.5" ry="2.4" transform="rotate(-32 5 18.5)" fill={P.grey} stroke={P.greyD} strokeWidth="1.5" />
      <g stroke={P.water} strokeWidth="1.8" strokeLinecap="round">
        <line x1="3" y1="16" x2="1.5" y2="12" />
        <line x1="6" y1="15" x2="5" y2="11" />
        <line x1="8.5" y1="16" x2="8.5" y2="12" />
      </g>
    </>
  ),
  water: (
    <path d="M24 8 C24 8 12 24 12 32 a12 12 0 0 0 24 0 C36 24 24 8 24 8 Z" fill={P.water} stroke={P.blueD} strokeWidth="2" />
  ),
  air: (
    <g fill="none" stroke={P.greyD} strokeWidth="3" strokeLinecap="round">
      <path d="M8 18 h20 a5 5 0 1 0 -5 -5" />
      <path d="M6 26 h26 a5 5 0 1 1 -5 5" />
      <path d="M10 34 h14" opacity="0.7" />
    </g>
  ),
  food: (
    <>
      <path d="M24 10 L38 36 a2 2 0 0 1 -1.8 2.8 H11.8 A2 2 0 0 1 10 36 Z" fill={P.white} stroke={P.yellowD} strokeWidth="2" />
      <rect x="19" y="26" width="10" height="9" rx="1.5" fill={P.night} />
    </>
  ),
  stone: (
    <path d="M10 30 l6 -12 12 -3 10 8 -2 12 -14 4 -12 -5 Z" fill={P.grey} stroke={P.greyD} strokeWidth="2" strokeLinejoin="round" />
  ),
  blood: (
    <path d="M24 9 C24 9 13 24 13 32 a11 11 0 0 0 22 0 C35 24 24 9 24 9 Z" fill={P.red} stroke={P.redD} strokeWidth="2" />
  ),

  // ---- plants ----
  seed: (
    <>
      <ellipse cx="24" cy="26" rx="10" ry="13" fill={P.brown} stroke={P.brownD} strokeWidth="2" />
      <path d="M24 15 q6 8 0 20" fill="none" stroke={P.brownD} strokeWidth="1.6" opacity="0.6" />
    </>
  ),
  sprout: (
    <>
      <line x1="24" y1="40" x2="24" y2="22" stroke={P.greenD} strokeWidth="3" strokeLinecap="round" />
      <path d="M24 26 C14 26 12 16 12 16 C22 16 24 26 24 26 Z" fill={P.green} stroke={P.greenD} strokeWidth="1.6" />
      <path d="M24 24 C34 24 36 14 36 14 C26 14 24 24 24 24 Z" fill={P.greenL} stroke={P.greenD} strokeWidth="1.6" />
    </>
  ),
  leaves: (
    <>
      <line x1="24" y1="40" x2="24" y2="18" stroke={P.greenD} strokeWidth="3" strokeLinecap="round" />
      <path d="M24 30 C13 30 11 20 11 20 C22 20 24 30 24 30 Z" fill={P.green} stroke={P.greenD} strokeWidth="1.5" />
      <path d="M24 24 C35 24 37 14 37 14 C26 14 24 24 24 24 Z" fill={P.green} stroke={P.greenD} strokeWidth="1.5" />
      <path d="M24 20 C16 16 18 8 18 8 C26 10 24 20 24 20 Z" fill={P.greenL} stroke={P.greenD} strokeWidth="1.5" />
    </>
  ),
  bud: (
    <>
      <line x1="24" y1="42" x2="24" y2="24" stroke={P.greenD} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 12 C14 22 20 26 24 26 C28 26 34 22 30 12 C28 18 20 18 18 12 Z" fill={P.green} stroke={P.greenD} strokeWidth="1.6" />
      <circle cx="24" cy="12" r="6" fill={P.yellow} stroke={P.yellowD} strokeWidth="1.6" />
    </>
  ),
  sunflower: (
    <>
      <line x1="24" y1="44" x2="24" y2="26" stroke={P.greenD} strokeWidth="3" strokeLinecap="round" />
      <g fill={P.yellow} stroke={P.yellowD} strokeWidth="1.2">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2
          return <ellipse key={i} cx={24 + Math.cos(a) * 11} cy={20 + Math.sin(a) * 11} rx="4" ry="2.4" transform={`rotate(${(a * 180) / Math.PI} ${24 + Math.cos(a) * 11} ${20 + Math.sin(a) * 11})`} />
        })}
      </g>
      <circle cx="24" cy="20" r="7" fill={P.brown} stroke={P.brownD} strokeWidth="1.5" />
    </>
  ),
  hibiscus: (
    <>
      <g fill={P.red} stroke={P.redD} strokeWidth="1.4">
        {Array.from({ length: 5 }).map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2
          return <ellipse key={i} cx={24 + Math.cos(a) * 9} cy={22 + Math.sin(a) * 9} rx="6.5" ry="4.5" transform={`rotate(${(a * 180) / Math.PI + 90} ${24 + Math.cos(a) * 9} ${22 + Math.sin(a) * 9})`} />
        })}
      </g>
      <circle cx="24" cy="22" r="4" fill={P.yellow} stroke={P.yellowD} strokeWidth="1.2" />
      <line x1="24" y1="44" x2="24" y2="30" stroke={P.greenD} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  tulip: (
    <>
      <line x1="24" y1="44" x2="24" y2="24" stroke={P.greenD} strokeWidth="3" strokeLinecap="round" />
      <path d="M30 20 C30 12 24 22 24 22 C24 22 18 12 18 20 C16 12 24 8 24 8 C24 8 32 12 30 20 Z" fill={P.pink} stroke={P.pinkD} strokeWidth="1.6" />
      <path d="M24 34 C24 34 14 32 14 24 C22 26 24 34 24 34 Z" fill={P.green} stroke={P.greenD} strokeWidth="1.4" />
    </>
  ),
  sakura: (
    <g stroke={P.pinkD} strokeWidth="1.4">
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        return <path key={i} d="M24 24 C18 18 20 8 24 10 C28 8 30 18 24 24 Z" fill={P.pink} transform={`rotate(${(a * 180) / Math.PI + 90} 24 24)`} />
      })}
      <circle cx="24" cy="24" r="3" fill={P.yellow} stroke="none" />
    </g>
  ),
  tree: (
    <>
      <rect x="21" y="28" width="6" height="14" rx="2" fill={P.brown} stroke={P.brownD} strokeWidth="1.5" />
      <circle cx="24" cy="20" r="13" fill={P.green} stroke={P.greenD} strokeWidth="2" />
      <circle cx="16" cy="24" r="8" fill={P.greenL} stroke={P.greenD} strokeWidth="1.5" />
      <circle cx="32" cy="24" r="8" fill={P.greenL} stroke={P.greenD} strokeWidth="1.5" />
    </>
  ),
  pine: (
    <>
      <rect x="22" y="36" width="4" height="8" fill={P.brown} stroke={P.brownD} strokeWidth="1.2" />
      <path d="M24 6 L34 22 H14 Z" fill={P.greenD} stroke={P.greenD} strokeWidth="1.4" />
      <path d="M24 16 L37 36 H11 Z" fill={P.green} stroke={P.greenD} strokeWidth="1.4" />
    </>
  ),
  fruit: (
    <>
      <path d="M14 34 C10 24 16 14 26 12 C34 22 30 34 20 38 C17 37 15 36 14 34 Z" fill={P.green} stroke={P.greenD} strokeWidth="2" />
      <line x1="26" y1="12" x2="30" y2="8" stroke={P.greenD} strokeWidth="2.5" strokeLinecap="round" />
      <g stroke={P.greenL} strokeWidth="1.4">
        <path d="M18 30 q6 -6 10 -12" fill="none" />
        <path d="M15 25 q6 -5 9 -9" fill="none" />
      </g>
    </>
  ),
  maple: (
    <>
      <path d="M24 8 l4 8 8 -3 -4 7 6 3 -7 2 2 8 -7 -4 -2 6 -2 -6 -7 4 2 -8 -7 -2 6 -3 -4 -7 8 3 z" fill={P.orange} stroke={P.redD} strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="24" y1="30" x2="24" y2="42" stroke={P.brownD} strokeWidth="2" />
    </>
  ),
  fallenLeaf: (
    <>
      <path d="M12 30 C12 18 24 12 36 16 C36 30 24 36 12 30 Z" fill={P.orange} stroke={P.brownD} strokeWidth="1.6" />
      <path d="M14 29 L34 18" stroke={P.brownD} strokeWidth="1.6" />
      <g stroke={P.brownD} strokeWidth="1"><path d="M20 26 l4 -6" /><path d="M26 24 l3 -5" /></g>
    </>
  ),
  leaf: (
    <>
      <path d="M14 34 C10 18 26 10 38 12 C38 28 24 38 14 34 Z" fill={P.green} stroke={P.greenD} strokeWidth="2" />
      <path d="M16 32 L36 14" stroke={P.greenD} strokeWidth="1.6" />
    </>
  ),
  clover: (
    <>
      <g fill={P.green} stroke={P.greenD} strokeWidth="1.4">
        <path d="M24 22 C24 14 16 12 16 18 C10 16 12 24 24 22 Z" />
        <path d="M24 22 C24 14 32 12 32 18 C38 16 36 24 24 22 Z" />
        <path d="M24 22 C16 22 12 30 18 30 C16 36 24 34 24 22 Z" />
      </g>
      <line x1="24" y1="24" x2="24" y2="42" stroke={P.greenD} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  rice: (
    <g stroke={P.greenD} strokeWidth="2" strokeLinecap="round" fill="none">
      <path d="M24 42 V16" stroke={P.brown} />
      <path d="M24 20 q-8 -3 -12 -9" />
      <path d="M24 24 q8 -3 12 -9" />
      <path d="M24 28 q-8 -3 -11 -8" />
      <path d="M24 32 q8 -3 11 -8" />
    </g>
  ),

  // ---- sky & weather ----
  sun: (
    <>
      <g stroke={P.yellowD} strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return <line key={i} x1={24 + Math.cos(a) * 13} y1={24 + Math.sin(a) * 13} x2={24 + Math.cos(a) * 20} y2={24 + Math.sin(a) * 20} />
        })}
      </g>
      <circle cx="24" cy="24" r="12" fill={P.yellow} stroke={P.yellowD} strokeWidth="2" />
    </>
  ),
  moon: (
    <path d="M32 8 A16 16 0 1 0 40 30 A12 12 0 1 1 32 8 Z" fill={P.yellow} stroke={P.yellowD} strokeWidth="2" />
  ),
  star: (
    <path d="M24 6 l5.3 11 12 1.6 -8.9 8.1 2.4 11.9 -10.8 -6 -10.8 6 2.4 -11.9 -8.9 -8.1 12 -1.6 z" fill={P.yellow} stroke={P.yellowD} strokeWidth="1.6" strokeLinejoin="round" />
  ),
  starBright: (
    <>
      <path d="M24 5 l5.6 11.4 12.6 1.8 -9.1 8.9 2.2 12.5 -11.3 -6 -11.3 6 2.2 -12.5 -9.1 -8.9 12.6 -1.8 z" fill="#ffe27a" stroke={P.yellowD} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="24" cy="22" r="3" fill={P.white} opacity="0.8" />
    </>
  ),
  starSmall: (
    <path d="M24 14 l3 7 7.5 1 -5.5 5 1.4 7.4 -6.4 -3.6 -6.4 3.6 1.4 -7.4 -5.5 -5 7.5 -1 z" fill={P.yellow} stroke={P.yellowD} strokeWidth="1.2" strokeLinejoin="round" />
  ),
  cloud: (
    <path d="M14 34 a8 8 0 0 1 0 -16 a10 10 0 0 1 19 -3 a7 7 0 0 1 1 19 Z" fill={P.white} stroke={P.grey} strokeWidth="2" strokeLinejoin="round" />
  ),
  cloudDark: (
    <path d="M14 34 a8 8 0 0 1 0 -16 a10 10 0 0 1 19 -3 a7 7 0 0 1 1 19 Z" fill={P.greyD} stroke="#3f4954" strokeWidth="2" strokeLinejoin="round" />
  ),
  cloudWhite: (
    <>
      <circle cx="34" cy="16" r="7" fill={P.yellow} stroke={P.yellowD} strokeWidth="1.6" />
      <path d="M12 36 a7 7 0 0 1 0 -14 a9 9 0 0 1 17 -2 a6 6 0 0 1 1 16 Z" fill={P.white} stroke={P.grey} strokeWidth="2" />
    </>
  ),
  rain: (
    <>
      <path d="M14 26 a7 7 0 0 1 0 -14 a9 9 0 0 1 17 -2 a6 6 0 0 1 1 16 Z" fill={P.grey} stroke={P.greyD} strokeWidth="2" />
      <g stroke={P.blue} strokeWidth="2.4" strokeLinecap="round"><line x1="17" y1="32" x2="15" y2="40" /><line x1="24" y1="32" x2="22" y2="42" /><line x1="31" y1="32" x2="29" y2="40" /></g>
    </>
  ),
  lightning: (
    <path d="M26 4 L12 26 h9 l-4 18 18 -24 h-10 l6 -16 z" fill={P.yellow} stroke={P.yellowD} strokeWidth="1.6" strokeLinejoin="round" />
  ),
  snow: (
    <g stroke={P.blue} strokeWidth="2.4" strokeLinecap="round">
      <line x1="24" y1="8" x2="24" y2="40" /><line x1="10" y1="24" x2="38" y2="24" />
      <line x1="14" y1="14" x2="34" y2="34" /><line x1="34" y1="14" x2="14" y2="34" />
    </g>
  ),
  typhoon: (
    <g fill="none" stroke={P.blueD} strokeWidth="3.4" strokeLinecap="round">
      <path d="M24 24 C14 24 12 12 24 12 C40 12 40 36 24 36" />
      <path d="M24 24 C34 24 36 36 24 36 C8 36 8 12 24 12" opacity="0.55" />
      <circle cx="24" cy="24" r="2.5" fill={P.blueD} stroke="none" />
    </g>
  ),

  // ---- animals & bugs ----
  bee: (
    <>
      <ellipse cx="26" cy="26" rx="12" ry="9" fill={P.yellow} stroke={P.brownD} strokeWidth="2" />
      <g fill={P.brownD}><path d="M22 18 h5 v16 h-5 z" opacity="0.9" /><path d="M31 20 v12 h-3 v-12 z" /></g>
      <ellipse cx="16" cy="22" rx="7" ry="5" fill={P.white} stroke={P.grey} strokeWidth="1.4" opacity="0.85" transform="rotate(-20 16 22)" />
      <ellipse cx="36" cy="24" rx="4" ry="4" fill={P.brownD} />
      <circle cx="38" cy="22" r="1.4" fill={P.white} />
    </>
  ),
  ladybug: (
    <>
      <ellipse cx="24" cy="26" rx="12" ry="11" fill={P.red} stroke={P.redD} strokeWidth="2" />
      <path d="M24 15 V37" stroke="#2a1a1a" strokeWidth="1.6" />
      <circle cx="24" cy="14" r="5" fill="#2a1a1a" />
      <g fill="#2a1a1a"><circle cx="18" cy="22" r="2" /><circle cx="30" cy="22" r="2" /><circle cx="17" cy="30" r="2" /><circle cx="31" cy="30" r="2" /></g>
    </>
  ),
  butterfly: (
    <>
      <g fill={P.orange} stroke={P.brownD} strokeWidth="1.6">
        <path d="M24 24 C10 8 6 22 14 24 C6 28 12 40 24 24 Z" />
        <path d="M24 24 C38 8 42 22 34 24 C42 28 36 40 24 24 Z" />
      </g>
      <rect x="23" y="14" width="2.6" height="22" rx="1.3" fill="#3a2a1a" />
      <path d="M24 14 q-3 -5 -6 -6 M24 14 q3 -5 6 -6" fill="none" stroke="#3a2a1a" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  grasshopper: (
    <>
      <path d="M8 26 q16 -4 30 -2" fill="none" stroke={P.greenD} strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="28" cy="24" rx="12" ry="6" fill={P.green} stroke={P.greenD} strokeWidth="1.8" transform="rotate(-8 28 24)" />
      <circle cx="38" cy="21" r="4" fill={P.green} stroke={P.greenD} strokeWidth="1.5" />
      <circle cx="39" cy="20" r="1.3" fill="#2a2a2a" />
      <path d="M22 26 L16 40 M28 26 L26 40" stroke={P.greenD} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </>
  ),
  beetle: (
    <>
      <ellipse cx="24" cy="28" rx="11" ry="12" fill="#4a3524" stroke="#2a1c12" strokeWidth="2" />
      <path d="M24 16 V40" stroke="#2a1c12" strokeWidth="1.6" />
      <circle cx="24" cy="13" r="4" fill="#3a2a1c" />
      <path d="M24 12 q-1 -8 -6 -8 M24 12 q1 -8 6 -8" fill="none" stroke="#2a1c12" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  cicada: (
    <>
      <ellipse cx="24" cy="26" rx="7" ry="12" fill="#5a6b52" stroke="#3a4636" strokeWidth="2" />
      <ellipse cx="16" cy="24" rx="9" ry="5" fill={P.white} stroke={P.grey} strokeWidth="1.2" opacity="0.7" transform="rotate(20 16 24)" />
      <ellipse cx="32" cy="24" rx="9" ry="5" fill={P.white} stroke={P.grey} strokeWidth="1.2" opacity="0.7" transform="rotate(-20 32 24)" />
      <circle cx="24" cy="15" r="4" fill="#3a4636" />
      <g fill="#c0392b"><circle cx="21" cy="15" r="1.6" /><circle cx="27" cy="15" r="1.6" /></g>
    </>
  ),
  caterpillar: (
    <>
      <g fill={P.green} stroke={P.greenD} strokeWidth="1.4">
        <circle cx="12" cy="30" r="5" /><circle cx="19" cy="28" r="5.5" /><circle cx="27" cy="28" r="5.5" /><circle cx="35" cy="29" r="5" />
      </g>
      <circle cx="37" cy="27" r="1.4" fill="#2a2a2a" />
    </>
  ),
  egg: (
    <ellipse cx="24" cy="26" rx="11" ry="14" fill="#fdf6e3" stroke="#e0d3ad" strokeWidth="2" />
  ),
  pupa: (
    <>
      <path d="M18 12 q6 -4 12 0 q4 16 -6 24 q-10 -8 -6 -24 z" fill="#c8a24a" stroke="#8a6a2a" strokeWidth="2" />
      <g stroke="#8a6a2a" strokeWidth="1.2"><path d="M18 20 h12" /><path d="M18 27 h12" /><path d="M20 34 h8" /></g>
    </>
  ),
  fish: (
    <>
      <path d="M8 24 C14 14 30 14 36 24 C30 34 14 34 8 24 Z" fill={P.orange} stroke={P.redD} strokeWidth="2" />
      <path d="M36 24 l8 -6 v12 z" fill={P.orange} stroke={P.redD} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="16" cy="22" r="2" fill="#2a2a2a" />
    </>
  ),
  frog: (
    <>
      <circle cx="16" cy="16" r="5" fill={P.green} stroke={P.greenD} strokeWidth="1.5" />
      <circle cx="32" cy="16" r="5" fill={P.green} stroke={P.greenD} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="1.8" fill="#2a2a2a" /><circle cx="32" cy="16" r="1.8" fill="#2a2a2a" />
      <path d="M10 30 a14 10 0 0 1 28 0 a14 6 0 0 1 -28 0 Z" fill={P.green} stroke={P.greenD} strokeWidth="2" />
      <path d="M16 32 q8 6 16 0" fill="none" stroke={P.greenD} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  snake: (
    <>
      <path d="M10 38 q-2 -10 8 -10 q10 0 8 -8 q-2 -6 6 -6" fill="none" stroke={P.green} strokeWidth="6" strokeLinecap="round" />
      <circle cx="34" cy="14" r="4.5" fill={P.green} stroke={P.greenD} strokeWidth="1.4" />
      <circle cx="35" cy="13" r="1.2" fill="#2a2a2a" />
      <path d="M38 14 l4 -1 -4 -1" fill="none" stroke={P.red} strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  shell: (
    <>
      <path d="M24 38 C10 34 8 16 24 12 C40 16 38 34 24 38 Z" fill="#f0d9b0" stroke="#b89b6a" strokeWidth="2" />
      <g stroke="#b89b6a" strokeWidth="1.4" fill="none"><path d="M24 13 V37" /><path d="M18 15 Q24 26 20 37" /><path d="M30 15 Q24 26 28 37" /></g>
    </>
  ),

  // ---- body ----
  mouth: (
    <>
      <path d="M8 24 Q24 12 40 24 Q24 36 8 24 Z" fill={P.red} stroke={P.redD} strokeWidth="2" />
      <path d="M12 24 Q24 20 36 24" fill="none" stroke={P.white} strokeWidth="2.4" />
      <path d="M12 24 Q24 33 36 24" fill={P.pinkD} opacity="0.5" />
    </>
  ),
  nose: (
    <path d="M24 8 Q18 26 14 30 Q14 38 24 36 Q34 38 34 30 Q30 26 24 8 Z" fill={P.skin} stroke="#c78b5e" strokeWidth="2" />
  ),
  lungs: (
    <>
      <path d="M22 10 v14 c0 10 -4 14 -9 14 c-4 0 -5 -4 -5 -9 c0 -8 4 -16 14 -19 Z" fill={P.pink} stroke={P.pinkD} strokeWidth="2" />
      <path d="M26 10 v14 c0 10 4 14 9 14 c4 0 5 -4 5 -9 c0 -8 -4 -16 -14 -19 Z" fill={P.pink} stroke={P.pinkD} strokeWidth="2" />
      <rect x="22.5" y="6" width="3" height="16" fill="#d8d8d8" stroke={P.greyD} strokeWidth="1" />
    </>
  ),
  heart: (
    <path d="M24 40 C6 28 8 12 18 12 C22 12 24 16 24 18 C24 16 26 12 30 12 C40 12 42 28 24 40 Z" fill={P.red} stroke={P.redD} strokeWidth="2" strokeLinejoin="round" />
  ),
  stomach: (
    <path d="M18 8 v10 c-8 2 -10 12 -4 18 c6 6 18 4 18 -6 c0 -6 -4 -8 -8 -9 v-13 Z" fill={P.pink} stroke={P.pinkD} strokeWidth="2" />
  ),
  intestine: (
    <path d="M14 10 h16 a6 6 0 0 1 0 12 h-12 a6 6 0 0 0 0 12 h16" fill="none" stroke={P.pinkD} strokeWidth="6" strokeLinecap="round" />
  ),
  trachea: (
    <>
      <rect x="21" y="6" width="6" height="18" rx="2" fill="#cfd8dd" stroke={P.greyD} strokeWidth="1.6" />
      <g stroke={P.greyD} strokeWidth="1"><line x1="21" y1="11" x2="27" y2="11" /><line x1="21" y1="15" x2="27" y2="15" /><line x1="21" y1="19" x2="27" y2="19" /></g>
      <path d="M24 24 L14 38 M24 24 L34 38" stroke="#cfd8dd" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
  esophagus: (
    <path d="M24 6 C18 16 30 24 24 34 C20 40 24 42 24 42" fill="none" stroke={P.pink} strokeWidth="6" strokeLinecap="round" />
  ),
  vessel: (
    <>
      <path d="M12 10 v12 a6 6 0 0 0 12 0 v-4 a6 6 0 0 1 12 0 v12" fill="none" stroke={P.red} strokeWidth="4" strokeLinecap="round" />
      <path d="M16 10 v12 a2 2 0 0 0 4 0 v-4 a10 10 0 0 1 20 0 v12" fill="none" stroke={P.blue} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </>
  ),
  legBody: (
    <>
      <circle cx="24" cy="12" r="6" fill={P.skin} stroke="#c78b5e" strokeWidth="1.6" />
      <path d="M24 18 v12 M24 22 l-8 4 M24 22 l8 4 M24 30 l-6 12 M24 30 l6 12" fill="none" stroke={P.skin} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  returnArrow: (
    <path d="M34 14 a12 12 0 1 1 -12 -12 M22 2 l-8 4 8 4" fill="none" stroke={P.blueD} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 12)" />
  ),

  // ---- earth / volcano ----
  volcano: (
    <>
      <path d="M6 40 L18 16 h12 L42 40 Z" fill={P.brownD} stroke="#4a2f18" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 16 h12 l-3 6 h-6 z" fill="#2a1c12" />
      <path d="M20 15 q1 -8 4 -10 q3 2 4 10 q-4 -4 -8 0 z" fill={P.orange} stroke={P.redD} strokeWidth="1.4" />
    </>
  ),
  lava: (
    <>
      <path d="M22 4 c-2 8 -8 8 -6 16 c-6 2 -8 12 0 18 c8 6 18 2 18 -8 c0 -8 -6 -8 -4 -14 c-2 2 -4 2 -4 -2 c0 -4 -2 -6 -4 -10 z" fill={P.orange} stroke={P.redD} strokeWidth="2" />
      <path d="M24 20 c-3 4 3 6 0 12" fill="none" stroke={P.yellow} strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  magma: (
    <>
      <circle cx="24" cy="26" r="14" fill={P.orange} stroke={P.redD} strokeWidth="2" />
      <circle cx="24" cy="26" r="8" fill={P.yellow} />
      <circle cx="20" cy="22" r="2.4" fill="#fff" opacity="0.7" />
    </>
  ),
  ash: (
    <g fill={P.greyD} opacity="0.9">
      <ellipse cx="24" cy="30" rx="16" ry="8" />
      <circle cx="18" cy="20" r="7" />
      <circle cx="30" cy="18" r="8" />
      <circle cx="24" cy="26" r="9" />
    </g>
  ),

  // ---- map / places ----
  house: (
    <>
      <rect x="14" y="24" width="20" height="16" fill="#f0d9a0" stroke={P.brownD} strokeWidth="2" />
      <path d="M12 24 L24 12 L36 24 Z" fill={P.red} stroke={P.redD} strokeWidth="2" strokeLinejoin="round" />
      <rect x="21" y="30" width="6" height="10" fill={P.brownD} />
    </>
  ),
  city: (
    <g stroke={P.greyD} strokeWidth="1.6">
      <rect x="10" y="20" width="9" height="20" fill="#9fb6c9" />
      <rect x="20" y="12" width="9" height="28" fill="#7f9db3" />
      <rect x="30" y="24" width="9" height="16" fill="#9fb6c9" />
      <g fill="#fce9a0" stroke="none"><rect x="12" y="23" width="2" height="2" /><rect x="16" y="23" width="2" height="2" /><rect x="22" y="16" width="2" height="2" /><rect x="26" y="16" width="2" height="2" /><rect x="32" y="27" width="2" height="2" /></g>
    </g>
  ),
  home: (
    <>
      <rect x="15" y="26" width="18" height="14" fill="#fbeccb" stroke={P.brownD} strokeWidth="2" />
      <path d="M13 26 L24 15 L35 26 Z" fill={P.orange} stroke={P.redD} strokeWidth="2" strokeLinejoin="round" />
      <rect x="26" y="30" width="5" height="10" fill={P.brown} />
      <rect x="18" y="30" width="5" height="5" fill={P.blue} />
    </>
  ),
  island: (
    <>
      <path d="M8 34 q16 -6 32 0 q-4 6 -16 6 q-12 0 -16 -6 z" fill="#e8d29a" stroke="#c8a94a" strokeWidth="1.6" />
      <path d="M24 30 q-2 -12 -6 -16 q8 2 6 16 M24 30 q2 -12 6 -16 q-8 2 -6 16" fill={P.green} stroke={P.greenD} strokeWidth="1.4" />
      <rect x="22" y="12" width="4" height="18" fill={P.brown} />
    </>
  ),
  japan: (
    <path d="M14 8 q6 4 4 10 q6 2 4 8 q8 2 6 10 q-2 6 -8 4 q-4 -2 -8 2 q-6 -4 -2 -10 q-4 -6 2 -10 q-4 -8 6 -14 z" fill={P.green} stroke={P.greenD} strokeWidth="2" strokeLinejoin="round" />
  ),
  compass: (
    <>
      <circle cx="24" cy="24" r="15" fill="#eef3f6" stroke={P.greyD} strokeWidth="2" />
      <path d="M24 10 L28 24 L24 38 L20 24 Z" fill={P.red} stroke={P.redD} strokeWidth="1" />
      <path d="M24 38 L20 24 L28 24 Z" fill="#dfe6eb" />
    </>
  ),
}

// Emoji+label from the stage data → a drawn icon name. Ambiguous emoji are split
// by label; anything unmatched falls through to the emoji glyph.
function pickIcon(emoji: string, label: string): keyof typeof ICONS | null {
  const has = (s: string) => label.includes(s)
  switch (emoji) {
    case '🪣':
      return 'wateringCan'
    case '💧':
      return 'water'
    case '💨':
      return 'air'
    case '🍙':
      return 'food'
    case '🪨':
      return 'stone'
    case '🩸':
      return 'blood'
    case '🌰':
      return 'seed'
    case '🌱':
      return 'sprout'
    case '🌿':
      return 'leaves'
    case '🌼':
      return 'bud'
    case '🌻':
      return 'sunflower'
    case '🌺':
      return 'hibiscus'
    case '🌷':
      return 'tulip'
    case '🌸':
      return 'sakura'
    case '🌳':
      return 'tree'
    case '🌲':
      return 'pine'
    case '🥒':
      return 'fruit'
    case '🍁':
      return 'maple'
    case '🍂':
      return 'fallenLeaf'
    case '🍃':
      return 'leaf'
    case '🍀':
    case '☘️':
      return 'clover'
    case '🌾':
      return 'rice'
    case '☀️':
      return 'sun'
    case '🌙':
      return 'moon'
    case '⭐':
      return 'star'
    case '🌟':
      return 'starBright'
    case '✨':
    case '·':
      return 'starSmall'
    case '☁️':
      return 'cloud'
    case '🌤️':
      return 'cloudWhite'
    case '⛅':
      return 'cloudWhite'
    case '🌧️':
      return 'rain'
    case '⛈️':
      return 'rain'
    case '⚡':
      return 'lightning'
    case '❄️':
      return 'snow'
    case '🌫️':
      return has('火山') ? 'ash' : 'cloudDark'
    case '🌀':
      return has('小腸') ? 'intestine' : 'typhoon'
    case '🐝':
      return 'bee'
    case '🐞':
      return 'ladybug'
    case '🦋':
      return 'butterfly'
    case '🦗':
      return 'grasshopper'
    case '🪲':
      return 'beetle'
    case '🪰':
      return 'cicada'
    case '🐛':
      return 'caterpillar'
    case '🥚':
      return 'egg'
    case '🪺':
      return 'pupa'
    case '🐟':
      return 'fish'
    case '🐸':
      return 'frog'
    case '🐍':
      return 'snake'
    case '🐚':
      return 'shell'
    case '👄':
      return 'mouth'
    case '👃':
      return 'nose'
    case '🫁':
      return 'lungs'
    case '❤️':
      return 'heart'
    case '🫘':
      return 'stomach'
    case '🎋':
      return 'trachea'
    case '🧵':
      return 'esophagus'
    case '🩹':
      return 'vessel'
    case '🦵':
      return 'legBody'
    case '↩️':
      return 'returnArrow'
    case '🌋':
      return 'volcano'
    case '🔥':
      return 'lava'
    case '🟠':
      return 'magma'
    case '🏘️':
      return 'house'
    case '🏙️':
      return 'city'
    case '🏡':
      return 'home'
    case '🏝️':
      return 'island'
    case '🗾':
      return 'japan'
    case '🧭':
      return 'compass'
    default:
      return null
  }
}

export function ObjIcon({ emoji, label = '', size = 40, className }: { emoji: string; label?: string; size?: number; className?: string }) {
  const name = pickIcon(emoji, label)
  if (!name) {
    return (
      <span className={className} style={{ fontSize: size * 0.8, lineHeight: 1 }} aria-hidden="true">
        {emoji}
      </span>
    )
  }
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={className} role="img" aria-label={label || undefined} style={{ display: 'block' }}>
      {ICONS[name]}
    </svg>
  )
}
