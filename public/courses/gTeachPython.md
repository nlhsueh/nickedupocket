# Python Programming (Python 程式設計)

## Ch 1: Python 導論與環境設定

### [Activity: python-ch01-ccq1] 編譯語言 vs 直譯語言特性 (CCQ 1)
#### [CCQ] 下列關於「編譯語言 (如 C++)」與「直譯語言 (如 Python)」特性的比較敘述，何者正確？
- 直譯語言在執行前必須先花費數分鐘編譯產生 `.exe` 二進位執行檔才能運行。
- 編譯語言通常執行效能極高，但修改程式碼後必須重新編譯；Python 則支援逐行直譯，具備隨改隨測與極佳的跨平台開發彈性。 (Correct)
- Python 直譯器可以直接讓硬體 CPU 執行純英文字串，完全不需經過任何轉譯過程。
- 編譯語言天生不具備型別檢查機制，直譯語言則在編譯期即鎖死型別。

### [Activity: python-ch01-ccq2] 環境變數 PATH 設定與指令 (CCQ 2)
#### [CCQ] 在 Windows 系統安裝 Python 官方安裝檔時，如果遺漏勾選了「Add python.exe to PATH」選項，後續在命令提示字元 (cmd) 中輸入 `python` 指令時，最常遇到什麼問題？
- 電腦螢幕解析度會被自動調降。
- 系統會顯示「'python' 不是內部或外部命令、可執行的程式或批次檔」，因為作業系統不知道去哪個資料夾路徑尋找 `python.exe`。 (Correct)
- 安裝程式會自動格式化硬碟。
- Python 程式碼中的字串會全部變成亂碼。

### [Activity: python-ch01-ccq3] 函式大小寫敏感度 NameError (CCQ 3)
#### [CCQ] 身為 Python 初學者，若你撰寫了一行程式碼 `Print("歡迎學習 Python")`，在執行時系統回報了 `NameError: name 'Print' is not defined`。這項錯誤發生的最主要原因為何？
- 電腦尚未連接網際網路，無法下載字型檔。
- Python 的函式名稱對英文大小寫極度敏感，內建的輸出函式是全小寫的 `print`，大寫開頭的 `Print` 會被視為未宣告的變數。 (Correct)
- 字串必須用三個雙引號包覆才合法。
- Python 不支援在字串中印出繁體中文字元。

## Ch 2: 變數與資料型態

### [Activity: python-ch02-ccq1] 布林值轉換規則 (CCQ 1)
#### [CCQ] 下列程式碼執行後，螢幕上會印出什麼結果？ ```python print(bool(None), bool('False')) ```
- `False False`
- `False True` (Correct)
- `True False`
- `True True`

### [Activity: python-ch02-ccq2] 整數除法與四捨五入 (CCQ 2)
#### [CCQ] 下列程式碼執行後，其輸出結果為何？ ```python print(10 // 4, round(3.5)) ```
- `2.5 4`
- `2 3`
- `2 4` (Correct)
- `2.5 3`

### [Activity: python-ch02-ccq3] 字串切片索引運算 (CCQ 3)
#### [CCQ] 給定字串 `s = "Python"`，執行 `print(s[1:4])` 會印出什麼結果？
- `"yth"` (Correct)
- `"pyth"`
- `"ytho"`
- `"y"`

### [Activity: python-ch02-ccq4] 邏輯運算子優先順序 (CCQ 4)
#### [CCQ] 下列邏輯表達式運算後的結果為何？ ```python is_student = True is_kid = False print(is_student or is_kid and not is_student) ```
- `False`
- `True` (Correct)
- `None`
- `TypeError`

### [Activity: python-ch02-ccq5] with open 檔案安全管理 (CCQ 5)
#### [CCQ] 在 Python 中進行檔案讀寫時，使用 `with open(...)` 的主要優點是什麼？
- 檔案的寫入速度會比傳統 `open()` 快速很多。
- 能自動將寫入的資料進行壓縮，節省硬碟空間。
- 無論程式區塊是否正常執行完畢或發生異常，都會自動安全地關閉檔案。 (Correct)
- 能夠自動修正程式碼中的語法錯誤。

## Ch 3: 串列與容器資料型態

### [Activity: python-ch04-ordering1] List sort 與 sorted 比較 (Ordering 1)
#### [Ordering] ```python d = [1,4,5,2,9,8,7,7,2,6] dc = d.copy() print ('original data d=\t', d) d.sort() print ('after sort d=\t\t', d) d = dc.copy() d.sort(reverse = True) print ('after sort (reverse) d=\t', d) d = dc.copy() r = sorted(d) print ('after sorted, d=\t', d) print ('after sorted, r=\t', r) ``` 輸出： ``` original data d=	 [1, 4, 5, 2, 9, 8, 7, 7, 2, 6] after sort d=		 [1, 2, 2, 4, 5, 6, 7, 7, 8, 9] after sort (reverse) d=	 [9, 8, 7, 7, 6, 5, 4, 2, 2, 1] after sorted, d=	 [1, 4, 5, 2, 9, 8, 7, 7, 2, 6] after sorted, r=	 [1, 2, 2, 4, 5, 6, 7, 7, 8, 9] ``` 排序是我們經常會使用到的一種資料修改，語法很簡單，我們只要用 `data.sort` 就可以把資料作由小到大的做排序。如果今天是想要由大到小的排序的話們可以加上一個參數，`reverse=True`。 另一個函式 `sorted(d)` 並**不會**改變 `d` 的內部資料排序，它會產生另一個 list 來儲存排序後的結果。如上述程式中的 r。

### [Activity: python-ch04-ordering2] 二維串列與 Lambda 排序 (Ordering 2)
#### [Ordering] 當我們對一個二維陣列做排序，會依據每一個的`第一個元素`來做排序。例如在下列的程式中，會依據 `11, 90, 77, 44` 來排序。 ```python grade = [[11, 22, 33], [90, 91, 92], [77, 88, 99], [44, 55, 66]] g1 = sorted(grade) print (g1) # Result: [[11, 22, 33], [44, 55, 66], [77, 88, 99], [90, 91, 92]] ``` 如果我們想用分數的總合來排序呢？這時候可以用 lambda 的運算： ```python # 依據每一個人的成績加總排序 grade = [[11, 22, 33], [90, 91, 92], [77, 88, 99], [44, 55, 66]] g2 = sorted(grade, key=lambda x: sum(x)) print (g2) ``` 結果如下： ``` [[11, 22, 33], [44, 55, 66], [77, 88, 99], [90, 91, 92]] ``` lambda 表示一個簡潔的運算，其指定的 `sum()` 會把陣列內的元素加總，所以分別是 `66 (11+22+33)`,  `273(90+91+92)`, `264(77+88+99)`, `165(44+55+66)`，所代表的索引值為 `0,1,2,3`，但依據總和後的排序應該是 `0,3,2,1`。 又或者我們想依據最後一筆資料來排序，可以用 `x[-1]` 來做排序，結果如下： ```python # 依據物理成績（最後一科) 排序 g3 = sorted(grade, key=lambda x: x[-1]) print (g3) ``` Result: ``` [[11, 22, 33], [44, 55, 66], [90, 91, 92], [77, 88, 99]] ```

### [Activity: python-ch04-ordering3] 氣泡排序法實作 (Ordering 3)
#### [Ordering] > `sort()` 會改變本身的資料; `sorted()` 不會，但會回傳一個已排序的。 以下我們自己寫一個氣泡排序法，藉此更認識 List 的應用。 ```python """ Bubble Sort """ import random # 隨機建立一個100 元素的列表，裡面的數介於1-100之間。 a = [] for i in range(100): a.append(random.randint(1,100)) print(a) s = len(a)   # 資料大小 r = s-1      # 回合 for i in range(1, r+1): print('Round', i) for j in range(0, s-i): if a[j] > a[j+1]: temp = a[j] a[j] = a[j+1] a[j+1] = temp print(a) ```

### [Activity: python-ch04-ccq1] append 與 extend 差異 (CCQ 4)
#### [CCQ] 給定兩個串列 `a = [1, 2]` 與 `b = [3, 4]`。請問執行 `a.append(b)` 與 `a.extend(b)` 兩者運作的結果有何不同？
- 兩者結果皆為 `[1, 2, 3, 4]`。
- 兩者結果皆為 `[1, 2, [3, 4]]`。
- `a.append(b)` 結果為 `[1, 2, [3, 4]]`，而 `a.extend(b)` 結果為 `[1, 2, 3, 4]`。 (Correct)
- `a.append(b)` 結果為 `[1, 2, 3, 4]`，而 `a.extend(b)` 結果為 `[1, 2, [3, 4]]`。

### [Activity: python-ch04-ccq2] 串列切片賦值運算 (CCQ 5)
#### [CCQ] 下列程式碼執行後，螢幕上會印出什麼結果？ ```python x = [1, 2, 3, 4, 5] x[1:3] = [9, 9] print(x) ```
- `[1, 9, 9, 4, 5]` (Correct)
- `[1, 9, 9, 3, 4, 5]`
- `[1, 2, 9, 9, 5]`
- `[1, 9, 9, 9, 5]`

### [Activity: python-ch04-ccq3] Tuple 內嵌可變物件 (CCQ 6)
#### [CCQ] Tuple 內部的元素是否絕對不可變動？下列程式碼執行後的輸出結果為何？ ```python t = (1, 2, [3, 4]) t[2].append(5) print(t) ```
- `TypeError: 'tuple' object does not support item assignment`
- `(1, 2, [3, 4, 5])` (Correct)
- `(1, 2, [3, 4], 5)`
- `(1, 2, [3, 4])`

### [Activity: python-ch04-ccq4] Set 集合無序性比對 (CCQ 7)
#### [CCQ] 下列布林運算表達式執行後的結果為何？ ```python print(set([1, 2, 2, 3]) == set([3, 2, 1])) ```
- `True` (Correct)
- `False`
- `TypeError`
- `None`

### [Activity: python-ch04-ccq5] Dict 字典 Key 型態限制 (CCQ 8)
#### [CCQ] 在 Python 的字典（Dict）物件中，下列哪一種資料型態**不能**被用來當作字典的鍵（Key）？
- 整數 (如 `123`)
- 字串 (如 `"name"`)
- 元組 (如 `(1, 2)`)
- 串列 (如 `[1, 2]`) (Correct)

### [Activity: python-ch04-ordering4] iBike 站點資料排序 (Ordering 9)
#### [Ordering] 因為欄位很多，我們挑選站名，位址，緯度就好。之後進行排序，排序的依據是第三個欄位，也就是 `line11` 的 `x[2]`。 ```python station=[] for st in d: # 站名，位址，緯度 name, addr, lat = st['sna'], st['ar'], st['lat'] item = (name, addr, lat) station.append(item) pprint(station) # 排序 station.sort(key=lambda x: x[2], reverse=True) pprint(station) with open('data/ibikeSorted.txt', 'w') as f: for i in station: f.write(str(i)+'\n') ```

