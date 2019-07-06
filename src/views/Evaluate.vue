<template>
  <div>
    <Loader v-if="listDepartmentsLoader" />
    <ul class="list-unstyled" v-else>
      <li class="mb-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
        <a href="javascript:void(0)" 
          class="highlighted">{{ department.name }}</a>
        <ul class="nested-ul">
          <li class="mt-1" v-for="(criterion, criterionIdx) in department.criteria" v-bind:key="criterionIdx">
            <a href="javascript:void(0)" 
              class="highlighted" 
              v-bind:class="{'checked': highlight(criterion.id)}"
              v-on:click="check(criterion.id)">
              {{ criterion.name }}
            </a>
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
      listDepartmentsLoader: true,
      checkedCriteria: [],
      departments: []
    }
  },
  computed: {
    highlight () {
      return criterion => this.checkedCriteria.includes(criterion)
    }
  },
  methods: {
    check (criterion) {
      if (this.checkedCriteria.includes(criterion)) {
        let arrIndx = this.checkedCriteria.indexOf(criterion)
        this.checkedCriteria.splice(arrIndx, 1)
      } else {
        this.checkedCriteria.push(criterion)
      }
    },
    listDepartments () {
      appService.listDepartments()
        .then(data => {
          this.departments = data
          this.listDepartmentsLoader = false
        })
    }
  },
  created () {
    this.listDepartments()
  }
}
</script>
