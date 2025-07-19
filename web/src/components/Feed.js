import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApiBase } from '../api/useApiBase';
import { useNavigate } from 'react-router-dom';
import { useInfiniteScrollFeed } from '../hooks/useInfiniteScrollFeed';

const Feed = () => {
  const { token, logout } = useAuth();
  const baseUrl = useApiBase();
  const navigate = useNavigate();

  const { feed, loading, error, lastPostRef } = useInfiniteScrollFeed({ baseUrl, token });

  const [deletingPostId, setDeletingPostId] = useState(null);

  const [localDeletedIds, setLocalDeletedIds] = useState([]);

  const posts = feed.filter(p => !localDeletedIds.includes(p._id));

  const handleDelete = async (postId) => {
    setDeletingPostId(postId);
    try {
      const res = await fetch(`${baseUrl}/feed/${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        alert('You do not have permission to delete this post.');
        return;
      }

      if (res.ok) {
        setLocalDeletedIds((prev) => [...prev, postId]);
      } else {
        const msg = await res.text();
        console.error('Delete failed:', msg);
        alert('Failed to delete post.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('An error occurred while deleting.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feed</h1>
        <button
          onClick={handleSignOut}
          className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
        >
          Sign Out
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {!loading && posts.length === 0 && <p className="text-gray-400">No posts found</p>}

      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <div
            key={post._id}
            ref={isLast ? lastPostRef : null}
            className="flex justify-between bg-white shadow-sm border border-gray-200 rounded-xl p-6 mb-6"
          >
            <div className="w-full pr-4">
              <div className="text-blue-700 font-semibold mb-2">
                {post.authorName}
              </div>
              <div className="text-gray-800 mb-3">{post.content}</div>
              <div className="text-xs text-gray-500">
                {new Date(post.created).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => handleDelete(post._id)}
              disabled={deletingPostId === post._id}
              className={`text-sm font-semibold ${
                deletingPostId === post._id
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-500 hover:text-red-700'
              }`}
            >
              {deletingPostId === post._id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        );
      })}

      {loading && <p className="text-gray-500">Loading more...</p>}
    </div>
  );
};

export default Feed;