## Ch 4: 函式宣告與參數傳遞

### [Activity: python-ch05-ccq1] 預設參數與位置參數規則 (CCQ 1)
#### [CCQ] 給定函式定義 `def func(a, b=5, c=10): print(a, b, c)`。下列哪一個呼叫方式在 Python 中是**無效的 (Invalid)**，會導致語法錯誤？
- `func(1)`
- `func(a=1, c=20)`
- `func(b=20, 30)` (Correct)
- `func(1, c=20, b=30)`

### [Activity: python-ch05-ccq2] 可變與不可變物件參數修改 (CCQ 2)
#### [CCQ] 下列程式碼執行後，螢幕上會印出什麼結果？ ```python def modify_values(a, b): a = a + 10 b.append(10) x = 5 y = [5] modify_values(x, y) print(x, y) ```
- `5 [5]`
- `15 [5, 10]`
- `5 [5, 10]` (Correct)
- `15 [5]`

### [Activity: python-ch05-ccq3] map 與 filter 組合運用 (CCQ 3)
#### [CCQ] 下列程式碼執行後，其輸出結果為何？ ```python nums = [1, 2, 3, 4] squared_evens = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, nums))) print(squared_evens) ```
- `[1, 4, 9, 16]`
- `[4, 16]` (Correct)
- `[1, 9]`
- `[2, 4]`

### [Activity: python-ch05-ccq4] try-finally 回傳值優先級 (CCQ 4)
#### [CCQ] 下列程式碼執行後，最後在螢幕上會印出什麼結果？ ```python def test_div(a, b): try: return a / b except ZeroDivisionError: return "Cannot divide by zero" finally: return "Always executed" print(test_div(10, 2)) ```
- `5.0`
- `Cannot divide by zero`
- `Always executed` (Correct)
- `5.0` 且換行印出 `Always executed`

## Ch 5: Pandas 資料處理

### [Activity: python-ch06-ccq1] Series loc 與 iloc 索引 (CCQ 1)
#### [CCQ] 在 Pandas 中，若我們建立了 Series `s = pd.Series([10, 20, 30], index=['a', 'b', 'c'])`，下列哪一種存取方式會回傳 `20`？
- 只有 `s['b']` 與 `s.loc['b']`
- 只有 `s[1]` 與 `s.iloc[1]`
- 只有 `s['b']`、`s.loc['b']` 與 `s.iloc[1]`
- 四種方式 `s['b']`、`s[1]`、`s.loc['b']`、`s.iloc[1]` 皆會回傳 `20`。 (Correct)

### [Activity: python-ch06-ccq2] DataFrame loc 與 iloc 差異 (CCQ 2)
#### [CCQ] 已知有一個 DataFrame `df` 內容如下： |    |  A  |  B  | |:---|:----|:----| |  x |  1  |  2  | |  y |  3  |  4  | 請問執行 `df.loc['x', 'B']` 與 `df.iloc[0, 1]` 回傳的值分別為何？
- 兩者皆回傳 `1`。
- `df.loc` 回傳 `2`，`df.iloc` 回傳 `3`。
- 兩者皆回傳 `2`。 (Correct)
- `df.loc` 回傳 `1`，`df.iloc` 回傳 `4`。

### [Activity: python-ch06-ccq3] DataFrame 條件篩選 (CCQ 3)
#### [CCQ] 若要從 DataFrame `df` 中過濾出欄位 `"Age"` 大於 `30` 的所有資料列（Rows），下列哪一個指令是正確的？
- `df[df["Age"] > 30]` (Correct)
- `df.filter("Age > 30")`
- `df.where("Age" > 30)`
- `df[Age > 30]`

### [Activity: python-ch06-ordering1] DataFrame 多欄位排序 (Ordering 4)
#### [Ordering] 資料排序也是經常使用的處理方法，我們可以使用 `df.sort_values(by=c1)` 的方式，也就是依據 c1 欄位排序。 假設我們有一筆資料如下： ```python df = pd.DataFrame({ 'c1': ['A', 'A', 'B', 'Z', 'D', 'C'], 'c2': [2, 1, 9, 8, 7, 4], 'c3': [0, 1, 9, 4, 2, 3], 'c4': ['a', 'B', 'c', 'D', 'e', 'F']}) print (df.sort_valaues(by='c1')) print ('---') df2 = df.sort_values(by=['c1','c2']) print(df2) ``` ``` c1  c2  c3 c4 0  A   2   0  a 1  A   1   1  B 2  B   9   9  c 3  Z   8   4  D 4  D   7   2  e 5  C   4   3  F

### [Activity: python-ch06-ccq4] DataFrame GroupBy 平均計算 (CCQ 5)
#### [CCQ] 給定一個 DataFrame `df`，包含 `"Department"`（部門）與 `"Salary"`（薪水）兩個欄位。若要計算每個部門的平均薪水，下列哪一個指令是正確的？
- `df.groupby("Department")["Salary"].mean()` (Correct)
- `df.groupby("Department").mean("Salary")`
- `df.groupby("Department").average("Salary")`
- `df["Department"].groupby("Salary").mean()`

## Ch 6: 物件導向與類別宣告

### [Activity: python-ch07-ccq1] 類別屬性 vs 實例屬性 (CCQ 1)
#### [CCQ] 給定下列 Python 類別定義： ```python class Counter: count = 0  # 類別屬性 (Class Attribute) def __init__(self): self.count = 1  # 實例屬性 (Instance Attribute) c = Counter() print(Counter.count, c.count) ``` 請問程式執行的輸出結果為何？
- `0 0`
- `0 1` (Correct)
- `1 1`
- 引發 `AttributeError`

### [Activity: python-ch07-ccq2] 私有屬性封裝與存取限制 (CCQ 2)
#### [CCQ] 下列程式碼執行時會發生什麼事？ ```python class Secretive: def __init__(self): self.__code = 42 s = Secretive() print(s.__code) ```
- 正常執行，印出 `42`
- 正常執行，印出 `None`
- 引發 `AttributeError` (Correct)
- 引發 `NameError`

### [Activity: python-ch07-ccq3] 類別繼承與屬性覆寫 (CCQ 3)
#### [CCQ] 給定下列繼承關係程式碼： ```python class Parent: def __init__(self): self.val = 10 class Child(Parent): def __init__(self): self.val = 20 c = Child() print(c.val) ``` 請問程式執行的輸出結果為何？
- `10`
- `20` (Correct)
- 引發 `AttributeError`
- `None`

### [Activity: python-ch07-game1] 抽象類別與方法實作 (Game 4)
#### [Game] 下面的例子中，`GuessGame` 宣告為抽象類別，裡面有抽象方法。透過 `metaclass=ABCMeta` 來宣告為抽象類別。`guess` 上面的 `@abstractmethod` 表示這個方法是一個抽象的。 ```plantuml abstract class GuessGame { +message() {abstract} +guess() {abstract} +go() } ``` ```python import random from abc import ABCMeta, abstractmethod class GuessGame(metaclass=ABCMeta): '設定 metaclass=ABCMeta, GuessGame 才能成為抽象類別' @abstractmethod def message(self, msg): pass @abstractmethod def guess(self): pass def go(self): ' Game 的大部流程，其中 guess 和 message 留給子類別實踐' self.message(self.welcome) number = int(random.random() * 10) while True: guess = self.guess(); if guess > number: self.message(self.bigger) elif guess < number: self.message(self.smaller) else: break self.message(self.correct) ``` 下方的 `ConsoleGame` 繼承了 `GuessGame`，因為它不是抽象的，所以必須實作上方抽象的方法。 ```plantuml GuessGame <|- ConsoleGame ``` `ConsoleGame` 不是以視窗的方式呈現，是命令列的互動方式，所以印出訊息是用 `print()` 的方式。下方第九行 `message()` 的實作說明了 `ConsoleGame` 印出訊息的方法。注意 `GuessGame` 中已經定義 `message()` 是一個抽象方法，`ConsoleGame` 既然已經繼承了，就必須將之實做出來。同理 `guess()` 也是在基礎類別中的抽象方法，`ConsoleGame` 也必須將之時做。下方第13行的實作表明 `guess()` 的運作是留給使用者輸入，系統會給予一個提示字：`輸入數字：`。 ```python class ConsoleGame(GuessGame): def __init__(self): self.welcome = "歡迎" self.prompt = "輸入數字：" self.correct = "猜中了" self.bigger = "太大，猜小一點" self.smaller = "太小，猜大一點" def message(self, msg): print(msg) def guess(self): return int(input(self.prompt)) # g = GuessGame()       # 會產生錯誤 game = ConsoleGame()    # 這樣才對 game.go() ``` 上述最後的程式碼表明了抽象類別不能生成物件。

## Chapter 8: Python 工程與資電應用

### [Activity: python-ch08-ccq1] 8.1.3 隨堂測驗 (CCQ 1)
#### [CCQ] 給定下列電路方程組的 NumPy 方程求解程式碼片段： ```python import numpy as np R_matrix = np.array([[8, -3], [-3, 12]]) V_matrix = np.array([5, 0]) I = np.linalg.solve(R_matrix, V_matrix) ``` 下列關於 `I` 變數的敘述，何者正確？
- `I` 是一個逆矩陣物件，可用 `I.apply()` 進行線性變換。
- `I` 是一個含有兩個浮點數元素的一維 NumPy 陣列，儲存求解出來的電流數值。 (Correct)
- `I` 包含了 `R_matrix` 的特徵值與特徵向量。
- 若 `R_matrix` 是一個行列式值 (Determinant) 為 0 的矩陣，此程式仍可順利執行並回傳全 0 的電流。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `np.linalg.solve` 返回的是方程式的特徵解向量，在本例中是一個 1D Array 儲存 $[I_1, I_2]$。
  * 行列式值為 0（奇異矩陣）時，線性方程式無解或有無限多組解，此時呼叫此方法會拋出 `LinAlgError`，不會返回全 0 結果，故 D 錯誤。
  * 此方法不計算特徵值與特徵向量（那需要使用 `np.linalg.eig`），故 C 錯誤。
</details>

### [Activity: python-ch08-ccq2] 8.1.4 隨堂測驗 (CCQ 2)
#### [CCQ] 在利用 `scipy.integrate.solve_ivp` 求解 RC 充電電路的暫態電壓隨時間變化時，我們需要傳入微分方程函數。下列哪一個微分方程函數的宣告與返回值設計是正確的？（已知 $dV_c/dt = (V_s - V_c)/(RC)$） A) ```python def rc_ode(Vc, t): return (Vs - Vc) / (R * C) ``` B) ```python def rc_ode(t, Vc): return (Vs - Vc) / (R * C) ``` C) ```python def rc_ode(t, y): return (Vs - y) * (R * C) ``` D) ```python def rc_ode(y, t): return (y - Vs) / (R * C) ```

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 在 `scipy.integrate.solve_ivp` 中，微分方程回呼函數的簽章格式預設為 `func(t, y)`，第一個參數為獨立變數時間 `t`，第二個參數為狀態變數 `y`（或是狀態變數陣列）。
  * 物理公式中電壓隨時間變化為 $dV_c/dt = (V_s - V_c)/(RC)$。選項 B 的命名與公式邏輯完全正確。選項 A 和 D 參數順序顛倒，`solve_ivp` 會報錯；選項 C 公式乘除法有誤。
