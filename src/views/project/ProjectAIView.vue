<template>
  <container :top-menu-type="2" :top-menu-selected="'/project/projectAI'">
    <template #content>
      <div class="chat-ai-assistant">
        <div class="chat-header">
          关于指标id：{{ metricsId }}
          <h2>平台 AI 助手</h2>
        </div>

        <div class="chat-body">
          <div class="cards-parent">
            <a-scrollbar style="height:70vh;overflow: auto; background-color: #fff; border-radius: 10px"
                         ref="chatScrollbar">
              <div class="msgCards" id="chatCard">
                <template v-for="(message, index) in messages" :key="index">
                  <a-card :title="message.role" v-if="message.role === 'user'" size="small">
                    <template #extra>
                      <div class="card-toolbar">
                        <a-tooltip content="重新编辑" mini>
                          <icon-edit/>
                        </a-tooltip>
                        <a-tooltip content="重新生成回复" mini>
                          <icon-refresh/>
                        </a-tooltip>
                      </div>
                    </template>
                    <v-md-preview :text="message.content" @copy-code-success="handleCopyCodeSuccess"/>
                  </a-card>

                  <a-card :title="message.role" v-else-if="message.role === 'assistant'" size="small">
                    <template #extra>
                      <div class="card-toolbar">
                        <a-tooltip content="重新编辑" mini>
                          <icon-edit/>
                        </a-tooltip>
                        <a-tooltip content="重新生成回复" mini>
                          <icon-refresh/>
                        </a-tooltip>
                      </div>
                    </template>


                    <a-collapse v-if="message.reasoningContent && enableReasoning" style="margin-top: 10px;">
                      <a-collapse-item key="1" header="展开查看深度思考内容">
                        <v-md-preview :text="message.reasoningContent" @copy-code-success="handleCopyCodeSuccess"/>
                      </a-collapse-item>
                    </a-collapse>
                    <v-md-preview :text="message.content" @copy-code-success="handleCopyCodeSuccess"/>

                  </a-card>

                </template>
              </div>
            </a-scrollbar>
          </div>

          <div class="input-box">
            <a-card>
              <div class="toolbar">
                <div class="setting-btn" @click="editPromptModalVisible = true">
                  <icon-settings size="18"/>
                  <div>添加prompt</div>
                </div>

                <a-popconfirm type="warning" content="是否确定要全部清除！" @ok="handlerClearMessage">
                  <div class="setting-btn">
                    <icon-eraser/>
                    清除聊天记录
                  </div>
                </a-popconfirm>

                <div class="setting-btn" @click="enableReasoning = !enableReasoning">
                  <icon-codepen size="18"/>
                  {{ enableReasoning ? '关闭深度思考(R1)' : '开启深度思考(R1)' }}
                </div>
              </div>

              <div class="msg-input">
                <a-textarea :auto-size="{ minRows: 1, maxRows: 12 }" v-model="inputMsg" placeholder="请输入要提问的问题"
                            :disabled="isDisabledInput"/>
                <a-button type="primary" @click="handlerSendMessage" :loading="buttonLoading">发送</a-button>
              </div>
            </a-card>
          </div>
        </div>
      </div>

      <a-modal v-model:visible="editPromptModalVisible" title="添加prompt" @ok="editPromptBeforeOk"
               @cancel="editPromptBeforeCancel" draggable>
        可以通过prompt指定gpt的角色和回复信息格式等。
        <a-textarea v-model="newPromptText" :auto-size="{ minRows: 4, maxRows: 4 }" style="margin-top: 20px"/>
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
</script>

<style scoped>
.chat-ai-assistant {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chat-header h2 {
  margin: 0;
  font-size: 22px;
}

.sub-title {
  font-size: 14px;
  color: #888;
}

.chat-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cards-parent {
  height: 70vh;
}

.msgCards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
}

.input-box .toolbar {
  margin-bottom: 10px;
  display: flex;
  gap: 15px;
}

.setting-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.setting-btn:hover {
  background-color: #f5f5f5;
  cursor: pointer;
  transform: scale(1.03);
}

.msg-input {
  display: flex;
  gap: 10px;
}

.arco-textarea-wrapper,
.arco-btn-size-medium,
.arco-card-bordered {
  border-radius: 10px;
}

.card-toolbar {
  display: flex;
  gap: 10px;
}

.arco-modal-body {
  padding: 1px 20px 24px 20px;
}

.chat-header {
  display: flex;
  gap: 43%;
}
</style>
