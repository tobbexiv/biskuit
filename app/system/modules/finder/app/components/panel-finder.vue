<template>
    <div v-show="items">
        <div class="uk-flex uk-flex-between uk-flex-wrap" uk-margin>
            <div class="uk-flex uk-flex-middle uk-flex-wrap" uk-margin>
                <h3 class="uk-margin-right uk-margin-remove-bottom" v-show="!selected.length">{{ '{0} %count% Files|{1} %count% File|]1,Inf[ %count% Files' | transChoice(count, {count:count}) }}</h3>
                <h3 class="uk-margin-right uk-margin-remove-bottom uk-margin-remove-top" v-show="selected.length">{{ '{1} %count% File selected|]1,Inf[ %count% Files selected' | transChoice(selected.length, {count:selected.length}) }}</h3>

                <div class="uk-margin-right" v-if="isWritable" v-show="selected.length">
                    <ul class="uk-iconnav">
                        <li v-show="selected.length === 1"><a uk-icon="file-edit" :title="$trans('Rename')" data-uk-tooltip="{delay: 500}" @click.prevent="rename"></a></li>
                        <li><a uk-icon="trash" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove" v-confirm="'Delete files?'"></a></li>
                    </ul>
                </div>

                <hr class="uk-divider-vertical bk-divider-vertical uk-margin-remove" />

                <div class="uk-search uk-search-navbar">
                    <span uk-search-icon></span>
                    <input class="uk-search-input" type="text" v-model="search">
                </div>
            </div>

            <div class="uk-flex uk-flex-middle uk-flex-wrap" uk-margin>
                <div class="uk-margin-right">
                    <ul class="uk-iconnav">
                        <li :class="{'uk-active': innerView == 'template-table'}">
                            <a uk-icon="table" :title="$trans('Table View')" data-uk-tooltip="{delay: 500}" @click.prevent="innerView = 'template-table'"></a>
                        </li>
                        <li :class="{'uk-active': innerView == 'template-thumbnail'}">
                            <a uk-icon="grid" :title="$trans('Thumbnails View')" data-uk-tooltip="{delay: 500}" @click.prevent="innerView = 'template-thumbnail'"></a>
                        </li>
                    </ul>
                </div>

                <div>
                    <button class="uk-button uk-button-default uk-margin-small-right" @click.prevent="createFolder()">{{ 'Add Folder' | trans }}</button>
                    <div uk-form-custom>
                        <input class="bk-file-upload" type="file" name="files[]" multiple>
                        <button class="uk-button" :class="{'uk-button-default': modal, 'uk-button-primary': !modal}" type="button" tabindex="-1">{{ 'Upload' | trans }}</button>
                    </div>
                </div>
            </div>
        </div>

        <ul class="uk-breadcrumb uk-margin-top">
            <li v-for="(bc, key) in breadcrumbs" :key="key">
                <span v-if="bc.current">{{ bc.title }}</span>
                <a v-else @click.prevent="setPath(bc.path)">{{ bc.title }}</a>
            </li>
        </ul>

        <progress v-show="upload.running" class="uk-progress" value="upload.progress" max="upload.total"></progress>

        <div class="uk-overflow-auto">
            <component :is="innerView" v-show="count"></component>
            <h3 class="uk-h1 uk-text-muted uk-text-center" v-show="!count">{{ 'No files found.' | trans }}</h3>
        </div>
    </div>
</template>

