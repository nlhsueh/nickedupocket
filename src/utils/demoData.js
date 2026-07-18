// Default demo activities for CCQ, Poll, Ordering, and Game

export const DEFAULT_ACTIVITIES = [
  {
    id: 'demo-ccq-1',
    type: 'ccq',
    title: 'Software Engineering Concepts (CCQ)',
    description: 'Quick check on basic SE principles.',
    questions: [
      {
        id: 'q-ccq-1',
        questionText: 'Which of the following describes "High Cohesion" in software architecture?',
        options: [
          'A module depends heavily on many other modules in the system.',
          'Elements inside a module belong together and perform a single well-defined task.',
          'A module has multiple unrelated responsibilities.',
          'The module is easily integrated with third-party APIs.'
        ],
        correctAnswer: 'B'
      },
      {
        id: 'q-ccq-2',
        questionText: 'What is the main purpose of Refactoring?',
        options: [
          'Adding new features to an existing codebase.',
          'Optimizing code execution performance during runtime.',
          'Improving internal code structure without changing external behavior.',
          'Fixing critical security bugs before release.'
        ],
        correctAnswer: 'C'
      }
    ]
  },
  {
    id: 'demo-poll-1',
    type: 'poll',
    title: 'Framework Preferences (Poll)',
    description: 'Class preference survey.',
    questions: [
      {
        id: 'q-poll-1',
        questionText: 'Which frontend library/framework do you use most frequently?',
        options: [
          'React',
          'Vue.js',
          'Angular',
          'Svelte / Qwik / Solid',
          'Pure HTML / CSS / Vanilla JS'
        ]
      },
      {
        id: 'q-poll-2',
        questionText: 'How comfortable are you with asynchronous programming in JavaScript?',
        options: [
          'Exceedingly comfortable (I use async/await and Promises daily)',
          'Moderately comfortable (I get the concept, but sometimes struggle with error handling)',
          'Not comfortable (I prefer synchronous code and simple callbacks)'
        ]
      }
    ]
  },
  {
    id: 'demo-ordering-1',
    type: 'ordering',
    title: 'Development Lifecycle (Ordering)',
    description: 'Arrange items in logical progression.',
    questions: [
      {
        id: 'q-order-1',
        questionText: 'Sort the Waterfall model lifecycle phases in the standard order (first to last):',
        items: [
          'Requirements Analysis',
          'System Design',
          'Implementation & Coding',
          'Integration & Testing',
          'Operations & Maintenance'
        ]
      },
      {
        id: 'q-order-2',
        questionText: 'Sort the levels of software testing from lowest to highest granularity:',
        items: [
          'Unit Testing',
          'Integration Testing',
          'System Testing',
          'Acceptance Testing'
        ]
      }
    ]
  },
  {
    id: 'demo-game-1',
    type: 'game',
    title: 'Computer Science Trivia (Real-time Game)',
    description: 'A fast-paced competitive trivia game with speed scoring!',
    questions: [
      {
        id: 'q-game-1',
        questionText: 'Who is widely considered the first computer programmer?',
        options: [
          'Alan Turing',
          'Ada Lovelace',
          'Grace Hopper',
          'Charles Babbage'
        ],
        correctAnswer: 'B',
        timeLimit: 15
      },
      {
        id: 'q-game-2',
        questionText: 'Which of the following data structures operates on a Last-In, First-Out (LIFO) basis?',
        options: [
          'Queue',
          'Stack',
          'Binary Tree',
          'Linked List'
        ],
        correctAnswer: 'B',
        timeLimit: 15
      },
      {
        id: 'q-game-3',
        questionText: 'What is the time complexity of searching a value in a balanced Binary Search Tree (BST) in the average case?',
        options: [
          'O(1)',
          'O(n)',
          'O(log n)',
          'O(n log n)'
        ],
        correctAnswer: 'C',
        timeLimit: 20
      }
    ]
  }
];
