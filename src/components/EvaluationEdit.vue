<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <ul class="nested-ul my-2" v-else>
            <li class="mb-2" v-for="(department, departmentIdx) in departments"     
                v-bind:key="departmentIdx">
                <a href="javascript:void(0)" class="font-weight-bold"
                    v-bind:class="{'highlight light-highlight': selectedDepartment == department.department__id}"
                    @click="getUnitEvaluation(department.department__id)">
                    {{ department.department__name }}
                </a>
                <Loader v-if="selectedDepartment == department.department__id && getDepartmentEvaluationLoader" />
                <ul class="nested-ul" v-else-if="selectedDepartment == department.department__id">
                    <li class="my-2" v-for="(evaluation, evaluationIdx) in evaluations" v-bind:key="evaluationIdx">
                        <div class="row">
                            <div class="col-auto align-self-center pl-0">
                                <span class="dot" v-bind:class="{
                                    'primary-highlight': evaluation.checked,
                                    'light-highlight': !evaluation.checked
                                }"></span>
                            </div>
                            <div class="col align-self-center">
                                <a href="javascript:void(0)" class="font-weight-bold highlight"
                                    v-on:click="select(evaluationIdx, evaluation.id)"
                                    v-bind:class="{'primary-highlight': selected(evaluation.id)}">
                                    {{ evaluation.criterion__name }}
                                </a>
                                
                            </div>
                        </div>
                    </li>
                    <div class="form-group mt-3">
                        <button type="button" class="btn btn-sm ml-2"
                            v-bind:class="[allSelected ? 'btn-secondary' : 'btn-light']" 
                            @click="selectAll()">تحديد
                        </button>
                        <button type="button" class="btn btn-light btn-sm ml-1"
                            v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !selectedCriteria.length">مستوفي
                        </button>
                        <button type="button" class="btn btn-light btn-sm ml-1"
                            v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !selectedCriteria.length">غير مستوفي
                        </button>
                         <button type="button" class="btn btn-light btn-sm ml-2"
                            v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !selectedCriteria.length">اخري
                        </button>
                        <button type="button" class="btn btn-light btn-sm ml-1"
                            v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !selectedCriteria.length">متاح
                        </button>
                        <button type="button" class="btn btn-light btn-sm ml-2"
                            v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !selectedCriteria.length">غير متاح
                        </button>
                        <button type="button" class="btn btn-light btn-sm mr-1"
                            v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !selectedCriteria.length">نص
                        </button>
                    </div>
                </ul>
            </li>
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
    props: {
        unitId: Number,
        month: Number,
        year: Number
    },
    data () {
        return {
            editUnitEvaluationLoader: true,
            getDepartmentEvaluationLoader: false,
            savingUnitEvaluation: false,
            toggleEditEvaluationModal: false,
            selectedEvaluation: null,
            selectedDepartment: null,
            selectedCriteria: [],
            departments: [],
            evaluations: []
        }
    },
    computed: {
        allSelected () {
            return this.selectedCriteria.length == this.evaluations.length
        },
        selected () {
        return criterion => this.selectedCriteria.includes(criterion)
        }
    },
    methods: {
        select (evaluationIdx, evaluationId) {
            // this.evaluations[evaluationIdx].selected = !this.evaluations[evaluationIdx].selected
            if (this.selectedCriteria.includes(evaluationId)) {
                let arrIndx = this.selectedCriteria.indexOf(evaluationId)
                this.selectedCriteria.splice(arrIndx, 1)
            } else {
                this.selectedCriteria.push(evaluationId)
            }
        },
        selectAll() {
            if (this.allSelected) {
                this.selectedCriteria = []
            } else {
                for (let evaluation of this.evaluations) {
                    if (!this.selectedCriteria.includes(evaluation.id)) {
                        this.selectedCriteria.push(evaluation.id)
                    }
                }
            }
        },
        editEvaluationModal(evaluationId) {
            this.selectedEvaluation = evaluationId
            this.toggleEditEvaluationModal = true
        },
        editUnitEvaluation () {
            appService.displayUnitEvaluation('edit', {
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.departments = data
                this.editUnitEvaluationLoader = false
            })
        },
        getUnitEvaluation(departmentId) {
            if (this.selectedDepartment == departmentId) {
                this.selectedDepartment = null
                this.selectedCriteria = []
            } else {
                this.getDepartmentEvaluationLoader = true
                this.selectedDepartment = departmentId
                appService.displayUnitEvaluation('get', {
                    unitId: this.unitId,
                    month: this.month,
                    year: this.year,
                    department: this.selectedDepartment
                }).then(data => {
                    this.evaluations = data
                    this.getDepartmentEvaluationLoader = false
                })
            }
        },
        saveUnitEvaluation () {
            this.savingUnitEvaluation = true
            appService.saveUnitEvaluation({
                id: this.selectedEvaluation,
                criteria: this.selectedCriteria,
            }).then(() => {
                this.selectedCriteria = []
                this.savingUnitEvaluation = false
            })
        }
    },
    created () {
        this.editUnitEvaluation()
    }
}
</script>