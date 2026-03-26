import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listenToQuestions, listenToSession, submitResponse } from '../lib/firestore';
import { QuestionCard } from '../components/QuestionCard';
import { buildSlides, formatClock } from '../lib/questions';

export function PlayerPage() {
  const [name, setName] = useState('guest');
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const u1 = listenToQuestions(setQuestions);
    const u2 = listenToSession(setSession);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      u1();
      u2();
      clearInterval(t);
    };
  }, []);

  const slides = useMemo(() => buildSlides(questions), [questions]);
  const currentIndex = slides.length ? (session?.currentIndex || 0) % slides.length : 0;
  const currentSlide = slides[currentIndex];
  const remaining = currentSlide ? currentSlide.duration - Math.floor((now - (session?.startedAt || now)) / 1000) : 0;

  const submitOne = async (qId) => {
    await submitResponse(qId, answers[qId] || '', name || 'guest');
    setStatus(`Submitted answer for ${qId}`);
  };

  const submitAllCurrent = async () => {
    if (!currentSlide) return;
    for (const q of currentSlide.questions) {
      await submitResponse(q.id, answers[q.id] || '', name || 'guest');
    }
    setStatus('Submitted all questions on this slide.');
  };

  return (
    <main className="layout">
      <header className="topbar">
        <h1>Participant View</h1>
        <Link to="/" className="btn secondary">Home</Link>
      </header>
      <label className="label">Your display name</label>
      <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <p className="timer">Time left on this slide: {formatClock(remaining)}</p>
      {status && <p className="status">{status}</p>}

      {!currentSlide ? (
        <p className="status">Waiting for presenter to start the cycle.</p>
      ) : (
        <>
          <section className="stack">
            {currentSlide.questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
                onSubmitOne={() => submitOne(q.id)}
              />
            ))}
          </section>
          <button type="button" className="btn" onClick={submitAllCurrent}>Submit all questions on this slide</button>
        </>
      )}
    </main>
  );
}
