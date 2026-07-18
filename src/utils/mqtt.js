// Real-time MQTT communication utility
// Connects to a public WebSocket MQTT broker completely client-side.

const PRIMARY_BROKER = 'wss://broker.hivemq.com:8884/mqtt';
const FALLBACK_BROKER = 'wss://broker.emqx.io:8084/mqtt';

class MqttService {
  constructor() {
    this.client = null;
    this.roomCode = null;
    this.role = null; // 'teacher' or 'student'
    this.onMessageCallback = null;
    this.onStatusCallback = null;
    this.isConnected = false;
  }

  connect(roomCode, role, onMessage, onStatusChange) {
    this.roomCode = roomCode.toUpperCase().trim();
    this.role = role;
    this.onMessageCallback = onMessage;
    this.onStatusCallback = onStatusChange;

    const mqttClient = window.mqtt || (typeof window !== 'undefined' && window.mqtt);
    if (!mqttClient) {
      console.error('MQTT.js is not loaded yet.');
      if (this.onStatusCallback) this.onStatusCallback('error', 'MQTT.js library missing');
      return;
    }

    if (this.client) {
      this.disconnect();
    }

    if (this.onStatusCallback) this.onStatusCallback('connecting', 'Connecting to real-time server...');

    // Connect options with random client ID to avoid collisions
    const clientId = `nickpocket_${role}_${Math.random().toString(16).substr(2, 8)}`;
    const options = {
      clientId,
      keepalive: 60,
      clean: true,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
    };

    console.log(`[MQTT] Connecting to ${PRIMARY_BROKER} with clientId: ${clientId}`);
    
    try {
      this.client = mqttClient.connect(PRIMARY_BROKER, options);
    } catch (e) {
      console.warn('[MQTT] Primary broker connect failed, attempting fallback...', e);
      this.client = mqttClient.connect(FALLBACK_BROKER, options);
    }

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log(`[MQTT] Connected successfully as ${role}`);
      if (this.onStatusCallback) this.onStatusCallback('connected', 'Connected');

      // Subscribe to relevant topics
      const topic = this.getSubscribeTopic();
      this.client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error(`[MQTT] Subscription error for topic ${topic}:`, err);
        } else {
          console.log(`[MQTT] Subscribed to topic: ${topic}`);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log(`[MQTT] Received message on topic: ${topic}`, payload);
        if (this.onMessageCallback) {
          this.onMessageCallback(topic, payload);
        }
      } catch (e) {
        console.error('[MQTT] Error parsing message payload:', e);
      }
    });

    this.client.on('error', (err) => {
      console.error('[MQTT] Connection error:', err);
      if (this.onStatusCallback) this.onStatusCallback('error', err.message || 'Connection error');
    });

    this.client.on('close', () => {
      this.isConnected = false;
      console.log('[MQTT] Connection closed');
      if (this.onStatusCallback) this.onStatusCallback('disconnected', 'Disconnected');
    });
  }

  getSubscribeTopic() {
    if (this.role === 'teacher') {
      // Teachers subscribe to responses sent by students
      return `nickpocket/room/${this.roomCode}/responses`;
    } else {
      // Students subscribe to state updates broadcasted by the teacher
      return `nickpocket/room/${this.roomCode}/state`;
    }
  }

  publish(topic, payload) {
    if (!this.client || !this.isConnected) {
      console.warn('[MQTT] Cannot publish, client not connected');
      return false;
    }
    const messageStr = JSON.stringify(payload);
    this.client.publish(topic, messageStr, { qos: 1, retain: false });
    return true;
  }

  // Teacher broadcasts current session state (e.g. active question, start/stop events)
  publishState(state) {
    const topic = `nickpocket/room/${this.roomCode}/state`;
    return this.publish(topic, state);
  }

  // Student publishes answer response
  publishResponse(response) {
    const topic = `nickpocket/room/${this.roomCode}/responses`;
    return this.publish(topic, response);
  }

  disconnect() {
    if (this.client) {
      console.log('[MQTT] Disconnecting client');
      try {
        this.client.end(true);
      } catch (e) {
        console.error('[MQTT] Error during disconnect:', e);
      }
      this.client = null;
    }
    this.isConnected = false;
  }
}

export default new MqttService();
