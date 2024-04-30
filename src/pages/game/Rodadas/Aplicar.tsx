import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RoundDetails } from './Rodada';

export function Aplicar() {
    const { groupId, nRodada } = useParams();
    const [roundDetails, setRoundDetails] = useState<RoundDetails | null>(null);
    const [applyValue, setApplyValue] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [nEuro, setNEuro] = useState(0);

    useEffect(() => {
        const fetchRoundDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3333/group/${groupId}/round/${nRodada}`,
                );
                setRoundDetails(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(`Erro ao buscar detalhes da rodada: ${error}`);
            }
        };

        fetchRoundDetails();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setApplyValue(value);

        if (roundDetails && value > Number(roundDetails.nEuro)) {
            setErrorMessage('Este valor é maior do que seu saldo disponível');
        } else {
            setErrorMessage('');
        }
    };
    return (
        <div className="mt-32 flex min-h-screen flex-col items-center justify-start">
            <div className="text-white">
                <h1 className="text-4xl">O quanto quer aplicar ?</h1>
                {roundDetails
                    ? `Seu saldo atual é de N$ ${roundDetails.nEuro}`
                    : 'Carregando...'}
            </div>

            <input
                className="mt-5 w-80 border-b border-gray-600 bg-transparent p-5 text-2xl text-white"
                type="number"
                onChange={handleInputChange}
            />
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <button
                type="submit"
                className="mt-96 w-72 rounded-xl bg-[#ff7d0d] p-3 text-2xl text-white"
            >
                Aplicar nEuro
            </button>
        </div>
    );
}
