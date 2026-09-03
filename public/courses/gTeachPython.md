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

## Ch 7: Python 工程與資電應用

### [Activity: python-ch08-ccq1] NumPy 線性方程組求解 (CCQ 1)
#### [CCQ] 給定下列電路方程組的 NumPy 方程求解程式碼片段： ```python import numpy as np R_matrix = np.array([[8, -3], [-3, 12]]) V_matrix = np.array([5, 0]) I = np.linalg.solve(R_matrix, V_matrix) ``` 下列關於 `I` 變數的敘述，何者正確？
- `I` 是一個逆矩陣物件，可用 `I.apply()` 進行線性變換。
- `I` 是一個含有兩個浮點數元素的一維 NumPy 陣列，儲存求解出來的電流數值。 (Correct)
- `I` 包含了 `R_matrix` 的特徵值與特徵向量。
- 若 `R_matrix` 是一個行列式值 (Determinant) 為 0 的矩陣，此程式仍可順利執行並回傳全 0 的電流。

### [Activity: python-ch08-ccq2] SciPy RC 電路微分方程 (CCQ 2)
#### [CCQ] 在利用 `scipy.integrate.solve_ivp` 求解 RC 充電電路的暫態電壓隨時間變化時，我們需要傳入微分方程函數。下列哪一個微分方程函數的宣告與返回值設計是正確的？（已知 $dV_c/dt = (V_s - V_c)/(RC)$） A) ```python def rc_ode(Vc, t): return (Vs - Vc) / (R * C) ``` B) ```python def rc_ode(t, Vc): return (Vs - Vc) / (R * C) ``` C) ```python def rc_ode(t, y): return (Vs - y) * (R * C) ``` D) ```python def rc_ode(y, t): return (y - Vs) / (R * C) ```

### [Activity: python-ch08-ccq3] PID 控制器積分項作用 (CCQ 3)
#### [CCQ] 在 PID 控制器的實作中，**積分項 (Integral Term, Ki)** 主要用來解決系統的什麼問題？
- 減少系統在初期的大幅過沖 (Overshoot)。
- 預測系統誤差的未來趨勢。
- 消除系統因摩擦力或熱損失所導致的「穩態誤差/靜態誤差 (Steady-State Error)」。 (Correct)
- 加快系統在初始階段的響應速度。

### [Activity: python-ch08-ccq4] 序列埠通訊緩衝區溢位 (CCQ 4)
#### [CCQ] 在實體硬體控制中，若微控制器以每 10 毫秒 (10ms) 的速度高頻發送序列埠數據，而 Python 端每 100 毫秒 (100ms) 才讀取一次，在沒有加入硬體流控制（Flow Control）的情況下，通常會發生什麼現象？
- Python 程式會自動提高讀取執行緒的 CPU 運算時脈，維持資料同步。
- 序列埠通訊晶片的硬體或軟體接收緩衝區 (Buffer) 會溢位 (Overflow)，導致舊的數據遺失或接收到的資料出現嚴重滯後與亂碼。 (Correct)
- 由於 Python 的直譯特性，程式會主動要求微控制器降低傳送頻率。
- 電壓訊號會在傳輸線上自動做均值濾波，變成平滑數值。

### [Activity: python-ch08-ccq5] TCP Socket 連線 Port 重用 (CCQ 5)
#### [CCQ] 在建立 TCP 網路連線程式設計時，常會使用到 `socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)`。這行設定的主要作用為何？
- 限制同一個 IP 在同一時間內的最大連線次數。
- 將 TCP 連線自動升級為更高傳輸頻寬的 UDP 模式。
- 允許伺服器關閉重啟後，立即重新綁定 (bind) 相同的 Port，避免作業系統因處於 TIME_WAIT 狀態而拒絕綁定。 (Correct)
- 加密傳輸的 Socket 內容以防止駭客竊聽。

## Ch 8: Python 機器學習入門

