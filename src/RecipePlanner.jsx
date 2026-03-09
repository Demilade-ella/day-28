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

  // const API_KEY = process.env.REACT_APP_FOOD_API_KEY;

  const fetchRecipes = useCallback(async (query='', selectedDiet = '') => {
    // if (!query && !selectedDiet) return;
    setLoading(true);
    // try {
    //   const response = await fetch(
    //     `https://api.spoonacular.com/recipes/complexSearch?query=${query}&diet=${selectedDiet}&number=9&addRecipeInformation=true&apiKey=${API_KEY}`
    //   );
    //   const data = await response.json();
    //   // Spoonacular returns an array inside 'results'
    //   setRecipes(data.results || []); 
    // } catch (err) {
    //   console.error("Fetch error:", err);
    // } finally {
    //   setLoading(false);
    // }

    await new Promise(resolve => setTimeout(resolve, 800));

    const mockDatabase = {
      pasta: [
        { id: 201, title: 'Creamy Garlic Penne', calories: 450, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400' },
        { id: 202, title: 'Spaghetti Bolognese', calories: 620, image: 'https://www.slimmingeats.com/blog/wp-content/uploads/2010/04/spaghetti-bolognese-36.jpg' },
        { id: 203, title: 'Classic Lasagna', calories: 750, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400' },
        { id: 204, title: 'Pesto Fusilli', calories: 380, image: 'https://dairyfarmersofcanada.ca/sites/default/files/image_file_browser/conso_recipe/pesto-and-fresh-tomato-fusilli.jpg' },
        { id: 205, title: 'Seafood Linguine', calories: 510, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
        { id: 206, title: 'Mushroom Ravioli', calories: 420, image: 'https://images.unsplash.com/photo-1458642849426-cfb724f15ef7?w=400' },
        { id: 207, title: 'Spicy Arrabbiata', calories: 390, image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400' },
        { id: 208, title: 'Mac & Cheese Bake', calories: 680, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400' },
      ],
      salad: [
        { id: 301, title: 'Greek Feta Salad', calories: 210, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
        { id: 302, title: 'Quinoa Power Bowl', calories: 340, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
        { id: 303, title: 'Caesar Chicken Salad', calories: 450, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400' },
        { id: 304, title: 'Berry Spinach Mix', calories: 180, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
        { id: 305, title: 'Roasted Beet Salad', calories: 260, image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400' },
        { id: 306, title: 'Asian Crunch Slaw', calories: 220, image: 'https://nadialim.com/wp-content/uploads/2020/09/Asian-Slaw.jpg' },
        { id: 307, title: 'Caprese Tomato Salad', calories: 190, image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400' },
        { id: 308, title: 'Sweet Potato Bowl', calories: 410, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwSoGeel1nhHyqyCA9ZM8Itx9EvFR7R3uEJg&s' },
      ],
      ketogenic: [
        { id: 401, title: 'Grilled Butter Salmon', calories: 550, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
        { id: 402, title: 'Ribeye & Asparagus', calories: 720, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
        { id: 403, title: 'Avocado Egg Boats', calories: 380, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400' },
        { id: 404, title: 'Bacon Wrapped Chicken', calories: 610, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400' },
        { id: 405, title: 'Cauliflower Steak', calories: 290, image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400' },
        { id: 406, title: 'Zucchini Noodle Beef', calories: 440, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
        { id: 407, title: 'Creamy Garlic Shrimp', calories: 480, image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=400' },
        { id: 408, title: 'Lemon Herb Halibut', calories: 430, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400' },
      ],
      vegan: [
        { id: 501, title: 'Chickpea Tikka Masala', calories: 340, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
        { id: 502, title: 'Tofu Buddha Bowl', calories: 410, image: 'https://www.sunglowkitchen.com/wp-content/uploads/2023/03/tofu-buddha-bowls-peanut-sauce-8-1.jpg' },
        { id: 503, title: 'Lentil Shepard Pie', calories: 480, image: 'https://images.unsplash.com/photo-1585238341267-1cfec2046a55?w=400' },
        { id: 504, title: 'Sweet Potato Tacos', calories: 320, image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400' },
        { id: 505, title: 'Vegan Ramen Bowl', calories: 450, image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400' },
        { id: 506, title: 'Mushroom Risotto', calories: 390, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400' },
        { id: 507, title: 'Black Bean Burgers', calories: 420, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400' },
        { id: 508, title: 'Green Thai Curry', calories: 360, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400' },
      ],
      healthy: [
        { id: 101, title: 'Rainbow Poke Bowl', calories: 420, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
        { id: 102, title: 'Honey Glazed Turkey', calories: 380, image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400' },
        { id: 103, title: 'Mixed Bean Stew', calories: 290, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
        { id: 104, title: 'Lean Beef Stirfry', calories: 460, image: 'https://www.allrecipes.com/thmb/7N-Xq1XMMJw8G0KJv2e0ETUYB2I=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/228823-quick-beef-stir-fry-DDMFS-4x3-1f79b031d3134f02ac27d79e967dfef5.jpg' },
        { id: 105, title: 'Steamed Sea Bass', calories: 310, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
        { id: 106, title: 'Veggie Frittata', calories: 240, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400' },
        { id: 107, title: 'Brown Rice Paella', calories: 510, image: 'https://img.taste.com.au/O2UG6Ipz/taste/2016/11/chorizo-and-prawn-brown-rice-paella-102548-1.jpeg' },
        { id: 108, title: 'Grilled Peaches & Chicken', calories: 330, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' },
      ]
    };

    // Selection Logic for the Demo
    let results = mockDatabase.healthy;
    
    const q = query.toLowerCase();
    const d = selectedDiet.toLowerCase();

    if (d === 'ketogenic' || q.includes('keto')) results = mockDatabase.ketogenic;
    else if (d === 'vegan' || q.includes('vegan')) results = mockDatabase.vegan;
    else if (q.includes('pasta')) results = mockDatabase.pasta;
    else if (q.includes('salad')) results = mockDatabase.salad;

    setRecipes(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecipes(searchQuery, diet);
  }, [fetchRecipes, diet, searchQuery]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchRecipes(searchQuery, diet);
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