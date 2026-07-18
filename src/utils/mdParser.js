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
        title: line.substring(3).trim(),
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
        // Legacy Support: Treating "### [Type] Question" as an activity containing a single question
        const typeMatch = rawText.match(/^\[(CCQ|Poll|Ordering|Game)\]/i);
        if (typeMatch) {
          const qType = typeMatch[1].toLowerCase();
          const qText = rawText.substring(typeMatch[0].length).trim();
          
          // Generate an Activity ID from the title/text slug
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
            timeLimit: qType === 'game' ? 15 : 0
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
      const typeMatch = qTextRaw.match(/^\[(CCQ|Poll|Ordering|Game)\]/i);

      if (typeMatch) {
        const qType = typeMatch[1].toLowerCase();
        const qText = qTextRaw.substring(typeMatch[0].length).trim();

        currentQuestion = {
          id: `q_${Date.now()}_${currentActivity.questions.length}`,
          type: qType,
          questionText: qText,
          options: qType === 'ccq' ? ['True', 'False', '50-50'] : [],
          correctAnswer: '',
          items: [],
          timeLimit: qType === 'game' ? 15 : 0
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
        
        if (currentQuestion.type === 'game' || currentQuestion.type === 'poll') {
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

          currentQuestion.options.push(cleanText);

          if (isCorrect && currentQuestion.type === 'game') {
            const idx = currentQuestion.options.length - 1;
            currentQuestion.correctAnswer = ['A', 'B', 'C', 'D'][idx] || 'A';
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
    }
  }

  // Post-processing for matching Game text correct answers
  chapters.forEach(chap => {
    chap.activities.forEach(act => {
      act.questions.forEach(q => {
        if (q.type === 'game' && q.rawCorrectText && !q.correctAnswer) {
          const matchedIdx = q.options.findIndex(opt => 
            opt.toLowerCase().trim() === q.rawCorrectText.toLowerCase().trim()
          );
          if (matchedIdx !== -1) {
            q.correctAnswer = ['A', 'B', 'C', 'D'][matchedIdx];
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
