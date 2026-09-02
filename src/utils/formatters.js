/**
 * Utility functions for formatting Chapter and Activity titles
 */

/**
 * Format chapter title to shorten "Chapter X" to "Ch X" so that more characters can fit.
 * e.g., "Chapter 1: 軟體危機、品質..." -> "Ch 1: 軟體危機、品質..."
 * e.g., "**Ch01 導論**" -> "Ch 1: 導論"
 * e.g., "Ch02 變數的型態" -> "Ch 2: 變數的型態"
 */
export function formatChapterTitle(title) {
  if (!title) return '';
  let clean = title.trim();
  
  // Strip outer markdown bold like **Ch01 導論**
  const boldMatch = clean.match(/^\*\*([^*]+)\*\*$/);
  if (boldMatch) {
    clean = boldMatch[1].trim();
  }
  
  // Chapter 1: ... -> Ch 1: ...
  clean = clean.replace(/^Chapter\s*(\d+)\s*[:：]?\s*/i, 'Ch $1: ');
  // Chapter -> Ch
  clean = clean.replace(/^Chapter\s+/i, 'Ch ');
  // Ch01 導論 or Ch01: 導論 -> Ch 1: 導論
  clean = clean.replace(/^Ch0*(\d+)\s*[:：]?\s*/i, (match, num) => {
    return `Ch ${Number(num)}: `;
  });
  // Clean double colons or unnecessary spaces
  clean = clean.replace(/:\s*:\s*/g, ': ').trim();
  return clean;
}

/**
 * Get short concise title for an activity, avoiding repeating the chapter's name.
 * Priority:
 * 1. Cleaned activity title (if distinct from chapter name)
 * 2. Summary/title extracted from first question
 * 3. Fallback to activity title or 'Activity'
 */
export function getActivityShortTitle(activity, chapter = null) {
  if (!activity) return '';

  let title = (activity.title || '').trim();

  // Strip Markdown bold/italic markup if any
  title = title.replace(/^\*\*([^*]+)\*\*$/, '$1').trim();

  // Strip Chapter prefix from activity title if it contains chapter name or Chapter/Ch prefix
  if (chapter && chapter.title) {
    const chapTitleRaw = chapter.title.trim();
    const chapTitleClean = formatChapterTitle(chapTitleRaw);

    if (title.toLowerCase().startsWith(chapTitleRaw.toLowerCase())) {
      title = title.substring(chapTitleRaw.length).trim();
    } else if (title.toLowerCase().startsWith(chapTitleClean.toLowerCase())) {
      title = title.substring(chapTitleClean.length).trim();
    } else {
      // Try stripping chapter name without number e.g. "軟體危機、品質模型..."
      const chapWithoutPrefix = chapTitleClean.replace(/^(?:Ch|Chapter|Unit)\s*\d+\s*[:：]?\s*/i, '').trim();
      if (chapWithoutPrefix && chapWithoutPrefix.length > 3 && title.toLowerCase().startsWith(chapWithoutPrefix.toLowerCase())) {
        title = title.substring(chapWithoutPrefix.length).trim();
      }
    }
  }

  // Strip generic Chapter / Ch patterns: "Chapter 1: ...", "Ch 1: ...", "Unit 1: ..."
  title = title.replace(/^(?:Chapter|Ch|Unit)\s*\d+\s*[:：-]?\s*/i, '').trim();
  title = title.replace(/^\*\*Ch0*\d+\s*.*?\*\*\s*/i, '').trim();

  // Strip leading punctuation/dashes/colons/dots
  title = title.replace(/^[-:：•.\s]+/, '').trim();

  // Check if remaining title is just a generic tag like "CCQ 1", "CCQ", "PAIR 2", "GAME 1", "WORDCLOUD 4", "ORDERING 7", "Activity"
  const isGeneric = !title || /^(CCQ|PAIR|WORDCLOUD|ORDERING|POLL|GAME|QA|Short|Activity)\s*\d*$/i.test(title);

  // If generic, derive short title from first question
  if (isGeneric && activity.questions && activity.questions.length > 0) {
    const firstQ = activity.questions[0];
    let qText = firstQ.questionText || '';

    // Clean question prompt text:
    qText = qText.replace(/^[>\s*#\-•]+/g, '').trim();
    qText = qText.replace(/^\[?(CCQ|Poll|Ordering|Game|Short|QA|WordCloud|Pair)\]?[:：\s]*/i, '').trim();
    qText = qText.replace(/^\*\*(討論任務|正確答案|第\s*\d+\s*題[^:*]*?)[\*:\s：]+/i, '').trim();
    qText = qText.replace(/\(Correct\)/gi, '').trim();
    qText = qText.replace(/```[\s\S]*?```/g, '').trim(); // Remove code blocks if at start

    // Take first line or first sentence
    const firstLine = qText.split(/\r?\n/)[0].trim();
    
    // Trim length if very long (around 32 characters)
    const summary = firstLine.length > 32 ? firstLine.substring(0, 30) + '...' : firstLine;
    
    if (summary) {
      // Include question type suffix if available in original title, e.g. " (CCQ 1)"
      const typeMatch = (activity.title || '').match(/(CCQ\s*\d+|PAIR\s*\d+|GAME\s*\d+|WORDCLOUD\s*\d+|ORDERING\s*\d+|POLL\s*\d+|QA\s*\d+)/i);
      if (typeMatch) {
        return `${summary} (${typeMatch[1]})`;
      }
      return summary;
    }
  }

  return title || 'Activity';
}
