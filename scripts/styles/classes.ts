export type CssClass =
  | 'Description_argument'
  | 'Description'
  | 'SubHeader'
  | 'flex'
  | 'flex-row'
  | 'flex-col'
  | 'gap-0'
  | 'gap-px'
  | 'gap-0.5'
  | 'gap-1'
  | 'gap-2'
  | 'gap-3'
  | 'gap-4'
  | 'gap-5'
  | 'gap-6'
  | 'gap-8'
  | 'text-xs'
  | 'text-sm'
  | 'text-base'
  | 'text-lg'
  | 'text-xl'
  | 'text-2xl'
  | 'text-3xl'
  | 'text-4xl'
  | 'font-bold'
  | 'font-sans'
  | 'font-mono'
  | 'font-serif'
  | 'italic'
  | 'border-white'
  | 'border-gray-50'
  | 'border-gray-100'
  | 'border-gray-200'
  | 'border-gray-300'
  | 'border-gray-400'
  | 'border-gray-500'
  | 'border-gray-600'
  | 'border-gray-700'
  | 'border-gray-800'
  | 'border-gray-900'
  | 'border-gray-950'
  | 'border-black'
  | 'border-solid'
  | 'border-dashed'
  | 'border-dotted'
  | 'border-double'
  | 'border-hidden'
  | 'border-0'
  | 'border-2'
  | 'border-3'
  | 'border-4'
  | 'border-8'
  | 'border'
  | 'border-x-0'
  | 'border-x-2'
  | 'border-x-3'
  | 'border-x-4'
  | 'border-x-8'
  | 'border-x'
  | 'border-y-0'
  | 'border-y-2'
  | 'border-y-3'
  | 'border-y-4'
  | 'border-y-8'
  | 'border-y'
  | 'border-t-0'
  | 'border-t-2'
  | 'border-t-3'
  | 'border-t-4'
  | 'border-t-8'
  | 'border-t'
  | 'border-r-0'
  | 'border-r-2'
  | 'border-r-3'
  | 'border-r-4'
  | 'border-r-8'
  | 'border-r'
  | 'border-b-0'
  | 'border-b-2'
  | 'border-b-3'
  | 'border-b-4'
  | 'border-b-8'
  | 'border-b'
  | 'border-l-0'
  | 'border-l-2'
  | 'border-l-3'
  | 'border-l-4'
  | 'border-l-8'
  | 'border-l'
  | 'border-none'
  | 'color-white'
  | 'color-gray-50'
  | 'color-gray-100'
  | 'color-gray-200'
  | 'color-gray-300'
  | 'color-gray-400'
  | 'color-gray-500'
  | 'color-gray-600'
  | 'color-gray-700'
  | 'color-gray-800'
  | 'color-gray-900'
  | 'color-gray-950'
  | 'color-black'
  | 'color-Comment'
  | 'color-Parameter'
  | 'color-FunctionName'
  | 'color-Name'
  | 'color-Number'
  | 'color-String'
  | 'color-Keyword'
  | 'justify-normal'
  | 'justify-start'
  | 'justify-end'
  | 'justify-center'
  | 'justify-between'
  | 'justify-around'
  | 'justify-evenly'
  | 'justify-stretch'
  | 'justify-items-start'
  | 'justify-items-end'
  | 'justify-items-center'
  | 'justify-items-stretch'
  | 'justify-self-auto'
  | 'justify-self-start'
  | 'justify-self-end'
  | 'justify-self-center'
  | 'justify-self-stretch'
  | 'content-normal'
  | 'content-center'
  | 'content-start'
  | 'content-end'
  | 'content-between'
  | 'content-around'
  | 'content-evenly'
  | 'content-baseline'
  | 'content-stretch'
  | 'items-start'
  | 'items-end'
  | 'items-center'
  | 'items-baseline'
  | 'items-stretch'
  | 'self-auto'
  | 'self-start'
  | 'self-end'
  | 'self-center'
  | 'self-stretch'
  | 'self-baseline'
  | 'align-baseline'
  | 'align-top'
  | 'align-middle'
  | 'align-bottom'
  | 'align-text-top'
  | 'align-text-bottom'
  | 'align-sub'
  | 'align-super'
  | 'text-left'
  | 'text-center'
  | 'text-right'
  | 'text-justify'
  | 'text-start'
  | 'text-end'
  | 'cursor-auto'
  | 'cursor-default'
  | 'cursor-pointer'
  | 'cursor-wait'
  | 'cursor-text'
  | 'cursor-move'
  | 'cursor-help'
  | 'cursor-not-allowed'
  | 'whitespace-normal'
  | 'whitespace-nowrap'
  | 'whitespace-pre'
  | 'whitespace-pre-line'
  | 'whitespace-pre-wrap'
  | 'whitespace-break-spaces'
  | 'm-0'
  | 'm-px'
  | 'm-0.5'
  | 'm-1'
  | 'm-2'
  | 'm-3'
  | 'm-4'
  | 'm-5'
  | 'm-6'
  | 'm-8'
  | 'my-0'
  | 'my-px'
  | 'my-0.5'
  | 'my-1'
  | 'my-2'
  | 'my-3'
  | 'my-4'
  | 'my-5'
  | 'my-6'
  | 'my-8'
  | 'mx-0'
  | 'mx-px'
  | 'mx-0.5'
  | 'mx-1'
  | 'mx-2'
  | 'mx-3'
  | 'mx-4'
  | 'mx-5'
  | 'mx-6'
  | 'mx-8'
  | 'mt-0'
  | 'mt-px'
  | 'mt-0.5'
  | 'mt-1'
  | 'mt-2'
  | 'mt-3'
  | 'mt-4'
  | 'mt-5'
  | 'mt-6'
  | 'mt-8'
  | 'mr-0'
  | 'mr-px'
  | 'mr-0.5'
  | 'mr-1'
  | 'mr-2'
  | 'mr-3'
  | 'mr-4'
  | 'mr-5'
  | 'mr-6'
  | 'mr-8'
  | 'mb-0'
  | 'mb-px'
  | 'mb-0.5'
  | 'mb-1'
  | 'mb-2'
  | 'mb-3'
  | 'mb-4'
  | 'mb-5'
  | 'mb-6'
  | 'mb-8'
  | 'ml-0'
  | 'ml-px'
  | 'ml-0.5'
  | 'ml-1'
  | 'ml-2'
  | 'ml-3'
  | 'ml-4'
  | 'ml-5'
  | 'ml-6'
  | 'ml-8'
  | 'p-0'
  | 'p-px'
  | 'p-0.5'
  | 'p-1'
  | 'p-2'
  | 'p-3'
  | 'p-4'
  | 'p-5'
  | 'p-6'
  | 'p-8'
  | 'py-0'
  | 'py-px'
  | 'py-0.5'
  | 'py-1'
  | 'py-2'
  | 'py-3'
  | 'py-4'
  | 'py-5'
  | 'py-6'
  | 'py-8'
  | 'px-0'
  | 'px-px'
  | 'px-0.5'
  | 'px-1'
  | 'px-2'
  | 'px-3'
  | 'px-4'
  | 'px-5'
  | 'px-6'
  | 'px-8'
  | 'pt-0'
  | 'pt-px'
  | 'pt-0.5'
  | 'pt-1'
  | 'pt-2'
  | 'pt-3'
  | 'pt-4'
  | 'pt-5'
  | 'pt-6'
  | 'pt-8'
  | 'pr-0'
  | 'pr-px'
  | 'pr-0.5'
  | 'pr-1'
  | 'pr-2'
  | 'pr-3'
  | 'pr-4'
  | 'pr-5'
  | 'pr-6'
  | 'pr-8'
  | 'pb-0'
  | 'pb-px'
  | 'pb-0.5'
  | 'pb-1'
  | 'pb-2'
  | 'pb-3'
  | 'pb-4'
  | 'pb-5'
  | 'pb-6'
  | 'pb-8'
  | 'pl-0'
  | 'pl-px'
  | 'pl-0.5'
  | 'pl-1'
  | 'pl-2'
  | 'pl-3'
  | 'pl-4'
  | 'pl-5'
  | 'pl-6'
  | 'pl-8'
