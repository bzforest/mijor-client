/* ===== Component: CreditCardForm ===== */
/* Responsibility: Render input fields for credit card details and collect form state */

import InputField from "@/components/ui/InputField"
import { useState, useEffect } from "react"

type CreditCardFormProps = {
    onchange?: (value: any) => void
}

export default function CreditCardForm({ onchange }: CreditCardFormProps) {
    const [cardnumber, setCardnumber] = useState<string>("")
    const [cardOwner, setCardOwner] = useState<string>("")
    const [expiryDate, setExpiryDate] = useState<string>("")
    const [cvc, setCvc] = useState<string>("")
    const [numberError, setNumberError] = useState<string>("")
    const [ownerError, setOwnerError] = useState<string>("")
    const [expiryError, setExpiryError] = useState<string>("")
    const [cvcError, setCvcError] = useState<string>("")

    const handleCardNumberChange = (value: string) => {
        // Allow only digits and spaces for temporary value
        if (!/^[0-9 ]*$/.test(value)) {
            setNumberError("Card number is not valid")
            return
        }

        const cleanValue = value.replace(/\s/g, "")
        if (cleanValue.length > 16 && cleanValue.length > 0) {
            return
        }

        // Format: Add space every 4 digits
        const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ");

        setNumberError("")
        setCardnumber(formattedValue)
    }

    const handleCardOwnerChange = (value: string) => {
        if (!/^[a-zA-Z ]*$/.test(value)) {
            setOwnerError("Card owner name is not valid")
            return
        }
        if (value.length === 0) {
            setOwnerError("Card owner name is required")
        } else {
            setOwnerError("")
        }
        setCardOwner(value)
    }


    const handleExpiryDateChange = (value: string) => {
        if (!/^[0-9 /]*$/.test(value)) {
            setExpiryError("Expiry date is not valid")
            return
        }

        // Remove all non-digit characters
        const cleanValue = value.replace(/\D/g, "")

        // Support only maximum 4 digits for MMYY
        if (cleanValue.length > 4 && cleanValue.length > 0) {
            return
        }

        let formattedValue = cleanValue

        // Auto format to MM / YY
        if (cleanValue.length >= 3) {
            formattedValue = `${cleanValue.slice(0, 2)} / ${cleanValue.slice(2, 4)}`
        } else if (cleanValue.length === 2 && value.length > expiryDate.length) {
            // Automatically add " / " after completing the month
            formattedValue = `${cleanValue} / `
        }

        setExpiryError("")
        setExpiryDate(formattedValue)
    }

    const handleCvcChange = (value: string) => {
        if (!/^[0-9]*$/.test(value)) {
            setCvcError("CVC is not valid")
            return
        }

        if (value.length > 3 && value.length > 0) {
            return
        }

        setCvcError("")
        setCvc(value)
    }

    useEffect(() => {
        const cleanCardNumber = cardnumber.replace(/\s/g, "")
        const cleanExpiryDate = expiryDate.replace(/\D/g, "")

        const isCardNumberValid = cleanCardNumber.length === 16 && !numberError
        const isOwnerValid = cardOwner.length > 0 && !ownerError
        const isExpiryValid = cleanExpiryDate.length === 4 && !expiryError
        const isCvcValid = cvc.length === 3 && !cvcError

        const isValid = isCardNumberValid && isOwnerValid && isExpiryValid && isCvcValid

        onchange?.({
            cardnumber,
            cardOwner,
            expiryDate,
            cvc,
            isValid
        })
    }, [cardnumber, cardOwner, expiryDate, cvc, onchange, numberError, ownerError, expiryError, cvcError])

    return (
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-2 gap-10">
            <div>
                <InputField
                    label="Card number"
                    placeholder="XXXX XXXX XXXX XXXX"
                    type="text"
                    text={cardnumber}
                    onChange={handleCardNumberChange}
                    correct={numberError ? false : true}
                    onClear={() => setCardnumber("")}
                />
                {numberError && <p className="text-red-500 text-sm">{numberError}</p>}
            </div>
            <div>
                <InputField
                    label="Card owner"
                    placeholder="Name"
                    type="text"
                    text={cardOwner}
                    onChange={handleCardOwnerChange}
                    correct={ownerError ? false : true}
                    onClear={() => setCardOwner("")}
                />
                {ownerError && <p className="text-red-500 text-sm">{ownerError}</p>}
            </div>
            <div>
                <InputField
                    label="Expiry date"
                    placeholder="MM / YY"
                    type="text"
                    text={expiryDate}
                    onChange={handleExpiryDateChange}
                    correct={expiryError ? false : true}
                    onClear={() => setExpiryDate("")}
                />
                {expiryError && <p className="text-red-500 text-sm">{expiryError}</p>}
            </div>
            <div>
                <InputField
                    label="CVC"
                    placeholder="XXX"
                    type="text"
                    text={cvc}
                    onChange={handleCvcChange}
                    correct={cvcError ? false : true}
                    onClear={() => setCvc("")}
                />
                {cvcError && <p className="text-red-500 text-sm">{cvcError}</p>}
            </div>
        </form>
    )
}