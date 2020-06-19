import React, { useState, useEffect, useContext } from 'react'

import { GlobalStateContext } from '../utils/GlobalStateContext'

export default function EducationalFunction() {
    const [kukizNumber, setKukizNumber] = useState(0)
    const [korwinNumber, setKorwinNumber] = useState(0)

    const cookies = (event) => {
        setKukizNumber((prevValue) => prevValue + 1)
    }

    const korwins = (event) => {
        setKorwinNumber(korwinNumber + 1)
    }

    useEffect(() => {
        console.log('pupa nietoperza')
        const interval = setInterval(cookies, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const [wartosc, double] = usePies(5)

    const { login, password, setLogin, setPassword } = useContext(
        GlobalStateContext
    )

    return (
        <div>
            Hej {login}! <br />
            Liczba Kukizów: {kukizNumber}
            <br />
            Liczba Korwinów: {korwinNumber}
            <br />
            <button onClick={cookies}>Kliknij żeby namnożyć Kukizy</button>
            <button onClick={korwins}>Kliknij żeby namnożyć Korwinów</button>
            <br />
            Podaj imię: <input value={login} onChange={setLogin} />
            Podaj 2 imię: <input value={password} onChange={setPassword} />
            <button
                onClick={() => {
                    double(6)
                }}
            ></button>
        </div>
    )
}

function usePies(initialValue) {
    const [wartosc, setState] = useState(initialValue)
    const double = (costam) => {
        setState(costam * 2)
    }

    return [wartosc, double]
}
