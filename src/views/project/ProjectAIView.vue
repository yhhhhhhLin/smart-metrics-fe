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
                      @keydown.enter.prevent="handleEnterPress"
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
import {useRoute} from "vue-router";

const inputMsg = ref('');
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
const metricsId = ref('')
const enableReasoning = ref(true);

onMounted(() => {
  const route = useRoute()
  const t = route.query.metricsId
  if (t) {
    metricsId.value = t
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

function handleEnterPress(e: KeyboardEvent) {
  if (e.shiftKey) return; // 允许 Shift + Enter 换行
  if (!inputMsg.trim() || buttonLoading.value) return;
  handlerSendMessage();
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
    messages.unshift({role: 'system', content: newPromptText.value});
  }

  localStorage.setItem(storageKeyPre + token, JSON.stringify(messages));
  Message.success('修改成功');
}

function editPromptBeforeCancel() {
  editPromptModalVisible.value = false;
  newPromptText.value = oldPromptText.value;
}

function handleDataPrediction() {
  Message.info('数据预测功能开发中...');
}
</script>

<style scoped>
.chat-ai-assistant {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-1);
  width: 100%;
}

.chat-header {
  background: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-wrapper {
  flex: 1;
  width: 100%;
  background: var(--color-bg-1);
  position: relative;
}

.chat-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  min-height: calc(100vh - 64px);
  position: relative;
  background: var(--color-bg-1);
}

.chat-main {
  padding-bottom: 180px;
  background: var(--color-bg-1);
}

.chat-scrollbar {
  height: 100%;
  background: var(--color-bg-1);
}

.chat-scrollbar :deep(.arco-scrollbar-container) {
  background: var(--color-bg-1);
}

.msgCards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
  background: var(--color-bg-1);
}

.message-wrapper {
  display: flex;
  gap: 8px;
  max-width: 85%;
  min-width: 200px;
}

.message-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
  min-width: 120px;
}

.message-wrapper.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.avatar-icon {
  font-size: 20px;
  color: #fff;
}

.avatar-icon.user {
  background: var(--color-primary-6);
  padding: 8px;
  border-radius: 50%;
}

.avatar-icon.assistant {
  background: var(--color-success-6);
  padding: 8px;
  border-radius: 50%;
}

.message-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: calc(100% - 48px);
  min-width: 0;
  flex: 1;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
}

.message-role {
  font-size: 13px;
  color: var(--color-text-3);
  font-weight: 500;
}

.message-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  width: fit-content;
  max-width: 100%;
}

.message-card :deep(.arco-card-body) {
  padding: 8px 12px;
}

.message-card.user {
  background: var(--color-primary-light-1);
  margin-left: auto;
}

.message-card.assistant {
  background: #fff;
  border: 1px solid var(--color-border-2);
  margin-right: auto;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-content :deep(.v-md-editor) {
  background: transparent !important;
}

.message-content :deep(.v-md-editor__preview) {
  padding: 0;
  width: fit-content;
  min-width: 0;
}

.message-content :deep(.v-md-editor__preview p) {
  margin: 0 0 4px 0;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-content :deep(.v-md-editor__preview pre) {
  margin: 4px 0;
  padding: 8px;
}

.message-content :deep(.v-md-editor__preview h1),
.message-content :deep(.v-md-editor__preview h2),
.message-content :deep(.v-md-editor__preview h3),
.message-content :deep(.v-md-editor__preview h4),
.message-content :deep(.v-md-editor__preview h5),
.message-content :deep(.v-md-editor__preview h6) {
  margin: 8px 0 4px 0;
}

.message-content :deep(.v-md-editor__preview ul),
.message-content :deep(.v-md-editor__preview ol) {
  margin: 4px 0;
  padding-left: 16px;
}

.message-content :deep(.v-md-editor__preview li) {
  margin: 2px 0;
}

.message-content :deep(.v-md-editor__preview blockquote) {
  margin: 4px 0;
  padding: 4px 8px;
}

.reasoning-collapse {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
  margin-bottom: 4px;
}

.chat-content {
  margin-top: 2px;
}

.card-toolbar {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-content-wrapper:hover .card-toolbar {
  opacity: 1;
}

.toolbar-icon {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  color: var(--color-text-3);
}

.toolbar-icon:hover {
  background: var(--color-fill-3);
  color: var(--color-primary-6);
}

.input-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-1);
  z-index: 100;
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
}

.input-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
}

.input-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  background: var(--color-bg-2);
}

.toolbar {
  margin-bottom: 8px;
  display: flex;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.msg-input {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.input-textarea {
  flex: 1;
}

.input-textarea :deep(.arco-textarea-wrapper) {
  border-radius: 8px;
  transition: all 0.2s;
  min-height: 32px !important;
  background: var(--color-bg-1);
}

.input-textarea :deep(.arco-textarea) {
  padding: 6px 12px;
  font-size: 14px;
}

.send-button {
  height: 32px;
  padding: 0 16px;
  margin-bottom: 2px;
}

@media screen and (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }

  .chat-container {
    padding: 0 16px;
  }

  .input-container {
    padding: 12px 16px;
  }

  .title-section h2 {
    font-size: 18px;
  }

  .metrics-badge {
    display: none;
  }

  .message-wrapper {
    max-width: 95%;
  }

  .toolbar {
    flex-direction: column;
    gap: 8px;
  }

  .toolbar-left {
    width: 100%;
    justify-content: center;
  }

  .msg-input {
    flex-direction: column;
  }

  .send-button {
    width: 100%;
  }
}
</style>
