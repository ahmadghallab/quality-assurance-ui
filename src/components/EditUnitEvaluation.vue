<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <ul class="mt-2 pr-0" v-else>
            <li class="mb-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                <p class="highlight font-weight-bold mb-2">{{ department.department__name }}</p>
                <ul class="nested-ul">
                    <li class="mb-1" 
                        v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" 
                        v-bind:key="evaluationIdx">
                        <span v-if="evaluation.checked" class="ml-2">+</span>
                        <span class="ml-2" v-else>-</span>
                        <a href="javascript:void(0)" 
                            class="highlight"
                            v-bind:class="[evaluation.checked ? 'success-highlight' : 'light-highlight']"
                            v-on:click="check(evaluation)">
                            {{ evaluation.criterion__name }}
                        </a>
                    </li>
                    <li class="my-3">
                        <span class="highlight success-highlight ml-2 bordered">
                            +{{ filteredEvaluationsChecked(department.department__id) }}
                        </span>
                        <span class="highlight danger-highlight bordered">
                            -{{ filteredEvaluationsNotChecked(department.department__id).length }}
                        </span>
                    </li>
                </ul>
            </li>
            <!-- <div class="my-3">
                <button type="button" class="btn btn-light btn-sm mr-2"
                    v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !checkedCriteria.length">
                    {{ savingUnitEvaluation ? 'يتم الحفظ' : 'حفظ' }}
                </button>
            </div> -->
            <p class="highlight font-weight-bold my-3">السلبيات والحل المقترح</p>
            <ul class="nested-ul">
                <li v-for="(evaluation, evaluationNotCheckedIdx) in evaluationsNotChecked" v-bind:key="evaluationNotCheckedIdx"
                class="mb-1">
                    <span class="highlight danger-highlight">
                        {{ evaluation.criterion__name }}
                    </span>
                </li>
            </ul>
            <p class="highlight font-weight-bold my-3">الملخص</p>
            <ul class="nested-ul">
                <table class="table">
                    <thead>
                        <tr>
                            <th>البند</th>
                            <th>ايجابي</th>
                            <th>سلبي</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                            <td class="font-weight-bold">{{ department.department__name }}</td>
                            <td>20%</td>
                            <td>
                                <span class="highlight danger-highlight">
                                {{ ((filteredEvaluationsNotChecked(department.department__id).length / evaluations.length) * 100).toFixed(1) }}%
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- <li class="mb-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                    <div class="row">
                        <div class="col-auto">{{ department.department__name }}</div>
                        <div class="col-auto">20%</div>
                        <div class="col-auto">80%</div>
                    </div>
                </li> -->
            </ul>    
        </ul>
    </div>
</template>
<script>
import appService from '../app.service.js'
import Loader from './Loader.vue'

export default {
    components: {
        Loader
    },
    props: {
        unitId: Number,
        month: Number,
        year: Number
    },
    data () {
        return {
            editUnitEvaluationLoader: true,
            savingUnitEvaluation: false,
            checkedCriteria: [],
            departments: [],
            evaluations: []
        }
    },
    computed: {
        filteredEvaluations () {
            return (departmentId) => this.evaluations.filter(evaluation => departmentId == evaluation.department_id
            )
        },
        filteredEvaluationsNotChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).filter(evaluation => evaluation.checked == false)
        },
        filteredEvaluationsChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).length - this.filteredEvaluationsNotChecked(departmentId).length
        },
        evaluationsNotChecked () {
            return this.evaluations.filter(evaluation => evaluation.checked == false)
        },
        highlight () {
            return (evaluationId) => this.checkedCriteria.includes(evaluationId) 
        }
    },
    methods: {
        check (evaluation) {
            const evaluationIndx = this.evaluations.indexOf(evaluation)
            this.evaluations[evaluationIndx].checked = !this.evaluations[evaluationIndx].checked
            
            if (this.checkedCriteria.includes(evaluation.id)) {
                let arrIndx = this.checkedCriteria.indexOf(evaluation.id)
                this.checkedCriteria.splice(arrIndx, 1)
            } else {
                this.checkedCriteria.push(evaluation.id)
            }
        },
        editUnitEvaluation () {
            appService.editUnitEvaluation({
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.departments = data.departments
                this.evaluations = data.evaluations
                this.editUnitEvaluationLoader = false
            })
        },
        saveUnitEvaluation () {
            this.savingUnitEvaluation = true
            appService.saveUnitEvaluation({
                criteria: this.checkedCriteria
            }).then(() => {
                this.checkedCriteria = []
                this.savingUnitEvaluation = false
            })
        }
    },
    created () {
        this.editUnitEvaluation()
    }
}
</script>
