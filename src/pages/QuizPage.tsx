import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { pickQuizQuestions } from "@/data/quizQuestions";

const QUESTION_COUNT = 12;

const QuizPage = () => {
  const { t, language } = useAppSettings();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(() => pickQuizQuestions(QUESTION_COUNT));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const current = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleAnswer = (index: number) => {
    const nextAnswers = [...selectedAnswers, index];
    setSelectedAnswers(nextAnswers);

    if (currentIndex >= questions.length - 1) {
      setDone(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const restartQuiz = () => {
    setQuestions(pickQuizQuestions(QUESTION_COUNT));
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setDone(false);
  };

  const score = questions.reduce((acc, question, index) => {
    return selectedAnswers[index] === question.correctIndex ? acc + 1 : acc;
  }, 0);

  const failedQuestions = questions
    .map((question, index) => ({
      question,
      userAnswer: selectedAnswers[index],
    }))
    .filter(({ question, userAnswer }) => userAnswer !== question.correctIndex);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16">
        <section className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 shadow-moroccan">
          {!done ? (
            <>
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.25em] text-moroccan-ochre-dark font-semibold mb-2">
                  {t("Quiz Medina de Fes", "اختبار مدينة فاس")}
                </p>
                <h1 className="font-heading text-3xl md:text-4xl text-foreground font-bold mb-3">
                  {t("Mode Kahoot - 12 questions", "نمط كاهوت - 12 سؤالا")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {t(
                    `Question ${currentIndex + 1} sur ${questions.length}`,
                    `السؤال ${currentIndex + 1} من ${questions.length}`,
                  )}
                </p>
                <div className="h-2 rounded-full bg-muted mt-3">
                  <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="rounded-xl bg-background border border-border p-5 mb-5">
                <h2 className="font-heading text-2xl text-foreground leading-snug">
                  {language === "ar" ? current.question.ar : current.question.fr}
                </h2>
              </div>

              <div className="grid gap-3">
                {current.options.map((option, optionIndex) => (
                  <button
                    key={`${current.id}-${optionIndex}`}
                    type="button"
                    onClick={() => handleAnswer(optionIndex)}
                    className="w-full rounded-xl border border-border bg-card px-4 py-4 text-start font-body text-base text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {language === "ar" ? option.ar : option.fr}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mb-8 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-moroccan-ochre-dark font-semibold mb-2">
                  {t("Resultat final", "النتيجة النهائية")}
                </p>
                <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
                  {score}/{questions.length}
                </h1>
                <p className="text-muted-foreground">
                  {t(
                    "Bravo. Voici les reponses fausses avec la bonne correction.",
                    "أحسنت. فيما يلي الإجابات الخاطئة مع التصحيح.",
                  )}
                </p>
              </div>

              {failedQuestions.length === 0 ? (
                <p className="rounded-xl border border-secondary/40 bg-secondary/10 p-4 text-secondary font-semibold text-center">
                  {t("Parfait, aucune faute.", "ممتاز، بدون أي خطأ.")}
                </p>
              ) : (
                <div className="space-y-4 mb-8">
                  {failedQuestions.map(({ question, userAnswer }) => (
                    <div key={`wrong-${question.id}`} className="rounded-xl border border-border bg-background p-4">
                      <p className="font-semibold text-foreground mb-2">
                        {language === "ar" ? question.question.ar : question.question.fr}
                      </p>
                      <p className="text-sm text-red-600 mb-1">
                        {t("Votre reponse:", "إجابتك:")}{" "}
                        {typeof userAnswer === "number"
                          ? language === "ar"
                            ? question.options[userAnswer].ar
                            : question.options[userAnswer].fr
                          : t("Aucune", "لا يوجد")}
                      </p>
                      <p className="text-sm text-green-700 mb-2">
                        {t("Bonne reponse:", "الإجابة الصحيحة:")}{" "}
                        {language === "ar"
                          ? question.options[question.correctIndex].ar
                          : question.options[question.correctIndex].fr}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar" ? question.explanation.ar : question.explanation.fr}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  {t("Rejouer (questions aleatoires)", "إعادة اللعب (أسئلة عشوائية)")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-lg border border-border px-5 py-2.5 text-foreground font-semibold hover:bg-muted transition-colors"
                >
                  {t("Retour a l'accueil", "العودة للرئيسية")}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuizPage;
