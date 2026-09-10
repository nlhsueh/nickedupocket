const mqtt = require('mqtt');

// HiveMQ public WebSocket broker
const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const ROOM_CODE = 'TEST-CH01-GAME';
const STATE_TOPIC = `nickpocket/room/${ROOM_CODE}/state`;
const RESPONSE_TOPIC = `nickpocket/room/${ROOM_CODE}/responses`;

const STUDENTS = [
  '🦊 陳冠宇', '🐼 林子涵', '🦁 黃品睿', '🐨 張宇恩', '🐬 李柏叡', '🦄 吳品妍', '🐯 劉哲維', '🦉 蔡欣妤',
  '🌻 楊承恩', '🌸 許家豪', '🚀 鄭羽彤', '⭐ 謝秉諺', '🍀 洪詩婷', '🍎 曾品翔', '🎈 邱郁婷', '⚡ 周廷睿',
  '🦊 葉宥廷', '🐼 廖庭瑋', '🦁 徐子恩', '🐨 賴冠霖', '🐬 莊睿安', '🦄 施涵予', '🐯 游宸瑋', '🦉 潘彥銘',
  '🌻 顏羽彤', '🌸 宋品豪', '🚀 柯廷恩', '⭐ 翁詩涵', '🍀 魏哲緯', '🍎 唐睿廷', '🎈 孫郁涵', '⚡ 彭宥銘',
  '🦊 范家豪', '🐼 方子睿', '🦁 白品妍', '🐨 姚冠廷', '🐬 譚宇恩', '🦄 鐘廷睿', '🐯 汪庭瑋', '🦉 鄒承恩'
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let activeQuestionIndex = -1;
let activeQuestionType = '';
let questionStartTime = 0;
let answeredInThisRound = new Set();

async function main() {
  console.log(`\n======================================================`);
  console.log(`🎮 NickPocket Edu - 40 人搶答 Game 自動伴跑機器人已啟動！`);
  console.log(`📌 監聽活動代碼：${ROOM_CODE}`);
  console.log(`======================================================\n`);

  const client = mqtt.connect(BROKER, {
    clientId: `game_sim_daemon_${Math.random().toString(16).substr(2, 8)}`,
    clean: true,
    keepalive: 60
  });

  client.on('connect', () => {
    console.log(`✅ 已連線到 HiveMQ Broker！`);
    console.log(`📡 正在訂閱老師端狀態廣播 (${STATE_TOPIC})...\n`);
    client.subscribe(STATE_TOPIC);

    // 40 位學生陸續加入大廳
    console.log(`🚪 40 位學生正在自動加入活動大廳...`);
    STUDENTS.forEach((st, idx) => {
      setTimeout(() => {
        client.publish(RESPONSE_TOPIC, JSON.stringify({
          event: 'join',
          studentName: st,
          timestamp: Date.now()
        }), { qos: 1 });
      }, idx * 60);
    });
    console.log(`👍 40 位學生就緒！請老師隨時在瀏覽器上點擊「開始搶答」！\n`);
  });

  client.on('message', async (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      
      if (payload.event === 'lobby') {
        console.log(`[老師動作] 進入大廳，等待開局...`);
        // 重新廣播 join 確保在大廳都看得到
        STUDENTS.forEach((st, idx) => {
          setTimeout(() => {
            client.publish(RESPONSE_TOPIC, JSON.stringify({
              event: 'join',
              studentName: st,
              timestamp: Date.now()
            }), { qos: 1 });
          }, idx * 40);
        });
      }

      if (payload.event === 'question_start') {
        const qIdx = payload.questionIndex !== undefined ? payload.questionIndex : 0;
        console.log(`\n======================================================`);
        console.log(`🔔 [老師啟動題目] 第 ${qIdx + 1} 題：${payload.questionText}`);
        console.log(`⏱️  作答限時：${payload.timeLimit || 20} 秒`);
        console.log(`⚡ 40 位學生開始即時搶答競速！`);
        console.log(`======================================================`);

        activeQuestionIndex = qIdx;
        questionStartTime = Date.now();
        answeredInThisRound = new Set();

        const opts = payload.options && payload.options.length > 0 
          ? payload.options.map((_, i) => String.fromCharCode(65 + i)) 
          : ['A', 'B', 'C', 'D'];

        // 各題最佳正確答案參考（依 gJustTest.md 題目設定）
        // 第 1 題：邊界值分析 (B)
        // 第 2 題：錯誤 (B)
        // 第 3 題：Shift-Left Testing (B)
        const expectedCorrect = 'B'; 

        // 模擬 40 位學生的搶答速度（手速從 1.2 秒到 8.5 秒分佈）
        const shuffled = [...STUDENTS].sort(() => Math.random() - 0.5);

        shuffled.forEach((st, idx) => {
          // 80% 學生答對 (B)，20% 答錯 (A, C, D)
          const isCorrect = Math.random() < 0.8;
          let chosen = expectedCorrect;
          if (!isCorrect) {
            const wrongOpts = opts.filter(o => o !== expectedCorrect);
            chosen = wrongOpts[Math.floor(Math.random() * wrongOpts.length)] || 'A';
          }

          // 手速延遲：1.2秒 ~ 8.5秒間隔交錯搶答
          const studentElapsed = 1200 + Math.floor(Math.random() * 7000) + (idx * 60);

          setTimeout(() => {
            // 如果此題還在進行中
            if (activeQuestionIndex === qIdx && !answeredInThisRound.has(st)) {
              answeredInThisRound.add(st);
              const sendTime = questionStartTime + studentElapsed;
              
              client.publish(RESPONSE_TOPIC, JSON.stringify({
                event: 'submit_answer',
                studentName: st,
                answer: chosen,
                timestamp: sendTime,
                questionIndex: qIdx
              }), { qos: 1 });

              process.stdout.write(`\r⚡ [搶答中] 已作答: ${answeredInThisRound.size}/40 人 | 最新: ${st} 選擇 ${chosen} (${(studentElapsed/1000).toFixed(1)}s)`);
              
              if (answeredInThisRound.size === 40) {
                console.log(`\n🎉 第 ${qIdx + 1} 題 40 人全數搶答完成！`);
                console.log(`👉 老師端可以隨時查看排行榜，或點擊「下一題」！\n`);
              }
            }
          }, studentElapsed);
        });
      }

      if (payload.event === 'question_stop') {
        console.log(`\n🛑 [老師動作] 本題作答已截止！公佈正確答案與即時排行榜！`);
        console.log(`👉 等待老師瀏覽排行榜後，由老師點擊「下一題」...\n`);
      }

      if (payload.event === 'session_finished') {
        console.log(`\n🏆 [老師動作] 活動圓滿結束！公佈總排行榜頒獎台！\n`);
      }

    } catch (e) {
      console.error('處理訊息出錯:', e);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT 連線錯誤:', err);
  });
}

main();
