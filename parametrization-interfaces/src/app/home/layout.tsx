import { Sidebar } from "../components/layout/sidebar";

import { ReactNode } from 'react';

export default function Layout({ children }: { readonly children: ReactNode }) {
  return (
    <article className="flex w-full">
        <Sidebar/>
        <section className="max-h-screen w-full overflow-y-auto">
          {children}
        </section>
    </article>
  )
}