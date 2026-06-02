# PostQ · Criptografía Post-Cuántica

Aplicación web interactiva desarrollada como TFG (Trabajo de Fin de Grado) de Ingeniería Informática en la Universidad de La Laguna. Permite aprender criptografía post-cuántica de forma visual y progresiva, con simuladores interactivos, cuestionarios y recursos curados.

![App screenshot](https://github.com/user-attachments/assets/401ad9e0-c227-42b1-b7f4-a56f5e080ce3)

## Secciones

| Ruta | Contenido |
|---|---|
| **Introducción** | Amenaza cuántica, algoritmos de Shor y Grover, cronología NIST, familias de algoritmos PQC |
| **Fundamentos** | Retículos, SVP/CVP, LWE, Module-LWE, visualizador interactivo y playground de ruido |
| **Aplicaciones** | Casos de uso reales de ML-KEM y ML-DSA: TLS, firmware, identidad digital |
| **Simulador ML-KEM** | Baby-Kyber didáctico (n=2, q=17): generación de claves, encapsulación, desencapsulación y modo espía |
| **Simulador ML-DSA** | Baby-Dilithium didáctico (n=2, q=17): generación de claves, firma y verificación |
| **Noticias** | Actualidad en criptografía post-cuántica con enlaces a fuentes externas |
| **Recursos** | Estándares NIST (FIPS 203/204/205), papers, cursos y herramientas externas |

## Stack tecnológico

- **Vite 7 + React 19 + TypeScript** (strict) — enrutamiento propio sin react-router, transiciones con Framer Motion
- **Tailwind CSS 3** — paleta `quantum-*` con modo oscuro/claro basado en clases
- **KaTeX** — renderizado de fórmulas matemáticas
- **PostHog JS** — analítica de comportamiento con consentimiento explícito, alojamiento EU
- **Web3Forms** — envío de formularios de feedback por email sin backend
- **Lucide React** — iconos

## Inicio rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:5173/post-quantum-cryptography-web/](http://localhost:5173/post-quantum-cryptography-web/) en el navegador.

## Variables de entorno

Crea un fichero `.env` en la raíz con:

```
VITE_PUBLIC_POSTHOG_KEY=<tu_clave_posthog>
VITE_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
VITE_WEB3FORMS_KEY=<tu_clave_web3forms>
```

## Build y despliegue

```bash
npm run build    # genera dist/
npm run preview  # sirve el build localmente
```

El despliegue en GitHub Pages se realiza automáticamente mediante GitHub Actions al hacer push a `main`. La base URL está configurada como `/post-quantum-cryptography-web/`.

## Persistencia local

La aplicación guarda en `localStorage` las siguientes claves:

| Clave | Contenido |
|---|---|
| `postq-theme` | Tema seleccionado (`dark` / `light`) |
| `postq-locale` | Idioma seleccionado (`es` / `en`) |
| `postq-cookie-consent` | Decisión de cookies (`accepted` / `rejected`) |
| `pqc-quiz-results` | Resultados de cuestionarios completados |
| `pqc-quiz-reactions` | Reacciones emoji por cuestionario |
| `pqc-feedback` | Copia local de los formularios de feedback enviados |

## Aviso

Los simuladores de ML-KEM y ML-DSA son reconstrucciones didácticas. No implementan NTT, compresión ni las funciones hash completas del estándar. **No usar en producción.**
