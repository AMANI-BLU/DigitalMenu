import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import TableTentCard from './TableTentCard';

export default function AdminDashboard({
  menu,
  categories,
  orders,
  waiterCalls,
  reviews,
  theme,
  restaurantName,
  tagline,
  onUpdateMenu,
  onUpdateOrderStatus,
  onResolveWaiterCall,
  onUpdateTheme,
  onUpdateRestaurantDetails,
  onToggleAdmin
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'tables' | 'analytics' | 'settings'
  
  // Menu CRUD states
  const [editingItem, setEditingItem] = useState(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formCategory, setFormCategory] = useState('starters');
  const [formImage, setFormImage] = useState('soup');
  const [formTags, setFormTags] = useState('');
  const [formIngredients, setFormIngredients] = useState('');

  // Table QR generator states
  const [tablesList, setTablesList] = useState([1, 2, 3, 4, 5]);
  const [newTableNum, setNewTableNum] = useState('');
  const [selectedTableForTent, setSelectedTableForTent] = useState(4);

  const renderIcon = (name, className = "w-4 h-4") => {
    const IconComponent = Icons[name] || Icons.HelpCircle;
    return <IconComponent className={className} />;
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormPrice(10);
    setFormCategory('starters');
    setFormImage('soup');
    setFormTags('Vegetarian');
    setFormIngredients('Garlic, Herbs');
    setShowMenuForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormPrice(item.price);
    setFormCategory(item.category);
    setFormImage(item.image);
    setFormTags(item.tags.join(', '));
    setFormIngredients(item.ingredients ? item.ingredients.join(', ') : '');
    setShowMenuForm(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const updatedTags = formTags.split(',').map(t => t.trim()).filter(Boolean);
    const updatedIngredients = formIngredients.split(',').map(i => i.trim()).filter(Boolean);

    const targetItem = {
      id: editingItem ? editingItem.id : `custom-${Date.now()}`,
      name: formName,
      description: formDesc,
      price: parseFloat(formPrice) || 0,
      category: formCategory,
      image: formImage,
      tags: updatedTags,
      rating: editingItem ? editingItem.rating : 5.0,
      reviews: editingItem ? editingItem.reviews : 1,
      prepTime: editingItem ? editingItem.prepTime : "15 mins",
      ingredients: updatedIngredients,
      customizations: editingItem ? editingItem.customizations : []
    };

    let newMenu;
    if (editingItem) {
      newMenu = menu.map(m => m.id === editingItem.id ? targetItem : m);
    } else {
      newMenu = [...menu, targetItem];
    }

    onUpdateMenu(newMenu);
    setShowMenuForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const newMenu = menu.filter(m => m.id !== itemId);
      onUpdateMenu(newMenu);
    }
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    const tbl = parseInt(newTableNum);
    if (tbl && !tablesList.includes(tbl)) {
      setTablesList(prev => [...prev, tbl].sort((a,b)=>a-b));
      setNewTableNum('');
    }
  };

  const handleRemoveTable = (tblNum) => {
    if (window.confirm(`Delete Table #${tblNum}?`)) {
      setTablesList(prev => prev.filter(t => t !== tblNum));
      if (selectedTableForTent === tblNum) {
        setSelectedTableForTent(tablesList[0] || null);
      }
    }
  };

  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((acc, curr) => acc + curr.subtotal, 0);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#111319] text-gray-200">
      
      {/* Subheader */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 bg-[#171923] border-b border-[#252836] gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {renderIcon("Layers", "w-5 h-5 text-emerald-500")}
              <span>Merchant Admin Console</span>
            </h2>
            <button 
              onClick={onToggleAdmin}
              className="text-xs font-bold text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1 hover:bg-emerald-950/60"
            >
              {renderIcon("ShoppingBag", "w-3 h-3")} View Storefront
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Real-time management dashboard for <strong className="text-gray-200">{restaurantName}</strong>
          </p>
        </div>

        {/* Preparing Counters */}
        <div className="flex items-center gap-4">
          <div className="bg-[#1f2232] rounded-xl px-4 py-2 flex items-center gap-2 border border-[#2d3142]">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <div className="text-left leading-none">
              <span className="text-[9px] text-gray-400 font-bold block uppercase">Preparing</span>
              <span className="text-sm font-black text-white">{preparingCount}</span>
            </div>
          </div>
          <div className="bg-[#1f2232] rounded-xl px-4 py-2 flex items-center gap-2 border border-[#2d3142]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <div className="text-left leading-none">
              <span className="text-[9px] text-gray-400 font-bold block uppercase">Incoming</span>
              <span className="text-sm font-black text-white">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main SaaS panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar tabs */}
        <div className="w-20 md:w-56 bg-[#171923] border-r border-[#252836] py-4 flex flex-col justify-between shrink-0">
          <div className="flex flex-col gap-1 px-2">
            {[
              { id: 'orders', label: 'Live Orders', icon: 'Inbox' },
              { id: 'menu', label: 'Menu Catalog', icon: 'UtensilsCrossed' },
              { id: 'tables', label: 'QR Tent stand', icon: 'QrCode' },
              { id: 'analytics', label: 'Sales KPI', icon: 'BarChart3' },
              { id: 'settings', label: 'Storefront Setup', icon: 'Settings' }
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-emerald-600/10 border border-emerald-500/25 text-emerald-400'
                      : 'border border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#1f2232]'
                  }`}
                >
                  <div className="flex justify-center w-full md:w-auto shrink-0">
                    {renderIcon(tab.icon, `w-5 h-5 ${isSelected ? 'stroke-[2.5]' : ''}`)}
                  </div>
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Space content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: LIVE ORDERS */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6">
              
              {/* Waiter calls alerts bar */}
              {waiterCalls.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h3 className="text-xs uppercase font-extrabold tracking-wider text-rose-500 flex items-center gap-1">
                    {renderIcon("BellRing", "w-4 h-4 animate-bounce")} Active Waiter Page Notifications ({waiterCalls.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {waiterCalls.map((call, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-rose-950/20 border border-rose-900/50 rounded-2xl text-xs text-rose-300 animate-pulse"
                      >
                        <div className="text-left leading-tight">
                          <p className="font-extrabold text-sm text-white">Table No. {call.tableNumber}</p>
                          <p className="text-[10px] text-rose-400 font-semibold mt-1">Requested: {call.reason} • {call.timestamp}</p>
                        </div>
                        <button
                          onClick={() => onResolveWaiterCall(idx)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[10px]"
                        >
                          Dismiss
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid lists */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Active and preparing orders */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    {renderIcon("Bell", "w-4 h-4 text-amber-500")}
                    <span>Active Orders Board</span>
                  </h3>
                  
                  {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orders
                        .filter(o => o.status !== 'completed' && o.status !== 'cancelled')
                        .map(order => (
                          <div 
                            key={order.id} 
                            className={`p-4 rounded-2xl border bg-[#171923] flex flex-col justify-between gap-4 shadow-md transition-all ${
                              order.status === 'pending' 
                                ? 'border-amber-500/30 bg-amber-500/[0.02]' 
                                : 'border-[#2d3142]'
                            }`}
                          >
                            {/* Card header */}
                            <div className="flex justify-between items-start">
                              <div className="text-left">
                                <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                  order.orderType === 'delivery' 
                                    ? 'bg-rose-500 text-white' 
                                    : 'bg-emerald-500 text-black'
                                }`}>
                                  {order.orderType === 'delivery' ? 'Delivery Order' : 'Dine In'}
                                </span>
                                
                                <p className="text-base font-extrabold text-white mt-2">
                                  {order.orderType === 'dine-in' 
                                    ? `Table ${order.tableNumber}` 
                                    : `Delivery Order #${order.id}`
                                  }
                                </p>
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">{order.timestamp}</span>
                            </div>

                            {/* Client Address/Delivery details if type is delivery */}
                            {order.orderType === 'delivery' && order.deliveryDetails && (
                              <div className="bg-[#1e202e] p-3 rounded-xl border border-[#2d3142] text-[11px] text-gray-300 text-left space-y-1">
                                <p className="font-extrabold text-white flex items-center gap-1.5">
                                  {renderIcon("User", "w-3.5 h-3.5 text-emerald-400")} 
                                  <span>{order.deliveryDetails.name}</span>
                                </p>
                                <p className="flex items-center gap-1.5">
                                  {renderIcon("Phone", "w-3.5 h-3.5 text-emerald-400")} 
                                  <span>{order.deliveryDetails.phone}</span>
                                </p>
                                <p className="flex items-center gap-1.5 leading-relaxed">
                                  {renderIcon("MapPin", "w-3.5 h-3.5 text-emerald-400")} 
                                  <span>{order.deliveryDetails.address}</span>
                                </p>
                              </div>
                            )}

                            {/* Dish Items list */}
                            <div className="border-t border-b border-[#252836] py-3 text-left">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="text-xs py-1 leading-relaxed">
                                  <div className="flex justify-between font-bold text-gray-200">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span className="text-gray-400">${item.finalTotalPrice.toFixed(2)}</span>
                                  </div>
                                  {item.selectedCustomizations && (
                                    <div className="text-[9px] text-gray-500 pl-4">
                                      {Object.entries(item.selectedCustomizations).map(([k,v]) => {
                                        if (Array.isArray(v)) {
                                          if (v.length === 0) return null;
                                          return <span key={k}>{k}: {v.map(val => val.name).join(', ')} </span>;
                                        }
                                        return <span key={k}>{k}: {v} </span>;
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                              
                              {order.offerApplied && (
                                <div className="mt-2 text-[9px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 p-1.5 rounded-lg flex items-center gap-1">
                                  {renderIcon("Sparkles", "w-3 h-3")} Combo Promo Applied
                                </div>
                              )}
                            </div>

                            {/* Total bill */}
                            <div className="flex justify-between items-center font-bold">
                              <span className="text-xs text-gray-400">Total Bill</span>
                              <span className="text-base font-black text-emerald-400">${order.subtotal.toFixed(2)}</span>
                            </div>

                            {/* Action status workflow */}
                            <div className="flex gap-2 mt-2">
                              {order.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                                    className="flex-1 py-2 rounded-xl border border-[#2d3142] hover:bg-[#1f2232] text-xs font-bold text-gray-400"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                                    className="flex-1 py-2 rounded-xl bg-amber-500 text-black hover:brightness-110 text-xs font-bold"
                                  >
                                    Accept
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                                  className="w-full py-2 rounded-xl bg-emerald-600 text-white hover:brightness-110 text-xs font-bold"
                                >
                                  {order.orderType === 'delivery' ? 'Ship Delivery' : 'Mark Served'}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-[#2d3142] rounded-3xl py-16 text-center">
                      {renderIcon("Inbox", "w-10 h-10 text-gray-600 mx-auto stroke-[1.5]")}
                      <p className="text-sm font-semibold text-gray-400 mt-2">No active orders right now.</p>
                    </div>
                  )}
                </div>

                {/* History list */}
                <div className="xl:col-span-1 flex flex-col gap-4">
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    {renderIcon("History", "w-4 h-4 text-emerald-500")}
                    <span>Completed Logs</span>
                  </h3>

                  <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                    {orders.filter(o => o.status === 'completed' || o.status === 'cancelled').length > 0 ? (
                      orders
                        .filter(o => o.status === 'completed' || o.status === 'cancelled')
                        .map(order => (
                          <div 
                            key={order.id} 
                            className="p-4 bg-[#171923]/60 rounded-2xl border border-[#252836]/60 text-left text-xs"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-extrabold text-gray-200">
                                {order.orderType === 'dine-in' ? `Table ${order.tableNumber}` : 'Delivery'}
                              </span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                order.status === 'completed' 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                                  : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-gray-400 mt-2">
                              {order.items.map((i, idx) => (
                                <p key={idx}>{i.quantity}x {i.name}</p>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#252836]/40 font-bold">
                              <span className="text-gray-500">Subtotal</span>
                              <span className="text-emerald-400">${order.subtotal.toFixed(2)}</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-6">No order logs yet.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MENU EDITOR */}
          {activeTab === 'menu' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-white leading-none">Menu Catalog Editor</h3>
                  <p className="text-xs text-gray-400 mt-1">Add, edit, or delete items from the customer catalog list.</p>
                </div>
                <button
                  onClick={handleAddNewItem}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  {renderIcon("Plus", "w-4 h-4")} Add Dish
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {menu.map(item => {
                  const itemCategory = categories.find(c => c.id === item.category)?.name || item.category;
                  return (
                    <div 
                      key={item.id}
                      className="p-4 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col justify-between gap-4"
                    >
                      <div className="text-left">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-500 bg-amber-950/20 px-2.5 py-0.5 rounded-full border border-amber-900/30">
                            {itemCategory}
                          </span>
                          <span className="text-base font-black text-emerald-400">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-white text-sm mt-3.5">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                        
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {item.tags.map(t => (
                              <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-[#1f2232] text-gray-300 rounded border border-[#2d3142]">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-[#252836]">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 rounded-xl border border-[#2d3142] text-rose-500 hover:bg-rose-950/20 hover:border-rose-900/50 flex items-center justify-center shrink-0"
                        >
                          {renderIcon("Trash2", "w-4.5 h-4.5")}
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex-1 py-2 bg-[#1f2232] hover:bg-[#282c3f] rounded-xl text-xs font-bold text-gray-200 border border-[#2d3142]"
                        >
                          Edit recipe
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: QR STAND TENT */}
          {activeTab === 'tables' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 flex flex-col gap-4 text-left">
                <div>
                  <h3 className="text-lg font-bold text-white leading-none">Scan-to-Order Setup</h3>
                  <p className="text-xs text-gray-400 mt-1">Manage active tables and print linked table stand tent cards.</p>
                </div>

                <form onSubmit={handleAddTable} className="flex gap-2 mt-2">
                  <input
                    type="number"
                    required
                    placeholder="Enter Table No."
                    value={newTableNum}
                    onChange={(e) => setNewTableNum(e.target.value)}
                    className="flex-1 bg-[#171923] border border-[#2d3142] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </form>

                <div className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-auto">
                  {tablesList.map(tbl => (
                    <div 
                      key={tbl}
                      onClick={() => setSelectedTableForTent(tbl)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedTableForTent === tbl
                          ? 'bg-emerald-600/10 border-emerald-500/40 text-white'
                          : 'bg-[#171923] border-[#252836] hover:bg-[#1e222f]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#252836] font-black text-sm flex items-center justify-center">
                          {tbl}
                        </div>
                        <div className="leading-tight">
                          <p className="font-extrabold text-xs">Table #{tbl}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTable(tbl);
                        }}
                        className="p-1 hover:text-rose-500 text-gray-400 transition-colors"
                      >
                        {renderIcon("Trash", "w-4 h-4")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col items-center gap-4">
                <div className="w-full flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-gray-400">Tent Card Template Preview</h4>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 bg-amber-500 text-black hover:brightness-110 rounded-xl text-xs font-black flex items-center gap-1.5 shadow"
                  >
                    {renderIcon("Printer", "w-4 h-4")} Print Tent Card
                  </button>
                </div>

                <div className="w-full p-8 rounded-3xl bg-[#171923] border border-[#252836] flex items-center justify-center shadow-lg">
                  {selectedTableForTent ? (
                    <TableTentCard
                      tableNumber={selectedTableForTent}
                      restaurantName={restaurantName}
                      tagline={tagline}
                      theme={theme}
                    />
                  ) : (
                    <div className="text-gray-400 py-10">Select a table to see its tent setup.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-6 text-left">
              <div>
                <h3 className="text-lg font-bold text-white leading-none">Analytics Performance KPIs</h3>
                <p className="text-xs text-gray-400 mt-1">Visual reports on sales, order quantities, and ratings.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Completed Sales</span>
                    {renderIcon("DollarSign", "w-4 h-4 text-emerald-500")}
                  </div>
                  <h4 className="text-2xl font-black text-white mt-2">${totalRevenue.toFixed(2)}</h4>
                </div>

                <div className="p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Total Checkouts</span>
                    {renderIcon("ClipboardList", "w-4 h-4 text-amber-500")}
                  </div>
                  <h4 className="text-2xl font-black text-white mt-2">{orders.length}</h4>
                </div>

                <div className="p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Average Bill</span>
                    {renderIcon("TrendingUp", "w-4 h-4 text-blue-500")}
                  </div>
                  <h4 className="text-2xl font-black text-white mt-2">
                    ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0.00"}
                  </h4>
                </div>

                <div className="p-4 bg-[#171923] border border-[#252836] rounded-2xl">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Customer Rating</span>
                    {renderIcon("Star", "w-4 h-4 text-yellow-500")}
                  </div>
                  <h4 className="text-2xl font-black text-white mt-2">
                    {reviews.length > 0 ? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "4.9"}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-5 bg-[#171923] border border-[#252836] rounded-2xl">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 mb-4">Simulated Hourly Revenue</h4>
                  
                  <div className="h-44 w-full flex items-end justify-between relative pt-6 border-b border-l border-[#2d3142] px-2.5 pb-2">
                    <div className="absolute inset-0 border-t border-[#1f2232] top-1/4 pointer-events-none"></div>
                    <div className="absolute inset-0 border-t border-[#1f2232] top-2/4 pointer-events-none"></div>
                    <div className="absolute inset-0 border-t border-[#1f2232] top-3/4 pointer-events-none"></div>

                    {[
                      { hr: "12 PM", val: 40 },
                      { hr: "2 PM", val: 85 },
                      { hr: "4 PM", val: 30 },
                      { hr: "6 PM", val: 120 },
                      { hr: "8 PM", val: 180 },
                      { hr: "10 PM", val: 95 }
                    ].map((pt, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 z-10 w-12">
                        <div 
                          className="w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md hover:brightness-110 transition-all duration-300"
                          style={{ height: `${(pt.val / 200) * 120}px` }}
                        ></div>
                        <span className="text-[9px] text-gray-500 font-bold">{pt.hr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-1 p-5 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col gap-4">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-gray-400">Client Reviews ({reviews.length})</h4>
                  
                  <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] pr-1">
                    {reviews.length > 0 ? (
                      reviews.map((rev, idx) => (
                        <div key={idx} className="p-3 bg-[#1e212f] rounded-xl border border-[#2b3042] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{rev.tableNumber}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(st => (
                                <Icons.Star 
                                  key={st}
                                  className={`w-3 h-3 ${st <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                />
                              ))}
                            </div>
                          </div>
                          {rev.comment && (
                            <p className="text-[10px] text-gray-400 mt-1.5 italic">"{rev.comment}"</p>
                          )}
                          <span className="text-[8px] text-gray-500 block mt-2">{rev.timestamp}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500 text-center py-6">No customer feedback yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="p-5 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Restaurant Profile Details</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Configure global display names for the client application storefront.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      value={restaurantName}
                      onChange={(e) => onUpdateRestaurantDetails(e.target.value, tagline)}
                      className="w-full bg-[#1e212f] border border-[#2d3142] rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Slogan / Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => onUpdateRestaurantDetails(restaurantName, e.target.value)}
                      className="w-full bg-[#1e212f] border border-[#2d3142] rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#171923] border border-[#252836] rounded-2xl flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Store Palette Branding</h3>
                  <p className="text-[10px] text-gray-400 mt-1">Swap colors across customer layout and print outputs.</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { id: 'forest', name: 'Forest Bistro', desc: 'Emerald & Gold', class: 'border-emerald-600 bg-emerald-950/20 text-emerald-300' },
                    { id: 'amber', name: 'Amber Cafe', desc: 'Yellow & Teal', class: 'border-amber-500 bg-amber-950/20 text-amber-300' },
                    { id: 'midnight', name: 'Midnight Grill', desc: 'Crimson & Gold', class: 'border-rose-600 bg-rose-950/20 text-rose-300' },
                    { id: 'blossom', name: 'Blossom Cafe', desc: 'Pink & Sage', class: 'border-pink-600 bg-pink-950/20 text-pink-300' },
                  ].map(t => {
                    const isSelected = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => onUpdateTheme(t.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all ${
                          isSelected
                            ? `${t.class} shadow-md`
                            : 'border-[#2d3142] bg-[#1e212f] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span className="font-extrabold text-xs text-white">{t.name}</span>
                        <span className="text-[9px] font-semibold opacity-80">{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CRUD Form Modal */}
      {showMenuForm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-[#171923] border border-[#2d3142] rounded-3xl p-6 w-full max-w-lg shadow-2xl text-left text-gray-200">
            <h3 className="text-base font-extrabold tracking-tight text-white mb-4">
              {editingItem ? "Edit Catalog Item" : "Create Catalog Recipe"}
            </h3>

            <form onSubmit={handleSaveItem} className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                <textarea
                  required
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-medium focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Thumbnail Graphic</label>
                  <select
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="soup">Soup Graphic</option>
                    <option value="coffee">Coffee/Espresso Graphic</option>
                    <option value="mocktail">Mocktail Graphic</option>
                    <option value="tiramisu">Cake/Dessert Graphic</option>
                    <option value="salad">Salad Graphic</option>
                    <option value="steak">Flame/Meat Graphic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Dietary Labels (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vegan, Spicy, Gluten-Free"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400">Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Potato, Olive, Oregano"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full mt-1 bg-[#1e212f] border border-[#2d3142] rounded-xl p-2.5 text-xs text-white font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  type="button"
                  onClick={() => setShowMenuForm(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-[#2d3142] text-gray-400 hover:bg-[#1f2232]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:brightness-110"
                >
                  Save Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
