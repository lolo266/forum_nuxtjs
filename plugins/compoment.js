import Vue from 'vue';

import Ads from '~/components/box/ads';
import TopicTitle from '~/components/forum/topic_title';
import TopicMain from '~/components/forum/topic';
import PostMain from '~/components/forum/post';
import Editor from '~/components/box/editor';

//Vue.component('Ads', () => import('~/components/box/ads'));
//Vue.component('Topic-Title', () => import('~/components/forum/topic_title'));
//Vue.component('Topic-Main', () => import('~/components/forum/topic'));
//Vue.component('Post-Main', () => import('~/components/forum/post'));

Vue.component('Ads', Ads);

Vue.component('Topic-Title', TopicTitle);
Vue.component('Topic-Main', TopicMain);
Vue.component('Post-Main', PostMain);

Vue.component('Editor', Editor);