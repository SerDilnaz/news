import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews, selectArticle } from '../redux/newsSlice';
import { Link } from 'react-router-dom';
import '../index.css';

const NewsList = () => {
  const dispatch = useDispatch();
  const articles = useSelector(state => state.news.articles);
  const newsStatus = useSelector(state => state.news.status);
  const error = useSelector(state => state.news.error);

  useEffect(() => {
    if (newsStatus === 'idle') {
      dispatch(fetchNews());
    }
  }, [newsStatus, dispatch]);

  let content;
  if (newsStatus === 'loading') {
    content = <div className="loader"><p >Loading...</p></div>;
  } else if (newsStatus === 'succeeded') {
    content = (
      <ul className="NewsList">
        {articles.map(article => (
          <li key={article.id}>
            <Link to={`/article/${article.id}`} onClick={() => dispatch(selectArticle(article))}>
              <h2>{article.title}</h2>
              <p>{article.text}</p>
              <p>{article.by}</p>
              <p>{new Date(article.time * 1000).toLocaleDateString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  } else if (newsStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <div>
      <div className="newslist"><h1>News</h1>
      <div className="refresh">  <button  onClick={() => dispatch(fetchNews())}>Refresh</button></div>
      </div>
      {content}
    </div>
  );
};

export default NewsList;
