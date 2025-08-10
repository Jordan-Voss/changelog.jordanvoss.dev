import React, { useState } from 'react';
import glossaryEntries from '@site/src/data/glossary.json'; // Import JSON directly

type GlossaryEntry = {
  term: string;
  definition: string;
  link: string;
};

// Utility to group entries by first letter
const groupByLetter = (entries: GlossaryEntry[]) => {
  const grouped: Record<string, GlossaryEntry[]> = {};
  entries.forEach(entry => {
    const letter = entry.term[0].toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(entry);
  });

  // Sort by letter and term
  Object.keys(grouped).forEach(letter => {
    grouped[letter].sort((a, b) => a.term.localeCompare(b.term));
  });

  return Object.keys(grouped)
    .sort()
    .reduce((obj, key) => {
      obj[key] = grouped[key];
      return obj;
    }, {} as Record<string, GlossaryEntry[]>);
};

export default function GlossarySearch() {
  const [query, setQuery] = useState('');
  const filteredEntries = glossaryEntries.filter(entry =>
    entry.term.toLowerCase().includes(query.toLowerCase())
  );

  const groupedEntries = groupByLetter(
    query ? filteredEntries : glossaryEntries
  );

  return (
    <div style={{ maxWidth: 700 }}>
      <input
        type="text"
        placeholder="Search glossary..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '1rem',
          marginBottom: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      {Object.entries(groupedEntries).length > 0 ? (
        Object.entries(groupedEntries).map(([letter, entries]) => (
          <div key={letter} style={{ marginBottom: '2rem' }}>
            <h2 id={letter}>{letter}</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {entries.map((entry) => (
                <li key={entry.term} style={{ marginBottom: '1rem' }}>
                  <a href={entry.link} style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {entry.term}
                  </a>
                  <p style={{ margin: '0.3rem 0 0', color: '#666' }}>
                    {entry.definition}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
