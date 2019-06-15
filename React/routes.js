// This is a good and proper way to manage routing in React
import Explore from 'components/explore/Explore';
import Learn from 'components/learn/Learn';
import Me from 'components/me/Me';
import Review from 'components/review/Review';
import Practice from 'components/practice/Practice';
import Quiz from 'components/quiz/Quiz';
import QuizResults from 'components/quiz/quiz-results/QuizResults';
import Lesson from 'components/lessons/lesson/Lesson';
import FlashcardDeck from 'components/practice/flashcard/flashcard-deck/FlashcardDeck';
import Unit from 'components/unit/Unit.js';
import UnitNav from 'components/learn/unit-nav/UnitNav';

export const routes = {
  EXPLORE: {
    path: '/explore',
    component: Explore,
    linkTo: () => '/explore',
  },
  LEARN: {
    path: '/learn',
    component: Learn,
    linkTo: () => '/learn',
  },
  COURSES: {
    path: '/courses/:courseId',
    component: UnitNav,
    linkTo: courseId => `/courses/${courseId}`,
  },
  ME: {
    path: '/me',
    component: Me,
    linkTo: () => '/me',
  },
  REVIEW: {
    path: '/review',
    component: Review,
    linkTo: () => '/review',
  },
  LESSON: {
    path: '/lessons/:lessonId',
    component: Lesson,
    linkTo: lessonId => `/lessons/${lessonId}`,
  },
  PRACTICE: {
    path: '/lessons/:lessonId/practice',
    component: Practice,
    linkTo: lessonId => `/lessons/${lessonId}/practice`,
  },
  QUIZ: {
    path: '/lessons/:lessonId/quiz',
    component: Quiz,
    linkTo: lessonId => `/lessons/${lessonId}/quiz`,
  },
  QUIZ_RESULTS: {
    path: '/lessons/:lessonId/quiz-results',
    component: QuizResults,
    linkTo: lessonId => `/lessons/${lessonId}/quiz-results`,
  },
  FLASHCARD_DECK: {
    path: '/lessons/:lessonId/flashcard-deck',
    component: FlashcardDeck,
    linkTo: lessonId => `/lessons/${lessonId}/flashcard-deck`,
  },
  UNIT: {
    path: '/units/:unitId',
    component: Unit,
    linkTo: unitId => `/units/${unitId}`,
  },
};
