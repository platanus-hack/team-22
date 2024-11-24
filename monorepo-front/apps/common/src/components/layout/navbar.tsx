import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { useEffect, useState } from 'react';

// const NavLink = ({
//   href,
//   children,
//   isActive,
// }: {
//   href: string;
//   children: React.ReactNode;
//   isActive?: boolean;
// }) => (
//   <a
//     href={href}
//     className={cn(
//       'font-medium hover:underline underline-offset-4',
//       'text-sm leading-tight text-neutral-500',
//       isActive && 'text-neutral-700 underline hover:brightness-110'
//     )}
//   >
//     {children}
//   </a>
// );

const DesktopNav = ({ pathname }: { pathname: string }) => (  <nav className="hidden lg:flex justify-between items-center">
    <a href="/">
      <img
        src="/logo.svg"
        className="object-cover h-10 w-auto"
        alt="Logo"
        width={192}
        height={56}
      />
    </a>

    {/* <div className="w-full flex items-center gap-6">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          isActive={pathname === item.href}
        >
          {item.label}
        </NavLink>
      ))}
    </div> */}

    <Button size="lg" className="text-neutral-800 bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] rounded-full hover:opacity-90 shadow-sm hover:shadow-md duration-300 transition-all" asChild>
      <a href="#">
        Empieza ahora
      </a>
    </Button>
  </nav>
);

const MobileNav = ({ pathname }: { pathname: string }) => (
  <div className='block lg:hidden'>
    <div className='flex items-center justify-between gap-4'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon'>
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent
          side='left'
          className='*:p-4 overflow-y-auto h-svh [&_.close]:hidden'
        >
          <SheetHeader className='!p-2'>
            <SheetTitle className='top-0 h-20 w-full justify-between gap-4 flex flex-row items-center'>
              <a href='/'>
                <img
                  src="/logo.svg"
                  className="object-cover h-10 w-auto"
                  alt="Logo"
                  width={192}
                  height={56}
                />
              </a>
            </SheetTitle>
          </SheetHeader>
          {/* <div className="my-4 flex *:text-xl flex-col gap-6 *:text-slate-700">
            {navItems.map((item) => (
              <SheetClose key={item.href} asChild>
                <NavLink href={item.href} isActive={pathname === item.href}>
                  {item.label}
                </NavLink>
              </SheetClose>
            ))}
          </div> */}
        </SheetContent>
      </Sheet>

      <a href='/'>
        <img
          src="/logo.svg"
          className="object-cover h-10 w-auto"
          alt="Logo"
          width={192}
          height={56}
        />
      </a>

      <Button size="lg" className="text-neutral-800 bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec] rounded-full hover:opacity-90 shadow-sm hover:shadow-md duration-300 transition-all" asChild>
        <a href="#">
          Empieza ahora
        </a>
      </Button>
    </div>
  </div>
);

const Navbar = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return (
    <div className="max-w-full z-50 bg-[#FEFAF5] border-b border-neutral-200 sticky w-screen [&_nav]:max-w-screen-xl [&_nav]:mx-auto top-0 px-4 h-20 content-center">
      <DesktopNav pathname={pathname} />
      <MobileNav pathname={pathname} />
    </div>
  );
};

export default Navbar;
