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
              v-on:click="editCriterionModal(criterion.id)">
              {{ criterion.name }}
            </a>
            <Modal v-if="toggleEditCriterionModal && selectedCriterion == criterion.id ">
              <div slot="body">
                <form v-on:submit.prevent="editCriterion(criterion.id, departmentIdx, criterionIdx)">
                  <div class="form-group">
                    <label for="criterionName">Name</label>
                    <input type="text"
                      v-model="criterion.name" 
                      class="form-control"  
                      placeholder="+ add criterion">
                  </div>
                  <button type="submit" 
                    class="btn btn-info btn-sm mr-2"
                    v-on:click="toggleEditCriterionModal = false">Save</button>
                  <button type="button" 
                    class="btn btn-light btn-sm"
                    v-on:click="toggleEditCriterionModal = false">Cancel</button>
                </form>
              </div>
            </Modal>
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
            <input type="text" class="form-control"
              v-model="departmentName" 
              placeholder="+ add department"
              v-on:keydown.enter="postDepartment()">
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>
<script>
import appService from '../app.service.js'
import Loader from '../components/Loader.vue'
import Modal from '../components/Modal.vue'

export default {
  components: {
    Loader,
    Modal
  },
  data () {
    return {
      listDepartmentsLoader: true,
      toggleEditCriterionModal: false,
      selectedCriterion: null,
      departmentName: null,
      checkedCriteria: [],
      criterionName: [],
      departments: []
    }
  },
  methods: {
    editCriterionModal(criterionId) {
      this.selectedCriterion = criterionId
      this.toggleEditCriterionModal = true
    },
    postCriterion(departmentId, departmentIdx) {
      appService.postCriterion({
        department: departmentId,
        name: this.criterionName[departmentIdx],
      })
      .then((data) => {
        this.criterionName[departmentIdx] = null
        this.departments[departmentIdx].criteria.push(data)
      }).catch(() => {
        //
      })
    },
    editCriterion(criterionId, departmentIdx, criterionIdx) {
      appService.editCriterion({
        id: criterionId,
        name: this.departments[departmentIdx].criteria[criterionIdx].name,
      })
      .then((data) => {
        this.toggleEditCriterionModal = false
      })
    },
    postDepartment() {
      appService.postDepartment({name: this.departmentName})
        .then((data) => {
          this.departmentName = null
          this.departments.push(data)
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
