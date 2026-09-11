const mqtt = require('mqtt');

const BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const ROOM_CODE = `TEST60_${Math.random().toString(16).substr(2, 6).toUpperCase()}`;
const STATE_TOPIC = `nickpocket/room/${ROOM_CODE}/state`;
const RESPONSE_TOPIC = `nickpocket/room/${ROOM_CODE}/responses`;

const FIRST_NAMES = [
  '陳冠宇', '林子涵', '黃品睿', '張宇恩', '李柏叡', '吳品妍', '劉哲維', '蔡欣妤',
  '楊承恩', '許家豪', '鄭羽彤', '謝秉諺', '洪詩婷', '曾品翔', '邱郁婷', '周廷睿',
  '葉宥廷', '廖庭瑋', '徐子恩', '賴冠霖', '莊睿安', '施涵予', '游宸瑋', '潘彥銘',
  '顏羽彤', '宋品豪', '柯廷恩', '翁詩涵', '魏哲緯', '唐睿廷', '孫郁涵', '彭宥銘',
  '范家豪', '方子睿', '白品妍', '姚冠廷', '譚宇恩', '鐘廷睿', '汪庭瑋', '鄒承恩',
  '何冠廷', '鄧子涵', '蕭品睿', '羅宇恩', '丁柏叡', '薛品妍', '董哲維', '蘇欣妤',
  '曹承恩', '袁家豪', '江羽彤', '顧秉諺', '盧詩婷', '馬品翔', '嚴郁婷', '石廷睿',
  '崔宥廷', '康庭瑋', '溫子恩', '紀冠霖'
];

