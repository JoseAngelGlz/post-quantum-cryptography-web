import posthog from 'posthog-js';

// Mapa de IDs de ruta a nombres legibles para los eventos de PostHog
const ROUTE_NAMES: Record<string, string> = {
  intro: 'Introducción',
  fundamentos: 'Fundamentos',
  aplicaciones: 'Aplicaciones',
  mlkem: 'ML-KEM',
  mldsa: 'ML-DSA',
  noticias: 'Noticias',
  recursos: 'Recursos',
  site: 'Sitio Web',
  progreso: 'Progreso',
};

// Devuelve el nombre legible de una ruta, o el ID si no está mapeado
const routeName = (routeId: string): string => ROUTE_NAMES[routeId] ?? routeId;

// Envía un evento con propiedades opcionales a PostHog
const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties);
};

// Registra una propiedad persistente en todas las sesiones de PostHog
const setGlobalProperty = (property: string, value: any) => {
  posthog.register({ [property]: value });
};

// Registra una visita a una ruta
const pageView = (routeId: string) => {
  captureEvent('Página Vista', { 'Ruta': routeName(routeId) });
};

// Se llama cuando el usuario ha leído ~25% de una ruta
const routeStarted = (routeId: string) => {
  captureEvent('Ruta Iniciada', { 'Ruta': routeName(routeId) });
};

// Se llama cuando el usuario ha leído ~95% de una ruta; incluye tiempo transcurrido
const routeCompleted = (routeId: string, timeSpent: number) => {
  captureEvent('Ruta Completada', {
    'Ruta': routeName(routeId),
    'Tiempo (s)': timeSpent,
  });
};

// Marca el inicio de un cuestionario
const quizStarted = (routeId: string, quizId: string) => {
  captureEvent('Cuestionario Iniciado', {
    'Ruta': routeName(routeId),
    'Quiz ID': quizId,
  });
};

// Registra la respuesta a una pregunta con su corrección
const questionAnswered = (
  routeId: string,
  quizId: string,
  questionIndex: number,
  isCorrect: boolean,
  questionText?: string,
) => {
  captureEvent('Pregunta Respondida', {
    'Ruta': routeName(routeId),
    'Quiz ID': quizId,
    'Num': questionIndex + 1,
    'Enunciado': questionText,
    'Resultado': isCorrect ? 'Correcto' : 'Incorrecto',
  });
};

// Registra puntuación final del cuestionario
const quizCompleted = (routeId: string, quizId: string, score: number, total: number) => {
  const percentage = Math.round((score / total) * 100);
  captureEvent('Cuestionario Completado', {
    'Ruta': routeName(routeId),
    'Quiz ID': quizId,
    'Puntuación': score,
    'Total': total,
    'Porcentaje': percentage,
  });
};

// Registra abandono parcial de un cuestionario
const quizAbandoned = (
  routeId: string,
  quizId: string,
  currentQuestion: number,
  total: number,
) => {
  captureEvent('Cuestionario Abandonado', {
    'Ruta': routeName(routeId),
    'Quiz ID': quizId,
    'Pregunta Actual': currentQuestion,
    'Total Preguntas': total,
  });
};

// Registra el envío del formulario de valoración de una sección
const feedbackSent = (
  routeId: string,
  difficulty: number,
  clarity: number,
  recommend: number,
  hasComment: boolean,
) => {
  captureEvent('Feedback Enviado', {
    'Ruta': routeName(routeId),
    'Dificultad': difficulty,
    'Claridad': clarity,
    'Recomendación': recommend,
    'Tiene Comentario': hasComment,
  });
};

// Registra cambio de tema y lo persiste como propiedad global
const themeChanged = (theme: 'Claro' | 'Oscuro') => {
  setGlobalProperty('Tema', theme);
  captureEvent('Cambio de Tema', { 'Tema': theme });
};

// Registra el uso de un simulador (ML-KEM o ML-DSA)
const simulatorUsed = (simulatorId: 'SimMLKEM' | 'SimMLDSA') => {
  captureEvent('Simulador Usado', { 'Simulador': simulatorId });
};

// Registra la interacción con cualquier elemento interactivo etiquetado
const interactiveElementUsed = (elementType: string, elementId: string) => {
  captureEvent('Elemento Interactivo Usado', {
    'Tipo de Elemento': elementType,
    'ID del Elemento': elementId,
  });
};

// Registra la apertura de un recurso externo
const resourceOpened = (resourceId: string, resourceType: string, url: string) => {
  captureEvent('Recurso Abierto', {
    'ID del Recurso': resourceId,
    'Tipo': resourceType,
    'URL': url,
  });
};

// Registra la apertura de una noticia
const newsOpened = (newsId: string, variant: string, url: string) => {
  captureEvent('Noticia Abierta', {
    'ID de Noticia': newsId,
    'Variante': variant,
    'URL': url,
  });
};

// Registra cambio de idioma y lo persiste como propiedad global
const languageChanged = (locale: string) => {
  setGlobalProperty('Idioma', locale);
  captureEvent('Idioma Cambiado', { 'Idioma': locale });
};

// Registra la decisión de consentimiento de cookies
const cookieConsent = (decision: 'Aceptado' | 'Rechazado') => {
  captureEvent('Consentimiento de Cookies', { 'Decisión': decision });
};

// Registra la valoración rápida (1-3) tras un cuestionario
const quizReaction = (quizId: string, reaction: number) => {
  captureEvent('Reacción al Cuestionario', {
    'Quiz ID': quizId,
    'Reacción': reaction,
  });
};

// Registra el tema inicial detectado sin interacción del usuario
const themeDefault = (theme: 'Claro' | 'Oscuro') => {
  setGlobalProperty('Tema', theme);
  captureEvent('Tema Inicial', { 'Tema': theme });
};

const analytics = {
  captureEvent,
  setGlobalProperty,
  pageView,
  routeStarted,
  routeCompleted,
  quizStarted,
  questionAnswered,
  quizCompleted,
  quizAbandoned,
  feedbackSent,
  themeChanged,
  simulatorUsed,
  interactiveElementUsed,
  resourceOpened,
  newsOpened,
  languageChanged,
  cookieConsent,
  quizReaction,
  themeDefault,
};

export const useAnalytics = () => analytics;
