"use client";
import React from "react";



export default function Index() {
  return (function MainComponent({ 
  items = [], 
  onQuantityChange, 
  onSaveList, 
  onShareList, 
  onAddToCart, 
  onBuyAll,
  savedLists = []
}) {
  const [selectedRetailer, setSelectedRetailer] = useState("amazon");
  const [savedListName, setSavedListName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  
  const retailers = {
    amazon: { name: "Amazon", logo: "/retailers/amazon.png" },
    bestbuy: { name: "Best Buy", logo: "/retailers/bestbuy.png" },
    newegg: { name: "Newegg", logo: "/retailers/newegg.png" },
    bhphoto: { name: "B&H Photo", logo: "/retailers/bh.png" }
  };
  
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      return total + (item.prices[selectedRetailer] * item.quantity);
    }, 0);
  };
  
  const handleSaveList = () => {
    if (savedListName.trim()) {
      onSaveList?.({ name: savedListName, items, date: new Date(), retailer: selectedRetailer });
      setShowSaveModal(false);
      setSavedListName("");
    }
  };
  
  const handleShareList = () => {
    onShareList?.({ items, retailer: selectedRetailer });
  };
  
  const handleBuyAll = () => {
    onBuyAll?.({ items, retailer: selectedRetailer });
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="border-b dark:border-gray-700">
        <div className="flex">
          <button 
            onClick={() => setActiveTab("current")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "current" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Current Shopping List
          </button>
          <button 
            onClick={() => setActiveTab("saved")}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === "saved" 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Saved Lists
          </button>
        </div>
      </div>
      
      {activeTab === "current" ? (
        <>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Required Adapters & Accessories</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    value={selectedRetailer}
                    onChange={(e) => setSelectedRetailer(e.target.value)}
                    className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 text-sm"
                  >
                    {Object.entries(retailers).map(([id, retailer]) => (
                      <option key={id} value={id}>{retailer.name}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <i className="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
            
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                  <i className="fas fa-shopping-cart text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-lg font-medium mb-2">Your shopping list is empty</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Connect devices to see required adapters and accessories</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="relative bg-gray-50 dark:bg-gray-800 p-4 flex justify-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-32 object-contain"
                        />
                        {item.compatibility === "perfect" && (
                          <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Perfect Match
                          </span>
                        )}
                        {item.compatibility === "alternative" && (
                          <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Alternative
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{item.description}</p>
                        
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <img 
                              src={retailers[selectedRetailer].logo} 
                              alt={retailers[selectedRetailer].name} 
                              className="h-4 mr-2"
                            />
                            <span className="font-bold">${item.prices[selectedRetailer].toFixed(2)}</span>
                          </div>
                          
                          <div className="flex items-center border rounded-lg">
                            <button 
                              onClick={() => onQuantityChange?.(item.id, Math.max(0, item.quantity - 1))}
                              className="px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <i className="fas fa-minus text-xs"></i>
                            </button>
                            <span className="px-2 py-1 text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => onQuantityChange?.(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                              <i className="fas fa-plus text-xs"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-sm mb-3">
                          <div className="flex justify-between mb-1">
                            <span>Amazon:</span>
                            <span>${item.prices.amazon.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                            <span>Best Buy:</span>
                            <span>${item.prices.bestbuy.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Newegg:</span>
                            <span>${item.prices.newegg.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => onAddToCart?.(item, selectedRetailer)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Total ({items.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                      <span className="ml-2 text-xl font-bold">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setShowSaveModal(true)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <i className="fas fa-save mr-2"></i>
                        Save List
                      </button>
                      <button 
                        onClick={handleShareList}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <i className="fas fa-share-alt mr-2"></i>
                        Share
                      </button>
                      <button 
                        onClick={handleBuyAll}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                      >
                        Buy All Items
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {showSaveModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Save Shopping List</h3>
                <input
                  type="text"
                  placeholder="Enter a name for this list"
                  value={savedListName}
                  onChange={(e) => setSavedListName(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-4 dark:bg-gray-800 dark:border-gray-700"
                />
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveList}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Saved Shopping Lists</h2>
          
          {savedLists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
                <i className="fas fa-bookmark text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium mb-2">No saved lists yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Save your shopping lists to access them later</p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedLists.map((list) => (
                <div key={list.id} className="border dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{list.name}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(list.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span>{list.items.length} items</span>
                    <span className="mx-2">•</span>
                    <span>${list.items.reduce((total, item) => total + (item.prices[list.retailer] * item.quantity), 0).toFixed(2)}</span>
                    <span className="mx-2">•</span>
                    <img 
                      src={retailers[list.retailer].logo} 
                      alt={retailers[list.retailer].name} 
                      className="h-3 mr-1"
                    />
                    <span>{retailers[list.retailer].name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setActiveTab("current");
                        onSaveList?.(list);
                      }}
                      className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Load List
                    </button>
                    <button 
                      onClick={() => onShareList?.(list)}
                      className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <i className="fas fa-share-alt mr-1"></i>
                      Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StoryComponent() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "HDMI to DisplayPort Adapter",
      description: "4K@60Hz, Gold Plated, Compatible with TV, Monitor, Projector",
      image: "/adapters/hdmi-to-displayport.png",
      compatibility: "perfect",
      quantity: 1,
      prices: {
        amazon: 15.99,
        bestbuy: 19.99,
        newegg: 14.95,
        bhphoto: 16.99
      }
    },
    {
      id: 2,
      name: "USB-C to HDMI Cable",
      description: "6ft, Thunderbolt 3 Compatible, 4K@60Hz Support",
      image: "/adapters/usbc-to-hdmi.png",
      compatibility: "perfect",
      quantity: 1,
      prices: {
        amazon: 12.99,
        bestbuy: 14.99,
        newegg: 11.95,
        bhphoto: 13.49
      }
    },
    {
      id: 3,
      name: "3.5mm Audio Extension Cable",
      description: "10ft, Gold Plated, Aux Cord for Headphones, Speakers",
      image: "/adapters/audio-extension.png",
      compatibility: "alternative",
      quantity: 1,
      prices: {
        amazon: 7.99,
        bestbuy: 9.99,
        newegg: 6.95,
        bhphoto: 8.49
      }
    },
    {
      id: 4,
      name: "DisplayPort to DVI Adapter",
      description: "1080p Compatible, Gold Plated Connector",
      image: "/adapters/displayport-to-dvi.png",
      compatibility: "perfect",
      quantity: 1,
      prices: {
        amazon: 9.99,
        bestbuy: 12.99,
        newegg: 8.95,
        bhphoto: 10.49
      }
    }
  ]);
  
  const [savedLists, setSavedLists] = useState([
    {
      id: 1,
      name: "Home Office Setup",
      date: "2025-01-15T12:00:00Z",
      retailer: "amazon",
      items: [
        {
          id: 1,
          name: "HDMI to DisplayPort Adapter",
          description: "4K@60Hz, Gold Plated, Compatible with TV, Monitor, Projector",
          image: "/adapters/hdmi-to-displayport.png",
          compatibility: "perfect",
          quantity: 2,
          prices: {
            amazon: 15.99,
            bestbuy: 19.99,
            newegg: 14.95,
            bhphoto: 16.99
          }
        },
        {
          id: 2,
          name: "USB-C to HDMI Cable",
          description: "6ft, Thunderbolt 3 Compatible, 4K@60Hz Support",
          image: "/adapters/usbc-to-hdmi.png",
          compatibility: "perfect",
          quantity: 1,
          prices: {
            amazon: 12.99,
            bestbuy: 14.99,
            newegg: 11.95,
            bhphoto: 13.49
          }
        }
      ]
    },
    {
      id: 2,
      name: "Conference Room Setup",
      date: "2025-02-10T15:30:00Z",
      retailer: "bestbuy",
      items: [
        {
          id: 3,
          name: "3.5mm Audio Extension Cable",
          description: "10ft, Gold Plated, Aux Cord for Headphones, Speakers",
          image: "/adapters/audio-extension.png",
          compatibility: "alternative",
          quantity: 3,
          prices: {
            amazon: 7.99,
            bestbuy: 9.99,
            newegg: 6.95,
            bhphoto: 8.49
          }
        },
        {
          id: 4,
          name: "DisplayPort to DVI Adapter",
          description: "1080p Compatible, Gold Plated Connector",
          image: "/adapters/displayport-to-dvi.png",
          compatibility: "perfect",
          quantity: 2,
          prices: {
            amazon: 9.99,
            bestbuy: 12.99,
            newegg: 8.95,
            bhphoto: 10.49
          }
        }
      ]
    }
  ]);
  
  const handleQuantityChange = (itemId, newQuantity) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleSaveList = (list) => {
    if (list.id) {
      // Loading an existing list
      setItems(list.items);
    } else {
      // Saving a new list
      const newList = {
        ...list,
        id: savedLists.length + 1
      };
      setSavedLists([...savedLists, newList]);
    }
  };
  
  const handleAddToCart = (item, retailer) => {
    console.log(`Added ${item.name} to ${retailer} cart`);
  };
  
  const handleBuyAll = ({ items, retailer }) => {
    console.log(`Buying all items from ${retailer}`);
  };
  
  const handleShareList = (list) => {
    console.log(`Sharing list: ${list.name || 'Current list'}`);
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping List Component</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Default View</h2>
        <MainComponent 
          items={items}
          onQuantityChange={handleQuantityChange}
          onSaveList={handleSaveList}
          onShareList={handleShareList}
          onAddToCart={handleAddToCart}
          onBuyAll={handleBuyAll}
          savedLists={savedLists}
        />
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Empty State</h2>
        <MainComponent 
          items={[]}
          onSaveList={handleSaveList}
          onShareList={handleShareList}
          onAddToCart={handleAddToCart}
          onBuyAll={handleBuyAll}
          savedLists={savedLists}
        />
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Saved Lists View</h2>
        <MainComponent 
          items={items}
          onQuantityChange={handleQuantityChange}
          onSaveList={handleSaveList}
          onShareList={handleShareList}
          onAddToCart={handleAddToCart}
          onBuyAll={handleBuyAll}
          savedLists={savedLists}
          initialTab="saved"
        />
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">No Saved Lists</h2>
        <MainComponent 
          items={items}
          onQuantityChange={handleQuantityChange}
          onSaveList={handleSaveList}
          onShareList={handleShareList}
          onAddToCart={handleAddToCart}
          onBuyAll={handleBuyAll}
          savedLists={[]}
          initialTab="saved"
        />
      </div>
    </div>
  );
});
}