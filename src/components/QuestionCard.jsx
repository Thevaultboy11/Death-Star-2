export function QuestionCard({ question, value, onChange, onSubmitOne }) {
  return (
    <article className="card">
      <h3>{question.text}</h3>
      <p className="muted">Type: {question.type}</p>
      {question.type === 'mcq' ? (
        <div className="optionList">
          {question.options.filter(Boolean).map((opt, idx) => (
            <label key={`${question.id}-opt-${idx}`} className="option">
              <input
                type="radio"
                name={`answer-${question.id}`}
                checked={value === opt}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          className="input"
          rows={5}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your code / explanation"
        />
      )}
      <button type="button" className="btn" onClick={onSubmitOne}>Submit this question</button>
    </article>
  );
}