<script>
    import { $, parents } from 'uikit-util';

    const PanelFinder = {
        name: 'panel-finder',

        props: {
            root: {type: String, default: '/'},
            mode: {type: String, default: 'write'},
            path: {type: String},
            view: {type: String},
            modal: Boolean
        },

        data() {
            return {
                innerView: this.view,
                innerPath: this.path,
                upload: {},
                selected: [],
                items: false,
                search: ''
            };
        },

        created() {
            this.resource = this.$resource('system/finder{/cmd}');

            if (!this.innerPath) {
                this.innerPath = this.$session.get('finder.' + this.root + '.path', '/');
            }

            if (!this.innerView) {
                this.innerView = this.$session.get('finder.' + this.root + '.view', 'template-table');
            }
        },

        mounted() {
            this.load().then(function () {
                this.$trigger('finder:ready', { finder: this });
            });

            this.$nextTick(function() {
                this.initUpload();
            });
        },

        watch: {
            view(newView) {
                this.innerView = newView;
            },

            innerView(newView) {
                this.$session.set('finder.' + this.root + '.view', newView);
                this.$emit('finder:change-view', newView);
            },

            path(newPath) {
                this.innerPath = newPath;
            },

            innerPath(newPath) {
                this.load();
                this.$session.set('finder.' + this.root + '.path', newPath);
                this.$emit('finder:change-path', newPath);
            },

            selected() {
                this.$trigger('finder:selected', { selected: this.getSelected() });
            },

            search() {
                this.selected = _.filter(this.selected, _.bind((name) => {
                    return _.find(this.searched, ['name', name]);
                }, this));
            }
        },

        computed: {
            searchedFolders() {
                return _.filter(this.searched, { mime: 'application/folder' });
            },

            searchedFiles() {
                return _.filter(this.searched, { mime: 'application/file' });
            },

            breadcrumbs() {
                let path = '';
                let crumbs = [{path: '/', title: this.$trans('Home')}]
                        .concat(this.innerPath.substr(1).split('/')
                            .filter((str) => {
                                return str.length;
                            })
                            .map((part) => {
                                return {path: path += '/' + part, title: part};
                            })
                        );

                crumbs[crumbs.length - 1].current = true;

                return crumbs;
            },

            searched() {
                return _.filter(this.items, _.bind((file) => {
                    return !this.search || file.name.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
                }, this));
            },

            count() {
                return this.searched.length;
            }

        },

        methods: {
            /**
             * API
             */

            setPath(path) {
                this.innerPath = path;
            },

            getPath() {
                return this.innerPath;
            },

            getFullPath() {
                return (this.getRoot() + this.getPath()).replace(/^\/+|\/+$/g, '') + '/';
            },

            getRoot() {
                return this.root.replace(/^\/+|\/+$/g, '')
            },

            getSelected() {
                return this.selected.map(function (name) {
                    return _.find(this.items, ['name', name]).url;
                }, this);
            },

            removeSelection() {
                this.selected = [];
            },

            toggleSelect(name) {
                const index = this.selected.indexOf(name);
                -1 === index ? this.selected.push(name) : this.selected.splice(index, 1);
            },

            isSelected(name) {
                return this.selected.indexOf(name.toString()) != -1;
            },

            createFolder() {
                const vm = this;
                UIkit.modal.prompt(this.$trans('Folder Name'), '').then((name) => {
                    if (!name) return;
                    vm.command('createfolder', {name: name});
                });
            },

            rename(oldname) {
                if (oldname.target) {
                    oldname = this.selected[0];
                }

                if (!oldname) return;

                const vm = this;
                UIkit.modal.prompt(this.$trans('Name'), oldname, { title: this.$trans('Rename') }).then((newname) => {
                    if (!newname) return;
                    vm.command('rename', { oldname: oldname, newname: newname });
                });
            },

            remove(names) {
                if (names.target) {
                    names = this.selected;
                }

                if (names) {
                    this.command('removefiles', {names: names});
                }
            },

            /**
             * Helper functions
             */

            encodeURI(url) {
                return encodeURI(url).replace(/'/g, '%27');
            },

            isWritable() {
                return this.mode === 'w' || this.mode === 'write';
            },

            isImage(url) {
                return url.match(/\.(?:gif|jpe?g|png|svg|ico)$/i);
            },

            isVideo(url) {
                return url.match(/\.(mpeg|ogv|mp4|webm|wmv)$/i);
            },

            command(cmd, params) {
                return this.resource.save({cmd}, _.extend({ path: this.innerPath, root: this.getRoot() }, params)).then(function (res) {
                        this.load();
                        this.$notify(res.data.message, res.data.error ? 'danger' : '');
                    }, function (res) {
                        this.$notify(res.status == 500 ? 'Unknown error.' : res.data, 'danger');
                    }
                );
            },

            load() {
                return this.resource.get({ path: this.innerPath, root: this.getRoot() }).then(function (res) {
                        this.items = res.data.items || [];
                        this.selected = [];
                        this.$trigger('finder:path', this.getFullPath(), this);
                    }, function () {
                        this.$notify('Unable to access directory.', 'danger');
                    }
                );
            },

            initUpload() {
                const finder = this;
                const settings = {
                        url: this.$url.route('system/finder/upload'),
                        multiple: true,

                        beforeAll(options) {
                            _.extend(options.params, { path: finder.innerPath, root: finder.getRoot(), _csrf: $biskuit.csrf });
                        },

                        loadStart(e) {
                            finder.$set(finder.upload, 'running', true);
                            finder.$set(finder.upload, 'progress', e.loaded);
                            finder.$set(finder.upload, 'total', e.total);
                        },

                        progress(e) {
                            finder.$set(finder.upload, 'progress', e.loaded);
                            finder.$set(finder.upload, 'total', e.total);
                        },

                        loadEnd(e) {
                            finder.$set(finder.upload, 'progress', e.loaded);
                            finder.$set(finder.upload, 'total', e.total);
                        },

                        completeAll(response) {
                            let data = response;
                            let message = 'Error uploading files.';
                            let error = true;
                            try{
                                data = JSON.parse(data.responseText);
                                message = data.message;
                                error = data.error;
                            } catch(e) {
                                // Nothing implemented, yet.
                            }

                            finder.load();
                            finder.$notify(message, error ? 'danger' : '');

                            setTimeout(function () {
                                finder.$set(finder.upload, 'running', false);
                            }, 1500);
                        }

                    };

                UIkit.upload($('.bk-file-upload', this.$el), settings);
                UIkit.upload(parents(this.$el, '.uk-modal').length ? this.$el : $('html'), settings);
            }
        },

        components: {
            'template-table': {
                template: require('../templates/table.html')
            },
            'template-thumbnail': {
                template: require('../templates/thumbnail.html')
            }
        }
    };

    export default PanelFinder;

    Vue.component('panel-finder', function(resolve) {
        resolve(PanelFinder);
    });
</script>
