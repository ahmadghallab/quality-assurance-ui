<template>
    <nav class="bg-primary customNav fixed-top">
        <div class="row justify-content-between bootstrap-nav">
            <div class="col-auto"></div>
            <div class="col-auto align-self-center">
                <ul class="list-inline mb-0 pr-0">
                    <li class="list-inline-item">
                        <router-link class="font-weight-bold nav-link" :to="{name: 'home'}">
                            الرئيسية
                        </router-link>
                    </li>
                    <li class="list-inline-item">
                        <router-link class="font-weight-bold nav-link" :to="{name: 'management'}">
                            الادارات
                        </router-link>
                    </li>
                    <li class="list-inline-item">
                        <router-link class="font-weight-bold nav-link" :to="{name: 'criterion'}">
                            المعايير
                        </router-link>
                    </li>
                </ul>
            </div>
            <div class="col-auto"></div>
        </div>
    </nav>
</template>
