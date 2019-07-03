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
              v-on:click="check(criterion.id)">
              {{ criterion.name }}
            </a>
          </li>
          <div class="row mt-2">
            <div class="col-8 col-sm-6 col-md-4">
              <div class="form-group">
                <input type="text"
                  v-model="criterionName[departmentIdx]" 
                  class="form-control"  
                  placeholder="+ add criterion"
                  v-on:keydown.enter="postCriterion(department.id, departmentIdx)">
              </div>
            </div>
          </div>
        </ul>
      </li>
      <div class="row">
        <div class="col-8 col-sm-6 col-md-4">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="+ add department">
          </div>
        </div>
      </div>
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
      criterionName: [],
      departments: []
    }
  },
  methods: {
    postCriterion(departmentId, departmentIdx) {
      appService.postCriterion({
        department: departmentId,
        name: this.criterionName[departmentIdx],
      })
      .then((data) => {
        this.criterionName[departmentIdx] = ''
        this.departments[departmentIdx].criteria.push(data)
      }).catch(() => {
        //
      })
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
