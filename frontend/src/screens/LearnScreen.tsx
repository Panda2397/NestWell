import { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View, Image } from 'react-native';
import styles from '../styles.ts';
import LearnData from '../learn/learn-example-data.json';
import { UserType } from '../types/user.ts';
import { useProfile } from '../context/ProfileContext.tsx';

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

  const { profile } = useProfile();

  

  const categoryToUserTypeMap: Record<string, UserType[]> = {
    Stress: ["anxiety", "highRisk"],
    Mindfulness: ["anxiety", "lowMood"],
    Sleep: ["lowMood", "anxiety"],
    Support: ["isolation", "highRisk"],
    Connection: ["isolation"],
    Parenting: ["stable", "lowMood"],
  };

  const recommendedArticles = useMemo(() => {
    if (!profile?.primaryType) return [];

    return articles.filter((article) =>
      categoryToUserTypeMap[article.category]?.includes(profile.primaryType)
    );
  }, [articles, profile]);

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

          {recommendedArticles.length > 0 && (
            <View style={styles.learnRecommendedSection}>
              <Text style={styles.learnSectionTitle}>Recommended for you</Text>

              {recommendedArticles.slice(0, 3).map((article) => (
                <View key={`rec-${article.id}`} style={styles.learnCard}>
                  
                  <Text style={styles.learnCardCategory}>{article.category}</Text>
                  <Text style={styles.learnCardTitle} numberOfLines={2}>
                    {article.title}
                  </Text>

                  <Pressable onPress={() => handleOpenArticle(article.url)}>
                    <Text style={styles.learnCardLink}>
                      Read {article.id.startsWith('a') ? 'article' : article.id.startsWith('v') ? 'video' : 'resource'}
                    </Text>
                  </Pressable>

                  {(article.human_checked || article.ai_checked) && (
                    <View style={styles.learnVerifiedBadge}>
                      <Text style={styles.learnVerifiedText}>
                        {article.human_checked ? 'Verified by Human' : 'Verified by AI'}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          <Text style={styles.learnSectionTitle}>All resources</Text>
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
                        <Text style={styles.badgeTooltipText}>Doctor verified</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              <Text style={styles.learnCardTitle}>{article.title}</Text>

              <Pressable onPress={() => handleOpenArticle(article.url)}>
                <Text style={styles.learnCardLink}>
                  Read {article.id.startsWith('a') ? 'article' : article.id.startsWith('v') ? 'video' : 'resource'}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}