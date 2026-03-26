import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { advanceSession, listenToQuestions, listenToSession, startSession } from '../lib/firestore';
import { buildSlides, formatClock } from '../lib/questions';

export function PresentationPage() {
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const unsubQuestions = listenToQuestions(setQuestions);
    const unsubSession = listenToSession(setSession);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      unsubQuestions();
      unsubSession();
      clearInterval(t);
    };
  }, []);

  const slides = useMemo(() => buildSlides(questions), [questions]);
  const currentIndex = slides.length ? (session?.currentIndex || 0) % slides.length : 0;
  const currentSlide = slides[currentIndex];

  const startedAt = session?.startedAt || now;
  const remaining = currentSlide ? currentSlide.duration - Math.floor((now - startedAt) / 1000) : 0;

  useEffect(() => {
    if (!currentSlide || !session?.running || remaining > 0) return;
    const next = (currentIndex + 1) % slides.length;
    advanceSession(next, slides[next].duration);
  }, [currentSlide, currentIndex, remaining, session, slides]);

  const handleStart = async () => {
    if (!slides.length) return;
    await startSession(0, slides[0].duration);
  };

  return (
    <main className="layout">
      <header className="topbar">
        <h1>Presentation Mode</h1>
        <Link to="/" className="btn secondary">Home</Link>
      </header>
      <p className="muted">MCQ: 3 questions per slide (2 min). Programming: 1 question per slide (5 min).</p>
      <div className="buttonRow">
        <button type="button" className="btn" onClick={handleStart}>Start / Restart Cycle</button>
      </div>

      {!currentSlide ? (
        <p className="status">No active questions yet. Add questions in the editor.</p>
      ) : (
        <section className="card">
          <h2>Slide {currentIndex + 1} / {slides.length}</h2>
          <p className="timer">Time left: {formatClock(remaining)}</p>
          {currentSlide.questions.map((q) => (
            <article key={q.id} className="subCard">
              <h3>{q.text}</h3>
              {q.type === 'mcq' ? (
                <ul>
                  {q.options.filter(Boolean).map((opt, idx) => <li key={`${q.id}-${idx}`}>{opt}</li>)}
                </ul>
              ) : (
                <p className="muted">Programming question</p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
