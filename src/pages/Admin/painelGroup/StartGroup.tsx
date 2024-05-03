import { useNavigate, useParams } from 'react-router-dom';
import PainelAdmin from '../../../components/logo/painelAdmin/PainelAdmin';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useStore } from '../../../context/store';
import axios from 'axios';

export function StartGroup() {
    const { groupId } = useParams();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const setStoreMessage = useStore((state) => state.setMessages);
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const navigate = useNavigate();

    const handleBackClick = (event: React.MouseEvent) => {
        event.preventDefault();
        navigate(-1);
    };

    useEffect(() => {
        const newSocket = io('http://localhost:3333');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(
                `Conectado ao servidor Socket.io com o ID ${newSocket.id}`,
            );
        });

        newSocket.on('error', (message) => {
            console.error(message);
        });

        newSocket.on('storedMessage', (message) => {
            setMessage(message);
        });
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleStartGame = async () => {
        if (socket) {
            socket.emit('testMessage', 'Jogo Iniciado', groupId);
            setStoreMessage(['Jogo iniciado']);
        }

        try {
            const roundResponse = await axios.get(
                `http://localhost:3333/group/${groupId}/round/1`,
            );
            const nEuro = roundResponse.data.nEuro;

            const usersResponse = await axios.get('http://localhost:3333/user');
            const users = usersResponse.data;
            setTotalUsuarios(users.length);
            for (const user of users) {
                await axios.patch(`http://localhost:3333/user/${user.id}`, {
                    nEuro,
                });
            }

            const totalUsuarios = users.length;
            await axios.patch(
                `http://localhost:3333/group/${groupId}/applyNEuro`,
                {
                    totalUsuarios,
                    nEuro: '0',
                },
            );
        } catch (error) {
            console.error(`Erro ao buscar detalhes da rodada: ${error}`);
        }
    };

    const handleNextRound = async (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
        try {
            await axios.post(
                `http://localhost:3333/group/${groupId}/next-round`,
            );
            if (socket) {
                socket.emit('nextRound', groupId);
                setStoreMessage(['Próxima rodada iniciada']);
            }
        } catch (error) {
            console.error(`Erro ao iniciar a próxima rodada: ${error}`);
        }
    };

    const handleEndGame = () => {
        if (socket) {
            socket.emit('endGame', groupId);
            setStoreMessage(['Jogo finalizado']);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <PainelAdmin>
                <div className="flex flex-col">
                    <div>
                        <h1 className="mb-5 bg-white">
                            Se todos os jogadores entram na tela de investimento
                            clique em Iniciar jogo. Depois que todos jogadores
                            tiverem investido clique em Proxima rodada (Espere
                            todos os jogadores investirem!)
                        </h1>
                        <h1 className="mb-5 bg-white">
                            Jogadores na sala: {totalUsuarios}
                        </h1>
                    </div>
                    {message && (
                        <div
                            className="mb-10 border-l-4 border-green-500 bg-green-200 p-4 text-green-700"
                            role="alert"
                        >
                            <p className="mb-5 text-2xl">Rodada iniciada</p>
                            <p className="font-bold">Notificação</p>
                            <p>{message}</p>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <button
                                        className="mt-5 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
                                        onClick={handleNextRound}
                                    >
                                        Proxima Rodada
                                    </button>
                                </div>
                                <div>
                                    <button
                                        className="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
                                        type="button"
                                        onClick={handleEndGame}
                                    >
                                        Finalizar jogo
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between gap-10">
                        <div>
                            <button
                                className="focus:shadow-outline rounded bg-[#ff7d0d] px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none"
                                type="button"
                                onClick={handleStartGame}
                            >
                                Iniciar jogo
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={handleBackClick}
                                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </PainelAdmin>
        </div>
    );
}