</details>

### [Activity: python-ch08-ccq3] 8.3.3 隨堂測驗 (CCQ 3)
#### [CCQ] 在 PID 控制器的實作中，**積分項 (Integral Term, Ki)** 主要用來解決系統的什麼問題？
- 減少系統在初期的大幅過沖 (Overshoot)。
- 預測系統誤差的未來趨勢。
- 消除系統因摩擦力或熱損失所導致的「穩態誤差/靜態誤差 (Steady-State Error)」。 (Correct)
- 加快系統在初始階段的響應速度。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* **比例項 (Kp)**：主要提供基礎控制力，但若只有比例項，當誤差很小時控制力會不足以克服散熱或摩擦阻力，進而導致殘留的「穩態誤差」。
  * **積分項 (Ki)**：會隨著時間不斷累積殘留的微小誤差，使控制輸出持續放大，直到誤差完全歸零，用以消除靜態誤差。
  * **微分項 (Kd)**：主要用於預測趨勢，對變化率產生反向阻力，藉此抑制波形震盪與減少過沖。
</details>

### [Activity: python-ch08-ccq4] 8.4.2 隨堂測驗 (CCQ 4)
#### [CCQ] 在實體硬體控制中，若微控制器以每 10 毫秒 (10ms) 的速度高頻發送序列埠數據，而 Python 端每 100 毫秒 (100ms) 才讀取一次，在沒有加入硬體流控制（Flow Control）的情況下，通常會發生什麼現象？
- Python 程式會自動提高讀取執行緒的 CPU 運算時脈，維持資料同步。
- 序列埠通訊晶片的硬體或軟體接收緩衝區 (Buffer) 會溢位 (Overflow)，導致舊的數據遺失或接收到的資料出現嚴重滯後與亂碼。 (Correct)
- 由於 Python 的直譯特性，程式會主動要求微控制器降低傳送頻率。
- 電壓訊號會在傳輸線上自動做均值濾波，變成平滑數值。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 序列通訊緩衝區大小有限。如果寫入速度（微控制器 10ms 發送）遠大於讀取速度（Python 100ms 讀取），緩衝區會迅速被塞滿。
  * 緩衝區滿載後，新進來的資料會被直接丟棄（遺失），或者 Python 讀取到的全部都是很久之前的「舊快取資料」，造成資料的嚴重遲滯。
  * 在實際的高頻數據處理中，必須使用高效的多執行緒或異步事件監聽（如 `pyserial` 的背景執行緒讀取機制）以維持同步。
</details>

### [Activity: python-ch08-ccq5] 8.5.2 隨堂測驗 (CCQ 5)
#### [CCQ] 在建立 TCP 網路連線程式設計時，常會使用到 `socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)`。這行設定的主要作用為何？
- 限制同一個 IP 在同一時間內的最大連線次數。
- 將 TCP 連線自動升級為更高傳輸頻寬的 UDP 模式。
- 允許伺服器關閉重啟後，立即重新綁定 (bind) 相同的 Port，避免作業系統因處於 TIME_WAIT 狀態而拒絕綁定。 (Correct)
- 加密傳輸的 Socket 內容以防止駭客竊聽。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* 當一個 TCP 伺服器正常關閉或異常終止時，作業系統的核心通常會將該連接埠保留在 TIME_WAIT 狀態幾分鐘，用以確保所有網路殘留包都已被丟棄。
  * 如果在此期間重新啟動伺服器並嘗試 `bind()`，會拋出 `OSError: [Errno 98] Address already in use`。
  * 設定 `SO_REUSEADDR` 為 1，可以強制允許重用該埠號，這是網路開發中非常實用的經驗設定。
</details>

## Chapter 9: Python 機器學習入門

### [Activity: python-ch09-ccq1] 9.2.5 隨堂測驗 (CCQ 1)
#### [CCQ] 在機器學習中，使用 `GridSearchCV` 進行「超參數網格搜尋與交叉驗證」的主要目的為何？
- 為了加速模型訓練的速度，避免使用 CPU。
- 自動在各種參數組合中，透過交叉驗證找出最能防止過擬合且泛化能力最佳的參數設定。 (Correct)
- 為了將無標籤的資料集進行自動分群。
- 將特徵維度進行降維以利於繪圖。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `GridSearchCV` 會以「窮舉法」測試我們設定的網格內所有參數組合。
  * 對每組參數使用「K-折交叉驗證（K-Fold Cross Validation）」評估，以避免單次資料切片造成的偏差，最終挑選出平均效能最優異的引數組合，故選 B。
</details>

### [Activity: python-ch09-ccq2] 9.2.6 隨堂測驗 (CCQ 2)
#### [CCQ] 當決策樹（Decision Tree）的 `max_depth` (最大深度) 參數設定為 `None`（即不限制樹的深度）時，模型通常會面臨什麼風險？
- 模型會因為結構過於簡單而產生欠擬合 (Underfitting)。
- 決策樹會無法進行多類別分類。
- 決策樹會不斷分裂直到葉節點完全純淨，極易產生過擬合 (Overfitting) 並喪失對新測試資料的預測能力。 (Correct)
- 程式會因為死迴圈而當機。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* 若不限制最大深度，決策樹會盡可能將每一個訓練集樣本分得清清楚楚，甚至「背下」噪聲。
  * 這會導致樹狀圖極其複雜（過擬合），使得在訓練集上準確度為 100%，但在測試集上表現低落。限制樹的深度（剪枝，Pruning）是防止決策樹過擬合的常用手段。
</details>

### [Activity: python-ch09-ccq3] 9.3.5 隨堂測驗 (CCQ 3)
#### [CCQ] 在評估房價預測模型的效能時，若我們算出模型的決定係數 $R^2$ 值為 `0.85`，這代表什麼工程含義？
- 該模型只預測對了 85% 的資料，剩下的 15% 資料全部預測錯誤。
- 該模型所預測的房價比真實房價平均貴了 85 萬元。
- 模型中的自變數（坪數、屋齡等特徵）能夠解釋因變數（房價）中 85% 的變異量。 (Correct)
- 模型有 85% 的機率會產生過擬合。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* $R^2$ 稱為決定係數，衡量的是模型擬合優度。
  * $R^2 = 0.85$ 表示系統總變異量中有 85% 可以由模型的迴歸方程式（自變數）所解釋，是評估迴歸擬合效能最通用的相對指標，故選 C。
</details>

### [Activity: python-ch09-ccq4] 9.4.3 隨堂測驗 (CCQ 4)
#### [CCQ] 在實施 K-Means 分群時，使用「肘部法 (Elbow Method)」繪製曲線圖，下列哪一個關於轉折點（手肘處）的說法是正確的？
- 轉折點代表 Inertia (WCSS) 開始變為負值的地方。
- 轉折點代表在此群數之後，增加群數所能降低的群內誤差和幅度明顯變小，是邊際效應的轉折點。 (Correct)
- 轉折點代表分群準確度達到 100% 的臨界點。
- 轉折點後的 $K$ 值代表模型開始欠擬合。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 當 $K$ 小於真實群數時，增加 $K$ 會劇烈降低誤差和。
  * 一旦 $K$ 超過真實群數，再細分群組所能降低的誤差和就微乎其微。因此，這個折線彎曲的地方就是平衡分群複雜度與誤差的最佳折衷點，故選 B。
</details>

### [Activity: python-ch09-ccq5] 9.5.3 隨堂測驗 (CCQ 5)
#### [CCQ] 在處理具有「類別特徵（如：科系、血型）」的資料時，為什麼通常不建議直接將它們編碼為簡單的整數值（如資工=1, 電機=2, 機械=3），而是使用 One-Hot Encoding？
- 因為 Scikit-Learn 的模型只支援輸入 0 或 1。
- 為了避免模型錯誤地假設這些類別特徵之間存在大小順序或倍數關係。 (Correct)
- One-Hot Encoding 可以自動刪除重複的特徵。
- 整數編碼會佔用十倍以上的記憶體。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 若使用 $1, 2, 3$ 編碼，距離型或線性模型會認為「機械 (3)」與「資工 (1)」的距離比「電機 (2)」大，或者認為科系可以做加減乘除。
  * 這不符合物理語意。One-Hot Encoding 透過將每個類別拉成獨立維度，確保它們彼此正交、距離均等，消除數值大小偏見，故選 B。
</details>

## Ch 9: 人工智慧與 LLM 應用

### [Activity: python-ch10-ccq1] LLM Temperature 溫度調整 (CCQ 1)
#### [CCQ] 在設計一個用來進行「自動寫程式與編譯 Debug」的 AI 軟體工程師代理人時，你應該如何調整 Gemini API 的 `temperature` (溫度) 超參數，以確保程式碼生成的一致性與語法正確度？
- 調高溫度至 1.0 或以上，以激發 AI 的無限創造力。
- 調低溫度至 0.0 或接近 0，使模型生成最確定、最符合標準語法的答案。 (Correct)
- 關閉 Top-P 與 Top-K，只使用 Temperature=1.5。
- 將溫度設為 -1.0。

### [Activity: python-ch10-ccq2] LLM Function Calling 原理 (CCQ 2)
#### [CCQ] 關於大型語言模型 (LLM) 的「Function Calling (工具調用)」機制，下列敘述何者是正確的？
- 該機制允許 LLM 直接繞過作業系統權限，在你的電腦硬碟中自動下載、編譯並執行任何 Python 程式碼。
- LLM 不會直接執行該函數；它僅負責閱讀函數的簽章與說明文檔，並根據使用者意圖輸出一個包含「欲調用之函數名稱與引數數值」的結構化指令，由開發者的本地程式碼負責實際執行。 (Correct)
- Function Calling 是一種用來對 LLM 進行深度微調 (Fine-Tuning) 的演算法。
- 這會將模型的運算速度提升 100 倍。

### [Activity: python-ch10-ccq3] RAG 檢索增強與幻覺抑制 (CCQ 3)
#### [CCQ] 在實作 RAG (檢索增強生成) 系統時，將檢索出來的外部私人參考文件作為「上下文 (Context)」一同送入 LLM 提示詞中，主要是為了解決 LLM 的什麼重大痛點？
- 網路頻寬太慢的問題。
- 解決模型因為訓練資料截止或缺乏私人知識而產生的幻覺 (Hallucination) 問題，並提供有憑有據的回答。
- 提高模型的推理硬體算力。
- 自動將輸入的程式碼進行最佳化編譯。

## Ch 10: 視窗遊戲設計 (Pygame)

