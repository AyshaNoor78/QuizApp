import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class QuizService {
  async getSubjects() {
    return prisma.subject.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getChapters(subjectId: string) {
    return prisma.chapter.findMany({
      where: { subjectId, isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async getSections(chapterId: string) {
    const sections = await prisma.section.findMany({
      where: { chapterId, isActive: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { questions: { where: { isActive: true } } } },
      },
    });

    return sections.map(s => ({
      ...s,
      questionCount: s._count.questions,
      _count: undefined,
    }));
  }

  async startSession(userId: string, sectionId: string) {
    const session = await prisma.quizSession.create({
      data: { userId, sectionId, status: 'IN_PROGRESS' },
    });
    return { sessionId: session.id };
  }

  async getNextQuestion(userId: string, sessionId: string) {
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { answers: true },
    });

    if (!session || session.userId !== userId) throw new Error('Invalid session');

    const sub = await prisma.subscription.findFirst({ where: { userId, status: 'ACTIVE' } });
    const isSubscribed = !!sub;

    const answeredIds = session.answers.map(a => a.questionId);

    if (!isSubscribed && answeredIds.length >= 3) {
      return { locked: true, message: 'Subscribe to continue' };
    }

    const nextQuestion = await prisma.question.findFirst({
      where: { sectionId: session.sectionId, isActive: true, id: { notIn: answeredIds } },
      orderBy: { createdAt: 'asc' },
    });

    if (!nextQuestion) {
      if (session.status !== 'COMPLETED') {
        await prisma.quizSession.update({ where: { id: sessionId }, data: { status: 'COMPLETED', completedAt: new Date() } });
      }
      return { completed: true };
    }

    const totalQuestions = await prisma.question.count({ where: { sectionId: session.sectionId, isActive: true } });

    return {
      id: nextQuestion.id,
      questionTextEn: nextQuestion.questionTextEn,
      questionTextBn: nextQuestion.questionTextBn,
      optionAEn: nextQuestion.optionAEn,
      optionABn: nextQuestion.optionABn,
      optionBEn: nextQuestion.optionBEn,
      optionBBn: nextQuestion.optionBBn,
      optionCEn: nextQuestion.optionCEn,
      optionCBn: nextQuestion.optionCBn,
      optionDEn: nextQuestion.optionDEn,
      optionDBn: nextQuestion.optionDBn,
      difficulty: nextQuestion.difficulty,
      marks: nextQuestion.marks,
      questionNumber: answeredIds.length + 1,
      totalQuestions,
    };
  }

  async submitAnswer(userId: string, sessionId: string, questionId: string, answer: any) {
    const session = await prisma.quizSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new Error('Invalid session');

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question || question.sectionId !== session.sectionId) throw new Error('Invalid question');

    const sub = await prisma.subscription.findFirst({ where: { userId, status: 'ACTIVE' } });
    const isSubscribed = !!sub;

    const isCorrect = answer === question.correctAnswer;

    await prisma.quizAnswer.create({
      data: {
        quizSessionId: sessionId,
        questionId,
        selectedAnswer: answer,
        isCorrect,
      },
    });

    if (!isSubscribed) {
      return { recorded: true };
    }

    return {
      recorded: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanationEn: question.explanationEn,
      explanationBn: question.explanationBn,
    };
  }

  async getResult(userId: string, sessionId: string) {
    const session = await prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { answers: { include: { question: true } } },
    });

    if (!session || session.userId !== userId) throw new Error('Invalid session');

    const sub = await prisma.subscription.findFirst({ where: { userId, status: 'ACTIVE' } });
    const isSubscribed = !!sub;

    const totalQuestions = await prisma.question.count({ where: { sectionId: session.sectionId, isActive: true } });
    const correctAnswers = session.answers.filter(a => a.isCorrect).length;
    const incorrectAnswers = session.answers.length - correctAnswers;
    const totalMarks = session.answers.reduce((sum, a) => sum + (a.isCorrect ? a.question.marks : 0), 0);
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    if (!isSubscribed) {
      return {
        restricted: true,
        message: 'Subscribe to see results',
        questionsAttempted: session.answers.length,
      };
    }

    const answers = session.answers.map(a => ({
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      isCorrect: a.isCorrect,
      correctAnswer: a.question.correctAnswer,
      explanationEn: a.question.explanationEn,
      explanationBn: a.question.explanationBn,
    }));

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      totalMarks,
      percentage,
      answers,
    };
  }

  async getHistory(userId: string) {
    const sessions = await prisma.quizSession.findMany({
      where: { userId },
      include: {
        section: true,
        answers: { include: { question: true } },
      },
      orderBy: { startedAt: 'desc' },
    });

    const sub = await prisma.subscription.findFirst({ where: { userId, status: 'ACTIVE' } });
    const isSubscribed = !!sub;

    return sessions.map(s => {
      const basic = {
        id: s.id,
        sectionNameEn: s.section.nameEn,
        status: s.status,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        attempted: s.answers.length,
      };

      if (!isSubscribed) return basic;

      const correct = s.answers.filter(a => a.isCorrect).length;
      return {
        ...basic,
        correct,
        totalMarks: s.answers.reduce((sum, a) => sum + (a.isCorrect ? a.question.marks : 0), 0),
      };
    });
  }
}

export const quizService = new QuizService();
