import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, ChefHat } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen pastel-gradient flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <div className="text-6xl">🍽️</div>
        <h1 className="text-4xl font-display font-bold text-foreground">CampusBites</h1>
        <p className="text-muted-foreground text-lg">
          Skip the queue. Pre-order your campus canteen food and pick it up when it's ready.
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <Link to="/student/menu">
            <Button className="w-full rounded-xl py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/80">
              <GraduationCap className="mr-2" size={22} />
              I'm a Student
            </Button>
          </Link>
          <Link to="/staff/dashboard">
            <Button variant="outline" className="w-full rounded-xl py-6 text-lg font-bold border-2 border-primary/30 text-foreground hover:bg-primary/10">
              <ChefHat className="mr-2" size={22} />
              Canteen Staff
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          No login required · Just order & go
        </p>
      </div>
    </div>
  );
}
