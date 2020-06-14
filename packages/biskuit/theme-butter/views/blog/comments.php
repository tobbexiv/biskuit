<?php $view->script('comments', 'blog:app/bundle/comments.js', 'vue') ?>

<div id="comments" v-cloak>
    <div class="uk-margin-large-top" v-show="config.enabled || comments.length">
        <template v-if="comments.length">
            <h2 class="uk-h4">{{ 'Comments (%count%)' | trans({count:count}) }}</h2>
            <ul class="uk-comment-list">
                <comment v-for="comment in tree[0]" :comment="comment" :tree="tree" :key="comment.id"></comment>
            </ul>
        </template>
        <div class="uk-alert" v-for="message in messages">{{ message }}</div>
        <div ref="reply" v-if="config.enabled"></div>
        <p v-else>{{ 'Comments are closed.' | trans }}</p>
    </div>
</div>

<script id="comments-item" type="text/x-template">
    <li :id="'comment-'+comment.id">
        <article class="uk-comment" :class="{'uk-comment-primary': comment.special}">
            <header class="uk-comment-header uk-grid-medium uk-flex-middle" uk-grid>
                <div class="uk-width-auto">
                    <img class="uk-comment-avatar" width="80" height="80" :alt="comment.author" v-gravatar="comment.email">
                </div>
                <div class="uk-width-expand">
                    <h4 class="uk-comment-title uk-margin-remove">{{ comment.author }}
                        <a class="uk-link-muted" :href="permalink" @scrolled="setHash" uk-scroll>#</a>
                    </h4>
                    <ul class="uk-comment-meta uk-subnav uk-subnav-divider uk-margin-remove-top">
                        <li v-if="comment.status"><time :datetime="comment.created">{{ comment.created | relativeDate }}</time></li>
                        <li class="uk-comment-meta" v-else>{{ 'The comment is awaiting approval.' }}</li>
                        <li><a v-if="showReplyButton" href="#" @click.prevent="replyTo">{{ 'Reply' | trans }}</a></li>
                    </ul>
                </div>
            </header>
            <div class="uk-comment-body"></div>
                <p v-html="comment.content"></p>
            </div>
            <div class="uk-alert" v-for="message in comment.messages">{{ message }}</div>
            <div ref="reply" v-if="config.enabled"></div>
        </article>

        <ul v-if="tree[comment.id] && depth < config.max_depth">
            <comment v-for="comment in tree[comment.id]" :comment="comment" :tree="tree" :key="comment.id"></comment>
        </ul>
    </li>

</script>

<script id="comments-reply" type="text/x-template">
    <div class="uk-margin-large-top js-comment-reply">
        <h2 class="uk-h4">{{ 'Leave a comment' | trans }}</h2>

        <div class="uk-alert uk-alert-danger" v-show="error">{{ error }}</div>

        <validation-observer v-if="user.canComment" v-slot="{ handleSubmit }" slim>
            <form @submit.prevent="handleSubmit(save)">
                <p v-if="user.isAuthenticated">{{ 'Logged in as %name%' | trans({name:user.name}) }}</p>
                <template v-else>
                    <v-validated-input
                        id="form-name"
                        name="author"
                        rules="required"
                        label="Name"
                        :error-messages="{ required: 'Name cannot be blank.' }"
                        :options="{ wrapperClass: 'uk-margin', elementClass: 'uk-form-width-large' }"
                        v-model="author">
                    </v-validated-input>

                    <v-validated-input
                        id="form-email"
                        name="email"
                        type="email"
                        rules="email"
                        label="Email"
                        :error-messages="{ email: 'Email invalid.' }"
                        :options="{ wrapperClass: 'uk-margin', elementClass: 'uk-form-width-large' }"
                        v-model="email">
                    </v-validated-input>
                </template>

                <v-validated-input
                    id="form-comment"
                    name="content"
                    tag="textarea"
                    rules="required"
                    label="Comment"
                    :error-messages="{ required: 'Comment cannot be blank.' }"
                    :options="{ wrapperClass: 'uk-margin', elementClass: 'uk-form-width-large', textarea: { rows: 10 } }"
                    v-model="content">
                </v-validated-input>

                <p>
                    <button class="uk-button uk-button-primary" type="submit" accesskey="s">{{ 'Submit' | trans }}</button>
                    <button class="uk-button" accesskey="c" v-if="parent" @click.prevent="cancel">{{ 'Cancel' | trans }}</button>
                </p>
            </form>
        </validation-observer>

        <template v-else>
            <p v-if="user.isAuthenticated">{{ 'You are not allowed to post comments.' | trans }}</p>
            <p v-else><a :href="login">{{ 'Please login to leave a comment.' | trans }}</a></p>
        </template>
    </div>
</script>
