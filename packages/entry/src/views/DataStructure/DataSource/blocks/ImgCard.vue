<template>
  <div class="img-card" :class="{ 'is-direction': props.cards.length > 1 }">
    <el-card
      class="box-card"
      shadow="hover"
      v-for="item in props.cards"
      :key="item"
      @click="item.jump"
    >
      <div class="content">
        <span :class="item.icon"></span>
        <div class="text">
          <slot>
            <span>{{ item.content }}</span>
          </slot>
          <slot name="contentAppend">
            <span class="content-append">{{ item.contentAppend }}</span>
          </slot>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
const props = defineProps({
  cards: {
    type: Array
  }
})
console.log(props.cards)
</script>
<style lang="scss" scoped>
.img-card {
  display: flex;
  margin: size(16) 0;
}
.is-direction {
  display: flex;
  .box-card {
    margin-right: size(16);
  }
}
.icon {
  font-size: size(32);
}
.el-card__body {
  --el-card-padding: size(16);
  .content {
    display: flex;
    align-items: center;
    min-width: size(240);

    .text {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding-left: size(5);
      font-size: size(14);
      .content-append {
        font-size: size(12);
        color: #a8abb2;
      }
    }
  }
}
</style>
