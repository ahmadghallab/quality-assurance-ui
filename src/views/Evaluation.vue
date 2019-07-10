<template>
    <div>
        <Loader v-if="editUnitEvaluationLoader" />
        <div v-else>
            <div class="card__header">
                <div class="mb-1" v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                    <p class="font-weight-bold my-2">{{ department.department__name }}</p>
                    <ul class="nested-ul">
                        <li class="mb-2" 
                            v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" 
                            v-bind:key="evaluationIdx">
                            <a href="javascript:void(0)" 
                                class="highlight"
                                v-bind:class="[evaluation.checked ? 'success-highlight' : 'light-highlight']"
                                v-on:click="check(evaluation)">
                                <span v-if="evaluation.checked">+</span>
                                <span v-else>-</span>
                                {{ evaluation.criterion__name }}
                            </a>
                            <!-- <div class="row">
                                <div class="col-auto pl-0">
                                    <span v-if="evaluation.checked" class="ml-2">+</span>
                                    <span class="ml-2" v-else>-</span>
                                </div>
                                <div class="col pr-0">
                                    <a href="javascript:void(0)" 
                                        class="highlight"
                                        v-bind:class="[evaluation.checked ? 'success-highlight' : 'light-highlight']"
                                        v-on:click="check(evaluation)">
                                        {{ evaluation.criterion__name }}
                                    </a>
                                </div>
                            </div> -->
                            <ul class="nested-ul" v-if="!evaluation.checked">
                                <li class="mt-2">
                                    {{ evaluation.criterion__suggested_solution }}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="card__footer light">
                <button type="button" class="btn btn-info"
                    v-on:click="saveUnitEvaluation()" :disabled="savingUnitEvaluation || !checkedCriteria.length">
                    {{ savingUnitEvaluation ? 'يتم الحفظ' : 'حفظ التعديلات' }}
                </button>
            </div> 
            <!-- <div class="default-card">
                <p class="font-weight-bold mb-3">السلبيات والحل المقترح</p>
                <ul class="pr-0">
                    <li class="my-2" v-for="(evaluation, evaluationNotCheckedIdx) in evaluationsNotChecked" v-bind:key="evaluationNotCheckedIdx">
                        <p class="highlight font-weight-bold my-2">
                            {{ evaluation.criterion__name }}
                        </p>
                        <ul class="nested-ul">
                            <li class="mb-2">
                                <span class="highlight success-highlight">
                                    الحل المقترح
                                </span>
                            </li>
                            <li class="mb-1">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <input type="text" class="form-control"
                                            autocomplete="off"
                                            placeholder="+ ملاحظـــات">
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div> -->
            <div class="default-card">
                <p class="highlight font-weight-bold mb-3">الملخص</p>
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
                            <td>
                                <span class="highlight light-highlight ml-2">
                                    {{ filteredEvaluationsChecked(department.department__id) }}
                                </span>
                                <span class="highlight success-highlight">
                                    {{ ((filteredEvaluationsChecked(department.department__id) / evaluations.length) * 100).toFixed(1) }}%
                                </span>
                            </td>
                            <td>
                                <span class="highlight light-highlight ml-2">
                                    {{ filteredEvaluationsNotChecked(department.department__id) }}
                                </span>
                                <span class="highlight danger-highlight">
                                {{ ((filteredEvaluationsNotChecked(department.department__id) / evaluations.length) * 100).toFixed(1) }}%
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <button type="button" class="btn btn-light" v-on:click="print()">طباعة</button>
            </div>
        </div>
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
            unitId: parseInt(this.$route.params.id),
            month: this.$route.query.month,
            year: this.$route.query.year,
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
        filteredEvaluationsChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).filter(evaluation => evaluation.checked).length
        },
        filteredEvaluationsNotChecked () {
            return (departmentId) => this.filteredEvaluations(departmentId).length - this.filteredEvaluationsChecked(departmentId)
        },
        evaluationsNotChecked () {
            return this.evaluations.filter(evaluation => evaluation.checked == false)
        },
        highlight () {
            return (evaluationId) => this.checkedCriteria.includes(evaluationId) 
        }
    },
    methods: {
        print () {
            window.print()
        },
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