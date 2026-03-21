import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable, ScrollView, Modal, TextInput } from 'react-native';
import styles from './styles.ts/letter.styles';
import { addForumPostToDb, getForumPostsFromDb, type ForumPost } from './frontend/src/letters/forum.db.ts'; //this is a fake db,

type ForumCardViewProps = Pick<ForumPost, 'text' | 'username' | 'verified' | 'mood'>;

function ForumCard({ text, username, verified, mood }: ForumCardViewProps) {
  const [showBadgeTooltip, setShowBadgeTooltip] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.username}>@{username}</Text>
        {verified && (
          <View style={styles.verifiedBadgeWrap}>
            <Pressable
              onHoverIn={() => setShowBadgeTooltip(true)}
              onHoverOut={() => setShowBadgeTooltip(false)}
              onPressIn={() => setShowBadgeTooltip(true)}
              onPressOut={() => setShowBadgeTooltip(false)}
              accessibilityLabel={`Verified ${verified}`}
            >
              <Image
                source={require('./assets/verfied_badge.png')}
                style={styles.verifiedBadgeImage}
              />
            </Pressable>

            {showBadgeTooltip && (
              <View style={styles.badgeTooltip}>
                <Text numberOfLines={1} style={styles.badgeTooltipText}>Verified {verified}</Text>
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newMood, setNewMood] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [createPostError, setCreatePostError] = useState('');
  const [showCreateHint, setShowCreateHint] = useState(false);

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

  async function handleCreatePost() {
    const username = newUsername.trim();
    const mood = newMood.trim();
    const text = newPostText.trim();

    if (!username || !mood || !text) {
      setCreatePostError('Please fill in Username, Mood, and Post before creating.');
      return;
    }

    setCreatePostError('');
    await addForumPostToDb({ username, mood, text });
    const updatedPosts = await getForumPostsFromDb();
    setPosts(updatedPosts);

    setNewUsername('');
    setNewMood('');
    setNewPostText('');
    setIsAddModalOpen(false);
  }

  const canCreatePost =
    newUsername.trim().length > 0 &&
    newMood.trim().length > 0 &&
    newPostText.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Community Letters</Text>
      </View>

      {isLoading ? (
        <Text style={styles.bodyText}>Loading posts from db...</Text>
      ) : (
        <ScrollView
          style={styles.postsScroll}
          contentContainerStyle={styles.postsContent}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
        >
          {posts.map((post) => (
            <ForumCard
              key={post.id}
              text={post.text}
              username={post.username}
              verified={post.verified}
              mood={post.mood}
            />
          ))}
        </ScrollView>
      )}

      <Pressable
        style={styles.addButton}
        accessibilityLabel="Add post"
        onPress={() => {
          setCreatePostError('');
          setIsAddModalOpen(true);
        }}
      >
        <View style={styles.addIconHorizontal} />
        <View style={styles.addIconVertical} />
      </Pressable>

      <Modal
        visible={isAddModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsAddModalOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Create post</Text>
              <Pressable
                style={styles.modalCloseButton}  onPress={() => setIsAddModalOpen(false)}
                accessibilityLabel="Close popup"
              >
                <Text style={styles.modalCloseButtonText}>X</Text>
              </Pressable>
            </View>

            <Text style={styles.modalFieldLabel}>Username</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Your name"
              placeholderTextColor="#94a3b8"
              value={newUsername}
              onChangeText={(value) => {
                setNewUsername(value);
                if (createPostError) {
                  setCreatePostError('');
                }
              }}
            />


            <Text style={styles.modalFieldLabel}>Mood</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Calm, hopeful, stressed..."
              placeholderTextColor="#94a3b8"
              value={newMood}
              onChangeText={(value) => {
                setNewMood(value);
                if (createPostError) {
                  setCreatePostError('');
                }
              }}
            />

            <Text style={styles.modalFieldLabel}>Post</Text>
            <TextInput
              style={styles.modalTextarea}
              placeholder="Share your thoughts with the community..."
              placeholderTextColor="#94a3b8"
              multiline={true}
              textAlignVertical="top"
              value={newPostText}
              onChangeText={(value) => {
                setNewPostText(value);
                if (createPostError) {
                  setCreatePostError('');
                }
              }}
            />

            {!!createPostError && <Text style={styles.modalErrorText}>{createPostError}</Text>}

            <View style={styles.modalPrimaryButtonWrap}>
              {showCreateHint && !canCreatePost && (
                <View style={styles.modalHintBubble}>
                  <Text style={styles.modalHintText}>Fill in all first</Text>
                </View>
              )}

              <Pressable
                style={[styles.modalPrimaryButton, !canCreatePost && styles.modalPrimaryButtonDisabled]}
                onPress={handleCreatePost}
                onHoverIn={() => {
                  if (!canCreatePost) {
                    setShowCreateHint(true);
                  }
                }}
                onHoverOut={() => setShowCreateHint(false)}
                onPressIn={() => {
                  if (!canCreatePost) {
                    setShowCreateHint(true);
                  }
                }}
                onPressOut={() => setShowCreateHint(false)}
                accessibilityState={{ disabled: !canCreatePost }}
              >
                <Text style={styles.modalPrimaryButtonText}>Create Post</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <StatusBar style="auto" />

    </View>
  );
}