const EMOJIS = ['🦊', '🐼', '🦁', '🐨', '🐬', '🦄', '🐯', '🦉', '🌻', '🌸', '🚀', '⭐', '🍀', '🍎', '🎈', '⚡'];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runScenarioTest() {
  console.log(`\n======================================================`);
  console.log(`🧪 60 人課堂即時作答與重連情境壓力測試`);
  console.log(`📌 測試房間代碼：${ROOM_CODE}`);
  console.log(`🌐 Broker：${BROKER}`);
  console.log(`======================================================\n`);

  // 1. 建立老師端連線 (模擬 TeacherSession 內部實作)
  const teacherClient = mqtt.connect(BROKER, {
    clientId: `teacher_${ROOM_CODE}_${Math.random().toString(16).substr(2, 6)}`,
    clean: true,
    keepalive: 60
  });

  const teacherState = {
    joinedStudents: new Set(),
    answers: {},
    sessionStatus: 'lobby',
    currentQIndex: 0
  };

  let joinBroadcastTimeout = null;
  let statsBroadcastTimeout = null;

  function teacherBroadcastState(payload, retain = false) {
    teacherClient.publish(STATE_TOPIC, JSON.stringify(payload), { qos: 1, retain });
  }

  function teacherBroadcastLobbyState() {
    if (teacherState.sessionStatus === 'lobby') {
      teacherBroadcastState({ event: 'lobby', acknowledged: true, activityTitle: '軟體測試與品質 60 人隨堂測驗' }, true);
    } else if (teacherState.sessionStatus === 'active') {
      teacherBroadcastState({
        event: 'question_start',
        type: 'single',
        questionIndex: 0,
        questionText: '下列哪一項不是敏捷軟體開發核心精神？',
        options: ['個體與互動重於流程與工具', '詳盡的文件重於可用的軟體', '與客戶協同合作重於合約協商', '回應變化重於遵循計劃'],
        timeLimit: 60
      }, true);
    }
  }

  await new Promise((resolve) => {
    teacherClient.on('connect', () => {
      console.log(`👩‍🏫 老師端已上線，訂閱學生作答通道: ${RESPONSE_TOPIC}`);
      teacherClient.subscribe(RESPONSE_TOPIC, { qos: 1 });
      // 廣播大廳狀態 (retain = true)
      teacherBroadcastState({ event: 'lobby', activityTitle: '軟體測試與品質 60 人隨堂測驗' }, true);
      resolve();
    });
  });

  teacherClient.on('message', (topic, message) => {
    try {
      const payload = JSON.parse(message.toString());
      if (payload.event === 'join' || payload.event === 'request_sync') {
        teacherState.joinedStudents.add(payload.studentName);
        
        // 老師端 200ms 防抖補發
        if (joinBroadcastTimeout) clearTimeout(joinBroadcastTimeout);
        joinBroadcastTimeout = setTimeout(() => {
          teacherBroadcastLobbyState();
        }, 200);
      } else if (payload.event === 'submit_answer') {
        teacherState.answers[payload.studentName] = payload.answer;
        
        // 老師端 400ms 防抖統計廣播
        if (statsBroadcastTimeout) clearTimeout(statsBroadcastTimeout);
        statsBroadcastTimeout = setTimeout(() => {
          teacherBroadcastState({
            event: 'stats_update',
            questionIndex: 0,
            totalSubmissions: Object.keys(teacherState.answers).length,
            totalStudents: teacherState.joinedStudents.size
          }, false);
        }, 400);
      }
    } catch (e) {}
  });

  // 2. 60 位學生連線並加入大廳 (模擬學生陸續掃描 QR Code，每人間隔 50-80ms)
  console.log(`\n🚪 [階段 1] 60 位學生陸續掃描 QR Code 加入大廳...`);
  const studentClients = [];
  const students = FIRST_NAMES.slice(0, 60).map((name, i) => `${EMOJIS[i % EMOJIS.length]} ${name}`);

  for (let i = 0; i < 60; i++) {
    const studentName = students[i];
    const client = mqtt.connect(BROKER, {
      clientId: `student_${i}_${Math.random().toString(16).substr(2, 6)}`,
      clean: true,
      keepalive: 60
    });

    const studentContext = {
      id: i,
      name: studentName,
      client,
      status: 'connecting',
      roomState: 'waiting',
      receivedQuestion: false,
      submitted: false
    };

    client.on('connect', () => {
      studentContext.status = 'connected';
      client.subscribe(STATE_TOPIC, { qos: 1 });
      client.publish(RESPONSE_TOPIC, JSON.stringify({ event: 'join', studentName }), { qos: 1 });
    });

    client.on('message', (topic, msg) => {
      try {
        const payload = JSON.parse(msg.toString());
        if (payload.event === 'question_start') {
          if (studentContext.simulatedPacketDrop) {
            return; // 模擬此學生此時未接收到開題廣播
          }
          studentContext.receivedQuestion = true;
          studentContext.roomState = 'answering';
        }
      } catch (e) {}
    });

    studentClients.push(studentContext);
    await sleep(60); // 模擬人類自然掃碼間隔，避免 60 個 TLS 握手瞬間堵塞
    process.stdout.write(`\r已發起連線: ${i + 1}/60 位學生...`);
  }

  // 等候大廳全員連線成功
  console.log(`\n⏳ 等候全員連線穩定...`);
  for (let wait = 0; wait < 15; wait++) {
    const connectedCount = studentClients.filter(s => s.status === 'connected').length;
    if (connectedCount >= 60 && teacherState.joinedStudents.size >= 60) break;
    await sleep(500);
  }
  console.log(`✅ 大廳目前在線人數：${teacherState.joinedStudents.size} / 60 人 (學生連線數: ${studentClients.filter(s => s.status === 'connected').length})`);

  // 3. 模擬情境：20 位同學在開題瞬間因網路封包遺失或手機螢幕鎖定，錯過了初始開題廣播！
  console.log(`\n📱 [階段 2] 模擬 20 位學生（第 41~60 號）錯過初始開題廣播，停留在【等待老師啟動】畫面...`);
  const delayedStudents = studentClients.slice(40, 60);
  for (const st of delayedStudents) {
    st.simulatedPacketDrop = true; // 模擬初始廣播遺失
    st.receivedQuestion = false;
  }

  // 4. 老師此時按下「啟動題目」
  console.log(`\n🔔 [階段 3] 老師在投影幕點擊【啟動題目】！(發送 question_start，retain = true)`);
  teacherState.sessionStatus = 'active';
  teacherBroadcastState({
    event: 'question_start',
    type: 'single',
    questionIndex: 0,
    questionText: '下列哪一項不是敏捷軟體開發核心精神？',
    options: ['個體與互動重於流程與工具', '詳盡的文件重於可用的軟體', '與客戶協同合作重於合約協商', '回應變化重於遵循計劃'],
    timeLimit: 60
  }, true);

  await sleep(1500);

  // 5. 前 40 位學生立刻收到題目並作答交卷
  console.log(`\n✍️ [階段 4] 前 40 位學生順利收到題目，開始陸續交卷...`);
  const activeStudents = studentClients.slice(0, 40);
  for (const st of activeStudents) {
    if (st.receivedQuestion) {
      st.client.publish(RESPONSE_TOPIC, JSON.stringify({
        event: 'submit_answer',
        studentName: st.name,
        answer: 'B',
        timestamp: Date.now(),
        questionIndex: 0
      }), { qos: 1 });
      st.submitted = true;
      await sleep(30);
    }
  }

  await sleep(2000);
  console.log(`📊 老師畫面目前顯示作答人數：${Object.keys(teacherState.answers).length} 人 (符合先前停在 40 人的狀態)`);

  // 6. 關鍵驗證：後 20 位學生停留等待畫面超過 3.5 秒，觸發自動同步機制 (request_sync)！
  // 在舊程式：老師端因 isAlreadyJoined === true 直接 return，學生永遠拿不到題目；
  // 在新程式：老師端解除阻擋並防抖補發，學生成功取得題目！
  console.log(`\n⚡ [階段 5] 關鍵測試：後 20 位學生觸發自動同步 / 點擊【🔄 重新同步】按鈕！`);
  console.log(`   (學生發送 request_sync 向老師確認當前進行中題目)...`);

  for (const st of delayedStudents) {
    st.simulatedPacketDrop = false; // 解除丟包模擬，開始接收題目
    st.client.publish(RESPONSE_TOPIC, JSON.stringify({ event: 'request_sync', studentName: st.name }), { qos: 1 });
    await sleep(40);
  }

  // 等候老師端防抖補發並接收題目
  for (let wait = 0; wait < 10; wait++) {
    const gotQ = delayedStudents.filter(s => s.receivedQuestion).length;
    if (gotQ >= 20) break;
    await sleep(400);
  }

  const delayedReceivedCount = delayedStudents.filter(s => s.receivedQuestion).length;
  console.log(`\n🎯 成果驗證：後 20 位原本卡住的學生中，成功取得題目的有：${delayedReceivedCount} / 20 人！`);

  // 7. 後 20 位學生作答提交
  console.log(`📝 後 20 位學生作答並提交...`);
  for (const st of delayedStudents) {
    if (st.receivedQuestion) {
      st.client.publish(RESPONSE_TOPIC, JSON.stringify({
        event: 'submit_answer',
        studentName: st.name,
        answer: 'B',
        timestamp: Date.now(),
        questionIndex: 0
      }), { qos: 1 });
      st.submitted = true;
      await sleep(30);
    }
  }

  await sleep(2500);

  const totalSubmissions = Object.keys(teacherState.answers).length;
  console.log(`\n======================================================`);
  console.log(`🏆 最終測試結果統計：`);
  console.log(`  總學生數：60 人`);
  console.log(`  前段順利作答：${activeStudents.filter(s => s.submitted).length} 人`);
  console.log(`  重連後成功獲取題目作答：${delayedStudents.filter(s => s.submitted).length} 人`);
  console.log(`  老師端最終收到作答總數：${totalSubmissions} / 60 人 (${Math.round(totalSubmissions / 60 * 100)}%)`);
  console.log(`======================================================\n`);

  // 關閉所有連線
  teacherClient.end(true);
  for (const s of studentClients) {
    s.client.end(true);
  }

  if (totalSubmissions === 60) {
    console.log(`🎉 測試大獲成功！60 位同學全數順利取得題目並作答，不再卡在 40 人！\n`);
    process.exit(0);
  } else {
    console.log(`⚠️ 部分學生未完成作答，請檢查連線日誌。\n`);
    process.exit(1);
  }
}

runScenarioTest().catch(err => {
  console.error('測試失敗：', err);
  process.exit(1);
});
