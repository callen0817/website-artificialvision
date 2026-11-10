import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import artificialVisionLogo from "@/assets/artificial-vision-logo-white.png";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const links = [
  { label: "Home", to: "/" },
  { label: "scanAR", to: "/scanar" },
  { label: "AV Suite", to: "/av-suite" },
  { label: "Technology", to: "/technology" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Insights", to: "/insights" },
];

export const SiteNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const suiteMenu = (mobile = false) => <div key="/av-suite" className={cn("flex items-center", mobile && "border-b border-border justify-between")}>
    <NavLink to="/av-suite" className={({ isActive }) => cn("label-mono transition-colors", mobile && "flex-1 py-3", isActive || ["/av-synthesis", "/av-scan"].includes(location.pathname) ? "text-gold" : "text-muted-foreground hover:text-foreground")}>AV Suite</NavLink>
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label="AV Suite products" className="h-8 w-8 text-muted-foreground hover:text-gold"><ChevronDown className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48 rounded-sm">
        <DropdownMenuItem asChild><Link to="/av-synthesis" className="label-mono py-3" onClick={() => setOpen(false)}>AV Synthesis</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link to="/av-scan" className="label-mono py-3" onClick={() => setOpen(false)}>AV Scan</Link></DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-500",
        scrolled || open
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={artificialVisionLogo} alt="Artificial Vision" className="h-7 w-auto invert" />
            <span className="font-display text-[15px] font-semibold tracking-tight text-foreground">
              Artificial Vision
            </span>
          </Link>

          <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-6">
            {links.map((link) => link.to === "/av-suite" ? suiteMenu() : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "label-mono transition-colors",
                    isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>


          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="xl:hidden text-foreground -mr-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {open && (
          <nav aria-label="Mobile navigation" className="xl:hidden pb-6 pt-2 flex flex-col gap-1">
            {links.map((link) => link.to === "/av-suite" ? suiteMenu(true) : (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "label-mono py-3 border-b border-border",
                    isActive ? "text-gold" : "text-muted-foreground"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default SiteNav;