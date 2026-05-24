import posthog from 'posthog-js';

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

const routeName = (routeId: string): string => ROUTE_NAMES[routeId] ?? routeId;

const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties);
};

const setGlobalProperty = (property: string, value: any) => {
  posthog.register({ [property]: value });
};

const pageView = (routeId: string) => {
  captureEvent('Página Vista', { 'Ruta': routeName(routeId) });
};

const routeStarted = (routeId: string) => {
  captureEvent('Ruta Iniciada', { 'Ruta': routeName(routeId) });
};

const routeCompleted = (routeId: string, timeSpent: number) => {
  captureEvent('Ruta Completada', {
    'Ruta': routeName(routeId),
    'Tiempo (s)': timeSpent,
  });
};

const quizStarted = (routeId: string, quizId: string) => {
  captureEvent('Cuestionario Iniciado', {
    'Ruta': routeName(routeId),
    'Quiz ID': quizId,
  });
};

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

const themeChanged = (theme: 'Claro' | 'Oscuro') => {
  setGlobalProperty('Tema', theme);
  captureEvent('Cambio de Tema', { 'Tema': theme });
};

const simulatorUsed = (simulatorId: 'SimMLKEM' | 'SimMLDSA') => {
  captureEvent('Simulador Usado', { 'Simulador': simulatorId });
};

const interactiveElementUsed = (elementType: string, elementId: string) => {
  captureEvent('Elemento Interactivo Usado', {
    'Tipo de Elemento': elementType,
    'ID del Elemento': elementId,
  });
};

const resourceOpened = (resourceId: string, resourceType: string, url: string) => {
  captureEvent('Recurso Abierto', {
    'ID del Recurso': resourceId,
    'Tipo': resourceType,
    'URL': url,
  });
};

const newsOpened = (newsId: string, variant: string, url: string) => {
  captureEvent('Noticia Abierta', {
    'ID de Noticia': newsId,
    'Variante': variant,
    'URL': url,
  });
};

const languageChanged = (locale: string) => {
  setGlobalProperty('Idioma', locale);
  captureEvent('Idioma Cambiado', { 'Idioma': locale });
};

const cookieConsent = (decision: 'Aceptado' | 'Rechazado') => {
  captureEvent('Consentimiento de Cookies', { 'Decisión': decision });
};

const quizReaction = (quizId: string, reaction: number) => {
  captureEvent('Reacción al Cuestionario', {
    'Quiz ID': quizId,
    'Reacción': reaction,
  });
};

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
