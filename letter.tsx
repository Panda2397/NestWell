import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable } from 'react-native';
import styles from './styles.ts/letter.styles';
import { getForumPostsFromDb, type ForumPost } from './forum.db.ts'; //this is a fake db

type ForumCardProps = Omit<ForumPost, 'id'>;

function ForumCard({ text, username, verified_psyc, mood }: ForumCardProps) {
  const [showBadgeTooltip, setShowBadgeTooltip] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.username}>@{username}</Text>
        {verified_psyc && (
          <View style={styles.verifiedBadgeWrap}>
            <Pressable
              onHoverIn={() => setShowBadgeTooltip(true)}
              onHoverOut={() => setShowBadgeTooltip(false)}
              accessibilityLabel="Verified doctor"
            >
              <Image
                source={require('./assets/verfied_badge.png')}
                style={styles.verifiedBadgeImage}
              />
            </Pressable>

            {showBadgeTooltip && (
              <View style={styles.badgeTooltip}>
                <Text style={styles.badgeTooltipText}>Verified doctor</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <Text style={styles.bodyText}>{text}</Text>
      <Text style={styles.moodText}>Mood: {mood}</Text>
    </View>
  );
}

export default function letter() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      const dbPosts = await getForumPostsFromDb();

      if (isMounted) {
        setPosts(dbPosts);
        setIsLoading(false);
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Card</Text>

      {isLoading ? (
        <Text style={styles.bodyText}>Loading posts from db...</Text>
      ) : (
        posts.map((post) => (
          <ForumCard
            key={post.id}
            text={post.text}
            username={post.username}
            verified_psyc={post.verified_psyc}
            mood={post.mood}
          />
        ))
      )}

      <StatusBar style="auto" />

    </View>
  );
}
