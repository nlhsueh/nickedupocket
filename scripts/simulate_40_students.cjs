const mqtt = require('mqtt');

// HiveMQ public WebSocket broker (same as nickedupocket client)
const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const ROOM_CODE = 'NICK-MENTORING-SURVEY';
const TOPIC = `nickpocket/room/${ROOM_CODE}/responses`;

const FIRST_NAMES = [
  '陳冠宇', '林子涵', '黃品睿', '張宇恩', '李柏叡', '吳品妍', '劉哲維', '蔡欣妤',
  '楊承恩', '許家豪', '鄭羽彤', '謝秉諺', '洪詩婷', '曾品翔', '邱郁婷', '周廷睿',
  '葉宥廷', '廖庭瑋', '徐子恩', '賴冠霖', '莊睿安', '施涵予', '游宸瑋', '潘彥銘',
  '顏羽彤', '宋品豪', '柯廷恩', '翁詩涵', '魏哲緯', '唐睿廷', '孫郁涵', '彭宥銘',
  '范家豪', '方子睿', '白品妍', '姚冠廷', '譚宇恩', '鐘廷睿', '汪庭瑋', '鄒承恩'
];

const EMOJIS = ['🦊', '🐼', '🦁', '🐨', '🐬', '🦄', '🐯', '🦉', '🌻', '🌸', '🚀', '⭐', '🍀', '🍎', '🎈', '⚡'];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomChoice(options, weights) {
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < options.length; i++) {
    cumulative += (weights ? weights[i] : 1 / options.length);
    if (rand <= cumulative) return options[i];
  }
  return options[options.length - 1];
}

async function runSimulation() {
  console.log(`📡 連線至 HiveMQ Broker: ${BROKER}...`);
  const client = mqtt.connect(BROKER, {
    clientId: `sim_stress_${Math.random().toString(16).substr(2, 8)}`,
    clean: true,
    keepalive: 60
  });

  await new Promise((resolve, reject) => {
    client.on('connect', () => {
      console.log('✅ MQTT 連線成功！準備模擬 40 位學生陸續加入並填寫問卷...');
      resolve();
    });
    client.on('error', reject);
  });

  // Step 1: 40 位學生陸續掃碼加入大廳 (每位間隔 100~300ms)
  console.log('\n🚪 第一階段：40 位學生陸續掃描 QR Code 進入大廳...');
  const students = [];

  for (let i = 0; i < 40; i++) {
    const emoji = EMOJIS[i % EMOJIS.length];
    const name = `${emoji} ${FIRST_NAMES[i] || `學生${i + 1}`}`;
    students.push(name);

    client.publish(TOPIC, JSON.stringify({
      event: 'join',
      studentName: name,
      timestamp: Date.now()
    }), { qos: 1 });

    process.stdout.write(`\r已加入大廳: ${i + 1}/40 位學生 (${name})`);
    await sleep(80 + Math.random() * 120); // 80ms ~ 200ms 加入延遲
  }

  console.log('\n\n⏳ 第二階段：學生思考中... 即將開始模擬「個別作答時間」陸續交卷！');
  await sleep(2000); // 模擬剛看到問卷思考 2 秒

  // Step 2: 40 位學生以真實自然的作答時間差（1 秒到 25 秒間隔交錯）提交問卷
  // 將學生打亂順序交卷
  const shuffledStudents = [...students].sort(() => Math.random() - 0.5);

  let submittedCount = 0;
  for (const st of shuffledStudents) {
    // 模擬真實作答選項分佈
    const answers = {
      0: getRandomChoice(['A', 'B', 'C', 'D'], [0.4, 0.35, 0.15, 0.1]), // 背景來源
      1: getRandomChoice(['A', 'B'], [0.85, 0.15]),                      // 逢甲食物喜歡嗎
      2: getRandomChoice(['A', 'B', 'C', 'D'], [0.05, 0.85, 0.05, 0.05]), // 新大樓：共善樓
      3: getRandomChoice(['A', 'B', 'C', 'D', 'E'], [0.25, 0.35, 0.25, 0.1, 0.05]), // MBTI
      4: getRandomChoice(['A', 'B', 'C', 'D'], [0.1, 0.7, 0.15, 0.05])  // 校園面積：16.5 公頃
    };

    client.publish(TOPIC, JSON.stringify({
      event: 'submit_survey',
      studentName: st,
      answers: answers,
      timestamp: Date.now()
    }), { qos: 1 });

    submittedCount++;
    const pct = Math.round((submittedCount / 40) * 100);
    process.stdout.write(`\r📝 提交進度: ${submittedCount}/40 (${pct}%) - 剛剛提交: ${st}`);

    // 每位學生提交的時間差：模擬 300ms ~ 900ms 的交卷間隔
    const thinkingDelay = 350 + Math.floor(Math.random() * 550);
    await sleep(thinkingDelay);
  }

  console.log('\n\n🎉 40 位學生全部作答完成並成功交卷！老師端畫面的進度條應已達到 100% (40/40)！');
  
  // 維持連線 2 秒確保封包全數送達後斷開
  await sleep(2000);
  client.end();
  console.log('連線已安全釋放。');
}

runSimulation().catch(err => {
  console.error('模擬執行出錯:', err);
  process.exit(1);
});
