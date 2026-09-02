import React from 'react';

/**
 * Safely parses basic inline markdown (**bold**, *italic*, `code`) into React elements.
 */
export function FormattedMarkdown({ text, className = '', style = {} }) {
  if (!text || typeof text !== 'string') return null;

  const parseInline = (str) => {
    if (!str) return [];

    // Split text by markdown tokens: **bold**, `code`, *italic*
    const regex = /(\*\*[\s\S]*?\*\*|`[\s\S]*?`|\*[^*\n]+?\*)/g;
    const parts = str.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // **bold**
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={index} className="md-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // `code`
      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code key={index} className="inline-code">
            {part.slice(1, -1)}
          </code>
        );
      }

      // *italic*
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return (
          <em key={index} className="md-italic">
            {part.slice(1, -1)}
          </em>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const lines = text.split('\n');

  return (
    <span className={className} style={style}>
      {lines.map((line, lIdx) => (
        <React.Fragment key={lIdx}>
          {lIdx > 0 && <br />}
          {parseInline(line)}
        </React.Fragment>
      ))}
    </span>
  );
}

export default FormattedMarkdown;
