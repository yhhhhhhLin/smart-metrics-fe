<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/projectAI'">
    <template #content>
      <div class="chat-ai-assistant">
        <div class="chat-header">
          <div class="header-content">
            <div class="title-section">
              <h2>平台 AI 助手</h2>
              <div v-if="metricsId" class="metrics-badge">
                <icon-info-circle />
                <span>指标ID: {{ metricsId }}</span>
              </div>
            </div>
            <div v-if="metricsId" class="header-actions">
              <a-button type="primary" @click="handleDataPrediction" class="prediction-btn">
                <template #icon><icon-line-chart /></template>
                数据预测
              </a-button>
            </div>
          </div>
        </div>

        <div class="chat-wrapper">
          <div class="chat-container">
            <div class="chat-main">
              <a-scrollbar 
                class="chat-scrollbar"
                ref="chatScrollbar"
              >
                <div class="msgCards" id="chatCard">
                  <template v-for="(message, index) in messages" :key="index">
                    <div :class="['message-wrapper', message.role]">
                      <div class="message-avatar">
                        <icon-user v-if="message.role === 'user'" class="avatar-icon user" />
                        <icon-robot v-else class="avatar-icon assistant" />
                      </div>
                      <div class="message-content-wrapper">
                        <div class="message-header">
                          <span class="message-role">{{ message.role === 'user' ? '我' : 'AI 助手' }}</span>
                          <div class="card-toolbar">
                            <a-tooltip content="重新编辑" mini>
                              <icon-edit class="toolbar-icon" />
                            </a-tooltip>
                            <a-tooltip content="重新生成回复" mini>
                              <icon-refresh class="toolbar-icon" />
                            </a-tooltip>
                          </div>
                        </div>
                        <a-card 
                          :class="['message-card', message.role]"
                          :bordered="false"
                          size="small"
                        >
                          <div class="message-content">
                            <a-collapse 
                              v-if="message.reasoningContent && enableReasoning" 
                              class="reasoning-collapse"
                            >
                              <a-collapse-item key="1" header="展开查看深度思考内容">
                                <v-md-preview :text="message.reasoningContent" @copy-code-success="handleCopyCodeSuccess"/>
                              </a-collapse-item>
                            </a-collapse>
                            <div class="chat-content">
                              <v-md-preview :text="message.content" @copy-code-success="handleCopyCodeSuccess"/>
                            </div>
                          </div>
                        </a-card>
                      </div>
                    </div>
                  </template>
                </div>
              </a-scrollbar>
            </div>

            <div class="input-box">
              <div class="input-container">
                <a-card :bordered="false" class="input-card">
                  <div class="toolbar">
                    <div class="toolbar-left">
                      <a-button-group size="small">
                        <a-button 
                          :type="enableReasoning ? 'primary' : 'outline'"
                          @click="enableReasoning = !enableReasoning"
                          size="small"
                        >
                          <template #icon><icon-codepen /></template>
                          {{ enableReasoning ? '深度思考(R1)已开启' : '开启深度思考(R1)' }}
                        </a-button>
                        <a-popconfirm 
                          type="warning" 
                          content="确定要清除所有聊天记录吗？" 
                          @ok="handlerClearMessage"
                        >
                          <a-button type="outline" size="small">
                            <template #icon><icon-eraser /></template>
                            清除记录
                          </a-button>
                        </a-popconfirm>
                        <a-button type="outline" @click="editPromptModalVisible = true" size="small">
                          <template #icon><icon-settings /></template>
                          设置 Prompt
                        </a-button>
                      </a-button-group>
                    </div>
                  </div>

                  <div class="msg-input">
                    <a-textarea
                      v-model="inputMsg"
                      :auto-size="{ minRows: 1, maxRows: 4 }"
                      placeholder="请输入要提问的问题..."
                      :disabled="isDisabledInput"
                      class="input-textarea"
                    />
                    <a-button 
                      type="primary" 
                      :loading="buttonLoading"
                      :disabled="!inputMsg.trim()"
                      @click="handlerSendMessage"
                      class="send-button"
                      size="small"
                    >
                      <template #icon><icon-send /></template>
                      发送
                    </a-button>
                  </div>
                </a-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a-modal 
        v-model:visible="editPromptModalVisible" 
        title="设置 Prompt" 
        @ok="editPromptBeforeOk"
        @cancel="editPromptBeforeCancel" 
        draggable
        :mask-closable="false"
        class="prompt-modal"
      >
        <div class="prompt-description">
          <icon-info-circle />
          <span>可以通过 prompt 指定 AI 助手的角色和回复信息格式等</span>
        </div>
        <a-textarea 
          v-model="newPromptText" 
          :auto-size="{ minRows: 4, maxRows: 8 }" 
          placeholder="请输入 prompt 内容..."
          class="prompt-textarea"
        />
      </a-modal>
    </template>
  </container>
</template>

<script setup lang="ts">
import Container from "../../components/Container.vue";
import {onMounted, reactive, ref} from "vue";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {Message} from "@arco-design/web-vue";
import {useRoute, useRouter} from "vue-router";

