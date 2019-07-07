<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <ul class="nested-ul mt-2" v-else>
            <li class="mb-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                <span class="highlight font-weight-bold">{{ department.department__name }}</span>
                <ul class="nested-ul">
                    <li class="mt-1" 
                        v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" 
                        v-bind:key="evaluationIdx">
                        <a href="javascript:void(0)" 
                            class="highlight"
                            v-bind:class="[evaluation.checked ? 'success-highlight' : 'light-highlight']"
                            v-on:click="check(evaluation)">
                            {{ evaluation.criterion__name }}
                        </a>
                    </li>
                </ul>
            </li>
            <div class="my-3">
                <button type="button" class="btn btn-light btn-sm mr-2"
                    v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !checkedCriteria.length">
                    {{ savingUnitEvaluation ? 'Saving' : 'Save' }}
                </button>
            </div>
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
