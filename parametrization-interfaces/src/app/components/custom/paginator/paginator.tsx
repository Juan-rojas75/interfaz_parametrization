"use client";

import { Paginator } from "./interfaces/paginator.interface";


export default function PaginatorPage( {paginator, changePage}: Readonly<Paginator>) {

    return (
      <article className="flex gap-2 items-center justify-center">
        {paginator.page > 1 &&
            <button onClick={() => changePage(paginator.page - 1)}className="items-center flex text-sm px-2 bg-primary-200 duration-300 font-semibold h-7 hover:bg-primary-900 hover:text-secondary-200 justify-center mr-2 rounded-full text-primary transition-colors w-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10 22L0 12L10 2l1.775 1.775L3.55 12l8.225 8.225z"/></svg>
            </button>
        }

        <div className="flex gap-2">
            {paginator.page > 1 && 
                <button onClick={() => changePage(paginator.page - 1)} className="items-center flex text-sm px-2 bg-primary-200 duration-300 font-semibold h-7 hover:bg-primary-900 hover:text-secondary-200 justify-center mr-2 rounded-full text-primary transition-colors w-7">
                    <span>{paginator.page - 1}</span>
                </button>
            }
            <button className="items-center flex text-sm px-2 bg-primary-400 duration-300 font-semibold h-7 hover:bg-primary-900 hover:text-secondary-200 justify-center mr-2 rounded-full text-primary transition-colors w-7">
                <span>{paginator.page}</span>
            </button>
            {paginator.page + 1 <= paginator.pages &&
            <button onClick={() => changePage(paginator.page + 1)} className="items-center flex text-sm px-2 bg-primary-200 duration-300 font-semibold h-7 hover:bg-primary-900 hover:text-secondary-200 justify-center mr-2 rounded-full text-primary transition-colors w-7">
                    <span>{paginator.page + 1}</span>
            </button>
        }
        </div>

        {paginator.page + 1 <= paginator.pages &&
            <button onClick={() => changePage(paginator.page + 1)} className="items-center flex text-sm px-2 bg-primary-200 duration-300 font-semibold h-7 hover:bg-primary-900 hover:text-secondary-200 justify-center mr-2 rounded-full text-primary transition-colors w-7">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2l10 10z"/></svg>
            </button>
        }
        <span className="text-primary-950 text-sm">Mostrando {paginator.items_per_page} de {paginator.total}</span>

      </article>
    );
  }