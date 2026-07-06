import { useState } from 'react';
import './Survey.css';

const QUESTIONS = [
  {
    id: 'overall',
    type: 'rating',
    question: 'How would you rate your overall experience on EZGAMES?',
    required: true,
  },
  {
    id: 'design',
    type: 'rating',
    question: 'How visually appealing did you find our store?',
    required: true,
  },
  {
    id: 'navigation',
    type: 'rating',
    question: 'How easy was it to find what you were looking for?',
    required: true,
  },
  {
    id: 'search',
    type: 'rating',
    question: 'How useful was our search and filter system?',
    required: false,
  },
  {
    id: 'purchase',
    type: 'radio',
    question: 'Did you complete a purchase today?',
    options: ['Yes, I bought something!', 'No, just browsing', 'I added items to my cart'],
    required: true,
  },
  {
    id: 'recommend',
    type: 'radio',
    question: 'How likely are you to recommend EZGAMES to a friend?',
    options: ['Definitely would!', 'Probably would', 'Not sure', 'Probably not', 'Definitely not'],
    required: true,
  },
  {
    id: 'features',
    type: 'multicheck',
    question: 'Which features did you enjoy most? (Select all that apply)',
    options: ['Game deals & discounts', 'Faceted search/filters', 'Game detail pages', 'Wishlist feature', 'Overall design', 'Easy checkout'],
    required: false,
  },
  {
    id: 'improve',
    type: 'radio',
    question: 'What would make EZGAMES even better for you?',
    options: ['More games', 'Better deals', 'More filter options', 'User reviews', 'Multiplayer game lists', 'Game trailers'],
    required: false,
  },
  {
    id: 'comments',
    type: 'textarea',
    question: 'Any other thoughts, suggestions, or kind words? We read every response! 🙏',
    placeholder: 'Tell us what you loved, what could be improved, or just say hi...',
    required: false,
  },
];

const RATING_LABELS = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent!'];

export default function Survey() {
  const [answers, setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]     = useState({});

  function setAnswer(id, val) {
    setAnswers(prev => ({ ...prev, [id]: val }));
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }));
  }

  function toggleMulti(id, option) {
    setAnswers(prev => {
      const cur = prev[id] || [];
      return {
        ...prev,
        [id]: cur.includes(option) ? cur.filter(o => o !== option) : [...cur, option],
      };
    });
  }

  function validate() {
    const err = {};
    QUESTIONS.forEach(q => {
      if (q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0))) {
        err[q.id] = 'This question is required.';
      }
    });
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      const firstErrId = Object.keys(err)[0];
      document.getElementById(`question-${firstErrId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    const rating = answers.overall || 5;
    return (
      <div className="survey-page">
        <div className="container">
          <div className="survey-thank-you glass-card animate-fadeUp">
            <div className="survey-ty__emoji">
              {rating >= 4 ? '🎉' : rating >= 3 ? '😊' : '🙏'}
            </div>
            <h1 className="survey-ty__title">
              {rating >= 4 ? 'You Made Our Day!' : 'Thank You So Much!'}
            </h1>
            <p className="survey-ty__sub">
              {rating >= 4
                ? `We're thrilled you had a great time on EZGAMES! Your ${rating}-star rating means the world to us. We'll keep working hard to bring you the best gaming deals around.`
                : "We genuinely appreciate you taking the time to share your thoughts. Every piece of feedback helps us improve and serve you better. Look forward to seeing you again soon!"}
            </p>

            <div className="survey-ty__stars">
              {[1,2,3,4,5].map(n => (
                <span
                  key={n}
                  className={`survey-ty__star ${n <= rating ? 'filled' : ''}`}
                >★</span>
              ))}
            </div>

            {answers.recommend && (
              <div className="survey-ty__quote">
                "{answers.recommend}"
              </div>
            )}

            {answers.comments && (
              <div className="survey-ty__comment">
                <span className="survey-ty__comment-label">Your message:</span>
                <p>{answers.comments}</p>
              </div>
            )}

            <div className="survey-ty__actions">
              <a href="/" className="btn btn-primary btn-lg">🏠 Back to Home</a>
              <a href="/store" className="btn btn-secondary btn-lg">🎮 Keep Shopping</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-page">
      <div className="survey-header">
        <div className="container survey-header__inner">
          <span className="section-eyebrow">💬 Share Your Experience</span>
          <h1 className="survey-header__title">
            How Are We <span className="gradient-text">Doing?</span>
          </h1>
          <p className="survey-header__sub">
            You're the reason we built EZGAMES — so tell us how we're doing!
            Your honest feedback (the good, the great, and everything in between) helps us create a better store for every gamer.
            It only takes 2 minutes. 🙌
          </p>
          <div className="survey-progress-hint">
            <span>{QUESTIONS.length} questions</span>
            <span>•</span>
            <span>~2 minutes</span>
            <span>•</span>
            <span>Anonymous</span>
          </div>
        </div>
      </div>

      <div className="container survey-body">
        <form
          className="survey-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Customer satisfaction survey"
          id="survey-form"
        >
          {QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              id={`question-${q.id}`}
              className={`survey-question ${errors[q.id] ? 'survey-question--error' : ''}`}
            >
              <div className="survey-question__header">
                <span className="survey-question__num">{idx + 1}</span>
                <label
                  className="survey-question__text"
                  htmlFor={q.type === 'textarea' ? `textarea-${q.id}` : undefined}
                >
                  {q.question}
                  {q.required && <span className="survey-required" aria-label="required"> *</span>}
                </label>
              </div>

              {q.type === 'rating' && (
                <div className="star-rating" role="group" aria-label={`Rate: ${q.question}`}>
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`star-btn ${(answers[q.id] || 0) >= n ? 'star-btn--active' : ''}`}
                      onClick={() => setAnswer(q.id, n)}
                      aria-label={`${RATING_LABELS[n]}`}
                      aria-pressed={(answers[q.id] || 0) >= n}
                      id={`${q.id}-star-${n}`}
                    >
                      ★
                    </button>
                  ))}
                  {answers[q.id] && (
                    <span className="star-label">{RATING_LABELS[answers[q.id]]}</span>
                  )}
                </div>
              )}

              {q.type === 'radio' && (
                <div className="radio-group" role="radiogroup" aria-label={q.question}>
                  {q.options.map(opt => (
                    <label
                      key={opt}
                      className={`radio-option ${answers[q.id] === opt ? 'radio-option--active' : ''}`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswer(q.id, opt)}
                        id={`${q.id}-${opt.replace(/\s+/g,'-')}`}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'multicheck' && (
                <div className="check-group" role="group" aria-label={q.question}>
                  {q.options.map(opt => {
                    const checked = (answers[q.id] || []).includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`check-option ${checked ? 'check-option--active' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMulti(q.id, opt)}
                          id={`${q.id}-${opt.replace(/\s+/g,'-')}`}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.type === 'textarea' && (
                <textarea
                  id={`textarea-${q.id}`}
                  className="form-control survey-textarea"
                  placeholder={q.placeholder}
                  value={answers[q.id] || ''}
                  onChange={e => setAnswer(q.id, e.target.value)}
                  rows={5}
                />
              )}

              {errors[q.id] && (
                <p className="survey-error" role="alert">{errors[q.id]}</p>
              )}
            </div>
          ))}

          <div className="survey-submit">
            <p className="survey-submit__note">
              📢 We read every single response and use your feedback to improve EZGAMES. Thank you for being part of our community!
            </p>
            <button
              type="submit"
              className="btn btn-primary btn-xl"
              id="survey-submit-btn"
            >
              🚀 Submit My Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
