import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from "react"
import isEqual from "lodash/isEqual"

interface Props<T = string>{
  options: {
    value: T,
    label: React.ReactNode | string,
    info?: string,
  }[]
  value: T
  onSelect: (value: T) => void
  placeholder?: string
  size?: "l" | "m" | "s"
  type?: "color" | "outline"
  className?: string
  contentClassName?: string
  error?: boolean
  fill?: boolean
  maxHeight?: number
  fixedWidth?: boolean
  fullWidth?: boolean
  align?: "center" | "start" | "end"
  leftSlotType?: "col" | "row"
}

/** DropdownMenu */
function Index<T>(
  props: Props<T> & { ref?: React.ForwardedRef<HTMLButtonElement> }
) {
  return <Select {...(props as unknown as Props<string>)} />
}

const Select = forwardRef<HTMLButtonElement|null, Props>(({
  options,
  value,
  onSelect,
  placeholder,
  className,
  contentClassName,
  size = "m",
  type = "color",
  error,
  fill,
  maxHeight,
  fixedWidth,
  fullWidth,
  align = "start",
  leftSlotType = "col",
  ...rest
}, ref) => {
  const currentOption = useMemo(() => options.find((option) => typeof value === "string" ? option.value === value : isEqual(option.value, value)) || null, [options, value])
  const displayLabel = currentOption && currentOption.label || placeholder || "Select..."
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [width, setWidth] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth)
    }
  }, [currentOption, triggerRef.current])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild ref={ref} {...rest} >
        <button
          className={`select-button ${className} ${error ? "error" : ""} ${fill ? "fill" : ""} ${type} ${size}`}
          color="neutralGrey"
          ref={triggerRef}
        >
          <span>{displayLabel}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" width="16" height="16">
            <path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9H7l4 4.5L15 9Z"></path>
          </svg>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          style={maxHeight
            ? {
                maxHeight: `${maxHeight}px`,
                width: fullWidth ? `${width}px` : ""
              }
            : {
                width: fullWidth ? `${width}px` : ""
              }
          }
          align={align}
          side='bottom'
          className={`dropdown-container-wrapper ${contentClassName} ${size} ${fixedWidth ? "fixed-width" : ""}`}
        >
          {options.map((item, index) => {
            return (
              <DropdownMenu.Item
                key={index}
                className="item"
                onSelect={(e)=>{
                  e.stopPropagation()
                  onSelect(item.value)
                }}
              >
                <div className={`left-slot ${leftSlotType}`}>
                  <div className="label">{item.label}</div>
                  {item.info &&
                    <div className="info">{item.info}</div>
                  }
                </div>
                <div className="right-slot">
                  { value === item.value &&
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 22" width="22" height="22">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="m4.67 10.424 4.374 4.748 8.478-7.678"></path>
                    </svg>
                  }
                </div>
              </DropdownMenu.Item>
            )
          })}

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
})

Select.displayName = "Select"
export default Index