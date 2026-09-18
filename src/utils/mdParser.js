import { formatChapterTitle, getActivityShortTitle } from './formatters.js';

// Markdown Course Parser for NickPocket Edu supporting Course -> Chapter -> Activity -> Question hierarchy

export function parseMarkdownCourse(mdText, fileId = '') {
  const lines = mdText.split(/\r?\n/);
  let courseTitle = 'Unnamed Course';
  let chapters = [];
  let currentChapter = null;
  let currentActivity = null;
  let currentQuestion = null;
  let inDetails = false;
  let inExplanation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Reset section/details state on any header
    if (line.startsWith('#')) {
      inDetails = false;
      inExplanation = false;
    }

    // 1. Course title: # Title
    if (line.startsWith('# ')) {
      courseTitle = line.substring(2).trim();
      continue;
    }

    // 2. Chapter: ## Title
    if (line.startsWith('## ')) {
      currentChapter = {
        id: `chap_${fileId}_${Date.now()}_${chapters.length}`,
        title: formatChapterTitle(line.substring(3).trim()),
        activities: []
      };
      chapters.push(currentChapter);
      currentActivity = null;
      currentQuestion = null;
      continue;
    }

    // Ensure we have a chapter if content appears before any "## "
    const ensureChapter = () => {
      if (!currentChapter) {
        currentChapter = {
          id: `chap_${fileId}_default`,
          title: 'General',
          activities: []
        };
        chapters.push(currentChapter);
      }
    };

    // 3. Activity: ### [Activity: ID] Title or legacy Question ### [Type] Question
    if (line.startsWith('### ')) {
      ensureChapter();
      const rawText = line.substring(4).trim();
      
      // Check if it specifies [Activity: ID]
      const activityMatch = rawText.match(/^\[Activity:\s*([^\]]+)\]/i);
      
      if (activityMatch) {
        const actId = activityMatch[1].trim();
        const actTitle = rawText.substring(activityMatch[0].length).trim();
        
        currentActivity = {
          id: actId,
          title: actTitle,
          questions: []
        };
        currentChapter.activities.push(currentActivity);
        currentQuestion = null;
      } else {
        // Legacy Support: Treating "### [Type] Question" or "### 🙋 CCQ: Question" as an activity containing a single question
        const cleanHeading = rawText.replace(/^[🙋🎯📊⚡☁️🔢💬💡❓📱🎮🏆⏱️]\s*/, '').trim();
        const typeMatch = cleanHeading.match(/^\[?(CCQ|Poll|Survey|Ordering|Game|Short|QA|WordCloud|Pair|Discussion|PairDiscussion|Pair-Discussion|Fill|Cloze|投票|問卷|問卷調查|搶答|文字雲|排序|簡答|問答|問答題|填空|填空題|觀念檢核|雙人討論|分組討論|小組討論|討論|討論題)\]?[:：\s]?(.*)/i);
        
        if (typeMatch) {
          const rawType = typeMatch[1].toLowerCase();
          let qType = rawType;
          if (['qa', 'short', '簡答', '簡答題', '問答', '問答題'].includes(rawType)) qType = 'short';
          else if (['poll', 'survey', '投票', '問卷', '問卷調查'].includes(rawType)) qType = 'poll';
          else if (['game', '搶答', '搶答題'].includes(rawType)) qType = 'game';
          else if (['wordcloud', '文字雲'].includes(rawType)) qType = 'wordcloud';
          else if (['ordering', '排序', '排序題'].includes(rawType)) qType = 'ordering';
          else if (['pair', 'discussion', 'pairdiscussion', 'pair-discussion', '雙人討論', '分組討論', '小組討論', '討論', '討論題'].includes(rawType)) qType = 'pair';
          else if (['fill', 'cloze', '填空', '填空題'].includes(rawType)) qType = 'fill';
          else qType = 'ccq';

          const qText = typeMatch[2].trim() || cleanHeading;
          const actId = `act_${fileId}_${qType}_${Date.now()}_${currentChapter.activities.length}`;
          
          currentActivity = {
            id: actId,
            title: qText,
            questions: []
          };
          
          currentQuestion = {
            id: `q_${Date.now()}_0`,
            type: qType,
            questionText: qText,
            options: qType === 'ccq' ? ['True', 'False', '50-50'] : [],
            correctAnswer: '',
            items: [],
            blanks: [],
            wordBank: [],
            timeLimit: qType === 'game' ? 15 : (qType === 'pair' ? 300 : (qType === 'wordcloud' ? 60 : 0)),
            description: '',
            explanation: ''
          };
          
          currentActivity.questions.push(currentQuestion);
          currentChapter.activities.push(currentActivity);
        } else {
          // General level-3 heading with no type tags (treated as an activity name)
          const actId = `act_${fileId}_${Date.now()}_${currentChapter.activities.length}`;
          currentActivity = {
            id: actId,
            title: rawText,
            questions: []
          };
          currentChapter.activities.push(currentActivity);
          currentQuestion = null;
        }
      }
      continue;
    }

    // 4. Question: #### [Type] Text
    if (line.startsWith('#### ')) {
      ensureChapter();
      
      // Ensure we have an active Activity to attach the question to
      if (!currentActivity) {
        const actId = `act_${fileId}_auto_${Date.now()}`;
        currentActivity = {
          id: actId,
          title: 'Activity',
          questions: []
        };
        currentChapter.activities.push(currentActivity);
      }

      const qTextRaw = line.substring(5).trim();
      const cleanLine = qTextRaw.replace(/^[🙋🎯📊⚡☁️🔢💬💡❓📱🎮🏆⏱️]\s*/, '').trim();
      const typeMatch = cleanLine.match(/^\[?(CCQ|Poll|Survey|Ordering|Game|Short|QA|WordCloud|Pair|Discussion|PairDiscussion|Pair-Discussion|Fill|Cloze|投票|問卷|問卷調查|搶答|文字雲|排序|簡答|問答|問答題|填空|填空題|觀念檢核|雙人討論|分組討論|小組討論|討論|討論題)\]?[:：\s]?(.*)/i);

      if (typeMatch) {
        const rawType = typeMatch[1].toLowerCase();
        let qType = rawType;
        if (['qa', 'short', '簡答', '簡答題', '問答', '問答題'].includes(rawType)) qType = 'short';
        else if (['poll', 'survey', '投票', '問卷', '問卷調查'].includes(rawType)) qType = 'poll';
        else if (['game', '搶答', '搶答題'].includes(rawType)) qType = 'game';
        else if (['wordcloud', '文字雲'].includes(rawType)) qType = 'wordcloud';
        else if (['ordering', '排序', '排序題'].includes(rawType)) qType = 'ordering';
        else if (['pair', 'discussion', 'pairdiscussion', 'pair-discussion', '雙人討論', '分組討論', '小組討論', '討論', '討論題'].includes(rawType)) qType = 'pair';
        else if (['fill', 'cloze', '填空', '填空題'].includes(rawType)) qType = 'fill';
        else qType = 'ccq';

        const qText = typeMatch[2].trim() || cleanLine;

        currentQuestion = {
          id: `q_${Date.now()}_${currentActivity.questions.length}`,
          type: qType,
          questionText: qText,
          options: qType === 'ccq' ? ['True', 'False', '50-50'] : [],
          correctAnswer: '',
          items: [],
          blanks: [],
          wordBank: [],
          timeLimit: qType === 'game' ? 15 : (qType === 'pair' ? 300 : (qType === 'wordcloud' ? 60 : 0)),
          description: '',
          explanation: ''
        };

        currentActivity.questions.push(currentQuestion);
      }
      continue;
    }

    // 5. Question properties (options, answers, timers, explanations)
    if (currentQuestion) {
      // Check for <details> tags
      if (/<details[\s>]/i.test(line)) {
        inDetails = true;
        inExplanation = true;
        continue;
      }
      if (/<\/details>/i.test(line)) {
        inDetails = false;
        inExplanation = false;
        continue;
      }
      if (/<summary[\s>]/i.test(line) || /<\/summary>/i.test(line)) {
        continue;
      }

      // Check for answer headers: **正確答案**：B, Correct Answer: B, etc.
      const cleanForCheck = line.replace(/^[-*]\s+/, '').replace(/^>\s*/, '').trim();
      const ansMatch = cleanForCheck.match(/^\*?\*?(?:正確答案|標準答案|Correct\s*Answer)[:：\s*]+([A-Za-z0-9])/i);
      if (ansMatch) {
        inExplanation = true;
        const val = ansMatch[1].trim().toUpperCase();
        if (!currentQuestion.correctAnswer && /^[A-Z0-9]$/i.test(val)) {
          currentQuestion.correctAnswer = val;
        }
        continue;
      }

      // Check for explanation headers or bullet points: **解析**：..., Option explanations, etc.
      if (
        /^\*?\*?(?:解析|Explanation|詳細解析|答案解析|說明)[:：]/i.test(cleanForCheck) ||
        /^\*?\*?選項\s*[A-Za-z0-9/、\s]+\s*(正確|錯誤|說明)[:：]/i.test(cleanForCheck) ||
        /^\*?\*?[A-Za-z0-9/、\s]+選項\s*(正確|錯誤|說明)[:：]/i.test(cleanForCheck)
      ) {
        inExplanation = true;
        // Infer correct answer from explanation if not yet set
        if (!currentQuestion.correctAnswer) {
          const inferMatch = cleanForCheck.match(/(?:選項\s*([A-Za-z])\s*正確|([A-Za-z])\s*選項正確)/i);
          if (inferMatch) {
            currentQuestion.correctAnswer = (inferMatch[1] || inferMatch[2]).toUpperCase();
          }
        }
        if (cleanForCheck) {
          currentQuestion.explanation = currentQuestion.explanation
            ? `${currentQuestion.explanation}\n${cleanForCheck}`
            : cleanForCheck;
        }
        continue;
      }

      // If we are within a details block or an explanation section, do not parse as options
      if (inDetails || inExplanation) {
        if (!currentQuestion.correctAnswer) {
          const inferMatch = cleanForCheck.match(/(?:選項\s*([A-Za-z])\s*正確|([A-Za-z])\s*選項正確)/i);
          if (inferMatch) {
            currentQuestion.correctAnswer = (inferMatch[1] || inferMatch[2]).toUpperCase();
          }
        }
        if (cleanForCheck && !cleanForCheck.startsWith('<') && !cleanForCheck.startsWith('---')) {
          currentQuestion.explanation = currentQuestion.explanation
            ? `${currentQuestion.explanation}\n${cleanForCheck}`
            : cleanForCheck;
        }
        continue;
      }

      if (line.toLowerCase().startsWith('time:')) {
        const sec = parseInt(line.substring(5).trim());
        if (!isNaN(sec)) {
          currentQuestion.timeLimit = sec;
        }
        continue;
      }

      if (line.toLowerCase().startsWith('correct:')) {
        const val = line.substring(8).trim();
        if (currentQuestion.type === 'ccq') {
          if (/^true/i.test(val)) {
            currentQuestion.correctAnswer = 'A';
          } else if (/^false/i.test(val)) {
            currentQuestion.correctAnswer = 'B';
          } else if (/^50/i.test(val) || /half/i.test(val)) {
            currentQuestion.correctAnswer = 'C';
          } else {
            currentQuestion.correctAnswer = val.toUpperCase();
          }
        } else {
          if (/^[A-Z0-9]$/i.test(val.trim())) {
            currentQuestion.correctAnswer = val.trim().toUpperCase();
          } else {
            currentQuestion.rawCorrectText = val;
          }
        }
        continue;
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const optionText = line.substring(2).trim();

        // Extra safety guard: If the bullet is an explanation line
        if (
          /^\*?\*?(?:正確答案|標準答案|Correct\s*Answer|解析|Explanation|詳細解析|答案解析)[:：]/i.test(optionText) ||
          /^\*?\*?選項\s*[A-Za-z0-9/、\s]+\s*(正確|錯誤|說明)[:：]/i.test(optionText)
        ) {
          inExplanation = true;
          currentQuestion.explanation = currentQuestion.explanation
            ? `${currentQuestion.explanation}\n${optionText}`
            : optionText;
          continue;
        }
        
        if (currentQuestion.type === 'game' || currentQuestion.type === 'poll' || currentQuestion.type === 'ccq') {
          // If CCQ has custom options defined, clear the default True/False/50-50 array on the first option parsed.
          if (currentQuestion.type === 'ccq' && currentQuestion.options.length === 3 && currentQuestion.options[0] === 'True' && currentQuestion.options[1] === 'False') {
            currentQuestion.options = [];
          }

          const isCorrect = optionText.toLowerCase().endsWith('(correct)') || 
                            optionText.endsWith('*') || 
                            optionText.toLowerCase().endsWith('(correct answer)');
          
          let cleanText = optionText;
          if (optionText.toLowerCase().endsWith('(correct answer)')) {
            cleanText = optionText.substring(0, optionText.length - 16).trim();
          } else if (optionText.toLowerCase().endsWith('(correct)')) {
            cleanText = optionText.substring(0, optionText.length - 9).trim();
          } else if (optionText.endsWith('*')) {
            cleanText = optionText.substring(0, optionText.length - 1).trim();
          }

          // Strip redundant option letters such as "A. ", "A、", "A) ", "(A) ", "Option A: ", "A: "
          cleanText = cleanText.replace(/^(\(?[A-Za-z]\)?[.:、\)\-\s]+|Option\s+[A-Za-z][:.\-\s]*)/i, '').trim() || cleanText;

          currentQuestion.options.push(cleanText);

          if (isCorrect && (currentQuestion.type === 'game' || currentQuestion.type === 'ccq')) {
            const idx = currentQuestion.options.length - 1;
            currentQuestion.correctAnswer = String.fromCharCode(65 + idx);
          }
        }

        if (currentQuestion.type === 'fill') {
          currentQuestion.description = currentQuestion.description
            ? `${currentQuestion.description}\n${line}`
            : line;
        }
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '').trim();
        if (currentQuestion.type === 'ordering') {
          currentQuestion.items.push(itemText);
        } else if (currentQuestion.type === 'fill' || currentQuestion.type === 'pair' || currentQuestion.type === 'short') {
          currentQuestion.description = currentQuestion.description
            ? `${currentQuestion.description}\n${line}`
            : line;
        }
        continue;
      }

      // Collect multiline discussion / question prompt descriptions
      if (currentQuestion && (currentQuestion.type === 'pair' || currentQuestion.type === 'short' || currentQuestion.type === 'fill')) {
        const trimmed = line.trim();
        if (
          trimmed && 
          !trimmed.startsWith('#') && 
          !trimmed.startsWith('<!--') && 
          !trimmed.startsWith('[線上作答]') && 
          !trimmed.startsWith('[課堂互動]') && 
          !trimmed.startsWith('<details') && 
          !trimmed.startsWith('</details') && 
          !trimmed.startsWith('<summary') &&
          !trimmed.startsWith('---')
        ) {
          const cleanLineText = line.replace(/^>\s*/, '');
          currentQuestion.description = currentQuestion.description
            ? `${currentQuestion.description}\n${cleanLineText}`
            : cleanLineText;
          continue;
        }
      }
    }
  }

  // Post-processing for matching Game text correct answers and refining activity titles
  chapters.forEach(chap => {
    chap.activities.forEach(act => {
      // Auto-heal: If an activity has a single question that actually embeds multiple sub-questions
      // (e.g. "* 第 1 題... * 第 2 題..." or "第 1 題... 第 2 題..."), split it into distinct questions!
      const expandedQuestions = [];
      act.questions.forEach(q => {
        const fullText = `${q.questionText || ''}\n${q.description || ''}`;
        const questionBulletRegex = /(?:^|[*\-\d.]+\s+|\s+)(?:[*_]{0,2})第\s*(\d+)\s*題(?:【([^】]+)】)?[:：]?([^*]+?)(?=(?:(?:[*\-\d.]+\s+|\s+)(?:[*_]{0,2})第\s*\d+\s*題)|$)/gis;
        const matches = [...fullText.matchAll(questionBulletRegex)];
        
        // If there are at least 2 distinct embedded questions and q.options is empty or default True/False
        if (matches.length >= 2 && (q.options.length <= 3 && (q.options[0] === 'True' || q.options.length === 0))) {
          // Check if there is an options pool in the prompt
          let poolOptions = [];
          const poolMatch = fullText.match(/【(?:八大|十大|各大)?[^】]*選項池】[:：]?\s*([^\n*]+)/i);
          if (poolMatch) {
            poolOptions = poolMatch[1].split(/[｜|]+/).map(opt => opt.replace(/[`*]/g, '').trim()).filter(Boolean);
          }

          matches.forEach((m, subIdx) => {
            const num = m[1];
            const tag = m[2] ? `【${m[2]}】` : '';
            const qContent = m[3].replace(/^[>*\-\s]+/, '').trim();
            const subQ = {
              id: `${q.id}_sub_${num || subIdx}`,
              type: q.type === 'ccq' && /game/i.test(act.id) ? 'game' : q.type,
              questionText: `第 ${num || (subIdx + 1)} 題${tag}：${qContent}`,
              options: poolOptions.length > 0 ? [...poolOptions] : (q.options.length > 0 ? [...q.options] : []),
              correctAnswer: '',
              items: [],
              timeLimit: q.timeLimit || 20,
              description: '',
              explanation: ''
            };
            expandedQuestions.push(subQ);
          });
        } else {
          expandedQuestions.push(q);
        }
      });
      act.questions = expandedQuestions;

      // Ensure activity title is a concise question summary rather than full chapter title
      act.title = getActivityShortTitle(act, chap);

      act.questions.forEach(q => {
        if (q.type === 'fill') {
          parseFillQuestionBlanks(q);
        }

        if (q.type === 'game' && q.rawCorrectText && !q.correctAnswer) {
          const matchedIdx = q.options.findIndex(opt => 
            opt.toLowerCase().trim() === q.rawCorrectText.toLowerCase().trim()
          );
          if (matchedIdx !== -1) {
            q.correctAnswer = String.fromCharCode(65 + matchedIdx);
          }
          delete q.rawCorrectText;
        }
      });
    });
  });

  return {
    id: fileId || `course_${Date.now()}`,
    courseTitle,
    chapters
  };
}

export function parseFillQuestionBlanks(q) {
  const circledMap = {
    '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5,
    '⑥': 6, '⑦': 7, '⑧': 8, '⑨': 9, '⑩': 10,
    '⑪': 11, '⑫': 12, '⑬': 13, '⑭': 14, '⑮': 15,
    '⑯': 16, '⑰': 17, '⑱': 18, '⑲': 19, '⑳': 20
  };
  const numToCircled = ['', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳'];

  const promptText = `${q.questionText || ''}\n${q.description || ''}`;
  const ansText = q.explanation || '';

  const blanksMap = {};

  // 1. Detect all blanks referenced in prompt text
  const promptRegex = /(?:\[\s*)?([①-⑳])(?:\s*_{2,}\s*\])?/g;
  let pm;
  while ((pm = promptRegex.exec(promptText)) !== null) {
    const sym = pm[1];
    const id = circledMap[sym];
    if (id && !blanksMap[id]) {
      blanksMap[id] = {
        id,
        label: sym,
        displayAnswer: '',
        acceptableAnswers: []
      };
    }
  }

  const numRegex = /\[\s*(\d{1,2})\s*_{2,}\s*\]/g;
  let nm;
  while ((nm = numRegex.exec(promptText)) !== null) {
    const id = parseInt(nm[1], 10);
    if (id && !blanksMap[id]) {
      blanksMap[id] = {
        id,
        label: numToCircled[id] || `(${id})`,
        displayAnswer: '',
        acceptableAnswers: []
      };
    }
  }

  // 2. Extract answers from explanation / details
  if (ansText) {
    const ansRegex = /([①-⑳]|\b(?:第\s*)?(\d{1,2})\s*(?:格|小題|題)?[:：])\s*([^①-⑳\n\r]+)/g;
    let am;
    while ((am = ansRegex.exec(ansText)) !== null) {
      let id = null;
      let sym = '';
      if (am[1] && circledMap[am[1]]) {
        sym = am[1];
        id = circledMap[sym];
      } else if (am[2]) {
        id = parseInt(am[2], 10);
        sym = numToCircled[id] || `(${id})`;
      }

      if (!id) continue;

      let raw = am[3].trim().replace(/[、，,；;。]+$/, '').replace(/[`*]/g, '').trim();
      raw = raw.replace(/[①-⑳].*$/, '').trim();
      if (!raw || raw.includes('___')) continue;

      const aliases = new Set();
      const cleanLower = raw.toLowerCase().trim();
      aliases.add(cleanLower);

      const withoutParen = raw.replace(/[（\(][^）\)]+[）\)]/g, ' ').replace(/\s+/g, ' ').trim();
      if (withoutParen) {
        const wpLower = withoutParen.toLowerCase();
        aliases.add(wpLower);
        aliases.add(wpLower.replace(/\s*\/\s*/g, '/'));
        aliases.add(wpLower.replace(/\s*\/\s*/g, ' / '));

        withoutParen.split(/[\/|、,，]+/).forEach(s => {
          const item = s.trim().toLowerCase();
          if (item) {
            aliases.add(item);
            if (item.endsWith('s') && item.length > 3) {
              aliases.add(item.slice(0, -1));
            }
          }
        });
      }

      const parenMatches = raw.match(/[（\(]([^）\)]+)[）\)]/g);
      if (parenMatches) {
        parenMatches.forEach(pm => {
          const inner = pm.replace(/[（\(\)）]/g, '').trim();
          aliases.add(inner.toLowerCase());
          inner.split(/[\/|、,，]+/).forEach(s => {
            const item = s.trim().toLowerCase();
            if (item) {
              aliases.add(item);
              if (item.endsWith('s') && item.length > 3) {
                aliases.add(item.slice(0, -1));
              }
            }
          });
        });
      }

      if (!blanksMap[id]) {
        blanksMap[id] = {
          id,
          label: sym,
          displayAnswer: raw,
          acceptableAnswers: Array.from(aliases)
        };
      } else {
        blanksMap[id].displayAnswer = raw;
        blanksMap[id].acceptableAnswers = Array.from(aliases);
      }
    }
  }

  const blanks = Object.values(blanksMap).sort((a, b) => a.id - b.id);
  q.blanks = blanks;

  // 3. Extract or generate word bank (candidate options pool)
  let wordBank = [];
  const poolMatch = promptText.match(/(?:【(?:詞彙池|選項池|字詞庫|詞庫)池?】|\*\*?(?:詞彙庫|字詞庫|詞庫|選項池|Word\s*Bank)[^：:]*\*?[:：])\s*([\s\S]+?)(?=\n\s*(?:[1-9]\.|\*|【|<details)|$)/i);
  if (poolMatch) {
    wordBank = poolMatch[1].split(/[｜|]+/).map(opt => opt.replace(/[`*\n\r]/g, '').trim()).filter(Boolean);
  } else {
    wordBank = blanks.map(b => b.displayAnswer).filter(Boolean);
  }
  q.wordBank = Array.from(new Set(wordBank));

  return blanks;
}
