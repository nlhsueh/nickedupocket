import { formatChapterTitle, getActivityShortTitle } from './formatters';

// Markdown Course Parser for NickPocket Edu supporting Course -> Chapter -> Activity -> Question hierarchy

export function parseMarkdownCourse(mdText, fileId = '') {
  const lines = mdText.split(/\r?\n/);
  let courseTitle = 'Unnamed Course';
  let chapters = [];
  let currentChapter = null;
  let currentActivity = null;
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

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
        const typeMatch = cleanHeading.match(/^\[?(CCQ|Poll|Survey|Ordering|Game|Short|QA|WordCloud|Pair|Discussion|PairDiscussion|Pair-Discussion|投票|問卷|問卷調查|搶答|文字雲|排序|簡答|觀念檢核|雙人討論|分組討論|小組討論|討論|討論題)\]?[:：\s]?(.*)/i);
        
        if (typeMatch) {
          const rawType = typeMatch[1].toLowerCase();
          let qType = rawType;
          if (['qa', 'short', '簡答', '簡答題'].includes(rawType)) qType = 'short';
          else if (['poll', 'survey', '投票', '問卷', '問卷調查'].includes(rawType)) qType = 'poll';
          else if (['game', '搶答', '搶答題'].includes(rawType)) qType = 'game';
          else if (['wordcloud', '文字雲'].includes(rawType)) qType = 'wordcloud';
          else if (['ordering', '排序', '排序題'].includes(rawType)) qType = 'ordering';
          else if (['pair', 'discussion', 'pairdiscussion', 'pair-discussion', '雙人討論', '分組討論', '小組討論', '討論', '討論題'].includes(rawType)) qType = 'pair';
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
            timeLimit: qType === 'game' ? 15 : (qType === 'pair' ? 300 : (qType === 'wordcloud' ? 60 : 0)),
            description: ''
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
      const typeMatch = cleanLine.match(/^\[?(CCQ|Poll|Survey|Ordering|Game|Short|QA|WordCloud|Pair|Discussion|PairDiscussion|Pair-Discussion|投票|問卷|問卷調查|搶答|文字雲|排序|簡答|觀念檢核|雙人討論|分組討論|小組討論|討論|討論題)\]?[:：\s]?(.*)/i);

      if (typeMatch) {
        const rawType = typeMatch[1].toLowerCase();
        let qType = rawType;
        if (['qa', 'short', '簡答', '簡答題'].includes(rawType)) qType = 'short';
        else if (['poll', 'survey', '投票', '問卷', '問卷調查'].includes(rawType)) qType = 'poll';
        else if (['game', '搶答', '搶答題'].includes(rawType)) qType = 'game';
        else if (['wordcloud', '文字雲'].includes(rawType)) qType = 'wordcloud';
        else if (['ordering', '排序', '排序題'].includes(rawType)) qType = 'ordering';
        else if (['pair', 'discussion', 'pairdiscussion', 'pair-discussion', '雙人討論', '分組討論', '小組討論', '討論', '討論題'].includes(rawType)) qType = 'pair';
        else qType = 'ccq';

        const qText = typeMatch[2].trim() || cleanLine;

        currentQuestion = {
          id: `q_${Date.now()}_${currentActivity.questions.length}`,
          type: qType,
          questionText: qText,
          options: qType === 'ccq' ? ['True', 'False', '50-50'] : [],
          correctAnswer: '',
          items: [],
          timeLimit: qType === 'game' ? 15 : (qType === 'pair' ? 300 : (qType === 'wordcloud' ? 60 : 0)),
          description: ''
        };

        currentActivity.questions.push(currentQuestion);
      }
      continue;
    }

    // 5. Question properties (options, answers, timers)
    if (currentQuestion) {
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
          if (['A', 'B', 'C', 'D'].includes(val.toUpperCase())) {
            currentQuestion.correctAnswer = val.toUpperCase();
          } else {
            currentQuestion.rawCorrectText = val;
          }
        }
        continue;
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const optionText = line.substring(2).trim();
        
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
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '').trim();
        if (currentQuestion.type === 'ordering') {
          currentQuestion.items.push(itemText);
        }
        continue;
      }

      // Collect multiline discussion / question prompt descriptions
      if (currentQuestion && (currentQuestion.type === 'pair' || currentQuestion.type === 'short')) {
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
      // Ensure activity title is a concise question summary rather than full chapter title
      act.title = getActivityShortTitle(act, chap);

      act.questions.forEach(q => {
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
