export interface CodeExample {
  title?: string;
  language: string;
  code: string;
}

export interface LessonSection {
  heading?: string;
  body: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface LessonTerm {
  en: string;
  ar: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleEn: string;
  duration: string;
  description: string;
  sections: LessonSection[];
  code?: CodeExample[];
  quiz: QuizQuestion[];
  exercise?: string;
  terms?: LessonTerm[];
}

export interface Source {
  name: string;
  url: string;
}

export interface Course {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  sources: Source[];
  lessons: Lesson[];
}

export interface Stage {
  id: string;
  level: number;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  color: string;
  icon: string;
  courses: Course[];
}
