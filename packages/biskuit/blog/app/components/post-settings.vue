<template>

    <div class="uk-grid pk-grid-large pk-width-sidebar-large uk-form-stacked" data-uk-grid-margin>
        <div class="pk-width-content">
            <v-validated-input
                id="form-title"
                name="title"
                rules="required"
                placeholder="Enter Title"
                :error-messages="{ required: 'Title cannot be blank.' }"
                :options="{ innerWrapperClass: '', elementClass: 'uk-width-1-1 uk-form-large' }"
                v-model="post.title">
            </v-validated-input>
            <div class="uk-margin">
                <v-editor id="post-content" v-model="post.content" :options="{ markdown : post.data.markdown }"></v-editor>
            </div>
            <div class="uk-margin">
                <label for="form-post-excerpt" class="uk-form-label">{{ 'Excerpt' | trans }}</label>
                <div class="uk-form-controls">
                    <v-editor id="post-excerpt" v-model="post.excerpt" :options="{ markdown : post.data.markdown, height: 250 }"></v-editor>
                </div>
            </div>
        </div>
        <div class="pk-width-sidebar">
            <div class="uk-panel">
                <div class="uk-margin">
                    <label for="form-image" class="uk-form-label">{{ 'Image' | trans }}</label>
                    <div class="uk-form-controls">
                        <input-image-meta v-model="post.data.image" cls="pk-image-max-height"></input-image-meta>
                    </div>
                </div>
                <div class="uk-margin">
                    <label for="form-slug" class="uk-form-label">{{ 'Slug' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-slug" class="uk-width-1-1" type="text" v-model="post.slug">
                    </div>
                </div>
                <div class="uk-margin">
                    <label for="form-status" class="uk-form-label">{{ 'Status' | trans }}</label>
                    <div class="uk-form-controls">
                        <select id="form-status" class="uk-width-1-1" v-model="post.status">
                            <option v-for="(status, id) in data.statuses" :value="id" :key="id">{{status}}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin" v-if="data.canEditAll">
                    <label for="form-author" class="uk-form-label">{{ 'Author' | trans }}</label>
                    <div class="uk-form-controls">
                        <select id="form-author" class="uk-width-1-1" v-model="post.user_id">
                            <option v-for="author in data.authors" :value="author.id" :key="author.id">{{author.username}}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <span class="uk-form-label">{{ 'Publish on' | trans }}</span>
                    <div class="uk-form-controls">
                        <input-date v-model="post.date"></input-date>
                    </div>
                </div>
                <div class="uk-margin">
                    <span class="uk-form-label">{{ 'Restrict Access' | trans }}</span>
                    <div class="uk-form-controls uk-form-controls-text">
                        <p v-for="role in data.roles" class="uk-form-controls-condensed" :key="role.id">
                            <label><input type="checkbox" :value="role.id" v-model.number="post.roles"> {{ role.name }}</label>
                        </p>
                    </div>
                </div>
                <div class="uk-margin">
                    <span class="uk-form-label">{{ 'Options' | trans }}</span>
                    <div class="uk-form-controls">
                        <label><input type="checkbox" v-model="post.data.markdown" value="1"> {{ 'Enable Markdown' | trans }}</label>
                    </div>
                    <div class="uk-form-controls">
                        <label><input type="checkbox" v-model="post.comment_status" value="1"> {{ 'Enable Comments' | trans }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['data', 'value'],

        section: {
            label: 'Post'
        },

        data() {
            return {
                post: this.value
            };
        },

        watch: {
            value(newPost) {
                this.post = newPost;
            },
            post: {
                handler(newPost) {
                    this.$emit('input', newPost);
                },
                deep: true
            }
        }
    };
</script>
