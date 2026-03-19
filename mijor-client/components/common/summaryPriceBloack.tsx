type Props = {
    tickets: number
    subtotal: number
    discount: number
    total: number
}

export default function SummaryPriceBlock({ tickets, subtotal, discount, total }: Props) {
      return (
    <div className="p-4 w-full">

      <div className="flex justify-between">
        <span className="text-brand-gray-400 text-body-2">
          {tickets} Tickets
        </span>
        <span className="text-white text-body-1">
          THB {subtotal}
        </span>
      </div>

      {discount > 0 && (
        <div className="flex justify-between">
          <span className="text-brand-gray-400 text-body-2">
            Coupon
          </span>
          <span className="text-red-400 text-body-1">
            -THB {discount}
          </span>
        </div>
      )}

      <div className="border-t border-brand-gray-200 my-3" />

      <div className="flex justify-between">
        <span className="text-white text-body-1 font-semibold">
          Total
        </span>
        <span className="text-white text-body-1 font-semibold">
          THB {total}
        </span>
      </div>

    </div>
  )
}