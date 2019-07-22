<template>
    <div>
        <Loader v-if="evaluationReportLoader" />
        <div v-else>
            <table class="table">
                <tbody>
                    <tr>
                        <td class="border-top-0">الادارة الصحية</td>
                        <td class="font-weight-bold border-top-0 border-bottom">{{ unit.management__name }}</td>
                        <td class="border-top-0">الوحدة الصحية</td>
                        <td class="font-weight-bold border-top-0 border-bottom">{{ unit.name }}</td>
                    </tr>
                    <tr>
                        <td class="border-top-0">تقرير شهر</td>
                        <td class="font-weight-bold border-bottom">{{ month + '-' + year }}</td>
                        <td class="border-top-0">نتيجة التقرير</td>
                        <td class="font-weight-bold border-bottom">{{ finalResult }} %</td>
                    </tr>
                </tbody>
            </table>
            <p class="font-weight-bold mb-3">تقرير نتيجة التقييم</p>
            <table class="table">
                <thead>
                    <tr>
                        <th>البند</th>
                        <th class="text-center">الاجمالي</th>
                        <th class="text-center">مستوفي</th>
                        <th class="text-center">غير مستوفي</th>
                        <th class="text-center">غير متاح</th>
                        <th class="text-center">النسبة %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(department, departmentIdx) in departments" v-bind:key="departmentIdx">
                        <td class="font-weight-bold">{{ department.department__name }}</td>
                        <td class="text-center">{{ filteredEvaluations(department.department__id).length }}</td>
                        <td class="text-center">
                            <span class="highlight primary-highlight">
                                {{ filteredEvaluationsFulfilled(department.department__id) }}
                            </span>
                        </td>
                        <td class="text-center">
                            <span class="highlight light-highlight">
                                {{ filteredEvaluationsNotFulfilled(department.department__id) }}
                            </span>
                        </td>
                         <td class="text-center">
                            <span class="highlight light-highlight">
                                {{ filteredEvaluationsNotApplicable(department.department__id) }}
                            </span>
                        </td>
                        <td class="text-center">
                            {{ ((filteredEvaluationsFulfilled(department.department__id) / filteredEvaluations(department.department__id).length) * 100).toFixed(2) }} %
                        </td>
                    </tr>
                </tbody>
            </table>
            <ul class="my-2 pr-0">
                <li class="mb-2" v-for="(department, departmentIdx) in departments"  
                    v-bind:key="departmentIdx">
                    <span class="font-weight-bold">{{ department.department__name }}</span>
                    <ul class="nested-ul">
                        <li class="my-2" 
                            v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" 
                            v-bind:key="evaluationIdx">
                            <div class="row">
                                <div class="col-auto align-self-center pl-0">
                                    <span v-if="evaluation.fulfilled == true">+</span>
                                    <span v-else-if="evaluation.fulfilled == false">-</span>
                                    <span v-else>!</span>
                                </div>
                                <div class="col">
                                    <span class="font-weight-bold">{{ evaluation.criterion__name }}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="mt-4">
                <button type="button" class="btn btn-light btn-sm ml-2" 
                v-on:click="print()">طباعة</button>
                <button type="button" 
                    class="btn btn-light btn-sm" @click="$emit('close')">الغاء
            </button>
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
    props: {
        unitId: Number,
        month: Number,
        year: Number
    },
    data () {
        return {
            evaluationReportLoader: true,
            departments: [],
            evaluations: [],
            unit: {}
        }
    },
    computed: {
        filteredEvaluations () {
            return (departmentId) => this.evaluations.filter(evaluation => departmentId == evaluation.department_id)
        },
        filteredEvaluationsFulfilled () {
            return (departmentId) => this.filteredEvaluations(departmentId).filter(evaluation => evaluation.fulfilled == true).length
        },
        filteredEvaluationsNotFulfilled () {
            return (departmentId) => this.filteredEvaluations(departmentId).filter(evaluation => evaluation.fulfilled == false).length
        },
        filteredEvaluationsNotApplicable () {
            return (departmentId) => this.filteredEvaluations(departmentId).filter(evaluation => evaluation.fulfilled == null).length
        },
        evaluationsFulfilled () {
            return this.evaluations.filter(evaluation => evaluation.fulfilled)
        },
        evaluationsNotApplicable () {
            return this.evaluations.filter(evaluation => evaluation.fulfilled == null)
        },
        finalResult () {
            return (((this.evaluationsFulfilled.length + this.evaluationsNotApplicable.length)/this.evaluations.length) * 100).toFixed(2)
        }
    },
    methods: {
        print () {
            window.print()
        },
        evaluationReport () {
            appService.displayUnitEvaluation('report', {
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.departments = data.departments
                this.evaluations = data.evaluations
                this.unit = data.unit
                this.evaluationReportLoader = false
            })
        },
    },
    created () {
        this.evaluationReport()
    }
}
</script>