<template>
  <container :top-menu-type=-1 :top-menu-selected="'2'">
    <template #content>
      <div class="home-view">
        <div class="home-title">
          <div class="home-title-word">
            智能指标平台
          </div>
          <div class="home-title-image">
            <img src="../assets/images/HomeImage.png" alt="homeImage"/>
          </div>
        </div>
        <div class="home-options-other-message">
          <div class="home-options-other">
            <div class="home-options">
              <div class="home-options-title">
                功能模块
              </div>
              <div class="home-options-options">
                <div v-for="option in options" :key="option.key">
                  <div class="home-options-item" @click="clickOption(option.key)">
                    <div class="home-options-item-image">
                      <img :src="option.image" alt="homeImage"/>
                    </div>
                    <div class="home-options-item-title">
                      {{ option.title }}
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="home-other">
              <div class="no-message">
                <div class="no-message__icon">📭</div>
                <h3 class="no-message__text">暂无任何消息</h3>
                <button class="no-message__button">
                  <span class="plus-icon"></span>
                  添加新消息
                </button>
              </div>

            </div>
          </div>
          <div class="home-message">
            系统公告

          </div>
        </div>

      </div>
    </template>

  </container>
</template>

<script setup lang="ts">

import Container from "../components/Container.vue";
import router from "../router";
import ProjectManagerPng from '../assets/images/ProjectManager.png'
import DataSourceManagerPng from '../assets/images/DataSourceManager.png'
import UserManagerPng from '../assets/images/UserManager.png'
import AdminManagerPng from '../assets/images/AdminManager.png'


const options = [
  {key: 1, image: ProjectManagerPng, title: '项目管理'},
  {key: 2, image: DataSourceManagerPng, title: '数据源管理'},
  {key: 3, image: UserManagerPng, title: '用户管理'},
  {key: 4, image: AdminManagerPng, title: '管理员模块'},
];

const clickOption = (optionKey: number) => {
  // 根据点击的key跳转到对应的页面
  switch (optionKey) {
    case 1:
      router.push('/projectManager/projectList');
      break;
    case 2:
      router.push('/datasource/list')
      break;
    case 3:
      router.push('/3');
      break;
    case 4:
      break;
    default:
      console.log('未知选项');
  }

  console.log('点击++' + optionKey)

}
</script>

<style scoped>

.home-view {
  height: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.home-options-other-message {
  flex-grow: 1;
  width: 100%;
  display: flex;
  gap: 15px;
}

.home-options-other {
  display: flex;
  flex-direction: column;
  width: 79%;
  gap: 15px;
}

.home-title {
  height: 300px;
  background-color: #329CFF;
  border-radius: 5px;
  display: flex;
}

.home-title-word {
  width: 1000px;
  font-size: 48px;
  margin-top: 100px;
  color: #fff;
  font-weight: bold;
}


.home-title-image {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.home-options {
  background-color: #FFFFFF;
  height: 220px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home-options-title {
  height: 20%;
  display: flex;
  justify-content: start;
  margin-top: 10px;
  margin-left: 20px;
}

.home-options-options {
  display: flex;
  gap: 10px;
  width: 100%;
  overflow: hidden;
}

.home-options-item {
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 130px;
  cursor: pointer;
}

.home-options-item-image {
  height: 80%;
}

.home-options-item-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.home-options-item-title {
  height: 20%;
}

.home-other {
  background-color: #FFFFFF;
  height: 280px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-message {
  background-color: #FFFFFF;
  width: 21%;
  border-radius: 5px;
  display: flex;
  justify-content: start;
}

.no-message {
  text-align: center;
  padding: 2rem;
  max-width: 300px;
}

.no-message__icon {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.no-message__text {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.no-message__button {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.no-message__button:hover {
  background: #0b5ed7;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.15);
}

.plus-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: relative;
}

.plus-icon::before,
.plus-icon::after {
  content: '';
  position: absolute;
  background: white;
  border-radius: 2px;
}

.plus-icon::before {
  width: 100%;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
}

.plus-icon::after {
  width: 2px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}


</style>