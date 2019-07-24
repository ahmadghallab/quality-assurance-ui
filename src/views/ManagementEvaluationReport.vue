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
                            <td class="font-weight-bold border-top-0">إدارة الرياض الصحية</td>
                            <td class="border-top-0">تقرير شهر</td>
                            <td class="font-weight-bold border-top-0">{{ month + '-' + year }}</td>
                        </tr>
                    </tbody>
                </table>
                <table class="table">
                    <thead>
                        <tr>
                            <th>الوحدة الصحية</th>
                            <th class="text-center">الاجمالي</th>
                            <th class="text-center">مستوفي</th>
                            <th class="text-center">غير مستوفي</th>
                            <th class="text-center">غير مطبق</th>
                            <th class="text-center">النسبة %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(evaluation, evaluationIdx) in evaluations" v-bind:key="evaluationIdx">
                            <td class="font-weight-bold">{{ evaluation.unit__name }}</td>
                            <td class="text-center">{{ evaluation.total }}</td>
                            <td class="text-center">
                                <span class="highlight primary-highlight">
                                    {{ evaluation.total_fulfilled }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="highlight light-highlight">
                                    {{ evaluation.total_not_fulfilled }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span class="highlight light-highlight">
                                    {{ evaluation.total - (evaluation.total_fulfilled + evaluation.total_not_fulfilled) }}
                                </span>
                            </td>
                            <td class="text-center">
                                {{ (evaluation.total_fulfilled / (evaluation.total - (evaluation.total - (evaluation.total_fulfilled + evaluation.total_not_fulfilled) )) * 100).toFixed(1) }} %
                            </td>
                        </tr>
                    </tbody>
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
            managementId: parseInt(this.$route.params.id),
            month: this.$route.query.month,
            year: this.$route.query.year,
            evaluationReportLoader: true,
            evaluations: []
        }
    },
    methods: {
        print () {
            window.print()
        },
        evaluationReport () {
            appService.displayManagementEvaluation({
                managementId: this.managementId,
                month: this.month,
                year: this.year
            }).then(data => {
                this.evaluations = data
                this.evaluationReportLoader = false
            })
        },
    },
    created () {
        this.evaluationReport()
    }
}
</script>