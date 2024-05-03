import { ArrowTrendingUpIcon } from '@heroicons/react/16/solid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../../context/store';

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
    const userId = useStore((state) => state.userId);
    const [roundDetails, setRoundDetails] = useState<RoundDetails | null>(null);
    const [, setUserNames] = useState<string[]>([]);
    const [fundoRetido, setFundoRetido] = useState('0');
    const [highestNRodada, setHighestNRodada] = useState<string>('');
    const navigate = useNavigate();

    const handleAplicarClick = () => {
        navigate(`/rodada/${groupId}/round/${nRodada}/aplicar`);
    };

    const handleEnviarExtratoClick = () => {
        navigate(`/rodada/${groupId}/round/${nRodada}/extrato`);
    };

    useEffect(() => {
        const fetchLastNRodada = async () => {
            try {
                const response = await axios.get(
                    `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/highest-nrodada`,
                );
                setHighestNRodada(response.data);
            } catch (error) {
                console.error(`Erro ao buscar a última nRodada: ${error}`);
            }
        };

        fetchLastNRodada();
    }, [groupId]);

    useEffect(() => {
        const fetchRoundDetails = async () => {
            try {
                const response = await axios.get(
                    `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/round/${nRodada}`,
                );
                let nEuroValue = response.data.nEuro;
                if (nRodada !== '1' && userId) {
                    const userResponse = await axios.get(
                        `https://neurocoop-backend-2225c4ca4682.herokuapp.com/user/${userId}`,
                    );
                    nEuroValue = userResponse.data.nEuro;
                }
                setRoundDetails({ ...response.data, nEuro: nEuroValue });

                async () => {
                    try {
                        const response = await axios.get(
                            'https://neurocoop-backend-2225c4ca4682.herokuapp.com/users',
                        );
                        const names = response.data.map(
                            (user: any) => user.nome,
                        );
                        setUserNames(names);
                    } catch (error) {
                        console.error(
                            `Erro ao buscar nomes dos usuários: ${error}`,
                        );
                    }
                };
            } catch (error) {
                console.error(`Erro ao buscar detalhes da rodada: ${error}`);
            }
        };

        fetchRoundDetails();
    }, [groupId, nRodada, userId]);

    useEffect(() => {
        const fetchFundoRetido = async () => {
            try {
                const response = await axios.get(
                    `https://neurocoop-backend-2225c4ca4682.herokuapp.com/group/${groupId}/value/fundoRetido`,
                );
                setFundoRetido(response.data);
            } catch (error) {
                console.error(`Erro ao buscar fundo retido: ${error}`);
            }
        };

        fetchFundoRetido();
    }, [groupId]);

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
                {nRodada !== highestNRodada.toString() && (
                    <button
                        className="flex items-center text-xl text-black"
                        onClick={handleAplicarClick}
                    >
                        <ArrowTrendingUpIcon className="mr-5 h-5 w-5" />
                        Aplicar ou Manter
                    </button>
                )}
                {nRodada === highestNRodada.toString() && (
                    <button
                        className="flex items-center text-xl text-black"
                        onClick={handleEnviarExtratoClick}
                    >
                        Enviar extrato
                    </button>
                )}
            </div>
            {nRodada === highestNRodada.toString() && (
                <div className="overflow-wrap h-33 font-regular mt-10 flex w-[15rem] flex-col break-all rounded-xl bg-orange-500 p-2 text-lg text-white">
                    <div>
                        <p>
                            Cada pessoa terá um valor diferente em sua carteira.
                        </p>
                        <p>
                            Este valor é feito o câmbio na proporção de 1 para 1
                        </p>
                        <p>e cada um pode escolher 1 livro para adquirir</p>
                        <p>utilizando seu saldo de</p>
                        <p>nEUROS</p>
                    </div>
                </div>
            )}

            <div className="mt-20 flex w-80 flex-col justify-center gap-2 rounded-lg bg-white py-3 text-center shadow-md">
                <div>
                    <h2 className="text-lg">Fundo retido</h2>
                    <h1 className="text-3xl">{`N$ ${fundoRetido}`}</h1>
                </div>
                <div className="mx-4 border-l" />
            </div>
        </div>
    );
}
