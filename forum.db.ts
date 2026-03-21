import forumData from './forum-example-data.json';

export type ForumPost = {
  id: string;
  text: string;
  username: string;
  verified_psyc?: boolean;
  mood: string;
};

type ForumDataFile = {
  posts: ForumPost[];
};

const data = forumData as ForumDataFile;

export async function getForumPostsFromDb(): Promise<ForumPost[]> {
  // Mock DB call for now. Replace with real API/DB query later.
  return Promise.resolve(data.posts);
}
