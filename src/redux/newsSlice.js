import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchNews = createAsyncThunk('news/fetchNews', async () => {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.map(async (id) => {
      const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyResponse.json();
    })
  );
  stories.sort((a, b) => b.time - a.time);
  return stories;
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    selectedArticle: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    selectArticle: (state, action) => {
      state.selectedArticle = action.payload;
    },
    updateComments: (state, action) => {
      const { articleId, comments } = action.payload;
      const article = state.articles.find(a => a.id === articleId);
      if (article) {
        article.comments = comments;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.articles = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { selectArticle, updateComments } = newsSlice.actions;

export default newsSlice.reducer;
