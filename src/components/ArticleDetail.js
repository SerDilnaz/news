import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { updateComments } from '../redux/newsSlice';
import '../index.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const article = useSelector(state => state.news.selectedArticle);
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      if (article && article.kids) {
        const comments = await Promise.all(
          article.kids.map(async (kid) => {
            const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${kid}.json`);
            return response.json();
          })
        );
        setComments(comments);
        dispatch(updateComments({ articleId: article.id, comments }));
      }
    };
    fetchComments();
  }, [article, dispatch]);

  const addComment = () => {
    if (newComment.trim() !== '') {
      const updatedComments = [...comments, { text: newComment }];
      setComments(updatedComments);
      dispatch(updateComments({ articleId: article.id, comments: updatedComments }));
      setNewComment('');
    }
  };

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const deleteComment = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
    dispatch(updateComments({ articleId: article.id, comments: updatedComments }));
  };

  const startEditComment = (index) => {
    setEditIndex(index);
    setEditText(comments[index].text);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const saveEditComment = () => {
    const updatedComments = comments.map((comment, i) =>
      i === editIndex ? { ...comment, text: editText } : comment
    );
    setComments(updatedComments);
    dispatch(updateComments({ articleId: article.id, comments: updatedComments }));
    setEditIndex(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditText('');
  };

  if (!article) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ArticleDetail">
      <h1>{article.title}</h1>
      <p>{article.text}</p>
      <p>Date: {new Date(article.time * 1000).toLocaleDateString()}</p>
      <p>Author: {article.by}</p>
      <div className="comments">
        <h3>Comments ({comments.length})</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              {editIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                  />
                  <button className="save-button" onClick={saveEditComment}>Save</button>
                  <button className="cancel-button" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  {comment.text}
                  <button onClick={() => startEditComment(index)}>Edit</button>
                  <button onClick={() => deleteComment(index)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleInputChange}
        />
        <button onClick={addComment}>Add Comment</button>
      </div>
      <Link to="/" className="back-link">Back to News List</Link>
    </div>
  );
};

export default ArticleDetail;
