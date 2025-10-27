// components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


// // components/ui/textarea.tsx
// import * as React from "react"
// import { cn } from "@/lib/utils"

// export interface TextareaProps
//   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ className, ...props }, ref) => {
//     return (
//       <textarea
//         className={cn(
//           "flex min-h-[120px] w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300 resize-none",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Textarea.displayName = "Textarea"

// export { Textarea }


// components/ui/label.tsx
// import * as React from "react"
// import { cn } from "@/lib/utils"

// const Label = React.forwardRef<
//   HTMLLabelElement,
//   React.LabelHTMLAttributes<HTMLLabelElement>
// >(({ className, ...props }, ref) => (
//   <label
//     ref={ref}
//     className={cn(
//       "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block",
//       className
//     )}
//     {...props}
//   />
// ))
// Label.displayName = "Label"

// export { Label }


// // components/ui/select.tsx
// import * as React from "react"
// import { cn } from "@/lib/utils"

// export interface SelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {}

// const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
//   ({ className, children, ...props }, ref) => {
//     return (
//       <select
//         className={cn(
//           "flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:border-black disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10",
//           className
//         )}
//         ref={ref}
//         {...props}
//       >
//         {children}
//       </select>
//     )
//   }
// )
// Select.displayName = "Select"

// export { Select }