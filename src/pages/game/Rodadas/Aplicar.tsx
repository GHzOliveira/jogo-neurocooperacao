import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoundDetails } from './Rodada';
import { Socket, io } from 'socket.io-client';

export function Aplicar() {
    const { groupId, nRodada } = useParams();
    const [roundDetails, setRoundDetails] = useState<RoundDetails | null>(null);
    const [applyValue, setApplyValue] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(
                `Conectado ao servidor Socket.io com o ID ${newSocket.id}`,
            );
        });

        newSocket.on('error', (message) => {
            console.error(message);
        });

        newSocket.on('storedMessage', async (message) => {
            console.log('Mensagem recebida do servidor:', message);
            setMessage(message);
            setShowModal(false);
            let nextRound = parseInt(nRodada ?? '0') + 1;
            while (true) {
                try {
                    const response = await axios.get(
                        `http://localhost:3333/group/${groupId}/round/${nextRound}`,
                    );
                    if (response.data) {
                        navigate(`/rodada/${groupId}/round/${nextRound}`, {
                            state: { nEuro: roundDetails?.nEuro },
                        });
                        nextRound++;
                    } else {
                        window.location.href = 'http://localhost:5173';
                        break;
                    }
                } catch (error) {
                    console.error(
                        `Erro ao verificar a existência da rodada ${nextRound}: ${error}`,
                    );
                    break;
                }
            }
        });
    }, []);

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

    const applyNEuro = async () => {
        try {
            await axios.patch(
                `http://localhost:3333/group/${groupId}/applyNEuro`,
                {
                    nEuro: applyValue.toString(),
                },
            );
            setErrorMessage('');
            setShowModal(true);
        } catch (error) {
            console.error(`Erro ao aplicar nEuro: ${error}`);
            setErrorMessage(
                'Houve um erro ao aplicar nEuro. Por favor, tente novamente.',
            );
        }
    };

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
                disabled={!!errorMessage}
                onClick={applyNEuro}
            >
                Aplicar nEuro
            </button>
            {showModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 transition-opacity"
                            aria-hidden="true"
                        >
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:h-screen sm:align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3
                                            className="text-lg font-medium leading-6 text-gray-900"
                                            id="modal-title"
                                        >
                                            Fundo aplicado com sucesso
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Aguardando administrador
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
