import forumData from './forum-example-data.json';
import userVerifyData from './user-verify-example-data.json';

export type ForumPost = {
  id: string;
  userId: string;
  text: string;
  username: string;
  verified?: boolean | string;
  mood: string;
};

type UserVerifyRecord = {
  userId: string;
  username: string;
  verified: boolean | string;
};

type ForumDataFile = {
  posts: ForumPost[];
};

type UserVerifyDataFile = {
  users: UserVerifyRecord[];
};

export type NewForumPostInput = {
  username: string;
  mood: string;
  text: string;
};

const data = forumData as ForumDataFile;
const userVerify = userVerifyData as UserVerifyDataFile;
let postsStore: ForumPost[] = [...data.posts];
let userVerifyStore: UserVerifyRecord[] = [...userVerify.users];

function getNextId(posts: ForumPost[]): string {
  const maxId = posts.reduce((max, post) => {
    const parsed = Number.parseInt(post.id, 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);

  return String(maxId + 1);
}

function getNextUserId(users: UserVerifyRecord[]): string {
  const maxUserNumber = users.reduce((max, user) => {
    const match = user.userId.match(/^u_(\d{4})$/);
    if (!match) {
      return max;
    }

    const parsed = Number.parseInt(match[1], 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);

  return `u_${String(maxUserNumber + 1).padStart(4, '0')}`;
}

export async function getForumPostsFromDb(): Promise<ForumPost[]> {
  // Mock DB call for now. Replace with real API/DB query later.
  const verifiedByUserId = new Map(
    userVerifyStore.map((user) => [user.userId, user.verified]),
  );

  const hydratedPosts = postsStore.map((post) => ({
    ...post,
    verified: verifiedByUserId.get(post.userId) ?? post.verified ?? false,
  }));

  return Promise.resolve(hydratedPosts);
}

export async function addForumPostToDb(input: NewForumPostInput): Promise<ForumPost> {
  const normalizedUsername = input.username.trim();
  const existingUser = userVerifyStore.find(
    (user) => user.username.toLowerCase() === normalizedUsername.toLowerCase(),
  );

  const userRecord: UserVerifyRecord = existingUser ?? {
    userId: getNextUserId(userVerifyStore),
    username: normalizedUsername,
    verified: false,
  };

  if (!existingUser) {
    userVerifyStore = [...userVerifyStore, userRecord];
  }

  const nextPost: ForumPost = {
    id: getNextId(postsStore),
    userId: userRecord.userId,
    username: normalizedUsername,
    mood: input.mood.trim(),
    text: input.text.trim(),
    verified: userRecord.verified,
  };

  postsStore = [nextPost, ...postsStore];
  return Promise.resolve(nextPost);
}
