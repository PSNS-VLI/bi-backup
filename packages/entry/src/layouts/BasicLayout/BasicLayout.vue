<template>
  <div class="basic-layout">
    <div class="header bg-image">
      <div class="header-item title">
        <img src="../../assets/image/header.png" />
        <span>平台应用服务</span>
      </div>
      <div class="header-item user">
        <div class="avatar">
          <img src="../../assets/image/userDefault.png" />
          <span>默认用户</span>
        </div>
        <img src="../../assets/image/questionCircle.png" class="question" />
        <img src="../../assets/image/loginOutlined.png" />
      </div>
    </div>
    <div class="body bg-image">
      <div class="body-inner bg-image">
        <div class="body-nav bg-image" v-if="breadCrumbShow">
          <gx-menu :menus="menus" collapse />
        </div>
        <div class="body-content">
          <div class="body-content__breadcrumb">
            <gx-breadcrumb :filter="breadcrumbFilter" v-show="breadCrumbShow" />
            <div class="sub-breadcrumb" v-show="!breadCrumbShow">
              <div class="sub-breadcrumb__title">
                <span class="left-border"></span>
                {{ route.meta.title }}
              </div>
            </div>
          </div>
          <div class="body-content__main">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { GxMenu, getMenusFromVueRouter, GxBreadcrumb } from '@gxhs/ui'

import { useRouterStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const routerStore = useRouterStore()

let breadCrumbShow = false
const updateBreadCrumbShow = (to) => {
  const currentPath = to.path
  breadCrumbShow = currentPath.endsWith('/list')
}
//切换路由时调用守卫
router.afterEach((to) => {
  updateBreadCrumbShow(to)
})
//刷新页面时根据当前路由更新breadCrumbShow
updateBreadCrumbShow(route)
const breadcrumbFilter = (route, index, matched) => {
  let nextRoute
  if (index < matched.length - 1) {
    nextRoute = matched[index + 1]
  }
  if (!route.meta.title || route.meta.hideInBreadcrumb) return false
  return route.meta.title !== nextRoute?.meta?.title
}

const menus = ref([])
watchEffect(() => {
  menus.value = getMenusFromVueRouter(
    routerStore.menuRouters,
    'icon',
    'title',
    'hide',
    'hideChildren'
  )
})
</script>

<style lang="scss" scoped>
.basic-layout {
  height: 100vh;
  .header {
    display: flex;
    justify-content: space-between;
    height: size(80);
    padding: size(20) size(24) size(20) size(32);
    background-color: #222f48;
    &-item {
      flex: 1;
      display: flex;
      &.title {
        img {
          width: size(34);
          height: size(40);
          padding-right: size(16);
        }
        span {
          font-family: PangMenZhengDao3;
          font-size: size(40);
          color: #fff;
          text-shadow: 0 size(1) size(7) rgba(23, 98, 241, 0.91);
          justify-content: flex-start;
        }
        .sql-title {
          @include normal-text;
          width: size(250);
          height: size(40);
          line-height: size(40);
          color: #fff;
          justify-content: flex-start;
          align-items: center;
          flex: 1;
        }
        .iconfont {
          &:hover {
            cursor: pointer;
            color: $theme-text-color;
          }
        }
        .el-input {
          max-width: size(250);
          :deep(.el-input__wrapper) {
            background: black;
            box-shadow: none;
            .el-input__inner {
              color: white;
            }
          }
        }
      }
      &.user {
        justify-content: flex-end;
        align-items: center;
        .avatar {
          display: flex;
          align-items: center;
          img {
            padding-right: size(8);
            border-radius: 50%;
          }
          span {
            color: #fff;
            font-family: SourceHanSansCN Regular;
            font-size: size(14);
          }
        }
        .question {
          padding: 0 size(16);
        }
      }
    }
    .sql-options {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: size(16);
      .iconfont {
        color: #a8abb2;
      }
      .start span {
        color: #fff;
      }
    }
  }
  .body {
    height: calc(100% - size(80));
    background-color: #2c3951;
    &-inner {
      display: flex;
      height: 100%;
      overflow: hidden;
    }
    &-nav,
    &-content {
      height: 100%;
    }
    &-nav {
      // width: size(220);
    }
    &-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: size(16);
      background: #f5f7fa;
      &__breadcrumb {
        margin-bottom: size(16);
        .sub-breadcrumb {
          display: flex;
          justify-content: space-between;
          &__title {
            @include plain-text;
            font-weight: 500;
            color: #303133;
            display: flex;
            align-items: center;
            .left-border {
              display: inline-block;
              width: size(4);
              height: size(16);
              background: $theme-complementary-color;
              border-radius: size(20);
              margin-right: size(8);
            }
          }
        }
      }
      &__main {
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        .router-view-container {
          width: 100%;
          height: 100%;
          overflow: auto;
        }
      }
    }
  }
}
</style>