### [Activity: python-ch11-ccq1] Pygame 螢幕座標系統 (CCQ 1)
#### [CCQ] 在 Pygame 遊戲設計中，關於螢幕座標系的描述，下列何者正確？
- 原點 $(0, 0)$ 位於螢幕的中心點，向右與向上為正數。
- 原點 $(0, 0)$ 位於螢幕的左上角，向右為 X 軸正方向，向下為 Y 軸正方向。 (Correct)
- 原點 $(0, 0)$ 位於螢幕的左下角，符合傳統數學笛卡爾座標系。
- X 座標增加物體會往左移動，Y 座標增加物體會往上移動。

### [Activity: python-ch11-ccq2] clock.tick 幀率控制 (CCQ 2)
#### [CCQ] 在遊戲迴圈的主程序中，`clock.tick(60)` 這行指令的核心功用為何？
- 限制顯示卡每秒的運算功率，維持電腦處於低溫狀態。
- 阻塞程式執行，直到系統精準經過 60 毫秒。
- 控制遊戲迴圈的每秒幀數 (FPS) 最高為 60，確保遊戲邏輯的更新速度在不同性能的電腦上保持一致。 (Correct)
- 設定遊戲中計時器的初始倒數時間為 60 秒。

### [Activity: python-ch11-ccq3] 雙重緩衝區 Double Buffering (CCQ 3)
#### [CCQ] 在遊戲畫面繪製結束後，我們會呼叫 `pygame.display.flip()`。這項操作背後的圖學機制「雙重緩衝區 (Double Buffering)」主要為解決什麼問題？
- 減少系統記憶體佔用。
- 防止螢幕更新時畫面閃爍與撕裂，讓玩家看不到圖畫繪製的過程。 (Correct)
- 將 2D 座標轉換為 3D 渲染。
- 自動執行物理碰撞演算法。

### [Activity: python-ch11-game1] Sprite 精靈核心屬性 (Game 4)
#### [Game] `Sprite` 是 2D 遊戲中所有活動實體的基類。一個自訂的精靈子類別，內部必須包含兩個最核心的屬性： 1. `self.image`：代表該精靈的畫布或外觀（可以是一張圖片，或是一個自定義形狀畫布）。 2. `self.rect`：一個 `pygame.Rect` 物件，代表該精靈在螢幕上的位置、寬度與高度。

### [Activity: python-ch11-ccq4] Sprite Group 管理與繪製 (CCQ 5)
#### [CCQ] 在 Pygame 中，一個自訂的精靈類別（繼承自 `pygame.sprite.Sprite`）在初始化時，**必須**設定哪兩個變數屬性，才能被精靈群組 (Sprite Group) 正確管理與繪製？
- `self.x` 與 `self.y`
- `self.image`（外觀 Surface）與 `self.rect`（邊框位置 Rect） (Correct)
- `self.speed` 與 `self.direction`
- `self.width` 與 `self.height`

### [Activity: python-ch11-ccq5] groupcollide 多對多碰撞檢測 (CCQ 6)
#### [CCQ] 在太空射擊遊戲中，若要檢測「所有的子彈群組 (bullets)」與「所有的隕石群組 (meteors)」之間的多對多碰撞，並讓相撞的子彈與隕石同時消失，下列哪一個內建函數是最佳且最有效率的選擇？
- `pygame.Rect.colliderect()`
- `pygame.sprite.spritecollide()`
- `pygame.sprite.groupcollide(bullets, meteors, True, True)` (Correct)
- 寫雙重 `for` 迴圈手動計算每一個子彈與隕石的幾何距離。

## Ch 11: Web 開發基礎 (Flask)

### [Activity: python-ch12-ccq1] HTTP GET 與 POST 資安特性 (CCQ 1)
#### [CCQ] 當你在瀏覽器中登入網頁，輸入個人密碼並點擊提交時，網頁前端應該採用哪一種 HTTP 方法將資料傳送到後台 Python 伺服器，以符合資安實務？
- GET 請求，因為 GET 能將密碼直接保存在網址中以便於書籤標記。
- POST 請求，因為 POST 將資料封裝在 HTTP Body 中傳輸，密碼不會外洩在瀏覽器網址列與歷史紀錄中。 (Correct)
- HEAD 請求，因為 HEAD 請求不需要回傳網頁內容。
- DELETE 請求，因為登入後需要將密碼從網頁中銷毀。

### [Activity: python-ch12-ccq2] 伺服器崩潰與 HTTP 狀態碼 (CCQ 2)
#### [CCQ] 當你的 Python Flask 網頁伺服器在執行時，因為讀取了不存在的串列索引而導致程式崩潰當機，此時用戶端瀏覽器最有可能收到哪一個 HTTP 狀態碼？
- 200 OK
- 302 Redirect
- 404 Not Found
- 500 Internal Server Error (Correct)

### [Activity: python-ch12-ccq3] Flask 動態路由與引數擷取 (CCQ 3)
#### [CCQ] 在 Flask 中，指令 `@app.route('/user/<username>')` 的作用為何？
- 將使用者自動導向到特定的資料庫查詢頁面。
- 定義一個路由路徑，並將網址中 `/user/` 後方的文字動態擷取出來，作為引數傳遞給下方對應的視圖處理函式。 (Correct)
- 用來下載特定使用者的所有個人相片檔案。
- 限定只有名為 `username` 的使用者才能訪問該網址。

### [Activity: python-ch12-ccq4] HTML 表單 GET 請求機制 (CCQ 4)
#### [CCQ] 在 HTML 表單的屬性中，`<form action="/query" method="GET">` 這段宣告的意義為何？
- 當使用者提交表單時，瀏覽器會使用 POST 協定將資料隱密地送到 `/query`。
- 表單欄位中的資料會被編碼並附加在網址列（URL）後端，並跳轉至伺服器的 `/query` 路徑進行 GET 請求。 (Correct)
- 這會強行關閉後端的 Python 伺服器以進行資料庫防護。
- 這是一個錯誤宣告，HTML 表單不支援 GET 方法。

## Chapter X01: 課程學習起點與修課調查 (Chapter X01: Course Orientation & Survey)

### [Activity: python-x01-survey] Chapter X01: Python 線上學習背景與學習動機問卷 (7題問卷)
#### [問卷] 第 1 題：請問你目前就讀的系所／學院為何？
- A. 資訊工程學系 (資電學院)
- B. 電機工程學系 (資電學院)
- C. 電子工程學系 (資電學院)
- D. 自動控制工程學系 (資電學院)
- E. 通訊工程學系 (資電學院)
- F. 商學院
- G. 工與應用科學院
- H. 建設與規劃學院
- I. 人文社會學院
- J. 金融學院
- K. 國際科技與管理學院
- L. 理學院
- M. 其他

#### [問卷] 第 2 題：請問你目前的就讀年級為何？
- A. 大一
- B. 大二
- C. 大三
- D. 大四
- E. 碩博士研究生 / 其他

#### [問卷] 第 3 題：你評估自己目前的程式設計基礎程度為何？
- A. 1 分：完全零基礎，第一次接觸寫程式
- B. 2 分：略懂基本語法（如變數、迴圈、判斷式），但不太會獨立撰寫
- C. 3 分：普通程度，曾寫過簡單小程式，能看懂基礎程式碼
- D. 4 分：良好程度，熟悉一門以上程式語言，能獨立解題實作
- E. 5 分：精通熟練，具備專案開發或演算法競賽經驗

#### [問卷] 第 4 題：在日常學習或寫程式時，你是否曾使用過生成式 AI 工具（例如 ChatGPT、Claude、GitHub Copilot）？
- A. 經常使用（已融入日常學習與寫程式流程）
- B. 偶爾使用（卡關或遇到 Bug 報錯時才會詢問）
- C. 僅初步嘗試過，不太熟悉如何有效提問
- D. 從未使用過 AI 工具輔助寫程式

#### [問卷] 第 5 題：在此之前，你是否曾修習過正式的「線上非同步／遠距教學課程」（指計入畢業學分的正式學分課）？
- A. 是，已有修過 1 門（含）以上的線上學分課程經驗
- B. 否，這是我的第一門線上學分課程

#### [問卷] 第 6 題：你選修這門 Python 線上程式設計課程最主要的學習動機為何？
- A. 掌握 Python 核心語法，建立扎實的邏輯思考與解題能力
- B. 應用於未來專題研究、資料科學分析或人工智慧（AI/ML）領域
- C. 培養跨領域程式技能，提升個人未來升學或就業競爭力
- D. 探索自動化腳本、爬蟲與 Web 應用開發
- E. 滿足系所必修或通識選修學分要求

#### [問卷] 第 7 題（開放問答）：請問你對這門 Python 線上程式設計課程有哪些期待、疑問或建議？

## Chapter 10: Python 人工智慧與 LLM 應用

### [Activity: python-ch10-ccq1] 10.1.4 隨堂測驗 (CCQ 1)
#### [CCQ] 在設計一個用來進行「自動寫程式與編譯 Debug」的 AI 軟體工程師代理人時，你應該如何調整 Gemini API 的 `temperature` (溫度) 超參數，以確保程式碼生成的一致性與語法正確度？
- 調高溫度至 1.0 或以上，以激發 AI 的無限創造力。
- 調低溫度至 0.0 或接近 0，使模型生成最確定、最符合標準語法的答案。 (Correct)
- 關閉 Top-P 與 Top-K，只使用 Temperature=1.5。
- 將溫度設為 -1.0。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 對於邏輯推理、程式撰寫、數值計算等任務，我們要求系統「高確定性」且「可重複驗證」，所以必須將溫度降至最低（趨近於 0）。
  * 若溫度調高（如選項 A），AI 生成的程式碼每次呼叫都會大相逕庭，且極易產生隨機的幻覺程式碼，故選 B。
</details>

### [Activity: python-ch10-ccq2] 10.3.4 隨堂測驗 (CCQ 2)
#### [CCQ] 關於大型語言模型 (LLM) 的「Function Calling (工具調用)」機制，下列敘述何者是正確的？
- 該機制允許 LLM 直接繞過作業系統權限，在你的電腦硬碟中自動下載、編譯並執行任何 Python 程式碼。
- LLM 不會直接執行該函數；它僅負責閱讀函數的簽章與說明文檔，並根據使用者意圖輸出一個包含「欲調用之函數名稱與引數數值」的結構化指令，由開發者的本地程式碼負責實際執行。 (Correct)
- Function Calling 是一種用來對 LLM 進行深度微調 (Fine-Tuning) 的演算法。
- 這會將模型的運算速度提升 100 倍。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* LLM 運行於雲端沙盒中，沒有權限也無法直接運作你的本地 Python 函數。
  * 它的本質是「意圖路由與參數擷取器」，告訴你「你該去執行這個函數了，我幫你把參數抓好了」。實際執行是你的程式（本地）的工作，故選 B。
</details>

