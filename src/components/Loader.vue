<template>
<div class="align-self-center py-4">
  <div class="circle-spinner"></div>
</div>
</template>
<style scoped>
@keyframes circleSpinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
.circle-spinner {
  margin: 0 auto;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border-width: 3px;
  border-style: solid;
  border-color: #007bff #f1f8ff #f1f8ff;
  border-image: initial;
  animation: circleSpinner 1s linear 0s infinite normal none running;
}
</style>
