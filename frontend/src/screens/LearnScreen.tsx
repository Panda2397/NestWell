import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View, Image } from 'react-native';
import styles from '../styles.ts';
import LearnData from '../learn/learn-example-data.json';

type LearnArticle = {
  id: string;
  title: string;
  category: string;
  url: string;
  ai_checked?: boolean;
  human_checked?: boolean;
};

const ALL_CATEGORIES = 'All Categories';

export default function LearnScreen() {
  const [articles] = useState<LearnArticle[]>(LearnData.articles || []);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORIES);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeBadgeTooltip, setActiveBadgeTooltip] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((a) => a.category))).sort();
    return [ALL_CATEGORIES, ...cats];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES) {
      return articles;
    }

    return articles.filter((article) => article.category === selectedCategory);
  }, [selectedCategory, articles]);

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
              {categories.map((category) => (
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
              <View style={styles.learnCardHeader}>
                <Text style={styles.learnCardCategory}>{article.category}</Text>
                {(article.human_checked || article.ai_checked) && (
                  <View style={styles.verifiedBadgeWrap}>
                    <Pressable
                      onPress={() => setActiveBadgeTooltip((cur) => (cur === article.id ? null : article.id))}
                      onHoverIn={() => setActiveBadgeTooltip(article.id)}
                      onHoverOut={() => setActiveBadgeTooltip(null)}
                      accessibilityLabel={article.human_checked ? 'Verified (Human)' : 'Verified (AI)'}
                    >
                      <Image
                        source={require('../../assets/verfied_badge.png')}
                        style={styles.verifiedBadgeImage}
                      />
                    </Pressable>

                    {activeBadgeTooltip === article.id && (
                      <View style={styles.badgeTooltip}>
                        <Text style={styles.badgeTooltipText}>
                          {`Doctor verified`}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <Text style={styles.learnCardTitle}>{article.title}</Text>

              <Pressable onPress={() => handleOpenArticle(article.url)}>
                <Text style={styles.learnCardLink}>Read {article.id.startsWith('a') ? 'article' : article.id.startsWith('v') ? 'video' : 'resource'}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}