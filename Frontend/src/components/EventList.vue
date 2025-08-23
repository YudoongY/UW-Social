<template>
  <div class="event-list">
    <div v-if="filteredEvents.length === 0" class="loading">Loading events...</div>
    <div v-else class="events-grid">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        :currentUserId="userStore.userProfile?.uid"
        @click="$emit('open-card', event); console.log('[EventList.vue] open-card emitted with event:', event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch} from 'vue';
import Fuse from 'fuse.js';
import { useEventStore } from '../stores/event';
import EventCard from './EventCard.vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { getPhraseVec, getPhraseVecBatch } from './models/embedding_distance';
import { formatEventSchedule, type Event } from '../types/event';

const props = defineProps<{ category?: string }>();
const eventStore = useEventStore();
const userStore = useUserStore(); 
const route = useRoute();

function sortEventsByStartTimeDesc(events: any[]) {
  return events.slice().sort((a, b) => {
    const toDate = (val: any) =>
      typeof val?.toDate === 'function' ? val.toDate() : new Date(val);
    return toDate(b.startTime).getTime() - toDate(a.startTime).getTime();
  });
}

/**
 * Compute cosine similarity between two Float32Array vectors.
 * Returns a value between -1 and 1.
 */
function cosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  console.log('cosine similarity computed')

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Compute cosine similarity between two phrases using getPhraseVec.
 * Returns similarity score (1 = identical, -1 = opposite).
 */
async function phraseCosineSimilarity(
  phrase1: string,
  phrase2: string
): Promise<number> {
  // Get embeddings
  const [vec1, vec2] = await Promise.all([getPhraseVec(phrase1), getPhraseVec(phrase2)]);

  // Compute and return cosine similarity
  return cosineSimilarity(vec1, vec2);
}

// Import your phraseCosineSimilarity or getPhraseVec accordingly
// import { getPhraseVec, phraseCosineSimilarity } from './your-embedding-module';

async function makeInterestTagEventsFirstSemantic(events: any[]){
  const userTags = (userStore.userProfile?.tags ?? []).map(t => t.toLowerCase());

  if (!userTags.length) return events;

  // Precompute embeddings for user tags
  const userTagEmbeddings = await Promise.all(
    userTags.map(tag => getPhraseVec(tag))
  );

  // For each event, find max similarity to any user tag
  async function maxSimilarityToUserTags(eventTags: string[]): Promise<number> {
    if (!Array.isArray(eventTags) || eventTags.length === 0) return -1;

    // Compute embeddings of event tags
    const eventTagEmbeddings = await Promise.all(
      eventTags.map(tag => getPhraseVec(tag.toLowerCase()))
    );

    let maxSim = -Infinity;

    for (const eVec of eventTagEmbeddings) {
      for (const uVec of userTagEmbeddings) {
        const sim = cosineSimilarity(eVec, uVec);
        if (sim > maxSim) maxSim = sim;
      }
    }

    return maxSim;
  }

  // Compute similarity scores for all events in parallel
  const eventScores = await Promise.all(
    events.map(async (event) => {
      const maxSim = await maxSimilarityToUserTags(event.tags ?? []);
      return { event, score: maxSim };
    })
  );

  // Sort by descending similarity (higher means more related)
  eventScores.sort((a, b) => b.score - a.score);

  // Return sorted events
  return eventScores.map(es => es.event);
}

const eventsAfterSemantic = ref<any[]>([]);

async function refreshEvents() {
  console.log('[EventList.vue] refreshEvents called');
  let events = !props.category
    ? eventStore.events
    : eventStore.events.filter(e => e.category.toUpperCase() === props.category?.toUpperCase());

  // Only show upcoming events
  const now = new Date();
  events = events.filter(e => {
    const end = typeof e.endtime?.toDate === 'function' 
      ? e.endtime.toDate()
      : new Date(e.endtime);
    return end > now;
  });

  // Phase 1: default sorting (fast)
  events = sortEventsByStartTimeDesc(events);
  eventsAfterSemantic.value = events; // immediately display to the user
  console.log('Initial events sorted by start time:', events.length);

  const q = (route.query.q as string || '').trim();
  if (!userStore.isLoggedIn || !userStore.userProfile?.tags?.length) return;

  // Phase 2: ML ranking in background
  makeInterestTagEventsFirstSemantic(events).then((mlSortedEvents) => {
    if (!q) {
      eventsAfterSemantic.value = mlSortedEvents; // update displayed list
    } else {
      // merge Fuse.js search on top of ML ranking
      const fuse = new Fuse(mlSortedEvents, {
        keys: ['title','description','location','tags','organizerName'],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      eventsAfterSemantic.value = sortEventsByStartTimeDesc(
        fuse.search(q).map(r => r.item)
      );
    }
  });
}


watch([() => props.category, () => userStore.isLoggedIn], refreshEvents, { immediate: true });

const filteredEvents = computed(() => {
  // Just return the pre-filtered async data (sync now)
  return eventsAfterSemantic.value;
});

// onMounted(() => {
//     if (eventStore.events.length === 0) {
//         eventStore.fetchEvents();
//     } 
// });

onMounted(async () => {
  if (eventStore.events.length === 0) {
    await eventStore.fetchEvents();
  }
  refreshEvents(); // now events are loaded
});

const isVisible = ref(false); // 控制 DetailCard 的显示状态

const showDetailCard = () => {
  isVisible.value = true; // 显示 DetailCard
};

const hideDetailCard = () => {
  isVisible.value = false; // 隐藏 DetailCard
};
</script>

<style scoped>
.event-list {
    padding: 1rem;
}

.loading,
.no-events {
    text-align: center;
    padding: 2rem;
    color: #666;
    font-size: 1.1rem;
}

.events-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr); /* 固定1列 */
    gap: 2.1rem 1.5rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0;
}

@media (max-width: 576px) {
    .events-grid {
        /* grid-template-columns: repeat(2, 1fr); */
        gap: 1rem 0.5rem;
        width: 100%;
        box-sizing: border-box;
        padding: 0.2rem 0;
    }
}
</style>
