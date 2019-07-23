<template>
  <div id="app">
    <AppHeader />
    <div class="wrapper">
      <router-view/>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: 'appHeader',
  components: {
    AppHeader
  }
}
</script>
