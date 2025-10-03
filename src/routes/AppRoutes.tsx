// routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DishDetail from "../pages/DishDetail";
import AllDishes from "../pages/AllDishes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllDishes />} />
        <Route path="/dish/:id" element={<DishDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
