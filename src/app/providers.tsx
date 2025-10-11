'use client'

import { ThemeProvider } from '@/components/ui/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip-provider'
import { Toaster } from '@/components/ui/toaster'
import { TRPCReactProvider } from '@/trpc/client'

type ProvidersProps = {
  children: React.ReactNode
}

const Providers = (props: ProvidersProps) => {
  const { children } = props

  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem
        enableColorScheme
        disableTransitionOnChange
      >
        <TooltipProvider>
          {children}
          <Toaster
            toastOptions={{
              duration: 2500
            }}
            visibleToasts={5}
            expand
          />
        </TooltipProvider>
      </ThemeProvider>
    </TRPCReactProvider>
  )
}

export default Providers