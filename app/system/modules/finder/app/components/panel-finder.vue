<template>
    <div class="uk-form" v-show="items">
        <div class="uk-margin uk-flex uk-flex-space-between uk-flex-wrap" data-uk-margin>
            <div class="uk-flex uk-flex-middle uk-flex-wrap" data-uk-margin>
                <h2 class="uk-margin-remove" v-show="!selected.length">{{ '{0} %count% Files|{1} %count% File|]1,Inf[ %count% Files' | transChoice(count, {count:count}) }}</h2>
                <h2 class="uk-margin-remove" v-show="selected.length">{{ '{1} %count% File selected|]1,Inf[ %count% Files selected' | transChoice(selected.length, {count:selected.length}) }}</h2>

                <div class="uk-margin-left" v-if="isWritable" v-show="selected.length">
                    <ul class="uk-subnav pk-subnav-icon">
                        <li v-show="selected.length === 1"><a class="pk-icon-edit pk-icon-hover" :title="$trans('Rename')" data-uk-tooltip="{delay: 500}" @click.prevent="rename"></a></li>
                        <li><a class="pk-icon-delete pk-icon-hover" :title="$trans('Delete')" data-uk-tooltip="{delay: 500}" @click.prevent="remove" v-confirm="'Delete files?'"></a></li>
                    </ul>
                </div>

                <div class="pk-search">
                    <div class="uk-search">
                        <input class="uk-search-field" type="text" v-model="search">
                    </div>
                </div>
            </div>

            <div class="uk-flex uk-flex-middle uk-flex-wrap" data-uk-margin>
                <div class="uk-margin-right">
                    <ul class="uk-subnav pk-subnav-icon">
                        <li :class="{'uk-active': innerView == 'template-table'}">
                            <a class="pk-icon-table pk-icon-hover" :title="$trans('Table View')" data-uk-tooltip="{delay: 500}" @click.prevent="innerView = 'template-table'"></a>
                        </li>
                        <li class="{'uk-active': innerView == 'template-thumbnail'}">
                            <a class="pk-icon-thumbnails pk-icon-hover" :title="$trans('Thumbnails View')" data-uk-tooltip="{delay: 500}" @click.prevent="innerView = 'template-thumbnail'"></a>
                        </li>
                    </ul>
                </div>

                <div>
                    <button class="uk-button uk-margin-small-right" @click.prevent="createFolder()">{{ 'Add Folder' | trans }}</button>
                    <div class="uk-form-file">
                        <button class="uk-button" :class="{'uk-button-primary': !modal}">{{ 'Upload' | trans }}</button>
                        <input type="file" name="files[]" multiple="multiple">
                    </div>
                </div>
            </div>
        </div>

        <ul class="uk-breadcrumb uk-margin-large-top">
            <li v-for="(bc, key) in breadcrumbs" :class="{'uk-active': bc.current}" :key="key">
                <span v-if="bc.current">{{ bc.title }}</span>
                <a v-else @click.prevent="setPath(bc.path)">{{ bc.title }}</a>
            </li>
        </ul>

        <div class="uk-progress uk-progress-mini uk-margin-remove" v-show="upload.running">
            <div class="uk-progress-bar" :style="{width: upload.progress + '%'}"></div>
        </div>

        <div class="uk-overflow-container tm-overflow-container">
            <component :is="innerView" v-show="count"></component>
            <h3 class="uk-h1 uk-text-muted uk-text-center" v-show="!count">{{ 'No files found.' | trans }}</h3>
        </div>
    </div>
</template>

<script>
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
                UIkit.modal.prompt(this.$trans('Folder Name'), '', function (name) {
                    if (!name) return;
                    this.command('createfolder', {name: name});
                }.bind(this));
            },

            rename(oldname) {
                if (oldname.target) {
                    oldname = this.selected[0];
                }

                if (!oldname) return;

                UIkit.modal.prompt(this.$trans('Name'), oldname, function (newname) {
                    if (!newname) return;
                    this.command('rename', {oldname: oldname, newname: newname});
                }.bind(this), {title: this.$trans('Rename')});
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
                        action: this.$url.route('system/finder/upload'),

                        before: function (options) {
                            $.extend(options.params, {path: finder.innerPath, root: finder.getRoot(), _csrf: $biskuit.csrf});
                        },

                        loadstart: function () {
                            finder.$set(finder.upload, 'running', true);
                            finder.$set(finder.upload, 'progress', 0);
                        },

                        progress: function (percent) {
                            finder.$set(finder.upload, 'progress', Math.ceil(percent));
                        },

                        allcomplete: function (response) {
                            var data = $.parseJSON(response);
                            finder.load();
                            finder.$notify(data.message, data.error ? 'danger' : '');
                            finder.$set(finder.upload, 'progress', 100);

                            setTimeout(function () {
                                finder.$set(finder.upload, 'running', false);
                            }, 1500);
                        }

                    };

                UIkit.uploadSelect(this.$el.querySelector('.uk-form-file > input'), settings);
                UIkit.uploadDrop($(this.$el).parents('.uk-modal').length ? this.$el : $('html'), settings);
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
