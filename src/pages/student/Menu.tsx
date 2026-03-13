import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Category, MenuItem } from '@/types';
import { Plus, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import StudentLayout from '@/components/StudentLayout';

const categories: { key: Category | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '🍽️' },
  { key: 'snacks', label: 'Snacks', emoji: '🍟' },
  { key: 'meals', label: 'Meals', emoji: '🍛' },
  { key: 'beverages', label: 'Beverages', emoji: '☕' },
];

function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart } = useApp();
  const categoryEmoji = { snacks: '🍟', meals: '🍛', beverages: '☕' };

  return (
    <div className={`glass rounded-2xl p-4 flex flex-col gap-2 transition-all hover:shadow-md ${!item.available ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="text-3xl">{categoryEmoji[item.category]}</div>
        {!item.available && <Badge variant="secondary" className="text-xs">Unavailable</Badge>}
      </div>
      <h3 className="font-display font-bold text-foreground">{item.name}</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock size={14} />
        <span>{item.prepTime} min</span>
      </div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-lg font-bold text-foreground">₹{item.price}</span>
        <Button
          size="sm"
          disabled={!item.available}
          onClick={() => addToCart(item)}
          className="rounded-xl bg-primary hover:bg-primary/80 text-primary-foreground"
        >
          <Plus size={16} />
          Add
        </Button>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { menu, getPopularItems } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [search, setSearch] = useState('');

  const popularItems = getPopularItems();
  const filtered = menu.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <StudentLayout>
      <div className="p-4 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-card border-border"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Popular Items */}
        {popularItems.length > 0 && activeCategory === 'all' && !search && (
          <div>
            <h2 className="font-display font-bold text-lg text-foreground mb-3">🔥 Popular Items</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {popularItems.map(item => (
                <div key={item.id} className="min-w-[140px]">
                  <MenuItemCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Menu Grid */}
        <div>
          <h2 className="font-display font-bold text-lg text-foreground mb-3">
            {activeCategory === 'all' ? 'Full Menu' : categories.find(c => c.key === activeCategory)?.label}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No items found</p>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
