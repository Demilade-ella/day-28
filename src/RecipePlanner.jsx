import React, { useState, useEffect, useCallback } from 'react';
import { Search, Clock, Utensils, Calendar, Trash2, Users, Loader } from 'lucide-react';
import './RecipePlanner.css'; // Importing your CSS file

const RecipePlanner = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('Healthy'); // Default search
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(Array(7).fill(null));
  const [diet, setDiet] = useState('');
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

  const fetchRecipes = useCallback(async (query, selectedDiet = diet) => {
    if (!query && !selectedDiet) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=9&addRecipeInformation=true&apiKey=${API_KEY}`
      );
      const data = await response.json();
      // Spoonacular returns an array inside 'results'
      setRecipes(data.results || []); 
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [diet, API_KEY]);

  useEffect(() => {
    fetchRecipes(searchQuery);
  }, [fetchRecipes, searchQuery]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchRecipes(searchQuery);
    }
  };

  const onDietChange = (e) => {
    const newDiet = e.target.value;
    setDiet(newDiet);
    fetchRecipes(searchQuery, newDiet); // Trigger search immediately on change
  };

  useEffect(() => {
    const savedPlan = localStorage.getItem('relic-meal-plan');
    if (savedPlan) {
      setMealPlan(JSON.parse(savedPlan));
    }
  }, []);

  // 2. Save data whenever mealPlan updates
  useEffect(() => {
    localStorage.setItem('relic-meal-plan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const addToPlan = (recipe, idx) => {
    const newPlan = [...mealPlan];
    newPlan[idx] = recipe;
    setMealPlan(newPlan);
  };

  const removeFromPlan = (idx) => {
    const newPlan = [...mealPlan];
    newPlan[idx] = null;
    setMealPlan(newPlan);
  };

  const totalCalories = mealPlan.reduce((sum, meal) => {
    return sum + (meal ? meal.calories : 0);
  }, 0);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Utensils color="#ff6b35" />
          <h2 style={{ margin: 0 }}>MealMaster</h2>
        </div>
        <div className="search-bar">
          <Search size={18} color="#636e72" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
          <select className="diet-select" value={diet} onChange={onDietChange}>
            <option value="">All Diets</option>
            <option value="gluten free">Gluten Free</option>
            <option value="ketogenic">Keto</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="paleo">Paleo</option>
          </select>
          <button onClick={() => fetchRecipes(searchQuery)} className="search-submit-btn">
            Go
          </button>
        </div>
      </nav>

      <main className="main-content">
        <section className="recipe-section">
          <h3>Discovery</h3>
          {loading ? (
            <div className="loader-container">
              <Loader className="animate-spin" size={32} />
              <p style={{ marginLeft: '10px' }}>Fetching fresh recipes...</p>
            </div>
          ) : (
            <div className="recipe-grid">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <div key={recipe.id} className="recipe-card">
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                    <div className="recipe-info">
                      <h4>{recipe.title}</h4>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '10px', color: 'var(--text-muted)', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> 25m
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Users size={14} /> 2 Servings
                        </span>
                      </div>
                      <div className="day-picker">
                        {days.map((day, idx) => (
                          <button key={idx} className="day-btn" onClick={() => addToPlan(recipe, idx)}>
                            {day[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="loader-container">No recipes found. Try another search!</p>
              )}
            </div>
          )}
        </section>

        <aside className="planner-sidebar">
          <h3><Calendar size={20} /> My Week</h3>
          <div className="plan-list">
            {days.map((day, idx) => (
              <div key={day} className="plan-item">
                <span className="plan-day-label">{day}</span>
                {mealPlan[idx] ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px' }}>{mealPlan[idx].title}</span>
                    <Trash2 size={14} color="#ff7675" cursor="pointer" onClick={() => removeFromPlan(idx)} />
                  </div>
                ) : (
                  <span style={{ color: '#ccc', fontSize: '12px' }}>Empty</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '25px', 
            paddingTop: '20px', 
            borderTop: '2px solid var(--bg-body)' 
          }}>
            <div style={{ display: 'flex', justifyBetween: 'center', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 'bold' }}>WEEKLY_INTAKE</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--primary)', marginLeft: 'auto' }}>
                {totalCalories} kcal
              </span>
            </div>
            
            {/* Visual Progress Bar */}
            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: '#eee', 
              borderRadius: '10px', 
              overflow: 'hidden' 
            }}>
              <div style={{ 
                width: `${Math.min((totalCalories / 14000) * 100, 100)}%`, 
                height: '100%', 
                background: 'var(--primary)',
                transition: 'width 0.4s ease-out'
              }}></div>
            </div>
            <p style={{ fontSize: '10px', color: '#ccc', marginTop: '5px' }}>Target: 14,000 kcal / week</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default RecipePlanner;