import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LifeEvent {
  id: string;
  title: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  color: string;
  emoji?: string;
}

export interface LifeSettings {
  lifespan: number; // 70, 80, 90, 100
}

export interface BucketItem {
  id: string;
  text: string;
}

export type LifeSeason =
  | 'Growing'
  | 'Hustling'
  | 'Building'
  | 'Transitioning'
  | 'Healing'
  | 'Launching'
  | 'Learning'
  | 'Loving';

export interface LifeFavorites {
  reading: string;
  obsessed: string;
  visit: string;
  comfort: string;
  watching: string;
  thought: string;
}

interface LifeState {
  // Core
  birthdate: string | null;
  name: string;
  age: string;
  vibe: string;
  zodiac: string;
  settings: LifeSettings;
  events: LifeEvent[];
  journalEntries: Record<number, string>;
  isOnboarded: boolean;
  isSharedView: boolean;

  // Season & Favorites
  season: LifeSeason | null;
  seasonSubtitle: string;
  favorites: LifeFavorites;
  tagline: string;

  // Bucket list
  bucketList: BucketItem[];

  // Onboarding step tracker
  onboardingStep: number;

  // Actions
  setBirthdate: (date: string | null) => void;
  setName: (name: string) => void;
  setAge: (age: string) => void;
  setVibe: (vibe: string) => void;
  setZodiac: (zodiac: string) => void;
  setLifespan: (lifespan: number) => void;
  setSeason: (season: LifeSeason) => void;
  setSeasonSubtitle: (subtitle: string) => void;
  setFavorites: (favorites: Partial<LifeFavorites>) => void;
  setTagline: (tagline: string) => void;
  setOnboardingStep: (step: number) => void;
  setIsOnboarded: (onboarded: boolean) => void;

  addEvent: (event: Omit<LifeEvent, 'id'>) => void;
  updateEvent: (id: string, updatedEvent: Partial<LifeEvent>) => void;
  deleteEvent: (id: string) => void;

  saveJournalEntry: (weekIndex: number, text: string) => void;
  deleteJournalEntry: (weekIndex: number) => void;

  addBucketItem: (text: string) => void;
  updateBucketItemText: (id: string, text: string) => void;
  deleteBucketItem: (id: string) => void;

  hydrateSharedState: (data: {
    birthdate: string;
    name: string;
    age?: string;
    vibe?: string;
    zodiac?: string;
    settings: { lifespan: number };
    season?: LifeSeason | null;
    seasonSubtitle?: string;
    favorites?: LifeFavorites;
    bucketList?: BucketItem[];
    tagline?: string;
    events: LifeEvent[];
  }) => void;

  resetAll: () => void;
}

const DEFAULT_BUCKET_LIST: BucketItem[] = [
  { id: 'b1', text: '' },
  { id: 'b2', text: '' },
  { id: 'b3', text: '' },
];

const DEFAULT_FAVORITES: LifeFavorites = {
  reading: '',
  obsessed: '',
  visit: '',
  comfort: '',
  watching: '',
  thought: '',
};

export const useLifeStore = create<LifeState>()(
  persist(
    (set) => ({
      // State
      birthdate: null,
      name: '',
      age: '',
      vibe: '',
      zodiac: '',
      settings: { lifespan: 90 },
      events: [],
      journalEntries: {},
      isOnboarded: false,
      isSharedView: false,
      season: null,
      seasonSubtitle: '',
      favorites: DEFAULT_FAVORITES,
      tagline: '',
      bucketList: DEFAULT_BUCKET_LIST,
      onboardingStep: 1,

      // Core actions
      setBirthdate: (date) => set({ birthdate: date }),
      setName: (name) => set({ name }),
      setAge: (age) => set({ age }),
      setVibe: (vibe) => set({ vibe }),
      setZodiac: (zodiac) => set({ zodiac }),
      setLifespan: (lifespan) =>
        set((state) => ({ settings: { ...state.settings, lifespan } })),
      setSeason: (season) => set({ season }),
      setSeasonSubtitle: (subtitle) => set({ seasonSubtitle: subtitle }),
      setFavorites: (favorites) =>
        set((state) => ({ favorites: { ...state.favorites, ...favorites } })),
      setTagline: (tagline) => set({ tagline }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setIsOnboarded: (onboarded) => set({ isOnboarded: onboarded }),

      // Event actions
      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: crypto.randomUUID
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2, 9),
            },
          ],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updatedEvent } : e
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      // Journal
      saveJournalEntry: (weekIndex, text) =>
        set((state) => {
          const entries = { ...state.journalEntries };
          if (text.trim() === '') {
            delete entries[weekIndex];
          } else {
            entries[weekIndex] = text;
          }
          return { journalEntries: entries };
        }),
      deleteJournalEntry: (weekIndex) =>
        set((state) => {
          const entries = { ...state.journalEntries };
          delete entries[weekIndex];
          return { journalEntries: entries };
        }),

      // Bucket List
      addBucketItem: (text) =>
        set((state) => ({
          bucketList: [
            ...state.bucketList,
            {
              id: Math.random().toString(36).substring(2, 9),
              text,
            },
          ],
        })),
      updateBucketItemText: (id, text) =>
        set((state) => ({
          bucketList: state.bucketList.map((item) =>
            item.id === id ? { ...item, text } : item
          ),
        })),
      deleteBucketItem: (id) =>
        set((state) => ({
          bucketList: state.bucketList.filter((item) => item.id !== id),
        })),

      // Share hydration
      hydrateSharedState: (data) =>
        set({
          birthdate: data.birthdate,
          name: data.name,
          age: data.age || '',
          vibe: data.vibe || '',
          zodiac: data.zodiac || '',
          settings: data.settings,
          season: data.season || null,
          seasonSubtitle: data.seasonSubtitle || '',
          favorites: data.favorites || DEFAULT_FAVORITES,
          bucketList: data.bucketList || DEFAULT_BUCKET_LIST,
          tagline: data.tagline || '',
          events: data.events,
          isSharedView: true,
          isOnboarded: true,
        }),

      resetAll: () =>
        set({
          birthdate: null,
          name: '',
          age: '',
          vibe: '',
          zodiac: '',
          settings: { lifespan: 90 },
          events: [],
          journalEntries: {},
          isOnboarded: false,
          isSharedView: false,
          season: null,
          seasonSubtitle: '',
          favorites: DEFAULT_FAVORITES,
          tagline: '',
          bucketList: DEFAULT_BUCKET_LIST,
          onboardingStep: 1,
        }),
    }),
    {
      name: 'chronos-life-storage',
      partialize: (state) => ({
        birthdate: state.birthdate,
        name: state.name,
        age: state.age,
        vibe: state.vibe,
        zodiac: state.zodiac,
        settings: state.settings,
        events: state.events,
        journalEntries: state.journalEntries,
        isOnboarded: state.isOnboarded,
        season: state.season,
        seasonSubtitle: state.seasonSubtitle,
        favorites: state.favorites,
        tagline: state.tagline,
        bucketList: state.bucketList,
      }),
    }
  )
);
