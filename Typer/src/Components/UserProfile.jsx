import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 
    const auth = getAuth(); 

    const fetchUserResults = async (uid) => {
      try {
        // Query Firestore for the user's results
        const resultsRef = collection(db, "Results");
        const userResultsQuery = query(resultsRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(userResultsQuery);

        if (isMounted) {
          const userResults = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              date: data.date.toDate(), 
            };
          });

          setResults(userResults);
        }
      } catch (err) {
        console.error("Error fetching results:", err);
        toast.error("Failed to fetch user results. Please try again later.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && isMounted) {
        setUser({
          email: currentUser.email,
          creationTime: currentUser.metadata.creationTime,
        });
        fetchUserResults(currentUser.uid);
      } else {
        setUser(null); 
      }
    });

    return () => {
      isMounted = false; 
      unsubscribe();
    };
  }, []);

  return (
    <div className="p-4">
      <div className="bg-gray-100 p-4 rounded shadow-md mb-6">
        {user ? (
          <>
            <h1 className="text-xl font-semibold text-green-600">
              Welcome, {user.email}!
            </h1>
            <p className="text-gray-700">
              Account Created On: {new Date(user.creationTime).toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-red-500">User not logged in. Please log in.</p>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow-md text-black">
        <h2 className="text-lg font-bold mb-4">Your Typing Game Results</h2>
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Language</th>
                <th className="border border-gray-300 p-2">Correct Words</th>
                <th className="border border-gray-300 p-2">Incorrect Words</th>
                <th className="border border-gray-300 p-2">Total Words</th>
                <th className="border border-gray-300 p-2">Accuracy</th>
                <th className="border border-gray-300 p-2">Time (s)</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="text-center">
                  <td className="border border-gray-300 p-2">{result.language}</td>
                  <td className="border border-gray-300 p-2">{result.correctWords}</td>
                  <td className="border border-gray-300 p-2">{result.incorrectWords}</td>
                  <td className="border border-gray-300 p-2">{result.totalWords}</td>
                  <td className="border border-gray-300 p-2">{result.accuracy}%</td>
                  <td className="border border-gray-300 p-2">{result.time}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(result.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
