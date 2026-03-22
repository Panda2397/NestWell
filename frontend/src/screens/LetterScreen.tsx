import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable, ScrollView, Modal, TextInput, useWindowDimensions } from 'react-native';
import styles from './styles/LetterScreen.styles';
import VerifiedBadge from '../components/VerifiedBadge';
import { addForumPostToDb, getForumPostsFromDb, type ForumPost } from '../databases/letters/forum.db.ts'; //this is a fake db,

type ForumCardViewProps = Pick<ForumPost, 'text' | 'username' | 'verified'>;
type ActionTooltipKey = 'report' | 'read';

function ForumCard({ text, username, verified}: ForumCardViewProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.username}>@{username}</Text>
        <VerifiedBadge human_checked={typeof verified === 'string' ? verified === 'doctor' : verified} ai_checked={verified === 'ai'} />
      </View>

      <Text style={styles.bodyText}>{text}</Text>
    </View>
  );
}

export default function letter() {
  const { width } = useWindowDimensions();
  const isNarrowScreen = width < 560;
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [randomPost, setRandomPost] = useState<ForumPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [createPostError, setCreatePostError] = useState('');
  const [showCreateHint, setShowCreateHint] = useState(false);
  const [showCreateSuccessPopup, setShowCreateSuccessPopup] = useState(false);
  const [activeActionTooltip, setActiveActionTooltip] = useState<ActionTooltipKey | null>(null);

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

  useEffect(() => {
    if (!activeActionTooltip) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setActiveActionTooltip(null);
    }, 1400);

    return () => clearTimeout(timeoutId);
  }, [activeActionTooltip]);

  function runActionWithTooltip(key: ActionTooltipKey, action: () => void) {
    setActiveActionTooltip(key);
    action();
  }

  const tooltipText =
    activeActionTooltip === 'report'
      ? 'Reported the letter. Thank you for your feedback!'
      : activeActionTooltip === 'read'
        ? 'Refreshed the letter. Here is a new one for you!'
        : null;

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
      setCreatePostError('Please fill 10 ~ 1000 characters');
      return;
    }

    setCreatePostError('');
    await addForumPostToDb({ username, mood, text });
    const updatedPosts = await getForumPostsFromDb();
    setPosts(updatedPosts);

    setNewUsername('');
    setNewPostText('');
    setIsAddModalOpen(false);
    setShowCreateSuccessPopup(true);
  }

  const canCreatePost =
    newPostText.trim().length < 1000 && newPostText.trim().length >= 1;

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

      <View
        style={[
          styles.buttonsContainer,
          isNarrowScreen ? styles.buttonsContainerNarrow : styles.buttonsContainerWide,
        ]}
      >
        <View style={[styles.addButtonGroup, isNarrowScreen ? styles.buttonGroupNarrow : styles.buttonGroupWide]}>
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

        <View style={[styles.dangerButtonGroup, isNarrowScreen ? styles.buttonGroupNarrow : styles.buttonGroupWide]}>
          <Pressable
            style={styles.dangerButton}
            accessibilityLabel="Report"
            onPress={() => {
              runActionWithTooltip('report', handleRefreshLetter);
            }} //fake report button(refresh letter)
          >
            <Text style={styles.dangerButtonText}>!</Text>
          </Pressable>
          <Text style={styles.bottomButtonLabel}>Report{"\n"}letter</Text>
        </View>

        <View style={[styles.refreshButtonGroup, isNarrowScreen ? styles.buttonGroupNarrow : styles.buttonGroupWide]}>
          <Pressable
            style={styles.refreshButton}
            accessibilityLabel="Reply to letter"
            onPress={() => {
              setCreatePostError('');
              setIsAddModalOpen(true); //fake reply button(new letter)
            }}
          >
            <Text style={styles.refreshButtonText}>↩</Text>
          </Pressable>
          <Text style={styles.bottomButtonLabel}>Reply{'\n'}letter</Text> 
        </View>

        <View style={[styles.refreshButtonGroup, isNarrowScreen ? styles.buttonGroupNarrow : styles.buttonGroupWide]}>
          <Pressable
            style={styles.refreshButton}
            accessibilityLabel="Show new letter"
            onPress={() => {
              runActionWithTooltip('read', handleRefreshLetter);
            }}
          >
            <Text style={styles.refreshButtonText}>↻</Text>
          </Pressable>
          <Text style={styles.bottomButtonLabel}>Read a new letter from a Stranger!</Text>
        </View>
      </View>

      {tooltipText && (
        <View style={styles.actionTooltipPageCenter}>
          <Text style={styles.actionTooltipText}>{tooltipText}</Text>
        </View>
      )}

      <Modal
        visible={isAddModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsAddModalOpen(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Write a letter!</Text>
              <Pressable
                style={styles.modalCloseButton}  onPress={() => setIsAddModalOpen(false)}
                accessibilityLabel="Close popup"
              >
                <Text style={styles.modalCloseButtonText}>X</Text>
              </Pressable>
            </View>
              <View style={styles.modalGuidelinesBox}>
              <Text style={styles.modalGuidelinesTitle}>Letter Guidelines</Text>
              <Text style={styles.modalGuidelinesText}>1. Be kind and respectful.</Text>
              <Text style={styles.modalGuidelinesText}>2. Do not share personal info.</Text>
              <Text style={styles.modalGuidelinesText}>3. Keep it supportive and constructive.</Text>
              <Text style={styles.modalGuidelinesText}>4. Zero tolerance for hateful or harmful language.</Text>
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