### [Activity: python-ch10-ccq3] 10.4.2 隨堂測驗 (CCQ 3)
#### [CCQ] 在實作 RAG (檢索增強生成) 系統時，將檢索出來的外部私人參考文件作為「上下文 (Context)」一同送入 LLM 提示詞中，主要是為了解決 LLM 的什麼重大痛點？
- 網路頻寬太慢的問題。
- 解決模型因為訓練資料截止或缺乏私人知識而產生的幻覺 (Hallucination) 問題，並提供有憑有據的回答。 (Correct)
- 提高模型的推理硬體算力。
- 自動將輸入的程式碼進行最佳化編譯。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* RAG 透過「給模型看開卷答案」的方式，讓模型在回答時有具體的參考文本，大幅降低胡說八道（幻覺）的機率，並能附帶來源參考，極具商用價值，故選 B。
</details>

## Chapter 11: Python 視窗遊戲設計 (Pygame)

### [Activity: python-ch11-ccq1] 11.1.4 隨堂測驗 (CCQ 1)
#### [CCQ] 在 Pygame 遊戲設計中，關於螢幕座標系的描述，下列何者正確？
- 原點 $(0, 0)$ 位於螢幕的中心點，向右與向上為正數。
- 原點 $(0, 0)$ 位於螢幕的左上角，向右為 X 軸正方向，向下為 Y 軸正方向。 (Correct)
- 原點 $(0, 0)$ 位於螢幕的左下角，符合傳統數學笛卡爾座標系。
- X 座標增加物體會往左移動，Y 座標增加物體會往上移動。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 電腦螢幕的掃描線是從左到右、從上到下進行更新的，因此大部分的視窗系統與 2D 遊戲引擎皆將左上角定義為原點 $(0,0)$。
  * 故當物體往下移動時，Y 座標會變大，這與傳統數學幾何座標系不同，必須特別注意，故選 B。
</details>

### [Activity: python-ch11-ccq2] 11.1.5 隨堂測驗 (CCQ 2)
#### [CCQ] 在遊戲迴圈的主程序中，`clock.tick(60)` 這行指令的核心功用為何？
- 限制顯示卡每秒的運算功率，維持電腦處於低溫狀態。
- 阻塞程式執行，直到系統精準經過 60 毫秒。
- 控制遊戲迴圈的每秒幀數 (FPS) 最高為 60，確保遊戲邏輯的更新速度在不同性能的電腦上保持一致。 (Correct)
- 設定遊戲中計時器的初始倒數時間為 60 秒。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* 如果沒有使用 `clock.tick(60)`，遊戲迴圈會以電腦 CPU 所能跑的最快速度（例如每秒幾千次）高頻循環。
  * 這會導致遊戲中的角色以光速移動而無法遊玩，且會佔滿 CPU 的單核心資源造成發熱。
  * 限制 FPS 可以讓遊戲更新速度在任何硬體上都維持一致，故選 C。
</details>

### [Activity: python-ch11-ccq3] 11.2.3 隨堂測驗 (CCQ 3)
#### [CCQ] 在遊戲畫面繪製結束後，我們會呼叫 `pygame.display.flip()`。這項操作背後的圖學機制「雙重緩衝區 (Double Buffering)」主要為解決什麼問題？
- 減少系統記憶體佔用。
- 防止螢幕更新時畫面閃爍與撕裂，讓玩家看不到圖畫繪製的過程。 (Correct)
- 將 2D 座標轉換為 3D 渲染。
- 自動執行物理碰撞演算法。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 在雙重緩衝區機制下，系統有兩個畫布：前台緩衝區（顯示在螢幕上）與後台緩衝區（隱藏在記憶體中）。
  * 所有的 `pygame.draw` 繪圖動作都是畫在後台緩衝區。
  * 當呼叫 `flip()` 時，前後台畫布會瞬間切換。這能保證玩家看到的是一張完整畫好的成品幀，避免看到物體一個個被畫出來的殘影與閃爍，故選 B。
</details>

### [Activity: python-ch11-ccq4] 11.3.4 隨堂測驗 (CCQ 4)
#### [CCQ] 在 Pygame 中，一個自訂的精靈類別（繼承自 `pygame.sprite.Sprite`）在初始化時，**必須**設定哪兩個變數屬性，才能被精靈群組 (Sprite Group) 正確管理與繪製？
- `self.x` 與 `self.y`
- `self.image`（外觀 Surface）與 `self.rect`（邊框位置 Rect） (Correct)
- `self.speed` 與 `self.direction`
- `self.width` 與 `self.height`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* Pygame 的 `SpriteGroup.draw()` 方法在繪製成員時，會依序讀取每個 Sprite 的 `self.image` 作為畫布，並讀取 `self.rect` 作為畫面上繪製的 $X, Y$ 座標。
  * 如果缺少這兩個屬性中的任何一個，群組的繪製或更新功能就會拋出錯誤，故選 B。
</details>

### [Activity: python-ch11-ccq1] 11.3.5 隨堂測驗 (CCQ 5)
#### [CCQ] 在太空射擊遊戲中，若要檢測「所有的子彈群組 (bullets)」與「所有的隕石群組 (meteors)」之間的多對多碰撞，並讓相撞的子彈與隕石同時消失，下列哪一個內建函數是最佳且最有效率的選擇？
- `pygame.Rect.colliderect()`
- `pygame.sprite.spritecollide()`
- `pygame.sprite.groupcollide(bullets, meteors, True, True)` (Correct)
- 寫雙重 `for` 迴圈手動計算每一個子彈與隕石的幾何距離。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* `groupcollide` 是專門設計用來處理「群組對群組」碰撞的方法。
  * 後面的兩個 `True` 參數分別代表：當發生碰撞時，自動將第 1 個群組（子彈）與第 2 個群組（隕石）的碰撞成員從其各自的群組中刪除（kill）。
  * 這能用一行程式碼高效替代雙重迴圈，故選 C。
</details>

## Chapter 12: Python Web 開發基礎 (Flask)

### [Activity: python-ch12-ccq1] 12.1.4 隨堂測驗 (CCQ 1)
#### [CCQ] 當你在瀏覽器中登入網頁，輸入個人密碼並點擊提交時，網頁前端應該採用哪一種 HTTP 方法將資料傳送到後台 Python 伺服器，以符合資安實務？
- GET 請求，因為 GET 能將密碼直接保存在網址中以便於書籤標記。
- POST 請求，因為 POST 將資料封裝在 HTTP Body 中傳輸，密碼不會外洩在瀏覽器網址列與歷史紀錄中。 (Correct)
- HEAD 請求，因為 HEAD 請求不需要回傳網頁內容。
- DELETE 請求，因為登入後需要將密碼從網頁中銷毀。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* GET 請求的參數會完全曝露在網址列中（例如：`http://example.com/login?pwd=12345`）。這在資安防護上是極大漏洞（密碼會存在於代理伺服器快取、瀏覽器歷史紀錄中）。
  * 涉及敏感資訊或變更伺服器狀態（寫入、更新）的動作，必須採用 POST 請求，故選 B。
</details>

