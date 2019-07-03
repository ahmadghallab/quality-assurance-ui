<template>
<div class="align-self-center">
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
  margin: 50px auto;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border-width: 4px;
  border-style: solid;
  border-color: #8d9aa5 #d4d9dd #d4d9dd;
  border-image: initial;
  animation: circleSpinner 1s linear 0s infinite normal none running;
}
</style>
