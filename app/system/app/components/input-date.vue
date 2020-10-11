<template>
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-1-1">
                <div class="uk-inline uk-display-block">
                    <span class="uk-form-icon" uk-icon="calendar"></span>
                    <validation-provider :rules="{ required: isRequired }" slim>
                        <input class="uk-input uk-width-1-1" type="date" v-model.lazy="date">
                    </validation-provider>
                </div>
            </div>
            <div class="uk-width-1-1">
                <div class="uk-inline uk-display-block">
                    <span class="uk-form-icon" uk-icon="clock"></span>
                    <validation-provider :rules="{ required: isRequired }" slim>
                        <input class="uk-input uk-width-1-1" type="time" v-model.lazy="time">
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

        watch: {
            value(newDatetime) {
                this.datetime = newDatetime;
            },

            datetime(newDatetime) {
                this.$emit('input', newDatetime);
            }
        },

        computed: {
            date: {
                get() {
                    const result = this.getDateFromAtomString(this.datetime);
                    return this.getDateString(result.getFullYear(), result.getMonth(), result.getDate());
                },

                set(date) {
                    if(!date) return;
                    const result = this.getDateFromAtomString(this.datetime);
                    const dateInformation = this.getDateInformationFromString(date);
                    result.setFullYear(dateInformation.year, dateInformation.month, dateInformation.day);
                    this.datetime = this.getAtomStringFromDate(result);
                }
            },

            time: {
                get() {
                    const result = this.getDateFromAtomString(this.datetime);
                    return this.getTimeString(result.getHours(), result.getMinutes(), result.getSeconds());
                },

                set(time) {
                    if(!time) return;
                    const result = this.getDateFromAtomString(this.datetime);
                    const timeInformation = this.getTimeInformationFromString(time);
                    result.setHours(timeInformation.hours, timeInformation.minutes, timeInformation.seconds);
                    this.datetime = this.getAtomStringFromDate(result);
                }
            },

            isRequired() {
                return this.required !== undefined;
            }
        },

        methods: {
            getDateFromAtomString(atomString) {
                const splitted = atomString.split('T');
                const dateInformation = this.getDateInformationFromString(splitted[0]);
                const timeInformation = this.getTimeInformationFromString(splitted[1].split('+')[0]);
                let date = new Date(0);
                date.setUTCFullYear(dateInformation.year, dateInformation.month, dateInformation.day);
                date.setUTCHours(timeInformation.hours, timeInformation.minutes, timeInformation.seconds);
                return date;
            },

            getAtomStringFromDate(date) {
                const year = (date.getUTCFullYear() >= 10000) || date.getUTCFullYear() <= 0 ? 1 : date.getUTCFullYear();
                return this.getDateString(year, date.getUTCMonth(), date.getUTCDate()) +
                        'T' + this.getTimeString(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()) +
                        '+00:00';
            },

            getDateInformationFromString(dateString) {
                const splitted = dateString.split('-');
                let year = splitted[0] && splitted[0] >= 0 ? splitted[0] : '0001';
                if(year.length > 4) {
                    year = year.substring(year.length - 4);
                }
                return {
                    year,
                    month: splitted[1] ? splitted[1] - 1 : 1,
                    day: splitted[2] ? splitted[2] : 1,
                };
            },

            getTimeInformationFromString(timeString) {
                const splitted = timeString.split(':');
                return {
                    hours: splitted[0] ? splitted[0] : 0,
                    minutes: splitted[1] ? splitted[1] : 0,
                    seconds: splitted[2] ? splitted[2] : 0,
                };
            },

            getDateString(year, month, day) {
                return this.pad(year, 4) + '-' + this.pad(month + 1, 2) + '-' + this.pad(day, 2);
            },

            getTimeString(hours, minutes, seconds) {
                return this.pad(hours, 2) + ':' + this.pad(minutes, 2) + ':' + this.pad(seconds, 2);
            },

            pad(input, digits) {
                return input.toString().padStart(digits, '0');
            }
        }
    };

    Vue.component('input-date', (resolve, reject) => {
        resolve(require('./input-date.vue'));
    });
</script>
