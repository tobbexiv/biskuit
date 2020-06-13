<template>

        <div class="uk-grid uk-grid-small" data-uk-grid-margin>
            <div class="uk-width-large-1-2">
                <div class="uk-form-icon uk-display-block">
                    <i class="pk-icon-calendar pk-icon-muted"></i>
                    <validation-provider :rules="{ required: isRequired }" slim>
                        <input class="uk-width-1-1" type="text" ref="datepicker" v-model.lazy="date">
                    </validation-provider>
                </div>
            </div>
            <div class="uk-width-large-1-2">
                <div class="uk-form-icon uk-display-block" ref="timepicker">
                    <i class="pk-icon-time pk-icon-muted"></i>
                    <validation-provider :rules="{ required: isRequired }" slim>
                        <input class="uk-width-1-1" type="text" v-model.lazy="time">
                    </validation-provider>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        props: ['value', 'required'],

        data() {
            return {
                datetime: this.value
            }
        },

        mounted() {
            this.$nextTick(function () {
                UIkit.datepicker(this.$refs.datepicker, {format: this.dateFormat, pos: 'bottom'});
                UIkit.timepicker(this.$refs.timepicker, {format: this.clockFormat});
            });
        },

        watch: {
            value(newDatetime) {
                this.datetime = newDatetime;
            },

            datetime(newDatetime) {
                this.$emit('input', newDatetime);
            }
        },

        computed: {
            dateFormat() {
                return window.$locale.DATETIME_FORMATS.shortDate
                    .replace(/\bd\b/i, 'DD')
                    .replace(/\bm\b/i, 'MM')
                    .replace(/\by\b/i, 'YYYY')
                    .toUpperCase();
            },

            timeFormat() {
                return window.$locale.DATETIME_FORMATS.shortTime.replace(/\bh\b/i, 'hh');
            },

            clockFormat() {
                return this.timeFormat.match(/a/) ? '12h' : '24h';
            },

            date: {
                get() {
                    return UIkit.Utils.moment(this.datetime).format(this.dateFormat);
                },

                set(date) {
                    const prev = new Date(this.datetime);
                    date = UIkit.Utils.moment(date, this.dateFormat);
                    date.hours(prev.getHours());
                    date.minutes(prev.getMinutes());
                    this.datetime = date.utc().format();
                }
            },

            time: {
                get() {
                    return UIkit.Utils.moment(this.datetime).format(this.timeFormat);
                },

                set(time) {
                    let date = new Date(this.datetime);
                    time = UIkit.Utils.moment(time, this.timeFormat);
                    date.setHours(time.hours(), time.minutes());
                    this.datetime = date.toISOString();
                }
            },

            isRequired() {
                return this.required !== undefined;
            }
        }
    };

    Vue.component('input-date', (resolve, reject) => {
        Vue.asset({
            js: [
                'app/assets/uikit/js/components/autocomplete.min.js',
                'app/assets/uikit/js/components/datepicker.min.js',
                'app/assets/uikit/js/components/timepicker.min.js'
            ]
        }).then(() => {
            resolve(require('./input-date.vue'));
        })
    });

</script>
