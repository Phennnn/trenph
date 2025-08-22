import Navbar from "./components/Navbar";
import PredictForm from "./components/PredictForm";

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <PredictForm />
    </div>
  );
}
