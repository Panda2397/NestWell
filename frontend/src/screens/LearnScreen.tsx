import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import styles from '../styles.ts';

type LearnArticle = {
  id: string;
  title: string;
  category: 'Stress' | 'Sleep' | 'Anxiety' | 'Mindfulness';
  url: string;
};

const ARTICLES: LearnArticle[] = [
  {
    id: 'a2',
    title: 'Practical Sleep Hygiene Checklist',
    category: 'Sleep',
    url: 'https://www.sleepfoundation.org/sleep-hygiene',
},
  {
    id: 'a3',
    title: 'Grounding Techniques for Stressful Days',
    category: 'Stress',
    url: 'https://www.healthline.com/health/grounding-techniques',
  },
  {
    id: 'a4',
    title: 'Beginner Mindfulness Guide',
    category: 'Mindfulness',
    url: 'https://www.mindful.org/meditation/mindfulness-getting-started/',
  },
  {
    id: 'a5',
    title: 'Breathing Exercises to Reset Your Mood',
    category: 'Stress',
    url: 'https://www.verywellmind.com/abdominal-breathing-2584115',
  },
];

const ALL_CATEGORIES = 'All Categories';
const CATEGORIES = [ALL_CATEGORIES, 'Stress', 'Sleep', 'Anxiety', 'Mindfulness'] as const;

export default function LearnScreen() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>(ALL_CATEGORIES);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES) {
      return ARTICLES;
    }

    return ARTICLES.filter((article) => article.category === selectedCategory);
  }, [selectedCategory]);

  async function handleOpenArticle(url: string) {
    await Linking.openURL(url);
  }

  return (
    <View style={styles.learnContainer}>
      <View style={styles.learnTopBar}>
        <View style={styles.learnCategoryWrap}>
          <Pressable
            style={styles.learnCategoryButton}
            onPress={() => setIsCategoryOpen((current) => !current)}
            accessibilityLabel="Toggle article categories"
          >
            <Text style={styles.learnCategoryButtonText}>{selectedCategory}</Text>
            <Text style={styles.learnCategoryChevron}>{isCategoryOpen ? '▲' : '▼'}</Text>
          </Pressable>

          {isCategoryOpen && (
            <View style={styles.learnCategoryDropdown}>
              {CATEGORIES.map((category) => (
                <Pressable
                  key={category}
                  style={styles.learnCategoryItem}
                  onPress={() => {
                    setSelectedCategory(category);
                    setIsCategoryOpen(false);
                  }}
                >
                  <Text style={styles.learnCategoryItemText}>{category}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View style={styles.learnTopSpacer} />
      </View>

      <ScrollView
        style={styles.learnScroll}
        contentContainerStyle={styles.learnGrid}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.learnCardsContainer}>
          {filteredArticles.map((article) => (
            <View key={article.id} style={styles.learnCard}>
              <Text style={styles.learnCardCategory}>{article.category}</Text>
              <Text style={styles.learnCardTitle}>{article.title}</Text>
              <Pressable onPress={() => handleOpenArticle(article.url)}>
                <Text style={styles.learnCardLink}>Read article</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}