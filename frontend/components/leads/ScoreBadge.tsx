import React from 'react';

interface ScoreBadgeProps {
  score: number;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let scoreClass = 'score-medium';
  if (score >= 80) {
    scoreClass = 'score-high';
  } else if (score < 60) {
    scoreClass = 'score-low';
  }

  return <span className={`lead-score-badge ${scoreClass}`}>{score}</span>;
};
