<template>
  <div class="container-fluid">
    <Loader v-if="listManagementsLoader" />
    <ul class="list-unstyled" v-else>
      <li class="mb-1" v-for="(management, managementIdx) in managements" v-bind:key="managementIdx">
        <a href="javascript:void(0)"
          v-on:click="editManagementModal(management.id)" 
          class="highlighted">{{ management.name }}
        </a>
        <Modal v-if="toggleEditManagementModal && selectedManagement == management.id ">
          <div slot="body">
            <form v-on:submit.prevent="editManagement(management.id, managementIdx)">
              <div class="form-group">
                <label for="managementName">Management Name</label>
                <input type="text"
                  id="managementName"
                  autocomplete="off"
                  v-model="management.name" 
                  class="form-control"  
                  placeholder="+ add management">
              </div>
              <button type="submit" 
                class="btn btn-info btn-sm mr-2"
                v-on:click="toggleEditManagementModal = false">Save</button>
              <button type="button" 
                class="btn btn-light btn-sm"
                v-on:click="toggleEditManagementModal = false">Cancel</button>
            </form>
          </div>
        </Modal>
        <ul class="nested-ul">
          <li class="mt-1" v-for="(unit, unitIdx) in management.units" v-bind:key="unitIdx">
            <div class="btn-group">
              <a href="javascript:void(0)"
                v-on:click="toggleUnitDropdown(unit.id)" class="highlighted"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{ unit.name }}</a>
              <div class="dropdown-menu custom_font"
                v-bind:class="[selectedUnit == unit.id ? 'show' : '']">
                <router-link class="dropdown-item" 
                  :to="{ name: 'unit', params: {id: unit.id} }">Display</router-link>
                <a class="dropdown-item" href="javascript:void(0)"
                  v-on:click="toggleEditUnitModal = true">Edit</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Delete</a>
              </div>
            </div>
            <Modal v-if="toggleEditUnitModal && selectedUnit == unit.id ">
              <div slot="body">
                <form v-on:submit.prevent="editUnit(unit.id, managementIdx, unitIdx)">
                  <div class="form-group">
                    <label for="unitName">Unit Name</label>
                    <input type="text"
                      id="unitName"
                      autocomplete="off"
                      v-model="unit.name" 
                      class="form-control"  
                      placeholder="+ add unit">
                  </div>
                  <button type="submit" 
                    class="btn btn-info btn-sm mr-2"
                    v-on:click="toggleEditUnitModal = false">Save</button>
                  <button type="button" 
                    class="btn btn-light btn-sm"
                    v-on:click="toggleEditUnitModal = false">Cancel</button>
                </form>
              </div>
            </Modal>
          </li>
          <div class="row mt-2">
            <div class="col-md-6">
              <div class="form-group">
                <input type="text"
                  v-model="unitName[managementIdx]"
                  autocomplete="off"
                  class="form-control"  
                  placeholder="+ add unit"
                  v-on:keydown.enter="postUnit(management.id, managementIdx)">
              </div>
            </div>
          </div>
        </ul>
      </li>
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <input type="text" class="form-control"
              autocomplete="off"
              v-model="managementName" 
              placeholder="+ add management"
              v-on:keydown.enter="postManagement()">
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
      listManagementsLoader: true,
      toggleEditUnitModal: false,
      toggleEditManagementModal: false,
      showUnitDropdown: false,
      selectedUnit: null,
      selectedManagement: null,
      managementName: null,
      unitName: [],
      managements: []
    }
  },
  methods: {
    toggleUnitDropdown(unitId) {
      if (unitId == this.selectedUnit) {
        this.selectedUnit = null
      } else {
        this.selectedUnit = unitId
      }
    },
    editManagementModal(managementtId) {
      this.selectedManagement = managementtId
      this.toggleEditManagementModal = true
    },
    postManagement() {
      appService.postManagement({name: this.managementName})
        .then((data) => {
          this.managementName = null
          this.managements.push(data)
        })
    },
    editManagement(managementId, managementIdx) {
      appService.editManagement({
        id: managementId,
        name: this.managements[managementIdx].name,
      })
      .then((data) => {
        this.toggleEditManagementModal = false
      })
    },
    postUnit(managementId, managementIdx) {
      appService.postUnit({
        management: managementId,
        name: this.unitName[managementIdx],
      })
      .then((data) => {
        this.unitName[managementIdx] = null
        this.managements[managementIdx].units.push(data)
      })
    },
    editUnit(unitId, managementIdx, unitIdx) {
      appService.editUnit({
        id: unitId,
        name: this.managements[managementIdx].units[unitIdx].name,
      })
      .then((data) => {
        this.toggleEditUnitModal = false
      })
    },
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