### [Activity: python-ch12-ccq2] 12.1.5 隨堂測驗 (CCQ 2)
#### [CCQ] 當你的 Python Flask 網頁伺服器在執行時，因為讀取了不存在的串列索引而導致程式崩潰當機，此時用戶端瀏覽器最有可能收到哪一個 HTTP 狀態碼？
- 200 OK
- 302 Redirect
- 404 Not Found
- 500 Internal Server Error (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：D
**解析**：* **500 狀態碼**代表「伺服器內部錯誤」。這通常是由於後端程式（如 Python）在執行邏輯時發生 Exception 且未妥善處理所導致。
  * 404 代表請求的網址不存在；200 代表完全正常；302 代表網頁跳轉，故選 D。
</details>

### [Activity: python-ch12-ccq3] 12.2.3 隨堂測驗 (CCQ 3)
#### [CCQ] 在 Flask 中，指令 `@app.route('/user/<username>')` 的作用為何？
- 將使用者自動導向到特定的資料庫查詢頁面。
- 定義一個路由路徑，並將網址中 `/user/` 後方的文字動態擷取出來，作為引數傳遞給下方對應的視圖處理函式。 (Correct)
- 用來下載特定使用者的所有個人相片檔案。
- 限定只有名為 `username` 的使用者才能訪問該網址。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 這是 Flask 著名的動態路由系統。角括號 `<variable_name>` 會捕獲該網址段落的值，並以同名參數傳入裝飾器下方的函式中，非常適合處理個人檔案頁面（如：`/user/john` 或 `/user/marry`），故選 B。
</details>

### [Activity: python-ch12-ccq4] 12.3.3 隨堂測驗 (CCQ 4)
#### [CCQ] 在 HTML 表單的屬性中，`<form action="/query" method="GET">` 這段宣告的意義為何？
- 當使用者提交表單時，瀏覽器會使用 POST 協定將資料隱密地送到 `/query`。
- 表單欄位中的資料會被編碼並附加在網址列（URL）後端，並跳轉至伺服器的 `/query` 路徑進行 GET 請求。 (Correct)
- 這會強行關閉後端的 Python 伺服器以進行資料庫防護。
- 這是一個錯誤宣告，HTML 表單不支援 GET 方法。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `action` 屬性定義了表單資料的目標接收路徑；`method="GET"` 代表將資料序列化後以 `?key=value` 的 Query String 形式掛載於 URL 尾端。
  * 這非常適合用在搜尋或篩選功能（因為不涉及隱私且可以將網址分享給他人），故選 B。
</details>

## Chapter 1: **Ch01 導論**

### [Activity: python-ch01-ccq1] 1.2.4 隨堂測驗 (CCQ 1)
#### [CCQ] 下列關於「編譯語言 (如 C++)」與「直譯語言 (如 Python)」特性的比較敘述，何者正確？
- 直譯語言在執行前必須先花費數分鐘編譯產生 `.exe` 二進位執行檔才能運行。
- 編譯語言通常執行效能極高，但修改程式碼後必須重新編譯；Python 則支援逐行直譯，具備隨改隨測與極佳的跨平台開發彈性。 (Correct)
- Python 直譯器可以直接讓硬體 CPU 執行純英文字串，完全不需經過任何轉譯過程。
- 編譯語言天生不具備型別檢查機制，直譯語言則在編譯期即鎖死型別。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 編譯語言（如 C/C++）在執行前由編譯器一次性產出機器碼，執行速度快，但更動代碼需重編譯。
  * Python 為直譯語言，由 Python 虛擬機 (PVM) 在執行時期逐行直譯位元組碼，提供極高開發效率與跨平台性，故選 B。
  * 選項 A 描述的是編譯語言；選項 C 錯誤，CPU 無法直接執行英文字串，仍需經過轉譯；選項 D 描述顛倒。
</details>

### [Activity: python-ch01-ccq2] 1.3.5 隨堂測驗 (CCQ 2)
#### [CCQ] 在 Windows 系統安裝 Python 官方安裝檔時，如果遺漏勾選了「Add python.exe to PATH」選項，後續在命令提示字元 (cmd) 中輸入 `python` 指令時，最常遇到什麼問題？
- 電腦螢幕解析度會被自動調降。
- 系統會顯示「'python' 不是內部或外部命令、可執行的程式或批次檔」，因為作業系統不知道去哪個資料夾路徑尋找 `python.exe`。 (Correct)
- 安裝程式會自動格式化硬碟。
- Python 程式碼中的字串會全部變成亂碼。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* **PATH** 是作業系統的「環境變數」，它記錄了一組目錄清單。當你在終端機輸入指令時，系統會依序在 PATH 所列的目錄中尋找執行檔。
  * 勾選該選項會自動將 Python 的安裝路徑加入 PATH 中。若未勾選，系統就找不到 `python.exe` 的位置而拋出命令未找到的錯誤，故選 B。
</details>

### [Activity: python-ch01-ccq3] 1.5.3 隨堂測驗 (CCQ 3)
#### [CCQ] 身為 Python 初學者，若你撰寫了一行程式碼 `Print("歡迎學習 Python")`，在執行時系統回報了 `NameError: name 'Print' is not defined`。這項錯誤發生的最主要原因為何？
- 電腦尚未連接網際網路，無法下載字型檔。
- Python 的函式名稱對英文大小寫極度敏感，內建的輸出函式是全小寫的 `print`，大寫開頭的 `Print` 會被視為未宣告的變數。 (Correct)
- 字串必須用三個雙引號包覆才合法。
- Python 不支援在字串中印出繁體中文字元。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* Python 是區分大小寫 (Case-sensitive) 的語言。`print`、`Print` 與 `PRINT` 在 Python 眼中是三個完全不同的名稱。
  * 官方內建的標準輸出函式是全小寫的 `print()`。若寫成大寫 `Print()`，直譯器會誤以為你在呼叫一個自己定義但尚未宣告的函式或變數，因而拋出 `NameError`，故選 B。
</details>

## Chapter 2: why 變數的型態?

### [Activity: python-ch02-ccq1] 2.2.3 隨堂測驗
#### [CCQ] **第一題** 下列哪一個變數名稱在 Python 中是**無效的 (Invalid)**？
- `_my_var`
- `my-var`
- `myVar2`
- `MYVAR`
#### [CCQ] **第二題** 在 Python 中，`total` 和 `Total` 這兩個變數名稱，請問它們代表的意義是？
- 完全相同，因為 Python 不區分大小寫。
- 語法錯誤，變數名稱不能使用大寫字母。
- 代表兩個不同的變數，因為 Python 區分大小寫。
- 只有 `total` 是有效的變數名稱。
#### [CCQ] **第三題** 下列哪一個選項**不能**被用來當作變數名稱？
- `age`
- `import`
- `address`
- `pi`

### [Activity: python-ch02-ccq2] 2.2.5 隨堂測驗 (CCQ 2)
#### [CCQ] 下列程式碼執行後，螢幕上會印出什麼結果？ ```python print(bool(None), bool('False')) ```
- `False False`
- `False True` (Correct)
- `True False`
- `True True`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `bool(None)`：`None` 物件代表無值或空值，轉換成布林值後一律為 `False`。
  * `bool('False')`：`'False'` 是一個包含五個字元的**非空字串**。根據 Python 的布林轉換規則，任何非空容器/字串轉換成布林值後皆為 `True`。字串的內容是 `'False'` 還是 `'True'` 在轉型時並不影響結果。
</details>

### [Activity: python-ch02-ccq3] 2.3.1.1 隨堂測驗 (CCQ 3)
#### [CCQ] 下列程式碼執行後，其輸出結果為何？ ```python print(10 // 4, round(3.5)) ```
- `2.5 4`
- `2 3`
- `2 4` (Correct)
- `2.5 3`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* `10 // 4`：雙斜線 `//` 代表**整數除法**（取整數商），10 除以 4 的商為 2，餘數為 2，故結果為 `2`。
  * `round(3.5)`：當小數部分恰好為 `0.5` 時，Python 的 `round()` 函數會採用「銀行家捨入法」，捨入到最接近的**偶數**。離 3.5 最近的兩個整數是 3（奇數）與 4（偶數），故結果為 `4`。
</details>

### [Activity: python-ch02-ccq4] 2.3.2.1 隨堂測驗 (CCQ 4)
#### [CCQ] 給定字串 `s = "Python"`，執行 `print(s[1:4])` 會印出什麼結果？
- `"yth"` (Correct)
- `"pyth"`
- `"ytho"`
- `"y"`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* Python 中的字串索引從 0 開始，`s = "Python"` 各字元索引為：`P:0, y:1, t:2, h:3, o:4, n:5`。
  * 切片語法 `s[start:end]` 是**左閉右開**（包含 `start` 索引，但不包含 `end` 索引）。
  * 因此 `s[1:4]` 會取出索引為 `1, 2, 3` 的字元，即 `'y'`, `'t'`, `'h'`，組合後為 `"yth"`。
</details>

### [Activity: python-ch02-ccq5] 2.3.3.1 隨堂測驗 (CCQ 5)
#### [CCQ] 下列邏輯表達式運算後的結果為何？ ```python is_student = True is_kid = False print(is_student or is_kid and not is_student) ```
- `False`
- `True` (Correct)
- `None`
- `TypeError`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 運算子優先順序（Precedence）為：`not` > `and` > `or`。
  * 步驟 1：先處理 `not is_student` -> `not True` -> `False`。
  * 步驟 2：處理 `is_kid and False` -> `False and False` -> `False`。
  * 步驟 3：最後處理 `is_student or False` -> `True or False` -> `True`。
  * 因此，最終結果為 `True`。
</details>

### [Activity: python-ch02-ccq6] 2.4.5.1 隨堂測驗 (CCQ 6)
#### [CCQ] 在 Python 中進行檔案讀寫時，使用 `with open(...)` 的主要優點是什麼？
- 檔案的寫入速度會比傳統 `open()` 快速很多。
- 能自動將寫入的資料進行壓縮，節省硬碟空間。
- 無論程式區塊是否正常執行完畢或發生異常，都會自動安全地關閉檔案。 (Correct)
- 能夠自動修正程式碼中的語法錯誤。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* `with` 語句在 Python 中作為**上下文管理器 (Context Manager)**，能保證在離開 block 時（不論是正常執行結束，或是中途發生 exception 崩留），都會自動呼叫檔案物件的 `close()` 方法，避免佔用記憶體與系統資源。
</details>

## Chapter 3: 變數命名：有意義的變數，避免複雜難懂的邏輯

### [Activity: python-ch03-ccq1] 3.4.1 隨堂測驗 (CCQ 1)
#### [CCQ] ```python g = 98 if g > 90: print ("Class A", end=' ') print ("Good job", end=' ') elif (g > 80): print ("Class B", end=' ') ``` 以下何者正確（複選） - [ ] 因為內縮問題，程式錯誤 - [ ] 第 1 行若改為 g=70, 一樣會印出: Class A Good Job - [ ] 印出 Good job Class B - [ ] 印出 Class B - [ ] elif 錯誤，應該為 else if

<details>
<summary>點擊查看答案與解析</summary>

**解析**：在 `if` 區塊與 `elif` 之間，插入了一行非內縮的 `print ("Good job", end=' ')`。這導致 Python 直譯器認為 `if` 區塊已經結束，後續的 `elif` 找不到對應的 `if`，因而引發語法錯誤（`SyntaxError: invalid syntax`）。
</details>

### [Activity: python-ch03-ccq2] 3.4.2 隨堂測驗 (CCQ 2)
#### [CCQ] 針對以下程式： ```python if g >= 60: print ("pass", end="; ") print ("good", end="; ") elif g >= 50: print ("almost pass", end="; ") if (g >= 90): print ("excellent", end="; ") else: print ("fail", end="; ") print ("not good", end="; ") print ("end of report") ``` 以下何者正確？（複選） - [ ] 當 g 為 0 時，會印出 fail; not good; end of report - [ ] 當 g 為 60 時，會印出 pass; good - [ ] 當 g 為 90 時，會印出 excellent; end of report - [ ] 當 g 為 51 時，會印出 almost pass; end of report - [ ] 當 g 為 90 時，會印出 pass; good; excellent; end of report

<details>
<summary>點擊查看答案與解析</summary>

**解析**：* 當 `g = 0` 時，不滿足 `g >= 60` 與 `g >= 50`，進入 `else` 印出 `fail; not good; `，最後執行外部的 `end of report`。
  * 當 `g = 51` 時，進入 `elif g >= 50`，印出 `almost pass; `；內部巢狀 `if (g >= 90)` 不成立不執行，最後印出 `end of report`。
  * 當 `g = 60` 或 `90` 時，都會進入第一個 `if`，並在最後印出 `end of report`。
</details>

### [Activity: python-ch03-ccq3] 3.4.3 隨堂測驗 (CCQ 3)
#### [CCQ] 針對以下程式： ```python sum = 0 for i in range (1, 10): sum += i print(sum) ``` 請問上述程式碼輸出結果為何? - [ ] 45 - [ ] 44 - [ ] 55 - [ ] 54

<details>
<summary>點擊查看答案與解析</summary>

**解析**：`range(1, 10)` 產生的數列為 $1, 2, 3, 4, 5, 6, 7, 8, 9$（不包含結束值 10）。加總 $1 + 2 + \dots + 9 = 45$。
</details>

### [Activity: python-ch03-ccq4] 3.4.4 隨堂測驗 (CCQ 4)
#### [CCQ] 針對以下的程式： ```python sum = 0 for i in range (2, 10, 2): sum += i print(sum) ``` 請問上述程式碼輸出結果為何? - [ ] 30 - [ ] 45 - [ ] 20 - [ ] 55 - [ ] 25

<details>
<summary>點擊查看答案與解析</summary>

**解析**：`range(2, 10, 2)` 從 2 開始，每次遞增 2，不包含 10，因此產生的數值為 $2, 4, 6, 8$。加總 $2 + 4 + 6 + 8 = 20$。
</details>

### [Activity: python-ch03-ccq5] 3.4.5 隨堂測驗 (CCQ 5)
#### [CCQ] 針對以下的程式： ```python for i in range(4): for j in range(i): print (str(i), end='') print (end='-') ``` 會印出什麼？ - [ ] -1-22-333- - [ ] 1-22-333-4444 - [ ] 1-2-3-4 - [ ] -1-2-3-

<details>
<summary>點擊查看答案與解析</summary>

**解析**：* $i=0$：`range(0)` 內層不執行，印出 `-`
  * $i=1$：`range(1)` 印出 `1`，接著印出 `-` $\rightarrow$ `-1-`
  * $i=2$：`range(2)` 印出 `22`，接著印出 `-` $\rightarrow$ `-1-22-`
  * $i=3$：`range(3)` 印出 `333`，接著印出 `-` $\rightarrow$ `-1-22-333-`
</details>

### [Activity: python-ch03-ccq6] 3.4.6 隨堂測驗 (CCQ 6)
#### [CCQ] 針對以下的程式： ```python g = 98 if g > 90: print ("Class A") print ("Good job") elif (g > 80): print ("Class B") ``` 以下何者正確？ - [ ] 程式錯誤 - [ ] 第一行若改為 g=70, 一樣會印出Class A Good job - [ ] 印出 Class B - [ ] 印出Good job Class B

<details>
<summary>點擊查看答案與解析</summary>

**解析**：`if` 與 `elif` 之間不能插入與其同層級的其他敘述句（`print("Good job")`），這會中斷條件判斷結構，造成 `SyntaxError`。
</details>

### [Activity: python-ch03-ccq7] 3.4.7 隨堂測驗 (CCQ 7)
#### [CCQ] 針對以下的程式： ```python for v in range(2, 11): for i in range (2, v): if v % i == 0: print (v, '不是質數') break else: print (v, '是質數') ``` 何者正確（複選） - [ ] 印出會包含 11是質數 - [ ] 編譯錯誤，else 應與 if 對齊 - [ ] break 會跳出迴圈，所以程式只會印出 2不是質數 - [ ] break 會跳出迴圈，所以程式只會印出 4不是質數 - [ ] 印出包含 7是質數 - [ ] 印出包含 6不是質數

<details>
<summary>點擊查看答案與解析</summary>

**解析**：* `for ... else` 是 Python 特有的合法語法，當迴圈**正常結束（未被 break 中斷）**時會執行 `else` 區塊。
  * `range(2, 11)` 範圍為 2 到 10，不包含 11。
  * 當 $v=7$ 時，內層迴圈沒有任何數能整除 7，正常結束進入 `else`，印出 `7 是質數`。
  * 當 $v=6$ 時，$6 \% 2 == 0$，印出 `6 不是質數` 並 `break` 跳出內層。
</details>

### [Activity: python-ch03-ccq8] 3.4.8 隨堂測驗 (CCQ 8)
#### [CCQ] 執行後 `sum` 的值為何？ ```python sum = 0 for i in range(1, 10, 2): if i == 5: break sum = sum + i print (sum) ```

<details>
<summary>點擊查看答案與解析</summary>

**解析**：`range(1, 10, 2)` 產生的序列為 $1, 3, 5, 7, 9$。
  * $i=1$：$sum = 0 + 1 = 1$
  * $i=3$：$sum = 1 + 3 = 4$
  * $i=5$：觸發 `break` 跳出迴圈。
  * 因此最後印出的 `sum` 值為 `4`。
</details>

### [Activity: python-ch03-ccq9] 3.4.9 隨堂測驗 (CCQ 9)
#### [CCQ] 關於執行時設定中斷點 (breakpoint)，以下何者正確（複選） - [ ] 通常用來幫助除錯 - [ ] 用來跳出迴圈 - [ ] 可以暫時中斷程式的執行，便於觀察變數的變化 - [ ] 可以更有效率的提升程式執行的效率

<details>
<summary>點擊查看答案與解析</summary>

**解析**：中斷點是偵錯工具（Debugger）的功能，讓程式在指定行暫停執行，供開發者檢視當前變數的值與記憶體狀態，它並不能用來加速程式執行或替代迴圈控制指令。
</details>

### [Activity: python-ch03-ccq10] 3.4.10 隨堂測驗 (CCQ 10)
#### [CCQ] 以下程式會印出多少個 `*`？ ```python n = 1 while True: print ('*') n += 2 if n == 100: break ``` - [ ] 0 - [ ] 無窮迴圈 - [ ] 100 - [ ] 101 - [ ] 50

<details>
<summary>點擊查看答案與解析</summary>

**解析**：$n$ 從 1 開始每次加 2，其值序列為 $1, 3, 5, \dots, 99, 101, \dots$，全為奇數，永遠不會等於 100。因此 `if n == 100` 條件永遠不會成立，形成無窮迴圈（Infinite Loop）。
</details>

### [Activity: python-ch03-ccq11] 3.4.11 隨堂測驗 (CCQ 11)
#### [CCQ] 針對以下的程式： ```python sum = 0; grade = 0 while (grade != -999): grade = int (input("input your grade: ")) sum += grade print (sum) ``` 上述的程式執行中，我們依序輸入 100, 98, -999，請問最後印出 `sum` 的值為何？

<details>
<summary>點擊查看答案與解析</summary>

**解析**：* 第 1 次輸入 100：$sum = 0 + 100 = 100$
  * 第 2 次輸入 98：$sum = 100 + 98 = 198$
  * 第 3 次輸入 -999：$sum = 198 + (-999) = -801$
  * 迴圈回到開頭判斷 `grade != -999` 為 False 才跳出，因此旗標值 `-999` 已經被累加進 `sum` 了。
</details>

### [Activity: python-ch03-ccq12] 3.4.12 隨堂測驗 (CCQ 12)
#### [CCQ] 針對以下的程式： ```python x = [20, 30, 90, 90] for i in x: print (i, end = " ") ``` 印出結果為？ - [ ] 20 30 90 90 - [ ] 0 1 2 3 - [ ] 1 2 3 4 - [ ] False False False False

<details>
<summary>點擊查看答案與解析</summary>

**解析**：Python 的 `for i in x:` 會直接遍歷串列（list）中的每一個**元素值**，而非索引（index）。因此迴圈會依序取出 `20`, `30`, `90`, `90` 並印出。
</details>

### [Activity: python-ch03-ccq13] 3.4.13 隨堂測驗 (CCQ 13)
#### [CCQ] 針對以下的程式： ```python import random x = random.randint(4, 50) ``` `x` 的值可能為何？（複選） - [ ] 4 - [ ] 10 - [ ] 50 - [ ] 100 - [ ] 0

<details>
<summary>點擊查看答案與解析</summary>

**解析**：Python 的 `random.randint(a, b)` 會回傳一個介於 $a$ 與 $b$ 之間的整數，且**包含兩端點**（即 $4 \le x \le 50$）。因此 4、10、50 都在可能產生的範圍內。
</details>

## Chapter 4: 放一群人的姓名，型態都是字串

### [Activity: python-ch04-ccq1] 4.1.1 隨堂測驗 (CCQ 1)
#### [CCQ] 給定兩個串列 `a = [1, 2]` 與 `b = [3, 4]`。請問執行 `a.append(b)` 與 `a.extend(b)` 兩者運作的結果有何不同？
- 兩者結果皆為 `[1, 2, 3, 4]`。
- 兩者結果皆為 `[1, 2, [3, 4]]`。
- `a.append(b)` 結果為 `[1, 2, [3, 4]]`，而 `a.extend(b)` 結果為 `[1, 2, 3, 4]`。 (Correct)
- `a.append(b)` 結果為 `[1, 2, 3, 4]`，而 `a.extend(b)` 結果為 `[1, 2, [3, 4]]`。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* `append(x)` 會把傳入的物件 `x` **原封不動地當成單一元素**加到串列尾端。因為 `b` 是一個串列，所以 `a.append(b)` 會將整個 `[3, 4]` 當作一個元素塞進 `a`，得到二維/巢狀串列 `[1, 2, [3, 4]]`。
  * `extend(iterable)` 會**迭代**傳入的容器，將其中的**所有元素拆開**、依序加到串列尾端。所以 `a.extend([3, 4])` 會分別將 `3` 與 `4` 加入，得到扁平串列 `[1, 2, 3, 4]`。
</details>

### [Activity: python-ch04-ccq2] 4.1.2 隨堂測驗 (CCQ 2)
#### [CCQ] 下列程式碼執行後，螢幕上會印出什麼結果？ ```python x = [1, 2, 3, 4, 5] x[1:3] = [9, 9] print(x) ```
- `[1, 9, 9, 4, 5]` (Correct)
- `[1, 9, 9, 3, 4, 5]`
- `[1, 2, 9, 9, 5]`
- `[1, 9, 9, 9, 5]`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* 切片 `x[1:3]` 取出的是索引值為 1 和 2 的子串列（左閉右開，不包含索引 3），即 `[2, 3]`。
  * 賦值操作 `x[1:3] = [9, 9]` 會將被切片選中的 `[2, 3]` 替換為新指定的元素 `[9, 9]`。
  * 因此，原位置的 `2` 與 `3` 被替換成 `9` 與 `9`，結果為 `[1, 9, 9, 4, 5]`。
</details>

### [Activity: python-ch04-ccq3] 4.2.1 隨堂測驗 (CCQ 3)
#### [CCQ] Tuple 內部的元素是否絕對不可變動？下列程式碼執行後的輸出結果為何？ ```python t = (1, 2, [3, 4]) t[2].append(5) print(t) ```
- `TypeError: 'tuple' object does not support item assignment`
- `(1, 2, [3, 4, 5])` (Correct)
- `(1, 2, [3, 4], 5)`
- `(1, 2, [3, 4])`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* Tuple 唯讀/不可變的本質指的是：**Tuple 內部每個位置所存放的「參照位址」是不可改變的**。也就是說，不允許直接修改 Tuple 元素的值（如 `t[2] = [3, 4, 5]` 或 `t[0] = 9` 會報 `TypeError`）。
  * 然而，在本題中，`t[2]` 指向的是一個可變的 **List 串列物件**。當我們呼叫 `t[2].append(5)` 時，只是修改了該串列的內部元素，並沒有改變該串列在 Tuple 中的參照位址。因此，此操作在 Python 中是完全合法的，輸出結果為 `(1, 2, [3, 4, 5])`。
</details>

### [Activity: python-ch04-ccq1] 4.3.1 隨堂測驗 (CCQ 4)
#### [CCQ] 下列布林運算表達式執行後的結果為何？ ```python print(set([1, 2, 2, 3]) == set([3, 2, 1])) ```
- `True` (Correct)
- `False`
- `TypeError`
- `None`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* 集合（Set）具備**元素不重複**的特性，因此 `set([1, 2, 2, 3])` 在建立時會自動去重，轉換成 `{1, 2, 3}`。
  * 集合同時具備**無順序性**的特性，表示集合間的比較與元素排列順序無關。因此，集合 `{1, 2, 3}` 和 `{3, 2, 1}` 包含完全相同的成員，兩者相等比較為 `True`。
</details>

### [Activity: python-ch04-ccq2] 4.4.1 隨堂測驗 (CCQ 5)
#### [CCQ] 在 Python 的字典（Dict）物件中，下列哪一種資料型態**不能**被用來當作字典的鍵（Key）？
- 整數 (如 `123`)
- 字串 (如 `"name"`)
- 元組 (如 `(1, 2)`)
- 串列 (如 `[1, 2]`) (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：D
**解析**：* 字典的鍵（Key）必須是**可雜湊的 (Hashable)**，即該物件在其生命週期內其內容必須是不變（Immutable）的。
  * 整數、字串以及元組（前提是元組內部沒有包含可變物件）都是不可變的，因此能安全作為字典的鍵。
  * 串列（List）是**可變的 (Mutable)**，其內容隨時可以新增修改，其雜湊值會隨之變動，因此為非雜湊物件，若將其作為字典鍵會引發 `TypeError: unhashable type: 'list'`。
</details>

## Chapter 5: hello2(msg = 'Good morning', 'Nick')  # ERROR

### [Activity: python-ch05-ccq1] 5.1.1 隨堂測驗 (CCQ 1)
#### [CCQ] 給定函式定義 `def func(a, b=5, c=10): print(a, b, c)`。下列哪一個呼叫方式在 Python 中是**無效的 (Invalid)**，會導致語法錯誤？
- `func(1)`
- `func(a=1, c=20)`
- `func(b=20, 30)` (Correct)
- `func(1, c=20, b=30)`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* Python 的語法規定：**位置引數（Positional Arguments）必須排在關鍵字引數（Keyword Arguments）之前**。
  * 在 `func(b=20, 30)` 中，第一個引數 `b=20` 是關鍵字引數，而第二個引數 `30` 是位置引數。這違反了引數順序規定，會引發 `SyntaxError: positional argument follows keyword argument`。
  * 其他選項皆合法：選項 A 使用預設值；選項 B 僅指定 a 和 c，b 採預設值；選項 D 位置引數在前，後面關鍵字引數順序無礙。
</details>

### [Activity: python-ch05-ccq2] 5.2.1 隨堂測驗 (CCQ 2)
#### [CCQ] 下列程式碼執行後，螢幕上會印出什麼結果？ ```python def modify_values(a, b): a = a + 10
- append(10)
- `5 [5]`
- `15 [5, 10]`
- `5 [5, 10]` (Correct)
- `15 [5]`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* **不可變物件 (Immutable)**：`x = 5` 是整數，傳入函式後，`a = a + 10` 會在函式內部建立一個新的局部變數 `a` 並指向新整數 `15`，這並不會影響外部全域變數 `x` 的值。故 `x` 仍為 `5`。
  * **可變物件 (Mutable)**：`y = [5]` 是列表，傳入函式後，`b.append(10)` 是在原本列表的記憶體位址上直接進行就地修改（in-place modification）。由於 `b` 和 `y` 指向同一個列表，因此外部的 `y` 內容會同步被修改為 `[5, 10]`。
</details>

### [Activity: python-ch05-ccq3] 5.2.2 隨堂測驗 (CCQ 3)
#### [CCQ] 下列程式碼執行後，其輸出結果為何？ ```python nums = [1, 2, 3, 4] squared_evens = list(map(lambda x: x**2, filter(lambda x: x % 2 == 0, nums))) print(squared_evens) ```
- `[1, 4, 9, 16]`
- `[4, 16]` (Correct)
- `[1, 9]`
- `[2, 4]`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `filter(lambda x: x % 2 == 0, nums)` 負責篩選出偶數，此時只會保留 `[2, 4]`。
  * `map(lambda x: x**2, ...)` 會將篩選後的每個元素進行平方運算：`2**2` 變為 `4`，`4**2` 變為 `16`。
  * 最後用 `list()` 將 map 物件轉換回列表，得到 `[4, 16]`。
</details>

### [Activity: python-ch05-ccq4] 5.3.1 隨堂測驗 (CCQ 4)
#### [CCQ] 下列程式碼執行後，最後在螢幕上會印出什麼結果？ ```python def test_div(a, b): try: return a / b except ZeroDivisionError: return "Cannot divide by zero" finally: return "Always executed" print(test_div(10, 2)) ```
- `5.0`
- `Cannot divide by zero`
- `Always executed` (Correct)
- `5.0` 且換行印出 `Always executed`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* `finally` 區塊在 Python 的例外處理機制中，**不論 try 與 except 內發生什麼事（即使包含 return 或拋出例外），都一定會被執行**。
  * 如果 `finally` 區塊中包含 `return` 語句，它會直接**覆蓋 (override)** try 區塊或 except 區塊中已準備回傳的 return 值。
  * 因此，當程式在 try 內計算出 `5.0` 並準備 return 時，隨後執行的 `finally` 區塊搶先執行了 `return "Always executed"`，覆蓋了原本的回傳值。
</details>

## Chapter 6: 資料處理

### [Activity: python-ch06-ccq1] 6.1.1 隨堂測驗 (CCQ 1)
#### [CCQ] 在 Pandas 中，若我們建立了 Series `s = pd.Series([10, 20, 30], index=['a', 'b', 'c'])`，下列哪一種存取方式會回傳 `20`？
- 只有 `s['b']` 與 `s.loc['b']`
- 只有 `s[1]` 與 `s.iloc[1]`
- 只有 `s['b']`、`s.loc['b']` 與 `s.iloc[1]`
- 四種方式 `s['b']`、`s[1]`、`s.loc['b']`、`s.iloc[1]` 皆會回傳 `20`。 (Correct)

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：D
**解析**：* **標籤索引 (Label-based)**：`s['b']` 和 `s.loc['b']` 會依據我們自訂的標籤索引 `'b'` 來取得對應元素值 `20`。
  * **位置索引 (Position-based)**：即使指定了自訂字串索引，Pandas 仍會保留預設的 0 開始整數位置索引。因此，第 2 個元素（索引位置 1）可透過 `s[1]` 或 `s.iloc[1]` 來存取，同樣會回傳 `20`。
  * 故四者皆為有效存取方式。
</details>

### [Activity: python-ch06-ccq2] 6.1.2 隨堂測驗 (CCQ 2)
#### [CCQ] 已知有一個 DataFrame `df` 內容如下： |    |  A  |  B  | |:---|:----|:----| |  x |  1  |  2  | |  y |  3  |  4  | 請問執行 `df.loc['x', 'B']` 與 `df.iloc[0, 1]` 回傳的值分別為何？
- 兩者皆回傳 `1`。
- `df.loc` 回傳 `2`，`df.iloc` 回傳 `3`。
- 兩者皆回傳 `2`。 (Correct)
- `df.loc` 回傳 `1`，`df.iloc` 回傳 `4`。

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* `df.loc['x', 'B']` 是**標籤型存取**（列標籤為 `'x'`，欄標籤為 `'B'`），對應到的值為 `2`。
  * `df.iloc[0, 1]` 是**位置型存取**（列位置為 0 即第一列 `'x'`，欄位置為 1 即第二欄 `'B'`），對應到的值同樣為 `2`。
  * 因此，兩個表達式都指向同一個儲存格，回傳的值都是 `2`。
</details>

### [Activity: python-ch06-ccq3] 6.1.3 隨堂測驗 (CCQ 3)
#### [CCQ] 若要從 DataFrame `df` 中過濾出欄位 `"Age"` 大於 `30` 的所有資料列（Rows），下列哪一個指令是正確的？
- `df[df["Age"] > 30]` (Correct)
- `df.filter("Age > 30")`
- `df.where("Age" > 30)`
- `df[Age > 30]`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* 在 Pandas 中，過濾資料最標準的方式是使用**布林索引 (Boolean Indexing)**。
  * `df["Age"] > 30` 會先針對每一列進行條件判斷，產生一個由 `True` 和 `False` 組成的 Series。
  * 將此布林 Series 作為索引傳入 `df[...]` 中，DataFrame 就會篩選出所有對應值為 `True` 的 Rows。
</details>

### [Activity: python-ch06-ccq4] 6.2.1 隨堂測驗 (CCQ 4)
#### [CCQ] 給定一個 DataFrame `df`，包含 `"Department"`（部門）與 `"Salary"`（薪水）兩個欄位。若要計算每個部門的平均薪水，下列哪一個指令是正確的？
- `df.groupby("Department")["Salary"].mean()` (Correct)
- `df.groupby("Department").mean("Salary")`
- `df.groupby("Department").average("Salary")`
- `df["Department"].groupby("Salary").mean()`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：A
**解析**：* `df.groupby("Department")`：先以 `"Department"` 欄位作為分組基準。
  * `["Salary"]`：接著從分組後的資料中選取 `"Salary"` 欄位。
  * `.mean()`：最後呼叫 `mean()` 函式計算每一組的平均值。
  * 這是 Pandas 中進行分組聚合（Aggregation）的最標準寫法。其他選項如 `average()` 並非 Pandas 的內建聚合函式。
</details>

## Chapter 7: 類別的宣告

### [Activity: python-ch07-ccq1] 7.1.1 隨堂測驗 (CCQ 1)
#### [CCQ] 給定下列 Python 類別定義： ```python class Counter: count = 0  # 類別屬性 (Class Attribute) def __init__(self):
- count = 1  # 實例屬性 (Instance Attribute)
- `0 0`
- `0 1` (Correct)
- `1 1`
- 引發 `AttributeError`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* `Counter.count` 存取的是定義在類別層級的**類別屬性**，其值為 `0`。它被所有實例共用，但不能透過實例進行直接覆寫（除非特別指定）。
  * `c.count` 存取的是實例 `c` 初始化時在 `__init__` 中建立的**實例屬性**，其值為 `1`。
  * 實例屬性與類別屬性同名時，實例屬性會**遮蔽 (shadow)** 類別屬性，因此存取 `c.count` 會優先返回實例屬性的值 `1`。
</details>

### [Activity: python-ch07-ccq2] 7.1.2 隨堂測驗 (CCQ 2)
#### [CCQ] 下列程式碼執行時會發生什麼事？ ```python class Secretive: def __init__(self):
- __code = 42
- 正常執行，印出 `42`
- 正常執行，印出 `None`
- 引發 `AttributeError` (Correct)
- 引發 `NameError`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：C
**解析**：* 在 Python 中，以兩個底線開頭但不用兩個底線結尾的屬性名稱（例如 `__code`），會觸發 **名稱修飾 (Name Mangling)** 機制。
  * 翻譯器會自動將這個屬性重新命名為 `_ClassName__attributeName`（即 `_Secretive__code`），以避免在繼承關係中意外衝突。
  * 因此，在外部直接透過 `s.__code` 存取該屬性時，會因為找不到此名稱而引發 `AttributeError: 'Secretive' object has no attribute '__code'`。
</details>

### [Activity: python-ch07-ccq3] 7.2.1 隨堂測驗 (CCQ 3)
#### [CCQ] 給定下列繼承關係程式碼： ```python class Parent: def __init__(self):
- val = 10
- val = 20
- `10`
- `20` (Correct)
- 引發 `AttributeError`
- `None`

<details>
<summary>點擊查看答案與解析</summary>

**正確答案**：B
**解析**：* 子類別 `Child` 定義了自己的建構子 `__init__`，這會直接**覆寫 (override)** 父類別 `Parent` 的建構子。
  * 當我們實例化 `Child()` 時，只有子類別的建構子會被執行，其中 `self.val` 被設定為 `20`。
  * 因為子類別建構子內沒有呼叫 `super().__init__()`，所以父類別建構子沒有被執行（但 `self.val` 已經在子類別中建立並賦值），故 `c.val` 回傳的值是 `20`。
</details>
