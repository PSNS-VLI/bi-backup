<template>
  <div class="step-block">
    <div class="top-content">
      <gx-step
        ref="stepsSelf"
        v-model:stepsData="stepsData"
        v-model:stepsIndex="stepsIndex"
      ></gx-step>
      <!--内容区域-->
      <div
        class="task-main-box"
        v-for="(step, index) in stepsData"
        :key="index"
        v-show="index === stepsIndex"
      >
        <slot :name="step.value"></slot>
      </div>
    </div>
    <div class="button-box">
      <gx-actions :actions="getActions()"></gx-actions>
    </div>
  </div>
</template>

<script setup>
import { GxActions, GxStep } from '@gxhs/ui'
import { defineProps, defineEmits, ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  stepsData: {
    type: Array
  },
  swag: {
    type: Boolean
  },
  queryId: {
    type: Number
  }
})
console.log(props.queryId)
watch(
  () => props.queryId,
  (n, o) => {
    if (n) {
      nextTick(() => {
        actions.value[2].disabled = false
      })
    }
  },
  {
    immediate: true
  }
)
const stepsData = computed({
  get: () => props.stepsData,
  set: (val) => emit('update:stepsData', val)
})
const stepsSelf = ref()
//第一步
const stepsIndex = ref(0)
const actions = ref([
  {
    label: '取消',
    type: 'normal',
    transparent: true,
    handler: () => {
      router.back()
    }
  },
  {
    label: '上一步',
    type: 'normal',
    transparent: true,
    handler: () => prevSteps()
  },

  {
    label: '下一步',
    type: 'main',
    disabled: true,
    handler: () => {
      if (stepsIndex.value !== stepsData.value.length - 1) {
        if (stepsIndex.value !== 1) {
          nextSteps()
        } else {
          pleaseVerify()
        }
      }
    }
  },
  {
    label: '测试连接',
    type: 'normal',
    handler: () => {
      pleaseVerify()
    }
  },
  {
    label: '完成',
    type: 'main',
    handler: () => {
      emit('done')
    }
  }
])
const getActions = () => {
  if (stepsIndex.value === 0) {
    return [actions.value[0], actions.value[2], actions.value[3]]
  } else if (stepsIndex.value === stepsData.value.length - 1) {
    return [actions.value[0], actions.value[1], actions.value[4]]
  } else {
    return [actions.value[0], actions.value[1], actions.value[2]]
  }
}
//下一步
const prevSteps = () => {
  stepsIndex.value--
}
const emit = defineEmits(['done'])

const pleaseVerify = async () => {
  console.log(stepsIndex.value, getActions())
  let verified
  if (stepsIndex.value === 1 && getActions()[2].label === '下一步') {
    verified = await stepsData.value[1].verify()
  } else {
    verified = await stepsData.value[stepsIndex.value].verify()
  }
  if (verified.proceed) {
    actions.value[2].disabled = false
    if (getActions()[2].label === '下一步') {
      nextSteps()
    }
  } else {
    ElMessage.error(verified.message)
  }
}
const nextSteps = () => {
  stepsIndex.value++
}
watch(
  () => props.swag,
  (n, o) => {
    if (n) {
      if (stepsIndex.value !== 2) actions.value[2].disabled = true
    } else {
      actions.value[2].disabled = false
    }
  }
)
</script>

<style lang="scss" scoped>
.step-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top-content {
    min-height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: size(16);
  }
  .task-main-box {
    padding: 0 0 size(16) size(16);
    min-height: 0;
    flex: 1;
  }
  .button-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
