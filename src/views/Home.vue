<template>
  <div class="row">
    <div class="col">
      <ul class="list-unstyled">
        <li class="mb-1" v-for="(management, managementIdx) in managements" v-bind:key="managementIdx">
          <a href="javascript:void(0)" class="highlighted">{{ management.name }}</a>
          <ul class="nested-ul">
            <li class="mt-1" v-for="(unit, unitIdx) in management.units" v-bind:key="unitIdx">
              <a href="javascript:void(0)" class="highlighted">{{ unit.name }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import appService from '../app.service.js'

export default {
  data () {
    return {
      managements: []
    }
  },
  methods: {
    listManagements () {
      appService.listManagements()
        .then(data => {
          this.managements = data
        })
    }
  },
  created () {
    this.listManagements()
  }
}
</script>
