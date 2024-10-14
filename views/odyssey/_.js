import { motion } from 'framer-motion'

function Link({href, className}) {
  return <a href={href} className={className} />
}
import {useRef, useEffect} from "react";
import {Runtime, Inspector} from "@observablehq/runtime";
import notebook from "@roboticsuniversity/agent-dashboard";
import { ChevronRightIcon } from '@heroicons/react/16/solid'


 function PlusGrid({ className = '', children }) {
  return <div className={className}>{children}</div>
}

 function PlusGridRow({ className = '', children }) {
  return (
    <div
      className={clsx(
        className,
        'group/row relative isolate pt-[calc(theme(spacing.2)+1px)] last:pb-[calc(theme(spacing.2)+1px)]',
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
      >
        <div className="absolute inset-x-0 top-0 border-t border-black/5"></div>
        <div className="absolute inset-x-0 top-2 border-t border-black/5"></div>
        <div className="absolute inset-x-0 bottom-0 hidden border-b border-black/5 group-last/row:block"></div>
        <div className="absolute inset-x-0 bottom-2 hidden border-b border-black/5 group-last/row:block"></div>
      </div>
      {children}
    </div>
  )
}

export function PlusGridItem({ className = '', children }) {
  return (
    <div className={clsx(className, 'group/item relative')}>
      <PlusGridIcon
        placement="top left"
        className="hidden group-first/item:block"
      />
      <PlusGridIcon placement="top right" />
      <PlusGridIcon
        placement="bottom left"
        className="hidden group-last/row:group-first/item:block"
      />
      <PlusGridIcon
        placement="bottom right"
        className="hidden group-last/row:block"
      />
      {children}
    </div>
  )
}

 function PlusGridIcon({ className = '', placement }) {
  let [yAxis, xAxis] = placement.split(' ')

  let yClass = yAxis === 'top' ? '-top-2' : '-bottom-2'
  let xClass = xAxis === 'left' ? '-left-2' : '-right-2'

  return (
    <svg
      viewBox="0 0 15 15"
      aria-hidden="true"
      className={clsx(
        className,
        'absolute size-[15px] fill-black/10',
        yClass,
        xClass,
      )}
    >
      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
    </svg>
  )
}

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { Logo } from './logo'

const links = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/company', label: 'Company' },
  { href: '/blog', label: 'Blog' },
  { href: '/login', label: 'Login' },
]

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex">
      {links.map(({ href, label }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-[hover]:bg-black/[2.5%]"
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
    </nav>
  )
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-[hover]:bg-black/5 lg:hidden"
      aria-label="Open main menu"
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  )
}

function MobileNav() {
  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link href={href} className="text-base font-medium text-gray-950">
              {label}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner }) {
  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="Home">
                <Logo className="h-9" />
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav />
          <MobileNavButton />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav />
    </Disclosure>
  )
}




// use lots of negative space ---??? maybe ---- try ------ clairty js to see how people fele? 

// also ->>> experiment with alayouts and make it easy to swap layouts super easy 

// prompt -> gen codde -> 3 widgets -> replace them as wyou swish -> radio 

import * as Headless from '@headlessui/react'


export function Container({ className, children }) {
  return (
    <div className={clsx(className, 'px-6 lg:px-8')}>
      <div className="mx-auto max-w-2xl lg:max-w-7xl">{children}</div>
    </div>
  )
}
const variants = {
  primary: clsx(
    'inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)]',
    'rounded-full border border-transparent bg-gray-950 shadow-md',
    'whitespace-nowrap text-base font-medium text-white',
    'data-[disabled]:bg-gray-950 data-[hover]:bg-gray-800 data-[disabled]:opacity-40',
  ),
  secondary: clsx(
    'relative inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)]',
    'rounded-full border border-transparent bg-white/15 shadow-md ring-1 ring-[#D15052]/15',
    'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_#ffffff4d]',
    'whitespace-nowrap text-base font-medium text-gray-950',
    'data-[disabled]:bg-white/15 data-[hover]:bg-white/20 data-[disabled]:opacity-40',
  ),
  outline: clsx(
    'inline-flex items-center justify-center px-2 py-[calc(theme(spacing.[1.5])-1px)]',
    'rounded-lg border border-transparent shadow ring-1 ring-black/10',
    'whitespace-nowrap text-sm font-medium text-gray-950',
    'data-[disabled]:bg-transparent data-[hover]:bg-gray-50 data-[disabled]:opacity-40',
  ),
}

export function Button({ variant = 'primary', className, ...props }) {
  className = clsx(className, variants[variant])

  if (typeof props.href === 'undefined') {
    return <Headless.Button {...props} className={className} />
  }

  return <Link {...props} className={className} />
}

import { clsx } from 'clsx'

export function Gradient({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-[linear-gradient(115deg,var(--tw-gradient-stops))] from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff] sm:bg-[linear-gradient(145deg,var(--tw-gradient-stops))]',
      )}
    />
  )
}

export function GradientBackground() {
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -right-60 -top-44 h-60 w-[36rem] transform-gpu md:right-0',
          'bg-[linear-gradient(115deg,var(--tw-gradient-stops))] from-[#fff1be] from-[28%] via-[#ee87cb] via-[70%] to-[#b060ff]',
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}



function FirstShit() {
  return <div className="relative">
  <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-inset ring-black/5" />
  <Container className="relative">
    <Navbar
      banner={
        <Link
          href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
          className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-[hover]:bg-fuchsia-950/30"
        >
          Radiant raises $100M Series A from Tailwind Ventures
          <ChevronRightIcon className="size-4" />
        </Link>
      }
    />
    <div className="pb-24 pt-16 sm:pb-32 sm:pt-24 md:pb-48 md:pt-32">
      <h1 className="font-display text-balance text-6xl/[0.9] font-medium tracking-tight text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
        Close every deal.
      </h1>
      <p className="mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8">
        Radiant helps you sell more by revealing sensitive information about
        your customers.
      </p>
      <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
        <Button href="#">Get started</Button>
        <Button variant="secondary" href="/pricing">
          See pricing
        </Button>
      </div>
    </div>
  </Container>
</div>
}
