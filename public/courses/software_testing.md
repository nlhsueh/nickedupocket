# Software Testing

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


### [Activity: test-patriot-ccq] Patriot Missile Failure CCQ
#### [CCQ] 愛國者反導彈系統（1991）在達蘭基地攔截失效的根本軟體原因為何？
- 通訊網路中斷導致雷達無法傳送指令給飛彈發射架
- 24-bit 時鐘暫存器的浮點捨入誤差在連續運行 100 小時後累加達 0.33 秒 (Correct)
- 程式碼發生記憶體洩漏（Memory Leak）導致作業系統當機
- 雷達演算法誤將美軍戰機辨識為敵方飛毛腿飛彈


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
