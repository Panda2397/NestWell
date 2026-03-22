import learnData from './learn-example-data.json';

export type LearnArticle = {
	id: string;
	title: string;
	category: string;
	url: string;
	ai_checked?: boolean;
	human_checked?: boolean;
};

type LearnDataFile = {
	articles: LearnArticle[];
};

const data = learnData as LearnDataFile;
let articlesStore: LearnArticle[] = [...data.articles];

export async function getLearnArticlesFromDb(): Promise<LearnArticle[]> {
	return Promise.resolve(articlesStore);
}

export async function getLearnArticleById(id: string): Promise<LearnArticle | undefined> {
	const found = articlesStore.find((a) => a.id === id);
	return Promise.resolve(found);
}

export async function getLearnCategoriesFromDb(): Promise<string[]> {
	const cats = Array.from(new Set(articlesStore.map((a) => a.category))).sort();
	return Promise.resolve(cats);
}
