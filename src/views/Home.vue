<template>
  <div>
    <Loader v-if="listManagementsLoader" />
    <ul class="list-unstyled" v-else>
      <li class="mb-1" v-for="(management, managementIdx) in managements" v-bind:key="managementIdx">
        <a href="javascript:void(0)" class="highlighted">{{ management.name }}</a>
        <ul class="nested-ul">
          <li class="mt-1" v-for="(unit, unitIdx) in management.units" v-bind:key="unitIdx">
            <router-link class="highlighted" :to="{ name: 'unit', params: {id: unit.id} }">
              {{ unit.name }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script>
import appService from '../app.service.js'
import Loader from '../components/Loader.vue'

export default {
  components: {
    Loader
  },
  data () {
    return {
      listManagementsLoader: true,
      managements: []
    }
  },
  methods: {
    listManagements () {
      appService.listManagements()
        .then(data => {
          this.managements = data
          this.listManagementsLoader = false
        })
    }
  },
  created () {
    this.listManagements()
  }
}
</script>
