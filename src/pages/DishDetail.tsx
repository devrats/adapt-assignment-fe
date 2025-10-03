import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../common.css";
import { apiGet } from "../api/httpClient";

type Dish = {
  name: string;
  ingredients: string[];
  diet: string;
  prep_time: number;
  cook_time: number;
  flavor_profile: string;
  course: string;
  state: string | number;
  region: string | number;
  id: number;
};

function DishDetail() {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDish() {
      try {
        setLoading(true);
        const response = await apiGet(`/${id}`);
        const data: Dish = response;
        setDish(data);
      } catch (err: any) {
        console.error("Error fetching dish:", err);
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDish();
  }, [id]);

  if (loading) return <div className="dish-detail-loading">Loading...</div>;
  if (error) return <div className="dish-detail-error">{error}</div>;
  if (!dish) return <div className="dish-detail-error">Dish not found</div>;

  return (
    <div className="dish-container">
      <div className="dish-content">
        <h1 className="dish-name">{dish.name}</h1>

        <div className="dish-info">
          <span className="dish-course">Course: {dish.course == "-1" ? "Not Available" : dish.course}</span>
          <span
            className={`flavor-badge flavor-${dish.flavor_profile.toLowerCase()}`}
          >
            {dish.flavor_profile == "-1" ? "Not Available" : dish.flavor_profile}
          </span>
          <span className="dish-diet">Diet: {dish.diet == "-1" ? "Not Available" : dish.diet}</span>
        </div>

        <div className="dish-time">
          Prep: {dish.prep_time == -1 ? "Not Available" : dish.prep_time + " min"} | Cook: {dish.cook_time == -1 ? "Not Available" : dish.cook_time + " min"}
        </div>

        <div className="dish-location">
          State: {dish.state == "-1" ? "Not Available" : dish.state} | Region: {dish.region == "-1" ? "Not Available" : dish.region}
        </div>

        <div className="dish-ingredients">
          <h3>Ingredients</h3>
          <ul>
            {dish.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
