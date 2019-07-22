<template>  
    <div>
        <Loader v-if="retrieveUnitLoader" />
        <div v-else>
            <div class="default-card border-bottom">
                <h6 class="font-weight-bold mb-0">{{ unitName }}</h6>
            </div>
            <Loader v-if="listUnitEvaluationLoader" />
            <div class="default-card" v-else>
                <ul class="pr-0 mb-0">
                    <li class="mb-2" v-for="(evaluation, evaluationIdx) in unitEvaluations" v-bind:key="evaluationIdx">
                        <a href="javascript:void(0)"
                            class="font-weight-bold"
                            v-on:click="toggleEvaluationList(evaluationIdx)">
                            {{ evaluation.month + '.' + evaluation.year }}
                        </a>
                        <EvaluationEdit
                            v-if="toggleEvaluation && selectedEvaluation == evaluationIdx" 
                            v-bind:unitId="unitId" 
                            v-bind:month="evaluation.month"
                            v-bind:year="evaluation.year" 
                        />
                        <Modal width="800px" v-if="toggleEvaluationReportModal && selectedEvaluation == evaluationIdx">
                            <div slot="body">
                                <EvaluationReport
                                    v-bind:unitId="unitId" 
                                    v-bind:month="evaluation.month"
                                    v-bind:year="evaluation.year" 
                                    @close="toggleEvaluationReportModal = false"
                                />
                            </div>
                        </Modal>
                        <Modal width="500px" v-if="toggleDeleteEvaluationModal && selectedEvaluation == evaluationIdx">
                            <div slot="body" class="text-left">
                                <div class="card__header">
                                    <p class="text-muted">
                                    You are about to delete <span class="highlight info-highlight">{{ evaluation.month + '.' + evaluation.year }}</span> evaluation. No one will be able to access this evaluation ever again
                                    </p>
                                    <p class="font-weight-bold mt-4 mb-0">Are you absolutely positive? There's no undo</p>
                                </div>
                                <div class="card__footer light-highlight border-top">
                                    <button type="button" @click="deleteUnitEvaluation(evaluationIdx, evaluation.month, evaluation.year)"
                                        class="btn btn-info btn-sm ml-2" :disabled="deletingUnitEvaluation">
                                        {{ deletingUnitEvaluation ? 'Deleting' : 'Yes, delete' }}
                                    </button>
                                    <button type="button" 
                                        class="btn btn-light btn-sm bg-white"
                                        v-on:click="toggleDeleteEvaluationModal = false">Cancel
                                    </button>
                                </div>
                            </div>
                        </Modal>
                        <div v-if="selectedEvaluation == evaluationIdx">
                            <!-- <router-link 
                            :to="{ 
                                name: 'evaluationReport', 
                                params: {id: unitId}, 
                                query: {month: evaluation.month, year: evaluation.year}
                            }">طباعة تقرير</router-link> -->
                            <button type="button" class="btn btn-light btn-sm"
                                v-on:click="toggleEvaluationReportModal = true">عرض تقرير
                            </button>
                            <button type="button" class="btn btn-light btn-sm mx-2">تزامن
                            </button>
                            <button type="button" class="btn btn-light btn-sm"
                                v-on:click="toggleDeleteEvaluationModal = true">حذف
                            </button>
                        </div>
                    </li>
                    <p class="text-muted" v-if="!unitEvaluations.length">لا يوجد تقييمات حتي الان</p>    
                </ul>
            </div>
            <div class="default-card border-top">
                <form v-on:submit.prevent="createUnitEvaluation()">
                    <div class="form-row">
                        <div class="col-2">
                            <input type="number" v-model="month" class="form-control" placeholder="شهر">
                        </div>
                        <div class="col-2">
                            <input type="number" v-model="year" class="form-control" placeholder="سنة">
                        </div>
                        <div class="col-auto">
                            <button type="submit" class="btn btn-light" :disabled="createUnitEvalValidator">
                                {{ creatingUnitEvaluation ? 'رجاء الانتظار' : 'إنشاء' }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
import appService from '../app.service.js'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import EvaluationEdit from '../components/EvaluationEdit'
import EvaluationReport from '../components/EvaluationReport'

export default {
    components: {
        Modal,
        Loader,
        EvaluationEdit,
        EvaluationReport
    },
    data () {
        return {
            toggleDeleteEvaluationModal: false,
            toggleEvaluationReportModal: false,
            toggleEvaluation: false,
            deletingUnitEvaluation: false,
            creatingUnitEvaluation: false,
            retrieveUnitLoader: true,
            listUnitEvaluationLoader: true,
            unitId: parseInt(this.$route.params.id),
            unitName: null,
            selectedEvaluation: null,
            month: null,
            year: null,
            unitEvaluations: []
        }
    },
    computed: {
        createUnitEvalValidator () {
            return (this.month && this.year && !this.creatingUnitEvaluation) ? false : true
        }
    },
    methods: {
        toggleEvaluationDropdown(evaluationIdx) {
            if (evaluationIdx == this.selectedEvaluation) {
                this.selectedEvaluation = null
            } else {
                this.selectedEvaluation = evaluationIdx
            }
        },
        toggleEvaluationList(evaluationIdx) {
            if (evaluationIdx == this.selectedEvaluation) {
                this.selectedEvaluation = null
                this.toggleEvaluation = false
            } else {
                this.selectedEvaluation = evaluationIdx
                this.toggleEvaluation = true
            }
        },
        retrieveUnit () {
            appService.retrieveUnit(this.unitId)
                .then(data => {
                    this.unitName = data.name
                    this.retrieveUnitLoader = false
                })
        },
        createUnitEvaluation () {
            this.creatingUnitEvaluation = true
            appService.createUnitEvaluation({
                unitId: this.unitId,
                month: this.month,
                year: this.year
            }).then(() => {
                this.unitEvaluations.push({
                    "month": this.month,
                    "year": this.year
                })
                this.month = null
                this.year = null
                this.creatingUnitEvaluation = false
            })
        },
        listUnitEvaluation () {
            appService.listUnitEvaluation(this.unitId)
                .then(data => {
                    this.unitEvaluations = data
                    this.listUnitEvaluationLoader = false
                })
        },
        deleteUnitEvaluation (index, month, year) {
            this.deletingUnitEvaluation = true
            appService.deleteUnitEvaluation({
                unitId: this.unitId,
                month: month,
                year: year
            }).then(() => {
                this.deletingUnitEvaluation = false
                this.toggleDeleteEvaluationModal = false
                this.unitEvaluations.splice(index, 1)
            })
        }
    },
    created () {
        this.retrieveUnit()
        this.listUnitEvaluation()
    }
}
</script>

