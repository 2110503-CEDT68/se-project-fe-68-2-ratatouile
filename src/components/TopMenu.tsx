import Image from "next/image";
import TopMenuItem from "./TopMenuItem";
import Link from "next/link";
import { Session } from "next-auth";

type TopMenuProps = {
  session: Session | null;
};

export default function TopMenu({ session }: TopMenuProps) {
  return (
    <main className="ds-topbar">
      <div className="ds-shell ds-topbar__content">
        <div className="relative ml-2 h-12 w-12">
          <Image
            src="/LogoDark.png"
            alt="logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="ds-nav-cluster">
          <TopMenuItem title="Home" pageRef="/" />
          <TopMenuItem title="Reservation" pageRef="/booking" />
          <TopMenuItem title="Restaurants" pageRef="/restaurants" />
          {session?.user?.role === "admin" ? (
            <TopMenuItem title="Dashboard" pageRef="/dashboard" />
          ) : (
            <TopMenuItem title="My Booking" pageRef="/mybooking" />
          )}
        </div>

        <div className="ds-action-group mx-5">
          {session ? (
            <div className="ds-action-group">
              <div className="text-xl">Hello, {session.user?.name}</div>
              <Link href="/api/auth/signout">
                <div className="ds-button-primary">Sign-Out</div>
              </Link>
            </div>
          ) : (
            <div className="ds-action-group">
              <Link href="/auth/signup">
                <div className="ds-button-secondary">Sign-Up</div>
              </Link>
              <Link href="/auth/signin">
                <div className="ds-button-primary">Sign-in</div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
