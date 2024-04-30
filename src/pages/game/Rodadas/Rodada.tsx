import { ArrowTrendingUpIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export type RoundDetails = {
    id: string;
    nEuro: string;
    retribuicao: string;
    qntRetribuicao: string;
    nRodada: string;
    gameRule: null | string;
    groupId: string;
    data: string;
};

export function Rodada() {
    const { groupId, nRodada } = useParams();
    const [roundDetails, setRoundDetails] = useState<RoundDetails | null>(null);
    const navigate = useNavigate();

    const handleAplicarClick = () => {
        navigate(`/rodada/${groupId}/round/${nRodada}/aplicar`);
    };

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

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="mb-4 flex h-44 w-80 flex-col justify-center rounded-2xl bg-orange-500 px-8 pb-8 pt-6 shadow-md">
                <div>
                    <h1 className="text-xl text-white">nEuro em conta</h1>
                </div>
                <div>
                    <h2 className="mt-5 text-4xl text-white">
                        {roundDetails
                            ? `N$ ${roundDetails.nEuro}`
                            : 'Carregando...'}
                    </h2>
                </div>
            </div>
            <div className="mb-4 flex w-64 justify-center rounded-lg bg-white py-3 shadow-md">
                <button
                    className="flex items-center text-xl text-black"
                    onClick={handleAplicarClick}
                >
                    <ArrowTrendingUpIcon className="mr-5 h-5 w-5" />
                    Aplicar
                </button>
            </div>
            <div className="mb-4 flex w-64 justify-center rounded-lg bg-white py-3 shadow-md">
                <button className="flex items-center text-xl text-black">
                    Manter
                </button>
            </div>

            <div className="mt-20 flex flex-col text-3xl">
                <h1 className="text-white">Total de rendimento</h1>
                <div className="flex">
                    <div className="text-green-500">
                        <ArrowUpIcon className="h-8 w-8" />
                    </div>
                    <h1 className="text-green-500">N$ 0,00</h1>
                </div>
            </div>

            <div className="mt-20 flex w-80 flex-col justify-center gap-2 rounded-lg bg-white py-3 text-center shadow-md">
                <div>
                    <h2 className="text-lg">Fundo retido</h2>
                    <h1 className="text-3xl">N$ 0,00</h1>
                </div>
                <div className="mx-4 border-l" />
                <div>
                    <h2 className="text-lg">Número total de participantes</h2>
                    <h1 className="text-3xl">20</h1>
                </div>
            </div>
        </div>
    );
}
