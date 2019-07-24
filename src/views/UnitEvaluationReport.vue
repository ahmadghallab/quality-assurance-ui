<template>
    <div>
        <div class="card__header light-highlight border-bottom screen-only">
            <div class="row justify-content-between">
                <div class="col-auto align-self-center">
                    <button type="button" class="btn btn-light btn-sm" 
                    v-on:click="$router.go(-1)">رجوع</button>
                </div>
                <div class="col-auto align-self-center">
                    <button type="button" class="btn btn-light btn-sm" 
                    v-on:click="print()">طباعة</button>
                </div>
            </div>
        </div>
        <div class="card__footer">
            <Loader v-if="evaluationReportLoader" />
            <div v-else>
                <table class="table">
                    <tbody>
                        <tr>
                            <td class="border-top-0">الادارة الصحية</td>
                            <td class="font-weight-bold border-top-0">{{ unit.management__name }}</td>
                            <td class="border-top-0">الوحدة الصحية</td>
                            <td class="font-weight-bold border-top-0">{{ unit.name }}</td>
                        </tr>
                        <tr>
                            <td>تقرير شهر</td>
                            <td class="font-weight-bold">{{ month + '-' + year }}</td>
                            <td>نتيجة التقرير</td>
                            <td class="font-weight-bold">{{ finalResult }} %</td>
                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead>
                        <tr>
                            <th>البند</th>
                            <th class="text-center">الاجمالي</th>
                            <th class="text-center">مستوفي</th>
                            <th class="text-center">غير مستوفي</th>
                            <th class="text-center">غير مطبق</th>
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
                                {{ ((filteredEvaluationsFulfilled(department.department__id) / filteredEvaluations(department.department__id).length) * 100).toFixed(1) }} %
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead>
                        <tr>
                            <td>المعيــار</td>
                            <td>مستوفي</td>
                            <td class="text-center">نص</td>
                        </tr>
                    </thead>
                    <template v-for="(department, departmentIdx) in departments">
                        <thead class="sub-thead" v-bind:key="departmentIdx">
                            <tr>
                                <td colspan="3" class="light-highlight font-weight-bold">{{ department.department__name }}</td>
                            </tr>
                        </thead>
                        <tbody v-bind:key="'A' + departmentIdx">
                                <tr v-for="(evaluation, evaluationIdx) in filteredEvaluations(department.department__id)" v-bind:key="'B' + evaluationIdx">
                                    <td class="align-middle font-weight-bold">
                                        {{ evaluation.criterion__name }}
                                    </td>
                                    <td class="align-middle text-center font-weight-bold">
                                        <span v-if="evaluation.fulfilled == true">
                                            <svg viewBox="0 0 45.701 45.7" class="check-icon">
                                                <g>
                                                    <path d="M20.687,38.332c-2.072,2.072-5.434,2.072-7.505,0L1.554,26.704c-2.072-2.071-2.072-5.433,0-7.504
                                                        c2.071-2.072,5.433-2.072,7.505,0l6.928,6.927c0.523,0.522,1.372,0.522,1.896,0L36.642,7.368c2.071-2.072,5.433-2.072,7.505,0
                                                        c0.995,0.995,1.554,2.345,1.554,3.752c0,1.407-0.559,2.757-1.554,3.752L20.687,38.332z"/>
                                                </g>
                                            </svg>
                                        </span>
                                        <span v-else-if="evaluation.fulfilled == false">
                                            <svg viewBox="0 0 41.756 41.756" class="check-icon">
                                                <g>
                                                    <path d="M27.948,20.878L40.291,8.536c1.953-1.953,1.953-5.119,0-7.071c-1.951-1.952-5.119-1.952-7.07,0L20.878,13.809L8.535,1.465
                                                        c-1.951-1.952-5.119-1.952-7.07,0c-1.953,1.953-1.953,5.119,0,7.071l12.342,12.342L1.465,33.22c-1.953,1.953-1.953,5.119,0,7.071
                                                        C2.44,41.268,3.721,41.755,5,41.755c1.278,0,2.56-0.487,3.535-1.464l12.343-12.342l12.343,12.343
                                                        c0.976,0.977,2.256,1.464,3.535,1.464s2.56-0.487,3.535-1.464c1.953-1.953,1.953-5.119,0-7.071L27.948,20.878z"/>
                                                </g>
                                            </svg>
                                        </span>
                                    </td>
                                    <td class="align-middle">
                                        {{ evaluation.text }}
                                    </td>
                                </tr>
                        </tbody>
                        
                    </template>
                </table>
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
            return ((this.evaluationsFulfilled.length/(this.evaluations.length - this.evaluationsNotApplicable.length)) * 100).toFixed(1)
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