<template>
  <RouterView v-slot="{ Component }">
    <Transition>
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
<script setup></script>

<style>
.v-enter-active,
.v-leave-active {
  float: left;
  width: 100%;
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
