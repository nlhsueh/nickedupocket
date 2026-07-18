// Markdown Course Parser for NickPocket Edu

export function parseMarkdownCourse(mdText, fileId = '') {
  const lines = mdText.split(/\r?\n/);
  let courseTitle = 'Unnamed Course';
  let chapters = [];
  let currentChapter = null;
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Course title: # Title
    if (line.startsWith('# ')) {
      courseTitle = line.substring(2).trim();
      continue;
    }

    // Chapter: ## Title
    if (line.startsWith('## ')) {
      currentChapter = {
        id: `chap_${fileId}_${Date.now()}_${chapters.length}`,
        title: line.substring(3).trim(),
        questions: []
      };
      chapters.push(currentChapter);
      currentQuestion = null;
      continue;
    }

    // Question: ### [Type] Text
    if (line.startsWith('### ')) {
      if (!currentChapter) {
        currentChapter = {
          id: `chap_${fileId}_default`,
          title: 'General',
          questions: []
        };
        chapters.push(currentChapter);
      }

      const qTextRaw = line.substring(4).trim();
      const typeMatch = qTextRaw.match(/^\[(CCQ|Poll|Ordering|Game)\]/i);

      if (typeMatch) {
        const qType = typeMatch[1].toLowerCase();
        const qText = qTextRaw.substring(typeMatch[0].length).trim();

        currentQuestion = {
          id: `q_${Date.now()}_${currentChapter.questions.length}`,
          type: qType,
          questionText: qText,
          options: [],
          correctAnswer: '',
          items: [],
          timeLimit: qType === 'game' ? 15 : 0
        };

        if (qType === 'ccq') {
          // CCQs always have exactly: True, False, 50-50
          currentQuestion.options = ['True', 'False', '50-50'];
        }

        currentChapter.questions.push(currentQuestion);
      }
      continue;
    }

    // Parse options, keys, items under active question
    if (currentQuestion) {
      // 1. Time Limit: Time: XX
      if (line.toLowerCase().startsWith('time:')) {
        const sec = parseInt(line.substring(5).trim());
        if (!isNaN(sec)) {
          currentQuestion.timeLimit = sec;
        }
        continue;
      }

      // 2. Correct Answer: Correct: XX
      if (line.toLowerCase().startsWith('correct:')) {
        const val = line.substring(8).trim();
        if (currentQuestion.type === 'ccq') {
          // Map CCQ answers directly to letter index: True -> A, False -> B, 50-50 -> C
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
          // For Game, check if correct matches option text or option index
          if (['A', 'B', 'C', 'D'].includes(val.toUpperCase())) {
            currentQuestion.correctAnswer = val.toUpperCase();
          } else {
            // Save raw text for mapping after we parse all options
            currentQuestion.rawCorrectText = val;
          }
        }
        continue;
      }

      // 3. Option lists: - Option Text or - Option Text (Correct)
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const optionText = line.substring(2).trim();
        
        if (currentQuestion.type === 'game' || currentQuestion.type === 'poll') {
          // Check for trailing (Correct) or asterisks indicating answer
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

      // 4. Ordering items: 1. Item Text
      if (/^\d+\.\s/.test(line)) {
        const itemText = line.replace(/^\d+\.\s/, '').trim();
        if (currentQuestion.type === 'ordering') {
          currentQuestion.items.push(itemText);
        }
        continue;
      }
    }
  }

  // Post-processing for matching rawCorrectText to option index
  chapters.forEach(chap => {
    chap.questions.forEach(q => {
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

  return {
    id: fileId || `course_${Date.now()}`,
    courseTitle,
    chapters
  };
}
