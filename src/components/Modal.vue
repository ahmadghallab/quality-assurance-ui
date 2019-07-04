<template>
<transition name="dialog">
  <div class="dialog-mask">
    <div class="dialog-wrapper" v-bind:style="{ 'max-width': width}">
      <div class="dialog-container fade-up">
        <!-- Header -->
        <div class="dialog-header">
          <slot name="header"></slot>
        </div>
        <!-- Body -->
        <div class="dialog-body">
          <slot name="body"></slot>
        </div>
        <!-- Footer -->
        <div class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>
<script>
export default {
  props: {
    width: {
      default: '600px',
      type: String
    }
  }
}
</script>
<style scoped>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.5);
}
.dialog-wrapper {
  position: relative;
  margin: 3rem auto;
  pointer-events: none;
  width: 90%;
  border-radius: 4px;
  border:1px solid #dee2e6;
  padding: 25px;
  background-color: #fff;
}
.dialog-container {
  position: relative;
  width: 100%;
  pointer-events: auto;
}
.mask, .dialog-leave-active {
  transition: all .3s ease;
}
.dialog-leave-to {
  transform: translateY(5px);
  opacity: 0;
}
</style>