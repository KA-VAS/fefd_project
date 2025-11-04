import React, { useState, useEffect } from 'react'
import { professionals as initialProfessionals } from './data/professionals'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [role, setRole] = useState('')
  const [professionals, setProfessionals] = useState(initialProfessionals)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 3500)
      return () => clearTimeout(t)
    }
  }, [notification])

  function handleLogin(e) {
    e.preventDefault()
    const name = e.target.name.value.trim()
    const email = e.target.email.value.trim()
    const selectedRole = e.target.role.value
    if (!name || !email || !selectedRole) {
      showNotification('Please fill in all fields', 'error')
      return
    }
    setCurrentUser({ name, email })
    setRole(selectedRole)
    showNotification(`Welcome ${name}! Logged in as ${selectedRole}`)
  }

  function showNotification(message, type = 'info') {
    setNotification({ message, type })
  }

  function logout() {
    setCurrentUser(null)
    setRole('')
    // reset filters
    setQuery('')
    setCategoryFilter('')
    setLocationFilter('')
    setPriceFilter('')
    showNotification('Logged out successfully')
  }

  function filteredProfessionals() {
    return professionals.filter(p => {
      if (query) {
        const q = query.toLowerCase()
        if (!(
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
        )) return false
      }
      if (categoryFilter && p.category !== categoryFilter) return false
      if (locationFilter && p.location !== locationFilter) return false
      if (priceFilter) {
        if (priceFilter.includes('-')) {
          const [min, max] = priceFilter.split('-').map(v => parseInt(v.replace(/[^0-9]/g, '')))
          if (isNaN(min) || isNaN(max)) return false
          if (!(p.price >= min && p.price <= max)) return false
        } else {
          const min = parseInt(priceFilter.replace(/[^0-9]/g, ''))
          if (!isNaN(min) && p.price < min) return false
        }
      }
      return true
    })
  }

  function hireProfessional(id) {
    const prof = professionals.find(p => p.id === id)
    showNotification(`Hiring ${prof.name}`, 'info')
  }

  return (
    <div className="app-root">
      <div className="container">
        {!currentUser && (
          <div className="login-container">
            <div className="login-card">
              <h1>ProConnect</h1>
              <p className="muted">Connect with the right professionals</p>
              <form id="loginForm" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input id="name" name="name" type="text" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Select Role</label>
                  <select id="role" name="role">
                    <option value="">Choose your role</option>
                    <option value="user">User (Client)</option>
                    <option value="professional">Professional</option>
                    <option value="admin">Admin</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>
                <button type="submit" className="btn">Login</button>
              </form>
            </div>
          </div>
        )}

        {currentUser && (
          <div className="dashboard active">
            <header className="header">
              <div className="header-content">
                <div className="logo">ProConnect {role === 'admin' ? 'Admin' : role === 'support' ? 'Support' : ''}</div>
                <div className="user-info">
                  <span>Welcome, {currentUser.name}</span>
                  <button className="logout-btn" onClick={logout}>Logout</button>
                </div>
              </div>
            </header>

            <div className="main-content">
              <div className="search-container">
                <h2>Find Professionals</h2>
                <div className="search-bar">
                  <input
                    className="search-input"
                    placeholder="Search for services (e.g., plumber, designer, tutor)"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') e.preventDefault() }}
                  />
                  <button className="search-btn" onClick={() => showNotification(`Found ${filteredProfessionals().length} professionals`, 'success')}>Search</button>
                </div>
                <div className="filters">
                  <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Home Services">Home Services</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Technology">Technology</option>
                    <option value="Education">Education</option>
                    <option value="Health & Wellness">Health & Wellness</option>
                  </select>
                  <select className="filter-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                    <option value="">All Locations</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Pune">Pune</option>
                    <option value="Gurgaon">Gurgaon</option>
                    <option value="Jaipur">Jaipur</option>
                  </select>
                  <select className="filter-select" value={priceFilter} onChange={e => setPriceFilter(e.target.value)}>
                    <option value="">Any Price</option>
                    <option value="0-500">₹0 - ₹500</option>
                    <option value="500-1000">₹500 - ₹1000</option>
                    <option value="1000-2000">₹1000 - ₹2000</option>
                    <option value="2000+">₹2000+</option>
                  </select>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">{filteredProfessionals().length.toLocaleString()}</div>
                  <div className="stat-label">Available Professionals</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Service Categories</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">4.8</div>
                  <div className="stat-label">Average Rating</div>
                </div>
              </div>

              <div className="professionals-grid">
                {filteredProfessionals().length === 0 && (
                  <div className="card">No professionals found matching your search.</div>
                )}
                {filteredProfessionals().map(p => (
                  <div className="professional-card" key={p.id}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
                    <div className="professional-info">
                      <div className="professional-name">{p.name}</div>
                      <div className="professional-category">{p.subcategory}</div>
                      <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: 10 }}>{p.location}</div>
                      <div className="rating">
                        <span className="stars">{ '★'.repeat(Math.round(p.rating)) }</span>
                        <span>{p.rating} ({p.reviews} reviews)</span>
                      </div>
                      <div style={{ marginBottom: 15, fontWeight: 600, color: '#667eea' }}>₹{p.price}/{p.priceUnit}</div>
                      <button className="hire-btn" onClick={() => hireProfessional(p.id)}>Hire Now</button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {notification && (
          <div id="notification" className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    </div>
  )
}
