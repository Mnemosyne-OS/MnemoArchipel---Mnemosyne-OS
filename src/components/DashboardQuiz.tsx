import React, { useState } from 'react';
import { Contact, CustomCategory } from '../types';
import { playSuccess, playFailure } from '../utils/audio';

interface DashboardQuizProps {
  contacts: Contact[];
  customCategories: CustomCategory[];
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

/**
 * Stateful mini-game quiz card component for cognitive memory training.
 * Isolated from GlobalDashboard to keep components small.
 */
export const DashboardQuiz: React.FC<DashboardQuizProps> = ({
  contacts,
  customCategories,
  t
}) => {
  const [gameState, setGameState] = useState<'idle' | 'question' | 'answered'>('idle');
  const [quizScore, setQuizScore] = useState(0);
  const [question, setQuestion] = useState<{
    text: string;
    correctAnswer: string;
    options: string[];
    contactName: string;
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const generateNewQuestion = () => {
    if (contacts.length < 3) {
      setQuestion(null);
      setGameState('idle');
      return;
    }
    
    // Pick random contact
    const targetIdx = Math.floor(Math.random() * contacts.length);
    const targetContact = contacts[targetIdx];
    
    // 0: category, 1: mood, 2: fact (if has facts)
    const hasFacts = targetContact.facts && targetContact.facts.length > 0;
    const type = hasFacts ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
    
    let text = '';
    let correctAnswer = '';
    let options: string[] = [];
    
    if (type === 0) {
      text = t('quiz_question_relation', { name: targetContact.name });
      correctAnswer = targetContact.relations[0] || 'Friend';
      
      const allPossibleCats = Array.from(new Set([
        'Friend', 'Colleague', 'Family', 'Mentor',
        ...customCategories.map(c => c.key)
      ]));
      
      const distractors = allPossibleCats.filter(c => c !== correctAnswer);
      distractors.sort(() => 0.5 - Math.random());
      options = [correctAnswer, ...distractors.slice(0, 3)];
    } else if (type === 1) {
      text = t('quiz_question_mood', { name: targetContact.name });
      correctAnswer = targetContact.mood || 'neutral';
      
      const allMoods = ['inspired', 'happy', 'neutral', 'tired', 'stressed'];
      const distractors = allMoods.filter(m => m !== correctAnswer);
      distractors.sort(() => 0.5 - Math.random());
      options = [correctAnswer, ...distractors.slice(0, 3)];
    } else {
      text = t('quiz_question_fact', { name: targetContact.name });
      correctAnswer = targetContact.facts?.[0] || '';
      
      const otherFacts = contacts
        .filter(c => c.id !== targetContact.id && c.facts && c.facts.length > 0)
        .map(c => c.facts![0]);
        
      if (otherFacts.length < 3) {
        text = t('quiz_question_relation', { name: targetContact.name });
        correctAnswer = targetContact.relations[0] || 'Friend';
        const allPossibleCats = Array.from(new Set([
          'Friend', 'Colleague', 'Family', 'Mentor',
          ...customCategories.map(c => c.key)
        ]));
        const distractors = allPossibleCats.filter(c => c !== correctAnswer);
        distractors.sort(() => 0.5 - Math.random());
        options = [correctAnswer, ...distractors.slice(0, 3)];
      } else {
        otherFacts.sort(() => 0.5 - Math.random());
        options = [correctAnswer, ...otherFacts.slice(0, 3)];
      }
    }
    
    options.sort(() => 0.5 - Math.random());
    
    setQuestion({
      text,
      correctAnswer,
      options,
      contactName: targetContact.name
    });
    setSelectedAnswer(null);
    setGameState('question');
  };

  const handleAnswerSelection = (answer: string) => {
    if (gameState !== 'question' || !question) return;
    setSelectedAnswer(answer);
    setGameState('answered');
    if (answer === question.correctAnswer) {
      setQuizScore(prev => prev + 1);
      playSuccess();
    } else {
      playFailure();
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }} className="glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          🧠 {t('social_quiz_title') || 'Entraînement de Mémoire Cognitive'}
        </h3>
        {gameState !== 'idle' && (
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-teal)', backgroundColor: 'var(--bg-deep)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            🏆 Score : {quizScore}
          </span>
        )}
      </div>

      {gameState === 'idle' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '16px 0', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '500px' }}>
            {t('quiz_desc')}
          </p>
          <button
            onClick={generateNewQuestion}
            disabled={contacts.length < 3}
            style={{
              backgroundColor: contacts.length < 3 ? 'transparent' : 'var(--accent-teal)',
              border: '1px solid var(--accent-teal)',
              color: contacts.length < 3 ? 'var(--text-muted)' : 'var(--bg-deep)',
              fontWeight: 700,
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: contacts.length < 3 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              fontSize: '13px'
            }}
          >
            {contacts.length < 3 ? t('quiz_add_contacts') : t('quiz_start')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {question && (
            <>
              <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: 600 }}>
                {question.text}
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {question.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === question.correctAnswer;
                  let btnBg = 'var(--bg-deep)';
                  let btnBorder = 'var(--border-subtle)';
                  let btnColor = 'var(--text-primary)';

                  if (gameState === 'answered') {
                    if (isCorrect) {
                      btnBg = 'rgba(14, 165, 233, 0.15)';
                      btnBorder = 'var(--accent-teal)';
                      btnColor = 'var(--accent-teal)';
                    } else if (isSelected) {
                      btnBg = 'rgba(244, 63, 94, 0.15)';
                      btnBorder = 'var(--accent-rose)';
                      btnColor = 'var(--accent-rose)';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelection(opt)}
                      disabled={gameState === 'answered'}
                      style={{
                        backgroundColor: btnBg,
                        border: `1px solid ${btnBorder}`,
                        color: btnColor,
                        padding: '12px 16px',
                        borderRadius: '8px',
                        cursor: gameState === 'answered' ? 'default' : 'pointer',
                        textAlign: 'left',
                        fontSize: '12.5px',
                        fontWeight: 500,
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {gameState === 'answered' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: selectedAnswer === question.correctAnswer ? 'var(--accent-teal)' : 'var(--accent-rose)', fontWeight: 600 }}>
                    {selectedAnswer === question.correctAnswer ? t('quiz_correct') : t('quiz_incorrect', { answer: question.correctAnswer })}
                  </span>
                  <button
                    onClick={generateNewQuestion}
                    style={{
                      backgroundColor: 'var(--bg-deep)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {t('quiz_next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
