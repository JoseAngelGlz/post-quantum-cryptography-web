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

const sectionStarted = (routeId: string, sectionIndex: number, sectionTitle?: string) => {
  captureEvent('Sección Iniciada', {
    'Ruta': routeName(routeId),
    'Índice Sección': sectionIndex,
    'Título Sección': sectionTitle,
  });
};

const sectionCompleted = (
  routeId: string,
  sectionIndex: number,
  timeSpent: number,
  sectionTitle?: string,
) => {
  captureEvent('Sección Completada', {
    'Ruta': routeName(routeId),
    'Índice Sección': sectionIndex,
    'Título Sección': sectionTitle,
    'Tiempo (s)': Math.round(timeSpent),
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
) => {
  captureEvent('Pregunta Respondida', {
    'Ruta': routeName(routeId),
    'Quiz ID': quizId,
    'Pregunta': questionIndex,
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

const analytics = {
  captureEvent,
  setGlobalProperty,
  pageView,
  sectionStarted,
  sectionCompleted,
  quizStarted,
  questionAnswered,
  quizCompleted,
  quizAbandoned,
  feedbackSent,
  themeChanged,
  simulatorUsed,
  interactiveElementUsed,
};

export const useAnalytics = () => analytics;
