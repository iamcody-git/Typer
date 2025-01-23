import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export const saveResultsToDB = async (db, user, results) => {
  try {
    await addDoc(collection(db, "Results"), {
      uid: user.uid,
      ...results,
      date: new Date(),
    });
    toast.success("Results saved successfully!");
  } catch (error) {
    console.error("Error saving results:", error);
    toast.error("Failed to save results. Try again.");
  }
};
