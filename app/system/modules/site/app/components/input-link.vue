<template>
    <div>
        <v-validated-input
            :id="id"
            :name="name"
            :rules="{ required: isRequired }"
            :error-messages="{ required: 'Link cannot be blank.' }"
            :options="{
                    wrapperClass: inputClass,
                    innerWrapperClass: 'uk-width-1-1',
                    icon: {
                        type: 'link',
                        symbol: 'link',
                        label: 'Select',
                        callback: open
                    }
                }"
            v-model.lazy="link">
        </v-validated-input>

        <p class="uk-text-muted uk-margin-small-top uk-margin-remove-bottom" v-show="url">{{ url }}</p>

        <v-modal ref="modal">
            <template #header>
                <h2 class="uk-modal-title">{{ 'Select Link' | trans }}</h2>
            </template>

            <form class="uk-form-stacked" @submit.prevent="update" ref="selectForm">
                <panel-link @selection-changed="updateSelection"></panel-link>
            </form>

            <template #footer>
                <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                <button class="uk-button uk-button-link" @click="update" :disabled="lastSelection == ''">{{ 'Update' | trans }}</button>
            </template>
        </v-modal>
    </div>
</template>

<script>
    export default {
        props: ['name', 'inputClass', 'id', 'required', 'value'],

        data() {
            return {
                link: this.value,
                lastSelection: '',
                url: false,
                updateDisabled: true
            };
        },

        watch: {
            link: {
                handler: 'linkChanged',
                immediate: true
            }
        },

        computed: {
            isRequired() {
                return this.required !== undefined;
            }
        },

        methods: {
            linkChanged() {
                this.$emit('input', this.link);
                this.load();
            },

            load() {
                if (this.link) {
                    this.$http.get('api/site/link', { params: { link: this.link }}).then(function (res) {
                                this.url = res.data.url || false;
                            }, function () {
                                this.url = false;
                            });
                } else {
                    this.url = false;
                }
            },

            open() {
                this.$refs.modal.open();
            },

            update() {
                this.link = this.lastSelection;
                this.lastSelection = '';
                this.$refs.modal.close();
            },

            updateSelection(selection) {
                this.lastSelection = selection;
            }
        }
    };

    Vue.component('input-link', (resolve) => {
        resolve(require('./input-link.vue'));
    });
</script>
