import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, ShoppingBag, Settings, Plus, Trash2, Edit, TrendingUp, Package, DollarSign, LogOut, X, Save, MessageSquare, CheckCircle, Reply } from 'lucide-react';
import axios from 'axios';
import './AdminPanel.css';
import { mockProducts, mockOrders, mockUsers, mockMessages } from '../data/mockData';

const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State for other tabs
  const [orderList, setOrderList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  
  // Support Tab State
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'men',
    description: '',
    brand: 'Stuckfit',
    isNew: false,
    isTrending: false,
    imageFile: null,
    model3dFile: null
  });

  // Fetch products from backend for Admin table
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProductList(data);
    } catch (error) {
      console.warn('Error fetching products from API, falling back to mock data:', error);
      setProductList(mockProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      const data = await response.json();
      setOrderList(data);
    } catch (error) {
      console.warn('Error fetching orders from API, falling back to mock data:', error);
      setOrderList(mockOrders);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      setUserList(data);
    } catch (error) {
      console.warn('Error fetching users from API, falling back to mock data:', error);
      setUserList(mockUsers);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages');
      const data = await response.json();
      setMessageList(data);
    } catch (error) {
      console.warn('Error fetching messages from API, falling back to mock data:', error);
      setMessageList(mockMessages);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchUsers();
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProductList(productList.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      images: product.images[0], // simplified to take first image
      brand: product.brand,
      isNew: product.isNew,
      isTrending: product.isTrending,
      imageFile: null,
      model3dFile: null
    });
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      category: 'men',
      description: '',
      images: '',
      brand: 'Stuckfit',
      isNew: false,
      isTrending: false,
      imageFile: null,
      model3dFile: null
    });
    setIsFormOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleResolveMessage = async (id, currentStatus) => {
    if (currentStatus === 'Resolved') return;
    try {
      await axios.put(`http://localhost:5000/api/messages/${id}`, { status: 'Resolved' });
      fetchMessages();
    } catch (error) {
      console.error('Error resolving message', error);
      alert('Failed to resolve message');
    }
  };

  const handleSendReply = async (id) => {
    if (!replyText.trim()) {
      alert('Please enter a reply message.');
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/messages/${id}`, { 
        status: 'Replied', 
        reply: replyText 
      });
      setReplyingTo(null);
      setReplyText('');
      fetchMessages();
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply', error);
      alert('Failed to send reply');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('price', formData.price);
    payload.append('category', formData.category);
    payload.append('brand', formData.brand);
    payload.append('description', formData.description);
    payload.append('isNew', formData.isNew);
    payload.append('isTrending', formData.isTrending);
    
    if (formData.imageFile) {
      payload.append('image', formData.imageFile);
    } else if (formData.images) {
      payload.append('images', formData.images);
    }
    
    if (formData.model3dFile) {
      payload.append('model3d', formData.model3dFile);
    }

    try {
      if (editingId) {
        // Update existing
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Create new
        await axios.post(`http://localhost:5000/api/products`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsFormOpen(false);
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Error saving product', error);
      alert('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-page container">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-profile">
            <div className="admin-logo-wrapper">
              <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Stuck Fit Logo" className="stuck-fit-admin-logo" />
            </div>
            <h3>Store Admin</h3>
            <p>Stuckfit Dashboard</p>
          </div>
          <nav className="admin-nav">
            <button className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              <ShoppingBag size={20} /> Products
            </button>
            <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <LayoutDashboard size={20} /> Orders
            </button>
            <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              <Users size={20} /> Users
            </button>
            <button className={`nav-item ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>
              <MessageSquare size={20} /> Support
              {messageList.filter(m => m.status === 'Unread').length > 0 && (
                <span className="nav-badge">{messageList.filter(m => m.status === 'Unread').length}</span>
              )}
            </button>
            <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={20} /> Settings
            </button>
            <button 
              className="nav-item" 
              style={{marginTop: 'auto', color: '#fca5a5'}} 
              onClick={() => {
                localStorage.removeItem('adminAuth');
                if(onLogout) onLogout();
              }}
            >
              <LogOut size={20} /> Sign Out
            </button>
          </nav>
        </aside>

        <main className="admin-content">
          {activeTab === 'products' && (
            <div className="tab-pane fade-in">
              <div className="admin-header-area">
                <div className="admin-greeting">
                  <h2>Dashboard Overview</h2>
                  <p>Welcome back, here's what's happening with your store today.</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => setActiveTab('products')}>
                  <div className="stat-icon bg-blue"><Package size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Total Products</p>
                    <h3 className="stat-value">{productList.length || 0}</h3>
                  </div>
                </div>
                <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => setActiveTab('orders')}>
                  <div className="stat-icon bg-green"><DollarSign size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Total Revenue</p>
                    <h3 className="stat-value">₹{orderList.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                  </div>
                </div>
                <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => setActiveTab('orders')}>
                  <div className="stat-icon bg-purple"><ShoppingBag size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">New Orders</p>
                    <h3 className="stat-value">{orderList.filter(o => o.status === 'Processing').length || 0}</h3>
                  </div>
                </div>
                <div className="stat-card" style={{cursor: 'pointer'}} onClick={() => setActiveTab('users')}>
                  <div className="stat-icon bg-orange"><TrendingUp size={24} /></div>
                  <div className="stat-info">
                    <p className="stat-label">Conversion Rate</p>
                    <h3 className="stat-value">
                      {userList.length > 0 ? ((orderList.length / userList.length) * 100).toFixed(1) : '0'}%
                    </h3>
                  </div>
                </div>
              </div>

              <div className="admin-section-card">
                {!isFormOpen ? (
                  <>
                    <div className="tab-header">
                      <h2>Product Management</h2>
                      <button className="btn-add" onClick={handleAddClick}><Plus size={18} /> Add Product</button>
                    </div>
                    {isLoading ? (
                        <p>Loading products...</p>
                    ) : (
                      <div className="data-table-container">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productList.map(product => (
                              <tr key={product.id}>
                                <td>
                                  <div className="table-product">
                                    <img src={product.images[0]} alt="" />
                                    <span>{product.name}</span>
                                  </div>
                                </td>
                                <td style={{textTransform: 'capitalize'}}>{product.category}</td>
                                <td>₹{Number(product.price).toFixed(2)}</td>
                                <td>
                                  <div className="action-btns">
                                    <button className="icon-btn edit-btn" onClick={() => handleEditClick(product)}><Edit size={16}/></button>
                                    <button className="icon-btn delete-btn" onClick={() => handleDelete(product.id)}><Trash2 size={16}/></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="admin-form-container fade-in">
                    <div className="tab-header">
                      <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                      <button className="btn-secondary" onClick={() => setIsFormOpen(false)}>
                        <X size={18} /> Cancel
                      </button>
                    </div>
                    <form onSubmit={handleFormSubmit} className="admin-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Product Name</label>
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                          <label>Price (₹)</label>
                          <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                          <label>Category</label>
                          <select name="category" value={formData.category} onChange={handleInputChange}>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="kids">Kids</option>
                            <option value="accessories">Accessories</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Brand</label>
                          <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group full-width">
                          <label>Product Image</label>
                          <input 
                            type="file" 
                            name="image" 
                            accept="image/*" 
                            onChange={(e) => setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }))} 
                            required={!editingId && !formData.images}
                          />
                          {formData.images && !formData.imageFile && (
                            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
                              <img src={formData.images} alt="Current" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                              <span style={{ fontSize: '0.8rem', marginLeft: '0.75rem', color: 'var(--color-text-muted)' }}>Current Image (Choosing a new file will replace this)</span>
                            </div>
                          )}
                        </div>
                        <div className="form-group full-width">
                          <label>3D Model File (.glb, .gltf, .obj) (Optional)</label>
                          <input 
                            type="file" 
                            name="model3d" 
                            accept=".glb,.gltf,.obj" 
                            onChange={(e) => setFormData(prev => ({ ...prev, model3dFile: e.target.files[0] }))} 
                          />
                        </div>
                        <div className="form-group full-width">
                          <label>Description</label>
                          <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required></textarea>
                        </div>
                        <div className="form-checkboxes full-width">
                          <label className="checkbox-label">
                            <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleInputChange} />
                            Mark as 'New Arrival'
                          </label>
                          <label className="checkbox-label">
                            <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleInputChange} />
                            Mark as 'Trending'
                          </label>
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-add" disabled={isSaving}>
                          <Save size={18} /> {isSaving ? 'Saving...' : 'Save Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="tab-pane fade-in">
              <div className="tab-header">
                <h2>Recent Orders</h2>
              </div>

              {/* Revenue Details Section */}
              <div className="admin-section-card" style={{marginBottom: '2rem'}}>
                <h3 style={{marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--color-primary)'}}>Revenue Breakdown</h3>
                <div className="revenue-breakdown-container">
                  <div style={{flex: 1}}>
                    <p className="stat-label">Total Revenue Collected</p>
                    <h3 className="stat-value" style={{color: 'var(--color-primary)'}}>₹{orderList.filter(o => o.paymentStatus === 'Paid').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div style={{flex: 2}} className="revenue-breakdown">
                    <div className="breakdown-item">
                      <span className="dot dot-yellow"></span>
                      <span className="breakdown-label">Outstanding (Pending/Failed)</span>
                      <span className="breakdown-value">₹{orderList.filter(o => o.paymentStatus === 'Outstanding').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="dot dot-blue"></span>
                      <span className="breakdown-label">Upcoming (COD/Net Terms)</span>
                      <span className="breakdown-value">₹{orderList.filter(o => o.paymentStatus === 'Upcoming').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="dot dot-red"></span>
                      <span className="breakdown-label">Return to Origin (RTO)</span>
                      <span className="breakdown-value">₹{orderList.filter(o => o.paymentStatus === 'RTO').reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-section-card">
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.map(order => (
                        <tr key={order.id}>
                          <td style={{fontWeight: '600', color: 'var(--color-primary)'}}>{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>₹{order.total.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="tab-pane fade-in">
              <div className="tab-header">
                <h2>User Management</h2>
              </div>
              <div className="admin-section-card">
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map(user => (
                        <tr key={user.id}>
                          <td style={{fontWeight: '500'}}>{user.name}</td>
                          <td style={{color: 'var(--color-text-muted)'}}>{user.email}</td>
                          <td>
                            <span className={`role-badge role-${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-badge status-${user.status.toLowerCase()}`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="tab-pane fade-in">
              <div className="tab-header">
                <h2>Support Inbox</h2>
              </div>
              <div className="admin-section-card">
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Customer Info</th>
                        <th>Subject & Message</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messageList.map(msg => (
                        <tr key={msg.id} style={{ opacity: msg.status === 'Resolved' ? 0.7 : 1 }}>
                          <td style={{verticalAlign: 'top', paddingTop: '1rem'}}>
                            {new Date(msg.date).toLocaleDateString()}
                          </td>
                          <td style={{verticalAlign: 'top', paddingTop: '1rem'}}>
                            <div style={{fontWeight: '500'}}>{msg.name}</div>
                            <div style={{fontSize: '0.85rem', color: 'var(--color-text-muted)'}}>{msg.email}</div>
                          </td>
                          <td style={{maxWidth: '300px', cursor: 'pointer'}} onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}>
                            <div style={{fontWeight: '600', marginBottom: '0.25rem'}}>{msg.subject}</div>
                            {expandedMessageId === msg.id ? (
                              <div style={{fontSize: '0.9rem', color: 'var(--color-text-light)', whiteSpace: 'pre-line'}}>{msg.message}</div>
                            ) : (
                              <div style={{fontSize: '0.9rem', color: 'var(--color-text-light)', WebkitLineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{msg.message}</div>
                            )}
                            <span style={{fontSize: '0.75rem', color: 'var(--color-primary)', marginTop: '0.25rem', display: 'inline-block', fontWeight: '500'}}>
                              {expandedMessageId === msg.id ? 'Show Less' : 'Show More'}
                            </span>
                          </td>
                          <td style={{verticalAlign: 'top', paddingTop: '1rem'}}>
                            <span className={`status-badge status-${msg.status.toLowerCase()}`}>
                              {msg.status}
                            </span>
                          </td>
                          <td style={{verticalAlign: 'top', paddingTop: '1rem', width: '200px'}}>
                            {msg.status !== 'Resolved' && msg.status !== 'Replied' && (
                              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button 
                                  className="btn-secondary" 
                                  style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderColor: 'var(--color-primary)', color: 'var(--color-primary)'}}
                                  onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)}
                                >
                                  <Reply size={14} /> Reply
                                </button>
                                <button 
                                  className="btn-secondary" 
                                  style={{padding: '0.25rem 0.5rem', fontSize: '0.8rem'}}
                                  onClick={() => handleResolveMessage(msg.id, msg.status)}
                                >
                                  <CheckCircle size={14} /> Resolve
                                </button>
                              </div>
                            )}
                            
                            {msg.status === 'Replied' && (
                              <div>
                                <span style={{fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600', marginBottom: '0.25rem'}}>
                                  <CheckCircle size={14} /> Reply Sent
                                </span>
                                {msg.reply && (
                                  <div style={{fontSize: '0.8rem', backgroundColor: '#f0fdf4', padding: '0.5rem', borderRadius: '4px', border: '1px solid #bbf7d0', color: '#166534', whiteSpace: 'pre-line'}}>
                                    <strong>Reply:</strong> {msg.reply}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Reply Modal/Drawer area attached conditionally below active row or absolute inside tab */}
                  {replyingTo && (() => {
                    const activeMessage = messageList.find(m => m.id === replyingTo);
                    return activeMessage ? (
                      <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius)', backgroundColor: '#f9fafb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.1rem' }}>
                            Replying to {activeMessage.name}
                          </h3>
                          <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                            <X size={18} />
                          </button>
                        </div>
                        
                        {/* Display the customer's full message here */}
                        <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '6px', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                            Subject: {activeMessage.subject}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', whiteSpace: 'pre-line' }}>
                            {activeMessage.message}
                          </div>
                        </div>

                        <textarea
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--color-border)', resize: 'vertical', minHeight: '100px', marginBottom: '1rem', fontFamily: 'inherit' }}
                          placeholder="Type your response here... (This will simulate sending an email)"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                          onClick={() => handleSendReply(replyingTo)}
                        >
                          Send Reply
                        </button>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-pane fade-in">
              <div className="tab-header">
                <h2>Store Settings</h2>
              </div>
              <div className="admin-section-card">
                <form className="admin-form settings-form">
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <h3>General Settings</h3>
                      <hr style={{border: 'none', borderTop: '1px solid var(--color-border)', margin: '1rem 0'}}/>
                    </div>
                    <div className="form-group">
                      <label>Store Name</label>
                      <input type="text" defaultValue="Stuckfit" />
                    </div>
                    <div className="form-group">
                      <label>Contact Email</label>
                      <input type="email" defaultValue="admin@stuckfit.com" />
                    </div>
                    <div className="form-group">
                      <label>Currency</label>
                      <select defaultValue="INR">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Tax Rate (%)</label>
                      <input type="number" defaultValue="18" />
                    </div>
                    <div className="form-group full-width">
                      <label>Store Address</label>
                      <textarea rows="3" defaultValue="123 Fashion Street, Design District, 400001"></textarea>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-add" onClick={() => alert('Settings saved successfully!')}>
                      <Save size={18} /> Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
