<template>
    <div class="container-fluid custom_font">
        <div class="row">
            <div class="col-md-12">
                <Loader v-if="retrieveUnitLoader" />
                <div v-else>
                    <h6 class="font-weight-bold">{{ unitName }}</h6>
                </div>
                <Loader v-if="listUnitEvaluationLoader" />
                <div v-else>
                    <ul class="list-unstyled">
                        <li class="mb-1" v-for="(evaluation, evaluationIdx) in unitEvaluations" v-bind:key="evaluationIdx">
                            <div class="btn-group">
                                <a href="javascript:void(0)" 
                                    v-on:click="toggleEditEvaluationList(evaluationIdx)"
                                    class="highlight light-highlight">
                                    {{ evaluation.month + '.' + evaluation.year }}
                                </a>
                            </div>
                            <EditUnitEvaluation 
                                v-bind:unitId="unitId" 
                                v-bind:month="evaluation.month"
                                v-bind:year="evaluation.year"
                                v-if="toggleEditEvaluation && selectedEvaluation == evaluationIdx" 
                            />
                            <Modal width="450px" v-if="toggleDeleteEvaluationModal && selectedEvaluation == evaluationIdx">
                                <div slot="body">
                                    <p class="text-muted">
                                    You are about to delete <span class="highlight info-highlight">{{ evaluation.month + '.' + evaluation.year }}</span> evaluation. No one will be able to access this evaluation ever again.
                                    </p>
                                    <p class="font-weight-bold my-4">Are you absolutely positive? There's no undo.</p>
                                    <div>
                                        <button type="button" @click="deleteUnitEvaluation(evaluationIdx, evaluation.month, evaluation.year)"
                                            class="btn btn-info btn-sm mr-2" :disabled="deletingUnitEvaluation">
                                            {{ deletingUnitEvaluation ? 'Deleting' : 'Yes, delete' }}
                                        </button>
                                        <button type="button" 
                                            class="btn btn-light btn-sm"
                                            v-on:click="toggleDeleteEvaluationModal = false">Cancel
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </li>
                        <p class="text-muted" v-if="!unitEvaluations.length">No evaluations yet</p>
                        <form v-on:submit.prevent="createUnitEvaluation()">
                            <div class="form-row mt-4">
                                <div class="col-2 col-md-1">
                                    <input type="number" v-model="month" class="form-control" placeholder="month">
                                </div>
                                <div class="col-2 col-md-1">
                                    <input type="number" v-model="year" class="form-control" placeholder="year">
                                </div>
                                <div class="col-auto">
                                    <button type="submit" class="btn btn-light btn-sm" :disabled="createUnitEvalValidator">
                                        {{ creatingUnitEvaluation ? 'Creating' : 'Create' }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import appService from '../app.service.js'
import Modal from '../components/Modal'
import Loader from '../components/Loader'
import EditUnitEvaluation from '../components/EditUnitEvaluation'

export default {
    components: {
        Modal,
        Loader,
        EditUnitEvaluation
    },
    data () {
        return {
            toggleDeleteEvaluationModal: false,
            toggleEditEvaluation: false,
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
        toggleEditEvaluationList(evaluationIdx) {
            if (evaluationIdx == this.selectedEvaluation) {
                this.selectedEvaluation = null
                this.toggleEditEvaluation = false
            } else {
                this.selectedEvaluation = evaluationIdx
                this.toggleEditEvaluation = true
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

