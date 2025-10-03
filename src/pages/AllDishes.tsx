import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { dietOptions, flavorOptions, stateOptions } from "../constant/constant";
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
  state: number;
  region: number;
  id: number;
};

function AllDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [dietFilterVal, setDietFilterVal] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [stateFilterVal, setStateFilterVal] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [flavorFilterVal, setFlavorFilterVal] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [ingredientSelection, setIngredientSelection] = useState<
    { value: string; label: string }[]
  >([]);

  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDishes() {
      try {
        setLoading(true);
        const data: Dish[] = await apiGet("/");
        setDishes(data);
        setFilteredDishes(data);

        const ingredientSet = new Set<string>();
        data.forEach((d) =>
          d.ingredients.forEach((i) => ingredientSet.add(i.trim().toLowerCase()))
        );
        setAllIngredients(Array.from(ingredientSet).sort());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDishes();
  }, []);

  useEffect(() => {
    let tempDishes = [...dishes];
    
    if (ingredientSelection.length > 0) {
      setDietFilterVal(null);
      setStateFilterVal(null);
      setFlavorFilterVal(null);
      if (searchTerm) {
        setSearchTerm("");
      }
      const selectedIngredients = ingredientSelection.map((i) =>
        i.value.toLowerCase()
      );

      tempDishes = tempDishes.filter((d) => {
        const dishIngredients = d.ingredients.map((ing) =>
          ing.trim().toLowerCase()
        );
        return selectedIngredients.every((selIng) =>
          dishIngredients.includes(selIng)
        );
      });
      // tempDishes = tempDishes.filter((d) =>
      //   d.ingredients.some((ing) => selectedIngredients.includes(ing))
      // );
    }

    if (sortConfig !== null) {
      tempDishes.sort((a: any, b: any) => {
        const aKey = a[sortConfig.key];
        const bKey = b[sortConfig.key];
        if (aKey < bKey) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aKey > bKey) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFilteredDishes(tempDishes);
    setCurrentPage(1);
  }, [ingredientSelection, sortConfig]);

  useEffect(() => {
    let tempDishes = [...dishes];
    console.log("Search Term:", searchTerm);
    if (searchTerm) {
      setDietFilterVal(null);
      setStateFilterVal(null);
      setFlavorFilterVal(null);
      if (ingredientSelection.length > 0) {
        setIngredientSelection([]);
      }
      setCurrentPage(1);
      const term = searchTerm.toLowerCase();
      tempDishes = tempDishes.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.ingredients.some((ing) => ing.toLowerCase().includes(term)) ||
          d.course.toLowerCase().includes(term)
      );
    }

    setFilteredDishes(tempDishes);
    setCurrentPage(1);
  }, [searchTerm]);

  const paginatedDishes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDishes.slice(start, start + itemsPerPage);
  }, [filteredDishes, currentPage]);

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    )
      direction = "descending";
    setSortConfig({ key, direction });
  };

  const dietFilter = (val: any) => {
    setDietFilterVal(val);
    setStateFilterVal(null);
    setFlavorFilterVal(null);
    setIngredientSelection([]);
    setSearchTerm("");
    setCurrentPage(1);
    let tempDishes = [...dishes];
    tempDishes = tempDishes.filter((d) => d.diet === val?.value);
    setFilteredDishes(tempDishes);
  };

  const stateFilter = (val: any) => {
    setStateFilterVal(val);
    setDietFilterVal(null);
    setFlavorFilterVal(null);
    setIngredientSelection([]);
    setSearchTerm("");
    setCurrentPage(1);
    let tempDishes = [...dishes];
    tempDishes = tempDishes.filter((d) => d.state === val?.value);
    setFilteredDishes(tempDishes);
  };

  const flavorFilter = (val: any) => {
    setFlavorFilterVal(val);
    setDietFilterVal(null);
    setStateFilterVal(null);
    setIngredientSelection([]);
    setSearchTerm("");
    setCurrentPage(1);
    let tempDishes = [...dishes];
    tempDishes = tempDishes.filter((d) => d.flavor_profile === val?.value);
    setFilteredDishes(tempDishes);
  };

  if (loading) return <div className="dish-detail-loading">Loading...</div>;
  if (error) return <div className="dish-detail-error">{error}</div>;

  return (
    <div className="all-dishes-container">
      <h1>All Dishes</h1>

      <input
        type="text"
        placeholder="Search by name, ingredients, or origin..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="filters">
        <Select
          options={dietOptions}
          value={dietFilterVal}
          onChange={(selected) => dietFilter(selected as any)}
          placeholder="Filter by Diet"
        />
        <Select
          options={flavorOptions}
          value={flavorFilterVal}
          onChange={(selected) => flavorFilter(selected as any)}
          placeholder="Filter by Flavor"
        />
        <Select
          options={stateOptions}
          value={stateFilterVal}
          onChange={(selected) => stateFilter(selected as any)}
          placeholder="Filter by State"
        />
      </div>

      <div className="ingredient-selection">
        <h3>Select Ingredients:</h3>
        <Select
          options={allIngredients.map((i) => ({ value: i, label: i }))}
          value={ingredientSelection}
          onChange={(selected) => setIngredientSelection(selected as any)}
          isMulti
          placeholder="Select Ingredients"
        />
      </div>

      <table className="dishes-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Dish Name</th>
            <th>Diet</th>
            <th>Flavor</th>
            <th>Course</th>
            <th onClick={() => handleSort("prep_time")}>Prep Time</th>
            <th onClick={() => handleSort("cook_time")}>Cook Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDishes.map((d) => (
            <tr key={d.id}>
              <td
                className="dish-name-link"
                onClick={() => navigate(`/dish/${d.id}`)}
              >
                {d.name}
              </td>
              <td>{d.diet == "-1" ? "Not Available" : d.diet}</td>
              <td>{d.flavor_profile == "-1" ? "Not Available" : d.flavor_profile}</td>
              <td>{d.course == "-1" ? "Not Available" : d.course}</td>
              <td>{d.prep_time == -1 ? "Not Available" : d.prep_time + " mins"}</td>
              <td>{d.cook_time == -1 ? "Not Available" : d.cook_time + " mins"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AllDishes;
