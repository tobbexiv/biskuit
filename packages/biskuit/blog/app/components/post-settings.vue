<template>
   <div uk-grid>
        <div class="uk-width-expand@m">
            <v-validated-input
                id="form-title"
                name="title"
                rules="required"
                placeholder="Enter Title"
                :error-messages="{ required: 'Title cannot be blank.' }"
                :options="{ innerWrapperClass: '', elementClass: 'uk-width-1-1 uk-form-large uk-input' }"
                v-model="post.title">
            </v-validated-input>
            <div class="uk-margin">
                <!--<textarea id="post-content" v-model="post.content" :options="{ markdown : post.data.markdown }"></textarea>-->
              <textarea id="post-content" v-model="post.content" ref="markdownEditor"></textarea>
            </div>
            <div class="uk-margin">
                <label for="form-post-excerpt" class="uk-form-label">{{ 'Excerpt' | trans }}</label>
                <div class="uk-form-controls">
                    <textarea class="uk-textarea" id="post-excerpt" v-model="post.excerpt" :options="{ markdown : post.data.markdown, height: 250 }"></textarea>
                </div>
            </div>
        </div>
        <div class="uk-width-auto@m">
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
                        <input d="form-slug" class="uk-width-1-1 uk-input" type="text" v-model="post.slug">
                    </div>
                </div>
                <div class="uk-margin">
                    <label for="form-status" class="uk-form-label">{{ 'Status' | trans }}</label>
                    <div class="uk-form-controls">
                        <select id="form-status" class="uk-width-1-1 uk-select" v-model="post.status">
                            <option v-for="(status, id) in data.statuses" :value="id" :key="id">{{status}}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin" v-if="data.canEditAll">
                    <label for="form-author" class="uk-form-label">{{ 'Author' | trans }}</label>
                    <div class="uk-form-controls">
                        <select id="form-author" class="uk-select uk-width-1-1" v-model="post.user_id">
                            <option v-for="author in data.authors" :value="author.id" :key="author.id">{{author.username}}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <span class="uk-form-label">{{ 'Publish on' | trans }}</span>
                    <div class="uk-form-controls">
                        <!-- TODO: this input do not parse current value -->
                        <input class="uk-input" type="date" v-model="post.date">
                    </div>
                </div>
                <div class="uk-margin">
                    <span class="uk-form-label">{{ 'Restrict Access' | trans }}</span>
                    <div class="uk-form-controls">
                        <div v-for="role in data.roles" :key="role.id">
                            <label><input class="uk-checkbox" type="checkbox" :value="role.id" v-model.number="post.roles"> {{ role.name }}</label>
                        </div>
                    </div>
                </div>
                <div class="uk-margin">
                    <span class="uk-form-label">{{ 'Options' | trans }}</span>
                    <!--
                    <div class="uk-form-controls">
                        <label><input class="uk-checkbox" type="checkbox" v-model="post.data.markdown" value="1"> {{ 'Enable Markdown' | trans }}</label>
                    </div>
                    -->
                    <div class="uk-form-controls">
                        <label><input class="uk-checkbox" type="checkbox" v-model="post.comment_status" value="1"> {{ 'Enable Comments' | trans }}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EasyMDE from "easymde";

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
        },

        mounted() {
          var easyMDE = new EasyMDE({
            element: document.getElementById('post-content'),
            spellChecker: false,
            autosave: {
              enabled: true,
              uniqueId: "biskuit-editor",
              delay: 1000 * 5,
              submit_delay: 5000,
              timeFormat: {
                locale: 'en-US',
                format: {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                },
              },
              text: "Autosaved: "
            }
          });

          easyMDE.codemirror.on('change', (instance, changeObj) => {
            if (changeObj.origin === 'setValue') {
              return;
            }
            this.post.content = easyMDE.value();
          });
        }
    };
</script>
