import React from 'react';
import { useHistory } from '@docusaurus/router';

export default function BackLink({ fallback = '/docs/glossary/glossary-index' }) {
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    const prevAnchor = sessionStorage.getItem('prevAnchor');

    if (prevAnchor) {
      history.push(prevAnchor); // Includes both path and hash
    } else {
      history.push(fallback);
    }
  };

  return (
    <a href={fallback} onClick={handleClick} style={{ display: 'inline-block', marginTop: '1rem' }}>
      ⬅ Back
    </a>
  );
}
