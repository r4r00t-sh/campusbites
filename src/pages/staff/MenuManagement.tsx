import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Category, MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StaffLayout from '@/components/StaffLayout';
import { Plus, Pencil } from 'lucide-react';

export default function StaffMenuManagement() {
  const { menu, updateMenuItem, addMenuItem } = useApp();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: '', category: 'snacks' as Category, price: '', prepTime: '' });

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: '', category: 'snacks', price: '', prepTime: '' });
    setOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({ name: item.name, category: item.category, price: String(item.price), prepTime: String(item.prepTime) });
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.prepTime) return;
    if (editItem) {
      updateMenuItem({ ...editItem, name: form.name, category: form.category, price: Number(form.price), prepTime: Number(form.prepTime) });
    } else {
      addMenuItem({ name: form.name, category: form.category, price: Number(form.price), prepTime: Number(form.prepTime), available: true });
    }
    setOpen(false);
  };

  return (
    <StaffLayout>
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-foreground">Menu Management</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="rounded-xl bg-primary text-primary-foreground">
                <Plus size={16} className="mr-1" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-display">{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Item name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl" />
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as Category }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="snacks">Snacks</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Price (₹)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="rounded-xl" />
                <Input placeholder="Prep time (min)" type="number" value={form.prepTime} onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))} className="rounded-xl" />
                <Button onClick={handleSubmit} className="w-full rounded-xl bg-mint text-mint-foreground hover:bg-mint/80">
                  {editItem ? 'Save Changes' : 'Add Item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {menu.map(item => (
            <div key={item.id} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded-full">{item.category}</span>
                </div>
                <p className="text-sm text-muted-foreground">₹{item.price} · {item.prepTime} min</p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={item.available}
                  onCheckedChange={checked => updateMenuItem({ ...item, available: checked })}
                />
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Pencil size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffLayout>
  );
}
