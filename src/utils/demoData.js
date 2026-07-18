// Default fallback raw markdown data for Software Engineering and Software Testing courses

export const DEFAULT_SE_MD = `# Software Engineering

## Chapter 1: Software Process & Lifecycle

### [Activity: se-lifecycle-ccq] Waterfall Suitability CCQ
#### [CCQ] The Waterfall model is highly suitable for projects with unstable, changing requirements.
Correct: False

### [Activity: se-lifecycle-poll] Class Development Process Poll
#### [Poll] Which development process does your team or class currently use?
- Waterfall
- Scrum / Agile
- Kanban
- Devops / CI-CD
- None / No structured process

### [Activity: se-lifecycle-order] SE Phases Ordering
#### [Ordering] Sort the standard Software Engineering phases in chronological order:
1. Requirements Elicitation
2. System & Architecture Design
3. Coding and Unit Testing
4. Integration & System Testing
5. Deployment & Maintenance

### [Activity: se-manifesto-game] Agile Manifesto Trivia Game
#### [Game] Which of the following is NOT an Agile Manifesto value?
- Individuals and interactions over processes and tools
- Working software over comprehensive documentation
- Following a plan over responding to change (Correct)
- Customer collaboration over contract negotiation
Time: 15

## Chapter 2: Design Patterns

### [Activity: se-singleton-ccq] Singleton Design Pattern CCQ
#### [CCQ] The Singleton pattern ensures a class has only one instance and provides a global point of access to it.
Correct: True

### [Activity: se-bridge-game] Bridge Pattern Trivia Game
#### [Game] Which design pattern is used to decouple an abstraction from its implementation so that the two can vary independently?
- Adapter
- Bridge (Correct)
- Decorator
- Proxy
Time: 20
`;

export const DEFAULT_ST_MD = `# Software Testing

## Chapter 1: Introduction to Testing

### [Activity: test-intro-ccq] Bug Absence CCQ
#### [CCQ] Software testing can prove the absence of bugs in a system.
Correct: False

### [Activity: test-intro-order] Testing Lifecycle Ordering
#### [Ordering] Sort the testing lifecycle steps in order:
1. Requirements Analysis
2. Test Planning
3. Test Case Design
4. Test Environment Setup
5. Test Execution
6. Test Cycle Closure

### [Activity: test-intro-game] Verification vs Validation Game
#### [Game] What is the difference between Verification and Validation?
- Verification is "Are we building the product right?", Validation is "Are we building the right product?" (Correct)
- Verification is dynamic testing, Validation is static testing
- Verification is done by developers, Validation is done by QA engineers
- Verification is unit testing, Validation is system testing
Time: 20

## Chapter 2: Black Box vs. White Box Testing

### [Activity: test-blackwhite-ccq] Boundary Value Analysis CCQ
#### [CCQ] Boundary Value Analysis is a white-box testing technique.
Correct: False

### [Activity: test-blackwhite-game] White-Box Metrics Game
#### [Game] Which of the following coverage metrics is typically used in White-Box testing?
- Statement Coverage (Correct)
- Equivalence Class Coverage
- Boundary Value Coverage
- Use Case Coverage
Time: 15
`;
