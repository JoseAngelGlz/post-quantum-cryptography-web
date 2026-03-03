# post-quantum-cryptography-web

Interactive web application for the TFG (Bachelor's Thesis) on **Post-Quantum Cryptography (PQC)** — Ingeniería Informática.

![App screenshot](https://github.com/user-attachments/assets/401ad9e0-c227-42b1-b7f4-a56f5e080ce3)

## Features

| Section | Description |
|---|---|
| **Introducción** | Overview of PQC, the quantum threat, NIST standards timeline, and algorithm families |
| **Lattices (Retículos)** | SVP, CVP, LWE and NTRU explanations + GeoGebra applet placeholder |
| **Simulador ML-KEM** | Interactive Baby-Kyber simulator (q=17, n=2) demonstrating key generation, encapsulation and decapsulation |
| **Recursos** | Curated links to NIST FIPS standards, academic papers, courses and tools |

## Tech Stack

- **Vite + React + TypeScript** — fast development and strict typing
- **Tailwind CSS** — responsive, professional academic design with dark/light mode
- **Lucide React** — icon library
- **KaTeX** (available as dependency) — for mathematical formula rendering

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173/post-quantum-cryptography-web/](http://localhost:5173/post-quantum-cryptography-web/) in your browser.

## Build

```bash
npm run build
npm run preview
```

## ML-KEM Simulator

The simulator implements a simplified **Baby-Kyber** scheme for educational purposes:

- **Key Generation:** `t = A·s + e (mod q)` — hardness based on the Module-LWE problem
- **Encapsulation:** `u = Aᵀ·r + e₁`, `v = (tᵀ·r)·[1,1] + e₂ + m (mod q)`
- **Decapsulation:** `m' = v − sᵀ·u (mod q)`, then round each component to nearest bit

> ⚠️ This is for **educational demonstration only**. Do not use in production.