### [Activity: python-ch09-ccq1] GridSearchCV 網格搜尋驗證 (CCQ 1)
#### [CCQ] 在機器學習中，使用 `GridSearchCV` 進行「超參數網格搜尋與交叉驗證」的主要目的為何？
- 為了加速模型訓練的速度，避免使用 CPU。
- 自動在各種參數組合中，透過交叉驗證找出最能防止過擬合且泛化能力最佳的參數設定。 (Correct)
- 為了將無標籤的資料集進行自動分群。
- 將特徵維度進行降維以利於繪圖。

### [Activity: python-ch09-ccq2] 決策樹最大深度與過擬合 (CCQ 2)
#### [CCQ] 當決策樹（Decision Tree）的 `max_depth` (最大深度) 參數設定為 `None`（即不限制樹的深度）時，模型通常會面臨什麼風險？
- 模型會因為結構過於簡單而產生欠擬合 (Underfitting)。
- 決策樹會無法進行多類別分類。
- 決策樹會不斷分裂直到葉節點完全純淨，極易產生過擬合 (Overfitting) 並喪失對新測試資料的預測能力。 (Correct)
- 程式會因為死迴圈而當機。

### [Activity: python-ch09-ccq3] 決定係數 R 平方值意義 (CCQ 3)
#### [CCQ] 在評估房價預測模型的效能時，若我們算出模型的決定係數 $R^2$ 值為 `0.85`，這代表什麼工程含義？
- 該模型只預測對了 85% 的資料，剩下的 15% 資料全部預測錯誤。
- 該模型所預測的房價比真實房價平均貴了 85 萬元。
- 模型中的自變數（坪數、屋齡等特徵）能夠解釋因變數（房價）中 85% 的變異量。 (Correct)
- 模型有 85% 的機率會產生過擬合。

### [Activity: python-ch09-ccq4] K-Means 肘部法群數選擇 (CCQ 4)
#### [CCQ] 在實施 K-Means 分群時，使用「肘部法 (Elbow Method)」繪製曲線圖，下列哪一個關於轉折點（手肘處）的說法是正確的？
- 轉折點代表 Inertia (WCSS) 開始變為負值的地方。
- 轉折點代表在此群數之後，增加群數所能降低的群內誤差和幅度明顯變小，是邊際效應的轉折點。 (Correct)
- 轉折點代表分群準確度達到 100% 的臨界點。
- 轉折點後的 $K$ 值代表模型開始欠擬合。

### [Activity: python-ch09-ccq5] 類別特徵 One-Hot 編碼 (CCQ 5)
#### [CCQ] 在處理具有「類別特徵（如：科系、血型）」的資料時，為什麼通常不建議直接將它們編碼為簡單的整數值（如資工=1, 電機=2, 機械=3），而是使用 One-Hot Encoding？
- 因為 Scikit-Learn 的模型只支援輸入 0 或 1。
- 為了避免模型錯誤地假設這些類別特徵之間存在大小順序或倍數關係。 (Correct)
- One-Hot Encoding 可以自動刪除重複的特徵。
- 整數編碼會佔用十倍以上的記憶體。

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

### [Activity: python-x01-survey] Chapter X01: Python 線上學習背景與學習動機問卷 (6題連續問卷)
#### [問卷] 第 1 題：請問你目前就讀的系所／學院為何？
- A. 資訊工程學系 (資電學院)
- B. 電機工程學系 (資電學院)
- C. 電子工程學系 (資電學院)
- D. 自動控制工程學系 (資電學院)
- E. 通訊工程學系 (資電學院)
- F. 其他學院（商學院、工與應用科學院、建設與規劃學院、人文社會學院、金融學院、國際科技與管理學院、理學院等）

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

### [Activity: python-x01-midterm] Chapter X01: 期中考測驗時段偏好調查
#### [Poll] 關於本課程期中考的測驗時間安排，你比較偏好下列哪一個時段？
- A. 下午正常上課時段 (13:10 - 15:00)
- B. 晚上考試時段 (18:00 - 20:00)
- C. 兩個時段皆可配合
