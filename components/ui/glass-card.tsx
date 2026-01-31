import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface GlassCardProps extends React.ComponentProps<typeof Card> {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}

export function GlassCard({ className, children, gradient = false, ...props }: GlassCardProps) {
    return (
        <Card
            className={cn(
                "bg-white/80 backdrop-blur-xl border-white/20 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
                gradient && "bg-gradient-to-br from-white/90 to-white/50 border-t-white/50 border-l-white/50",
                className
            )}
            {...props}
        >
            {children}
        </Card>
    );
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