const inputMsg = ref<string>('');
const isDisabledInput = ref(false);
const buttonLoading = ref(false);
const editPromptModalVisible = ref(false);
const oldPromptText = ref('');
const newPromptText = ref('');
const messages = reactive<API.GptMessageInfo[]>([]);
const chatScrollbar = ref<any>(null);
const token = localStorage.getItem('token');
const storageKeyPre = 'gptMessages_';
let newMessage = '';
let newReasoningMessage = ''
const metricsId = ref<string>('');
const enableReasoning = ref(true);
const router = useRouter();

onMounted(() => {
  const route = useRoute();
  const t = route.query.metricsId;
  if (typeof t === 'string') {
    metricsId.value = t;
  }

  const chatMessage = localStorage.getItem(storageKeyPre + token);
  if (chatMessage) {
    const parsed = JSON.parse(chatMessage);
    oldPromptText.value = getPrompt(parsed);
    newPromptText.value = oldPromptText.value;
    messages.push(...parsed);
  }
});

function getPrompt(msg: API.GptMessageInfo[]): string {
  return msg.length > 0 && msg[0].role === 'system' ? msg[0].content : '';
}

function handlerSendMessage() {
  isDisabledInput.value = true;
  buttonLoading.value = true;

  messages.push({role: 'user', content: inputMsg.value});
  const msgLength = messages.length;
  inputMsg.value = '';

  const controller = new AbortController();
  // if (!token) {
  //   Message.error('请先登录');
  //   router.push('/login');
  //   return;
  // }

  // fetchEventSource(import.meta.env.VITE_BASE_HOST + import.meta.env.VITE_BASE_PRE_URL + '/gpt/gptChat', {
  fetchEventSource("http://localhost:7531/gpt/gptChat", {
    method: 'POST',
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      "dscId": "1",
      "metricsId": metricsId.value,
      "reasoner": enableReasoning.value.toString(),
      // "token": "123"
    },
    body: JSON.stringify(messages),
    onmessage(msg) {
      const oneMsg = JSON.parse(msg.data);
      if (oneMsg.isEnd === "true") {
        isDisabledInput.value = false;
        buttonLoading.value = false;
        newMessage = '';
        newReasoningMessage = '';
        return;
      }

      console.log(msg)


      const contentWord = oneMsg?.content || '';
      const reasoningContentWord = oneMsg?.reasoningContent || '';


      newMessage = contentWord;
      newReasoningMessage = reasoningContentWord

      messages[msgLength] = {role: 'assistant', reasoningContent: newReasoningMessage, content: newMessage};
    },
    onerror(err) {
      isDisabledInput.value = false;
      buttonLoading.value = false;
      newMessage = '出错了...(可能是你没权限，也可能是系统错误)';
      messages[msgLength] = {role: 'assistant', content: newMessage};
      throw err;
    }
  }).then(() => {
    localStorage.setItem(storageKeyPre + token, JSON.stringify(messages));
  });
}

function handleCopyCodeSuccess() {
  Message.success('复制成功');
}

function handlerClearMessage() {
  if (messages.length === 0) return;
  if (messages[0].role === 'system') messages.splice(1);
  else messages.length = 0;

  localStorage.setItem(storageKeyPre + token, JSON.stringify(messages));
  Message.success('聊天记录已清除');
}

function editPromptBeforeOk() {
  oldPromptText.value = newPromptText.value;
  editPromptModalVisible.value = false;

  if (messages.length > 0 && messages[0].role === 'system') {
    if (newPromptText.value) {
      messages[0].content = newPromptText.value;
    } else {
      messages.shift();
    }
  } else if (newPromptText.value) {
    messages.unshift({role: 'system', content: newPromptText.value, reasoningContent: ''});
  }

  localStorage.setItem(storageKeyPre + token, JSON.stringify(messages));
  Message.success('修改成功');
}

function editPromptBeforeCancel() {
  editPromptModalVisible.value = false;
  newPromptText.value = oldPromptText.value;
}

const handleDataPrediction = () => {
  if (metricsId.value) {
    router.push({ path: '/project/data-prediction', query: { metricsId: metricsId.value } });
  } else {
    router.push({ path: '/project/data-prediction' });
  }
};
</script>

<style scoped>
.chat-ai-assistant {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background: #f5f5f5;
}

.chat-header {
  background: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metrics-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #e6f7ff;
  padding: 5px 10px;
  border-radius: 4px;
}

.chat-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-main {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 110px;
}

.chat-scrollbar {
  height: 100%;
}

.msgCards {
  padding: 20px;
}

.message-wrapper {
  display: flex;
  margin-bottom: 20px;
}

.message-avatar {
  margin-right: 10px;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e6f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-content-wrapper {
  flex: 1;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message-role {
  font-weight: bold;
}

.card-toolbar {
  display: flex;
  gap: 10px;
}

.toolbar-icon {
  cursor: pointer;
}

.message-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
}

.message-content {
  margin-top: 10px;
}

.reasoning-collapse {
  margin-bottom: 10px;
}

.chat-content {
  margin-top: 10px;
}

.input-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.input-container {
  display: flex;
  flex-direction: column;
}

.input-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.msg-input {
  display: flex;
  gap: 10px;
}

.input-textarea {
  flex: 1;
}

.send-button {
  align-self: flex-end;
}

.prompt-modal {
  .prompt-description {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }

  .prompt-textarea {
    width: 100%;
  }
}
</style>
