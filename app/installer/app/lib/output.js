export default {
    data() {
        return {
            pkg: {},
            updatePkg: {},
            output: '',
            status: 'loading',
            options: {
                bgclose: false,
                keyboard: false
            }
        }
    },

    created() {
        this.$mount();
    },

    methods: {
        init() {
            this.open();
            return this.setOutput(this.responseText);
        },

        setOutput(output) {
            let lines = output.split("\n");
            const match = lines[lines.length - 1].match(/^status=(success|error)$/);

            if (match) {
                this.status = match[1];
                delete lines[lines.length - 1];
                this.output = lines.join("\n");
            } else {
                this.output = output;
            }
        },

        open() {
            this.$refs.output.open();
            this.$refs.output.modal.on('hide.uk.modal', this.onClose);
        },

        close() {
            this.$refs.output.close();
        },

        onClose() {
            if (this.cb) {
                this.cb(this);
            }
            this.$destroy();
        }

    },

    watch: {
        status() {
            if (this.status !== 'loading') {
                this.$refs.output.modal.options.bgclose = true;
                this.$refs.output.modal.options.keyboard = true;
            }
        }
    }

};
