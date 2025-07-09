import { useEffect, useState } from "react";
import Loader from "./Loader";
import axios from "axios";

const AdminDashboard = () => {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingBookId, setRejectingBookId] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");

  const fetchPendingBooks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/pending`, {
        withCredentials: true,
      });
      setPendingBooks(res.data);
    } catch (error) {
      console.error("Failed to fetch pending books", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookId) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/approve`, {bookId}, { withCredentials: true });
      setPendingBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error("Approve failed", error);
    }
  };

  const handleReject = async (bookId) => {
    if (!rejectionMessage.trim()) return alert("Please enter a rejection message.");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/reject`,
        { bookId, message: rejectionMessage },
        { withCredentials: true }
      );
      setPendingBooks((prev) => prev.filter((book) => book._id !== bookId));
      setRejectingBookId(null);
      setRejectionMessage("");
    } catch (error) {
      console.error("Reject failed", error);
    }
  };

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Pending Book Submissions</h1>
      {pendingBooks.length === 0 ? (
        <p>No books pending approval.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingBooks.map((book) => (
            <div key={book._id} className="border rounded-lg shadow p-4 bg-white">
              <img src={book.bookImage} alt={book.bookname} className="w-full h-60 object-cover rounded mb-4" />
              <h2 className="text-xl font-semibold">{book.bookname}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Category:</strong> {book.category}</p>
              <p><strong>Description:</strong> {book.description}</p>
              <p><strong>Price:</strong> ₹{book.price}</p>
              <p><strong>Submitted by:</strong> {book.seller?.name || book.seller}</p>

              {rejectingBookId === book._id ? (
                <div className="mt-4">
                  <textarea
                    placeholder="Enter rejection reason..."
                    className="w-full p-2 border rounded mb-2"
                    value={rejectionMessage}
                    onChange={(e) => setRejectionMessage(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded"
                      onClick={() => handleReject(book._id)}
                    >
                      Confirm Reject
                    </button>
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setRejectingBookId(null);
                        setRejectionMessage("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleApprove(book._id)}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => setRejectingBookId(book._id)}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
