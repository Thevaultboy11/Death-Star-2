import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createEmptyQuestion, QUESTION_COUNT } from '../lib/questions';
import { listenToQuestions, saveQuestion } from '../lib/firestore';

export function AdminPage() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const unsub = listenToQuestions(setQuestions);
    return () => unsub();
  }, []);

  const fullList = useMemo(() => {
    const map = new Map(questions.map((q) => [q.order, q]));
    return Array.from({ length: QUESTION_COUNT }).map((_, i) => map.get(i + 1) || { id: `q${i + 1}`, ...createEmptyQuestion(i + 1) });
  }, [questions]);

  const updateLocal = (id, patch) => {
    setQuestions((prev) => {
      const exists = prev.find((q) => q.id === id);
      if (!exists) return [...prev, { id, ...patch }];
      return prev.map((q) => (q.id === id ? { ...q, ...patch } : q));
    });
  };

  const persist = async (q) => {
    await saveQuestion(q.id, {
      order: q.order,
      text: q.text,
      type: q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      active: q.active,
    });
  };

  const saveAll = async () => {
    try {
      for (const q of fullList) {
        await persist(q);
      }
      setStatus('Saved all 20 questions. Live views are updated instantly.');
    } catch (error) {
      setStatus(`Save failed: ${error.message}`);
    }
  };

  return (
    <main className="layout">
      <header className="topbar">
        <h1>Question Editor (20 Boxes)</h1>
        <Link to="/" className="btn secondary">Home</Link>
      </header>
      <p className="muted">Any text is allowed for both MCQ and programming questions.</p>
      <button type="button" className="btn" onClick={saveAll}>Save all questions</button>
      {status && <p className="status">{status}</p>}

      <section className="stack">
        {fullList.map((q) => (
          <article key={q.id} className="card">
            <h3>Question #{q.order}</h3>
            <label className="label">Type</label>
            <select
              className="input"
              value={q.type}
              onChange={(e) => updateLocal(q.id, { ...q, type: e.target.value })}
            >
              <option value="mcq">Multiple Choice</option>
              <option value="programming">Programming</option>
            </select>

            <label className="label">Question text</label>
            <textarea
              rows={3}
              className="input"
              value={q.text}
              onChange={(e) => updateLocal(q.id, { ...q, text: e.target.value })}
              placeholder="Question title / prompt"
            />

            {q.type === 'mcq' && (
              <>
                <label className="label">Options</label>
                {q.options.map((opt, idx) => (
                  <input
                    key={`${q.id}-opt-${idx}`}
                    className="input"
                    value={opt}
                    onChange={(e) => {
                      const options = [...q.options];
                      options[idx] = e.target.value;
                      updateLocal(q.id, { ...q, options });
                    }}
                    placeholder={`Option ${idx + 1}`}
                  />
                ))}
              </>
            )}

            <label className="label">Correct answer</label>
            <input
              className="input"
              value={q.correctAnswer}
              onChange={(e) => updateLocal(q.id, { ...q, correctAnswer: e.target.value })}
              placeholder="Correct answer text"
            />
            <label className="option">
              <input
                type="checkbox"
                checked={q.active}
                onChange={(e) => updateLocal(q.id, { ...q, active: e.target.checked })}
              />
              Include in rotation
            </label>
            <button type="button" className="btn" onClick={() => persist(q)}>Save question #{q.order}</button>
          </article>
        ))}
      </section>
    </main>
  );
}
