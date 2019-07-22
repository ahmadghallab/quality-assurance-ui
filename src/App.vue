<template>
  <div id="app">
    <div class="wrapper">
      <div class="row">
        <div class="col-auto border-left py-3 side-nav">
          <AppHeader />
        </div>
        <div class="col px-0">
          <router-view/>
        </div>
      </div>
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
