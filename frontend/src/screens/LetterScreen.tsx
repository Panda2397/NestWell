import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable, ScrollView, Modal, TextInput } from 'react-native';
import styles from '../styles.ts';
import { addForumPostToDb, getForumPostsFromDb, type ForumPost } from '../letters/forum.db.ts'; //this is a fake db,

type ForumCardViewProps = Pick<ForumPost, 'text' | 'username' | 'verified'>;

function ForumCard({ text, username, verified}: ForumCardViewProps) {
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
                source={require('../../assets/verfied_badge.png')}
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
    </View>
  );
}

export default function letter() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [randomPost, setRandomPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [createPostError, setCreatePostError] = useState('');
  const [showCreateHint, setShowCreateHint] = useState(false);
  const [showCreateSuccessPopup, setShowCreateSuccessPopup] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      const dbPosts = await getForumPostsFromDb();

      if (isMounted) {
        setPosts(dbPosts);
        setRandomPost(
          dbPosts.length > 0
            ? dbPosts[Math.floor(Math.random() * dbPosts.length)]
            : null
        );
        setIsLoading(false);
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!showCreateSuccessPopup) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowCreateSuccessPopup(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [showCreateSuccessPopup]);

  function handleRefreshLetter() {
    if (posts.length === 0) {
      setRandomPost(null);
      return;
    }

    if (posts.length === 1) {
      setRandomPost(posts[0]);
      return;
    }

    setRandomPost((currentPost) => {
      let nextPost = posts[Math.floor(Math.random() * posts.length)];

      while (currentPost && nextPost.id === currentPost.id) {
        nextPost = posts[Math.floor(Math.random() * posts.length)];
      }

      return nextPost;
    });
  }

  async function handleCreatePost() {
    const username = newUsername.trim();
    const text = newPostText.trim();
    const mood = 'Reflective';

    if (!canCreatePost) {
      setCreatePostError('Please fill 10 ~ 600 characters');
      return;
    }

    setCreatePostError('');
    await addForumPostToDb({ username, mood, text });
    const updatedPosts = await getForumPostsFromDb();
    setPosts(updatedPosts);
    setRandomPost(
      updatedPosts.length > 0
        ? updatedPosts[Math.floor(Math.random() * updatedPosts.length)]
        : null
    );

    setNewUsername('');
    setNewPostText('');
    setIsAddModalOpen(false);
    setShowCreateSuccessPopup(true);
  }

  const canCreatePost =
    newPostText.trim().length < 1000 && newPostText.trim().length >= 10;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.bodyText}>Loading posts from db...</Text>
      ) : (
        <ScrollView
          style={styles.postsScroll}
          contentContainerStyle={styles.postsContent}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
        >
          {randomPost ? (
            <ForumCard
              key={randomPost.id}
              text={randomPost.text}
              username={randomPost.username}
              verified={randomPost.verified}
            />
          ) : (
            <Text style={styles.bodyText}>No posts yet.</Text>
          )}
        </ScrollView>
      )}

      <View style={styles.addButtonGroup}>
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
        <Text style={styles.bottomButtonLabel}>Write a letter to a Stranger!</Text>
      </View>

      <View style={styles.refreshButtonGroup}>
        <Pressable
          style={styles.refreshButton}
          accessibilityLabel="Show new letter"
          onPress={handleRefreshLetter}
        >
          <Text style={styles.refreshButtonText}>↻</Text>
        </Pressable>
        <Text style={styles.bottomButtonLabel}>Read a new letter from a Stranger!</Text>
      </View>

      <View style={styles.dangerButtonGroup}>
        <Pressable
          style={styles.dangerButton}
          accessibilityLabel="Report"
          onPress={handleRefreshLetter} //fake report button
        >
          <Text style={styles.dangerButtonText}>!</Text>
        </Pressable>
        <Text style={styles.bottomButtonLabel}>Report{"\n"}letter</Text>
      </View>

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
              placeholder="Your name (Blank will be anonymous)"
              placeholderTextColor="#94a3b8"
              value={newUsername}
              onChangeText={(value) => {
                setNewUsername(value);
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
                  <Text style={styles.modalHintText}>Please fill 10 ~ 1000 characters</Text>
                </View>
              )}

              <Pressable
                style={[styles.modalPrimaryButton, !canCreatePost && styles.modalPrimaryButtonDisabled]}
                disabled={!canCreatePost}
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

      {showCreateSuccessPopup && (
        <View style={styles.createSuccessPopup}>
          <Text style={styles.createSuccessPopupText}>Letter posted successfully!</Text>
        </View>
      )}

      <StatusBar style="auto" />

    </View>
  );
}
